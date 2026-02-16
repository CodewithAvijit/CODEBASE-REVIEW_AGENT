import React, { useState } from 'react';

const UploadZone = ({ onFileSelect, selectedFile, isAnalyzing }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`
        relative group cursor-pointer
        border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 ease-in-out
        ${isDragging 
          ? 'border-blue-500 bg-blue-50/50 scale-[1.02]' 
          : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'}
        ${isAnalyzing ? 'opacity-50 pointer-events-none grayscale' : ''}
      `}
    >
      <input 
        type="file" 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        onChange={handleFileInput}
        disabled={isAnalyzing}
        // Accept common code archives and files
        accept=".zip,.tar,.gz,.js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.cs,.go,.rs,.php,.html,.css,.json,.xml,.yaml,.yml"
      />
      
      <div className="flex flex-col items-center gap-4 transition-transform group-hover:-translate-y-1">
        {selectedFile ? (
          <>
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              {/* File Code Icon */}
              <svg className="w-8 h-8" width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <div className="text-lg font-bold text-slate-900">{selectedFile.name}</div>
              <div className="text-sm text-slate-400 font-mono">{(selectedFile.size / 1024).toFixed(2)} KB</div>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onFileSelect(null); }}
              className="z-20 text-xs text-red-500 hover:text-red-700 font-medium underline mt-1"
            >
              Change File
            </button>
          </>
        ) : (
          <>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-colors ${isDragging ? 'bg-blue-200 text-blue-700' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-500'}`}>
              {/* Cloud Upload Icon */}
              <svg className="w-8 h-8" width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <span className="text-blue-600 font-bold text-lg">Upload Codebase</span>
              <span className="text-slate-500 text-lg"> or drag & drop</span>
            </div>
            <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">
              Supports single files (.js, .py, .java) or archives (.zip) for full project context.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default UploadZone;