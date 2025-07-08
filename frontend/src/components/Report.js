import React, { useState, useEffect } from 'react';

const Report = () => {
  const [reportData, setReportData] = useState([]);
  const [dailySummary, setDailySummary] = useState({});
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const url = selectedDate ? `http://localhost:3001/report?date=${selectedDate}` : 'http://localhost:3001/report';
        const response = await fetch(url);
        const data = await response.json();
        setReportData(data.detailedReport);
        setDailySummary(data.dailySummary);
      } catch (error) {
        console.error('Error fetching report:', error);
      }
    };
    fetchReport();
  }, [selectedDate]);

  return (
    <div>
      <h2>Test Report</h2>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      <h3>Daily Summary</h3>
      <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
      {Object.keys(dailySummary).length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Total Applicants</th>
              <th>Passed</th>
              <th>Failed</th>
              <th>Pending</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(dailySummary).map(([date, summary]) => (
              <tr key={date}>
                <td>{date}</td>
                <td>{summary.total}</td>
                <td>{summary.passed}</td>
                <td>{summary.failed}</td>
                <td>{summary.pending}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No daily summary available.</p>
      )}
      </div>

      <h3>Detailed Report</h3>
      <div style={{ maxHeight: '325px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
      {reportData.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Physical Test</th>
              <th>Theory Test</th>
              <th>Practical Test</th>
              <th>Final Result</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map(data => (
              <tr key={data.id}>
                <td>{data.first_name} {data.last_name}</td>
                <td>{data.physical_test}</td>
                <td>{data.theory_test}</td>
                <td>{data.practical_test}</td>
                <td>{data.final_result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No detailed report available.</p>
      )}
      </div>
    </div>
  );
};

export default Report;