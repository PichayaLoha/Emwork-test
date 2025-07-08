
import React, { useState, useCallback } from 'react';
import './App.css';
import ApplicantForm from './components/ApplicantForm';
import ApplicantList from './components/ApplicantList';
import Report from './components/Report';

function App() {
  const [refreshApplicants, setRefreshApplicants] = useState(0);

  const handleApplicantSave = useCallback(() => {
    setRefreshApplicants(prev => prev + 1);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Driving License Test Results</h1>
      </header>
      <main>
        <ApplicantForm onSave={handleApplicantSave} />
        <ApplicantList refreshKey={refreshApplicants} onSave={handleApplicantSave} />
        <Report />
      </main>
    </div>
  );
}

export default App;
