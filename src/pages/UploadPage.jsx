import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadZone from '../components/UploadZone';

// --- MOCK DATA ---
const MOCK_API_RESPONSE = {
  "code_review": { 
    "score": 7, 
    "issues": [
      "Complex logic in AuthenticationService.java (Cyclomatic Complexity > 15)", 
      "Unused variables in UserProfile.tsx",
      "Magic numbers used in pricing calculation logic"
    ], 
    "suggestions": [
      "Refactor `validateUser` method into smaller helper functions", 
      "Use TypeScript interfaces instead of `any` type",
      "Extract pricing constants to a config file"
    ] 
  },
  "security_review": { 
    "risk_level": "LOW", 
    "vulnerabilities": ["Outdated dependency: lodash v4.17.15", "Exposed API key pattern in .env.example"] 
  },
  "design_review": { 
    "architecture": "Microservices", 
    "scalability": "HIGH", 
    "improvements": ["Consider implementing circuit breaker pattern for external calls", "Add centralized logging"] 
  },
  "production_review": { 
    "error": null, 
    "raw": "Build success. Test coverage: 82%." 
  },
  "final_report": { 
    "overall_score": 8, 
    "critical_risks": [], 
    "final_verdict": "GOOD_TO_MERGE" 
  }
};

const UploadPage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing...");

  const handleAnalyze = () => {
    if (!file) return;
    setIsAnalyzing(true);
    setProgress(0);

    const stages = [
      "Parsing syntax tree...",
      "Checking cyclomatic complexity...",
      "Scanning for security vulnerabilities...",
      "Validating design patterns...",
      "Generating final report..."
    ];

    let stepIndex = 0;
    setStatusText(stages[0]);

    const interval = setInterval(() => {
      setProgress((prev) => {
        // Move progress bar
        const nextProgress = prev + Math.floor(Math.random() * 10) + 2;
        
        // Update text based on progress milestones
        if (nextProgress > 20 && stepIndex === 0) { stepIndex++; setStatusText(stages[1]); }
        if (nextProgress > 40 && stepIndex === 1) { stepIndex++; setStatusText(stages[2]); }
        if (nextProgress > 60 && stepIndex === 2) { stepIndex++; setStatusText(stages[3]); }
        if (nextProgress > 80 && stepIndex === 3) { stepIndex++; setStatusText(stages[4]); }

        if (nextProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            navigate('/report', { state: { reportData: MOCK_API_RESPONSE } });
          }, 800);
          return 100;
        }
        return nextProgress;
      });
    }, 400); // Slightly slower to feel "deep"
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden relative">
        {/* Top Gradient Bar - Blue/Teal for "Code" theme */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-400"></div>

        <div className="p-8 md:p-10">
          <div className="text-center mb-10">
            <div className="bg-blue-50 w-20 h-20 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm mx-auto mb-6 ring-1 ring-blue-100">
              {/* Code Brackets Icon */}
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Automated Code Review</h1>
            <p className="text-slate-500 mt-3 text-lg leading-relaxed">
              Upload your project files. AI will analyze code quality, complexity, security, and architectural patterns.
            </p>
          </div>

          <UploadZone 
            onFileSelect={setFile} 
            selectedFile={file} 
            isAnalyzing={isAnalyzing} 
          />

          <div className="mt-8 space-y-4">
            {isAnalyzing ? (
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <span>{statusText}</span>
                  <span>{Math.min(progress, 100)}%</span>
                </div>
                {/* Progress Bar Container */}
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  {/* Progress Bar Fill */}
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 ease-out rounded-full relative" 
                    style={{ width: `${progress}%` }}
                  >
                    {/* Shimmer Effect */}
                    <div className="absolute top-0 left-0 bottom-0 right-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
                <p className="text-center text-xs text-slate-400">Comparing against clean code standards...</p>
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
        
        <div className="bg-slate-50 px-8 py-4 text-center border-t border-slate-100">
          <p className="text-xs text-slate-400">
            <span className="font-semibold text-slate-500">Supported Formats:</span> .zip, .js, .py, .java, .tsx
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;