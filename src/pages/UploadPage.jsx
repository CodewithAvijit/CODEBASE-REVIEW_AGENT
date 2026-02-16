import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadZone from '../components/UploadZone';

const UploadPage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Ready to upload");
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    setError(null);
    setProgress(0);
    setStatusText("Initializing upload...");

    // 1. Setup the Form Data (matches your Postman "file" key)
    const formData = new FormData();
    formData.append('file', file);

    // Fake progress animation (since fetch doesn't give upload progress easily)
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return 90; // Stall at 90% until real response comes
        return prev + 10;
      });
      setStatusText("Analyzing codebase...");
    }, 500);

    try {
      // 2. The Real API Call
      const response = await fetch('http://127.0.0.1:8000/review/file', {
        method: 'POST',
        body: formData,
        // Note: Do NOT set 'Content-Type': 'multipart/form-data' manually here.
        // The browser sets it automatically with the correct boundary.
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const rawData = await response.json();

      // 3. Data Normalization
      // Your backend returns some fields as strings inside "raw" or "error" keys.
      // We need to clean this up so the ReportPage doesn't crash.
      const cleanedData = normalizeBackendData(rawData);

      // Complete progress
      clearInterval(progressInterval);
      setProgress(100);
      setStatusText("Analysis Complete!");

      // 4. Navigate
      setTimeout(() => {
        navigate('/report', { state: { reportData: cleanedData } });
      }, 500);

    } catch (err) {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
      setProgress(0);
      setError("Failed to connect to the analysis server. Is the backend running on port 8000?");
      console.error("Upload error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-400"></div>

        <div className="p-8 md:p-10">
          <div className="text-center mb-10">
            <div className="bg-blue-50 w-20 h-20 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm mx-auto mb-6 ring-1 ring-blue-100">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Automated Code Review</h1>
            <p className="text-slate-500 mt-3 text-lg leading-relaxed">
              Upload your project file. Our AI engine will analyze it for security, quality, and design flaws.
            </p>
          </div>

          <UploadZone 
            onFileSelect={setFile} 
            selectedFile={file} 
            isAnalyzing={isAnalyzing} 
          />
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg text-center">
              {error}
            </div>
          )}

          <div className="mt-8 space-y-4">
            {isAnalyzing ? (
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <span>{statusText}</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 ease-out rounded-full relative" 
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute top-0 left-0 bottom-0 right-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={handleAnalyze}
                disabled={!file}
                className={`
                  w-full py-4 px-6 rounded-xl font-bold text-lg text-white shadow-lg transition-all duration-200
                  flex items-center justify-center gap-3
                  ${!file 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0'}
                `}
              >
                Start Code Review
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper to handle the mixed JSON/String responses from your specific backend
const normalizeBackendData = (data) => {
  // If your backend returns valid JSON objects inside "raw" strings (common with LLM outputs), parse them.
  // Otherwise, if they are already objects, use them directly.
  
  const parseIfString = (val) => {
    if (typeof val === 'string') {
      try { return JSON.parse(val); } catch(e) { return val; }
    }
    return val;
  };

  // Clone to avoid mutating original if needed
  let clean = { ...data };

  // Example Fixes based on your JSON structure:
  // 1. Code Review
  if (clean.code_review?.raw) {
    const parsedRaw = parseIfString(clean.code_review.raw);
    if (parsedRaw.issues) clean.code_review.issues = parsedRaw.issues;
    if (parsedRaw.suggestions) clean.code_review.suggestions = parsedRaw.suggestions;
    if (parsedRaw.score) clean.code_review.score = parsedRaw.score;
  }

  // 2. Security Review
  if (clean.security_review?.raw) {
    const parsedRaw = parseIfString(clean.security_review.raw);
    if (parsedRaw.vulnerabilities) clean.security_review.vulnerabilities = parsedRaw.vulnerabilities;
    if (parsedRaw.risk_level) clean.security_review.risk_level = parsedRaw.risk_level;
  }

  // 3. Ensure arrays exist to prevent .map() crashes
  clean.final_report = clean.final_report || {};
  clean.final_report.critical_risks = clean.final_report.critical_risks || [];
  
  clean.code_review = clean.code_review || {};
  clean.code_review.issues = clean.code_review.issues || [];
  clean.code_review.suggestions = clean.code_review.suggestions || [];

  return clean;
};

export default UploadPage;