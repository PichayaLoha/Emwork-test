
import React, { useState, useEffect } from 'react';

const TheoryTestForm = ({ applicantId, onSave }) => {
  const [trafficSigns, setTrafficSigns] = useState(0);
  const [trafficLines, setTrafficLines] = useState(0);
  const [givingWay, setGivingWay] = useState(0);
  const [theoryTestId, setTheoryTestId] = useState(null);

  useEffect(() => {
    const fetchTheoryTest = async () => {
      try {
        const res = await fetch(`http://localhost:3001/theory-tests?applicant_id=${applicantId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            const test = data[0];
            setTrafficSigns(test.traffic_signs);
            setTrafficLines(test.traffic_lines);
            setGivingWay(test.giving_way);
            setTheoryTestId(test.id);
          } else {
            setTrafficSigns(0);
            setTrafficLines(0);
            setGivingWay(0);
            setTheoryTestId(null);
          }
        } else {
          console.error('Failed to fetch theory test');
        }
      } catch (error) {
        console.error('Error fetching theory test:', error);
      }
    };
    fetchTheoryTest();
  }, [applicantId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = theoryTestId ? 'PUT' : 'POST';
    const url = theoryTestId ? `http://localhost:3001/theory-tests/${theoryTestId}` : 'http://localhost:3001/theory-tests';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicant_id: applicantId,
          traffic_signs: parseInt(trafficSigns),
          traffic_lines: parseInt(trafficLines),
          giving_way: parseInt(givingWay),
        }),
      });
      if (res.ok) {
        onSave();
      } else {
        console.error('Failed to save theory test');
      }
    } catch (error) {
      console.error('Error saving theory test:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Theory Test for Applicant ID: {applicantId}</h3>
      <label>
        Traffic Signs (0-50):
        <input type="number" min="0" max="50" value={trafficSigns} onChange={(e) => setTrafficSigns(e.target.value)} />
      </label>
      <label>
        Traffic Lines (0-50):
        <input type="number" min="0" max="50" value={trafficLines} onChange={(e) => setTrafficLines(e.target.value)} />
      </label>
      <label>
        Giving Way (0-50):
        <input type="number" min="0" max="50" value={givingWay} onChange={(e) => setGivingWay(e.target.value)} />
      </label>
      <button type="submit">Save Theory Test</button>
      <button type="button" onClick={onSave}>Cancel</button>
    </form>
  );
};

export default TheoryTestForm;
