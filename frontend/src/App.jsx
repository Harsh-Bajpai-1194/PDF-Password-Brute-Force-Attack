import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [timer, setTimer] = useState(0);

  // Timer logic
  useEffect(() => {
    let interval;
    if (loading) {
      const start = Date.now();
      interval = setInterval(() => {
        setTimer(Date.now() - start);
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleAttack = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    setTimer(0);

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const res = await axios.post('http://localhost:5000/api/recover', formData);
      setResult({ status: 'success', msg: `PIN Found: ${res.data.password}`, time: (timer / 1000).toFixed(2) });
    } catch (err) {
      setResult({ status: 'error', msg: "Recovery failed.", time: (timer / 1000).toFixed(2) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800 rounded-xl shadow-2xl p-8 border border-slate-700">
        <h1 className="text-2xl font-bold mb-2 text-blue-400">PDF-Password-Brute-Force-Attack</h1>
        <p className="text-slate-400 text-sm mb-6 font-mono">
          {loading ? `ATTACK DURATION: ${(timer / 1000).toFixed(2)}s` : "READY FOR DEPLOYMENT"}
        </p>

        <div className="space-y-4">
          <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700" />
          
          <button onClick={handleAttack} disabled={loading || !file} className={`w-full py-3 rounded-lg font-bold ${loading ? 'bg-red-600 animate-pulse' : 'bg-blue-600'}`}>
            {loading ? "BRUTE-FORCING..." : "START ATTACK"}
          </button>
        </div>

        {result && (
          <div className="mt-6 p-4 rounded-lg bg-slate-900 border border-slate-700 text-center">
            <p className={result.status === 'success' ? 'text-green-400' : 'text-red-400'}>{result.msg}</p>
            <p className="text-xs text-slate-500 mt-2 font-mono">Completed in {result.time} seconds</p>
          </div>
        )}
      </div>

      <footer className="mt-12 text-slate-500 text-center text-xs">
        Harsh Bajpai | GDG PSIT • CMO @ Zerythron
      </footer>
    </div>
  );
}

export default App;