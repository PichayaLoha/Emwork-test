import React, { useState, useEffect } from 'react';

const ApplicantForm = ({ applicant, onSave }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    if (applicant) {
      setFirstName(applicant.first_name);
      setLastName(applicant.last_name);
    } else {
      setFirstName('');
      setLastName('');
    }
  }, [applicant]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = applicant ? 'PUT' : 'POST';
    const url = applicant ? `http://localhost:3001/applicants/${applicant.id}` : 'http://localhost:3001/applicants';

    try {
      // Check for duplicate names before saving
      const existingApplicantsResponse = await fetch('http://localhost:3001/applicants');
      const existingApplicants = await existingApplicantsResponse.json();

      const isDuplicate = existingApplicants.some(
        (existingApplicant) =>
          existingApplicant.first_name === firstName &&
          existingApplicant.last_name === lastName &&
          (!applicant || existingApplicant.id !== applicant.id) // Allow editing the same applicant
      );

      if (isDuplicate) {
        alert('Applicant with this name already exists!');
        return;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ first_name: firstName, last_name: lastName }),
      });
      if (response.ok) {
        onSave();
        setFirstName('');
        setLastName('');
      } else {
        console.error('Failed to save applicant');
      }
    } catch (error) {
      console.error('Error saving applicant:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{applicant ? 'Edit Applicant' : 'Add New Applicant'}</h2>
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
      />
      <button type="submit">Save</button>
      {applicant && <button type="button" onClick={() => onSave()}>Cancel</button>}
    </form>
  );
};

export default ApplicantForm;