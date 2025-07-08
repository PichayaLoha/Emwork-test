import React, { useState, useEffect } from 'react';
import ApplicantForm from './ApplicantForm';
import PhysicalTestForm from './PhysicalTestForm';
import TheoryTestForm from './TheoryTestForm';
import PracticalTestForm from './PracticalTestForm';

const ApplicantList = ({ refreshKey }) => {
  const [applicants, setApplicants] = useState([]);
  const [search, setSearch] = useState('');
  const [editingApplicant, setEditingApplicant] = useState(null);
  const [testingApplicantId, setTestingApplicantId] = useState(null);
  const [testType, setTestType] = useState(null);

  const fetchApplicants = async () => {
    try {
      const response = await fetch(`http://localhost:3001/applicants?search=${search}`);
      const data = await response.json();
      setApplicants(data);
    } catch (error) {
      console.error('Error fetching applicants:', error);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [search, refreshKey]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/applicants/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchApplicants();
      } else {
        console.error('Failed to delete applicant');
      }
    } catch (error) {
      console.error('Error deleting applicant:', error);
    }
  };

  const handleEdit = (applicant) => {
    setEditingApplicant(applicant);
  };

  const handleSave = () => {
    setEditingApplicant(null);
    setTestingApplicantId(null);
    setTestType(null);
    fetchApplicants();
  };

  const handleRecordTest = (applicantId, type) => {
    setTestingApplicantId(applicantId);
    setTestType(type);
  };

  return (
    <div>
      <h2>Applicants</h2>
      <input
        type="text"
        placeholder="Search by name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {editingApplicant ? (
        <ApplicantForm applicant={editingApplicant} onSave={handleSave} />
      ) : testingApplicantId && testType === 'physical' ? (
        <PhysicalTestForm applicantId={testingApplicantId} onSave={handleSave} />
      ) : testingApplicantId && testType === 'theory' ? (
        <TheoryTestForm applicantId={testingApplicantId} onSave={handleSave} />
      ) : testingApplicantId && testType === 'practical' ? (
        <PracticalTestForm applicantId={testingApplicantId} onSave={handleSave} />
      ) : null}
      <div style={{ maxHeight: '625px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
        <ul>
          {applicants.map(applicant => (
            <li key={applicant.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
              {applicant.first_name} {applicant.last_name}
              <button onClick={() => handleEdit(applicant)}>Edit</button>
              <button onClick={() => handleDelete(applicant.id)}>Delete</button>
              <button onClick={() => handleRecordTest(applicant.id, 'physical')}>Record Physical Test</button>
              <button onClick={() => handleRecordTest(applicant.id, 'practical')}>Record Practical Test</button>
              <button onClick={() => handleRecordTest(applicant.id, 'theory')}>Record Theory Test</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ApplicantList;