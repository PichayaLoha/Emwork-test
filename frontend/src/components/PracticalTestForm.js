
import React, { useState, useEffect } from 'react';

const PracticalTestForm = ({ applicantId, onSave }) => {
  const [result, setResult] = useState('Pass');
  const [practicalTestId, setPracticalTestId] = useState(null);

  useEffect(() => {
    const fetchPracticalTest = async () => {
      try {
        const res = await fetch(`http://localhost:3001/practical-tests?applicant_id=${applicantId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            const test = data[0];
            setResult(test.result);
            setPracticalTestId(test.id);
          } else {
            setResult('Pass');
            setPracticalTestId(null);
          }
        } else {
          console.error('Failed to fetch practical test');
        }
      } catch (error) {
        console.error('Error fetching practical test:', error);
      }
    };
    fetchPracticalTest();
  }, [applicantId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = practicalTestId ? 'PUT' : 'POST';
    const url = practicalTestId ? `http://localhost:3001/practical-tests/${practicalTestId}` : 'http://localhost:3001/practical-tests';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicant_id: applicantId,
          result: result,
        }),
      });
      if (res.ok) {
        onSave();
      } else {
        console.error('Failed to save practical test');
      }
    } catch (error) {
      console.error('Error saving practical test:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Practical Test for Applicant ID: {applicantId}</h3>
      <label>
        Result:
        <select value={result} onChange={(e) => setResult(e.target.value)}>
          <option value="Pass">Pass</option>
          <option value="Fail">Fail</option>
        </select>
      </label>
      <button type="submit">Save Practical Test</button>
      <button type="button" onClick={onSave}>Cancel</button>
    </form>
  );
};

export default PracticalTestForm;
