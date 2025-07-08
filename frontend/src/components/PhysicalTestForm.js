
import React, { useState, useEffect } from 'react';

const PhysicalTestForm = ({ applicantId, onSave }) => {
  const [colorBlindness, setColorBlindness] = useState(false);
  const [longSight, setLongSight] = useState(false);
  const [astigmatism, setAstigmatism] = useState(false);
  const [response, setResponse] = useState(false);
  const [physicalTestId, setPhysicalTestId] = useState(null);

  useEffect(() => {
    const fetchPhysicalTest = async () => {
      try {
        const res = await fetch(`http://localhost:3001/physical-tests?applicant_id=${applicantId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            const test = data[0];
            setColorBlindness(test.color_blindness);
            setLongSight(test.long_sight);
            setAstigmatism(test.astigmatism);
            setResponse(test.response);
            setPhysicalTestId(test.id);
          } else {
            setColorBlindness(false);
            setLongSight(false);
            setAstigmatism(false);
            setResponse(false);
            setPhysicalTestId(null);
          }
        } else {
          console.error('Failed to fetch physical test');
        }
      } catch (error) {
        console.error('Error fetching physical test:', error);
      }
    };
    fetchPhysicalTest();
  }, [applicantId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = physicalTestId ? 'PUT' : 'POST';
    const url = physicalTestId ? `http://localhost:3001/physical-tests/${physicalTestId}` : 'http://localhost:3001/physical-tests';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicant_id: applicantId,
          color_blindness: colorBlindness,
          long_sight: longSight,
          astigmatism: astigmatism,
          response: response,
        }),
      });
      if (res.ok) {
        onSave();
      } else {
        console.error('Failed to save physical test');
      }
    } catch (error) {
      console.error('Error saving physical test:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Physical Test for Applicant ID: {applicantId}</h3>
      <label>
        <input type="checkbox" checked={colorBlindness} onChange={(e) => setColorBlindness(e.target.checked)} />
        Color Blindness
      </label>
      <label>
        <input type="checkbox" checked={longSight} onChange={(e) => setLongSight(e.target.checked)} />
        Long Sight
      </label>
      <label>
        <input type="checkbox" checked={astigmatism} onChange={(e) => setAstigmatism(e.target.checked)} />
        Astigmatism
      </label>
      <label>
        <input type="checkbox" checked={response} onChange={(e) => setResponse(e.target.checked)} />
        Response
      </label>
      <button type="submit">Save Physical Test</button>
      <button type="button" onClick={onSave}>Cancel</button>
    </form>
  );
};

export default PhysicalTestForm;
