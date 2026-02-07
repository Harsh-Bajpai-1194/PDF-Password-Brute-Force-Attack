import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleUpload = async () => {
    if (!file) return alert("Select a PDF first");
    
    setLoading(true);
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await axios.post('http://localhost:5000/api/recover', formData);
      setResult(`Success! Password is: ${response.data.password}`);
    } catch (error) {
      setResult("Failed to recover password. Ensure it is a 4-digit PIN.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>PDF PIN Recovery Tool</h1>
      <p>Ethical use only. Use this for files you own.</p>
      
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Searching 0000-9999..." : "Start Recovery"}
      </button>

      {result && <div style={{ marginTop: '20px', fontWeight: 'bold' }}>{result}</div>}
      
      <footer style={{ marginTop: '50px', fontSize: '12px', color: 'gray' }}>
        Developed by Harsh Bajpai | Zerythron Marketing & GDG PSIT
      </footer>
    </div>
  );
}

export default App;