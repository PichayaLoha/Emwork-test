const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

// Routes
app.get('/applicants', (req, res) => {
  const { search } = req.query;
  let sql = 'SELECT * FROM applicants';
  if (search) {
    sql += ' WHERE first_name LIKE ? OR last_name LIKE ?';
  }
  db.query(sql, [`%${search}%`, `%${search}%`], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post('/applicants', (req, res) => {
  const { first_name, last_name } = req.body;
  const sql = 'INSERT INTO applicants (first_name, last_name) VALUES (?, ?)';
  db.query(sql, [first_name, last_name], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, first_name, last_name });
  });
});

app.put('/applicants/:id', (req, res) => {
  const { id } = req.params;
  const { first_name, last_name } = req.body;
  const sql = 'UPDATE applicants SET first_name = ?, last_name = ? WHERE id = ?';
  db.query(sql, [first_name, last_name, id], (err, result) => {
    if (err) throw err;
    res.json({ id, first_name, last_name });
  });
});

app.delete('/applicants/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM applicants WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Applicant deleted' });
  });
});

app.post('/physical-tests', (req, res) => {
  const { applicant_id, color_blindness, long_sight, astigmatism, response } = req.body;
  const pass_count = [color_blindness, long_sight, astigmatism, response].filter(Boolean).length;
  const result = pass_count >= 3 ? 'Pass' : 'Fail';
  const sql = 'INSERT INTO physical_tests (applicant_id, color_blindness, long_sight, astigmatism, response, result) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [applicant_id, color_blindness, long_sight, astigmatism, response, result], (err, db_result) => {
    if (err) throw err;
    res.json({ id: db_result.insertId, result });
  });
});

app.post('/theory-tests', (req, res) => {
  const { applicant_id, traffic_signs, traffic_lines, giving_way } = req.body;
  const total_score = traffic_signs + traffic_lines + giving_way;
  const result = total_score >= 120 ? 'Pass' : 'Fail'; // 80% of 150
  const sql = 'INSERT INTO theory_tests (applicant_id, traffic_signs, traffic_lines, giving_way, total_score, result) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [applicant_id, traffic_signs, traffic_lines, giving_way, total_score, result], (err, db_result) => {
    if (err) throw err;
    res.json({ id: db_result.insertId, total_score, result });
  });
});

app.post('/practical-tests', (req, res) => {
  const { applicant_id, result } = req.body;
  const sql = 'INSERT INTO practical_tests (applicant_id, result) VALUES (?, ?)';
  db.query(sql, [applicant_id, result], (err, db_result) => {
    if (err) throw err;
    res.json({ id: db_result.insertId, result });
  });
});

app.get('/report', (req, res) => {
  const { date } = req.query;
  let sql = `
    SELECT
      a.id,
      a.first_name,
      a.last_name,
      pt.result AS physical_test,
      tt.result AS theory_test,
      prt.result AS practical_test,
      CASE
        WHEN pt.result = 'Pass' AND tt.result = 'Pass' AND prt.result = 'Pass' THEN 'Pass'
        WHEN pt.result IS NULL OR tt.result IS NULL OR prt.result IS NULL THEN 'Pending'
        ELSE 'Fail'
      END AS final_result,
      a.created_at
    FROM applicants a
    LEFT JOIN physical_tests pt ON a.id = pt.applicant_id
    LEFT JOIN theory_tests tt ON a.id = tt.applicant_id
    LEFT JOIN practical_tests prt ON a.id = prt.applicant_id
  `;
  let params = [];

  if (date) {
    sql += ' WHERE DATE(a.created_at) = ?';
    params.push(date);
  }

  db.query(sql, params, (err, results) => {
    if (err) throw err;

    const dailySummary = {};

    results.forEach(row => {
      const creationDate = row.created_at.toISOString().split('T')[0];
      if (!dailySummary[creationDate]) {
        dailySummary[creationDate] = { passed: 0, failed: 0, pending: 0, total: 0, applicants: [] };
      }
      dailySummary[creationDate].total++;
      if (row.final_result === 'Pass') {
        dailySummary[creationDate].passed++;
      } else if (row.final_result === 'Fail') {
        dailySummary[creationDate].failed++;
      } else {
        dailySummary[creationDate].pending++;
      }
      dailySummary[creationDate].applicants.push(row);
    });

    res.json({ detailedReport: results, dailySummary });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});