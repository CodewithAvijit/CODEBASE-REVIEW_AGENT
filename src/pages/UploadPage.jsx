import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Loader2, AlertCircle, FileText, Terminal } from 'lucide-react'; 
import UploadZone from '../components/UploadZone';

const UploadPage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Ready to initialize");
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    setError(null);
    setProgress(0);
    setStatusText("Initializing secure upload channel...");

    const formData = new FormData();
    formData.append('file', file);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95; 
        return prev + 5;
      });
      setStatusText(prev => {
         if(progress > 30) return "Parsing directory structure...";
         if(progress > 60) return "Executing static analysis heuristics...";
         if(progress > 80) return "Finalizing security audit...";
         return "Uploading source artifacts...";
      });
    }, 800);

    try {
      const response = await fetch('http://127.0.0.1:8000/review/file', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();

      clearInterval(progressInterval);
      setProgress(100);
      setStatusText("Audit Complete");

      setTimeout(() => {
        navigate('/report', { state: { reportData: result } });
      }, 500);

    } catch (err) {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
      setProgress(0);
      setError("Connection refused. Verify analysis engine availability.");
      console.error("Upload error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-xl w-full bg-slate-800 rounded-3xl shadow-2xl shadow-black/50 border border-slate-700/60 overflow-hidden relative transition-all duration-500 z-10">
        {/* Gradient Top Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500"></div>

        <div className="p-8 md:p-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 mb-6 ring-1 ring-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
              <Terminal className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Codebase Auditor</h1>
            <p className="text-slate-400 text-lg">
              Initialize AI security reconnaissance and quality analysis.
            </p>
          </div>

          <div className="mb-8">
            {/* Note: If UploadZone has internal white styling, it will look like a 'paper' on the desk. 
                Ideally, UploadZone should accept a 'dark' prop or assume transparent background. 
                Assuming default behavior for now. */}
            <UploadZone 
                onFileSelect={setFile} 
                isUploading={isAnalyzing} 
            />
          </div>
          
          {file && !isAnalyzing && (
            <div className="flex items-center justify-between p-3 px-4 bg-slate-900/50 border border-slate-700 rounded-xl mb-6 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-slate-800 rounded-lg border border-slate-700 shadow-sm">
                        <FileText className="w-5 h-5 text-indigo-400" />
                    </div>
                    <span className="font-medium text-slate-200 truncate text-sm">{file.name}</span>
                </div>
                <button 
                    onClick={() => setFile(null)}
                    className="text-xs font-bold text-slate-500 hover:text-rose-400 transition-colors uppercase tracking-wider"
                >
                    Change
                </button>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-rose-900/10 border border-rose-500/20 text-rose-300 text-sm font-medium rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            {isAnalyzing ? (
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/60">
                <div className="flex justify-between items-end mb-3">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest animate-pulse">{statusText}</span>
                    <span className="text-sm font-bold text-white tabular-nums">{progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out rounded-full relative shadow-[0_0_10px_rgba(139,92,246,0.3)]" 
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={handleAnalyze}
                disabled={!file}
                className={`
                  w-full py-4 px-6 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform
                  flex items-center justify-center gap-3 border
                  ${!file 
                    ? 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed shadow-none' 
                    : 'bg-indigo-600 text-white border-indigo-500 hover:bg-indigo-500 hover:shadow-indigo-500/25 hover:-translate-y-0.5 active:translate-y-0'}
                `}
              >
                {isAnalyzing ? <Loader2 className="animate-spin" /> : "Run Audit Sequence"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;