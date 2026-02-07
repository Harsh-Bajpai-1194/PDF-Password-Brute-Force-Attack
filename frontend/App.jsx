import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Please select a PDF file.");
    
    setLoading(true);
    setResult(null);
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      // Pointing to your Node.js backend
      const res = await axios.post('http://localhost:5000/api/recover', formData);
      setResult({ status: 'success', data: res.data.password });
    } catch (err) {
      setResult({ status: 'error', data: "Recovery failed. PIN might be outside 0000-9999." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '50px', fontFamily: 'sans-serif' }}>
      <h2>PDF Password Recovery (0000-9999)</h2>
      <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} />
      
      <button onClick={handleUpload} disabled={loading} style={{ marginLeft: '10px' }}>
        {loading ? "Brute-forcing... Please wait" : "Start Attack"}
      </button>

      {loading && <p>System is testing 10,000 combinations. This may take a moment...</p>}

      {result && (
        <div style={{ marginTop: '20px', color: result.status === 'success' ? 'green' : 'red' }}>
          {result.status === 'success' ? `Found Password: ${result.data}` : result.data}
        </div>
      )}

      <footer style={{ marginTop: '100px', fontSize: '12px' }}>
        Developed by Harsh Bajpai | GDG PSIT
      </footer>
    </div>
  );
}
export default App;