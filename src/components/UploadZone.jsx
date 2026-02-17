import React, { useState, useRef } from 'react';
import { UploadCloud, FileCode, Loader2, MousePointerClick } from 'lucide-react';

const UploadZone = ({ onFileSelect, isUploading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isUploading) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (!isUploading && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
      e.target.value = '';
    }
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative group flex flex-col items-center justify-center w-full h-80
        rounded-3xl border-2 border-dashed transition-all duration-300 ease-out
        ${isUploading 
          ? 'bg-slate-50 border-slate-200 cursor-wait' 
          : isDragging 
            ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01] shadow-2xl shadow-indigo-100' 
            : 'border-slate-200 bg-slate-50/30 hover:bg-white hover:border-indigo-300 hover:shadow-xl hover:shadow-slate-100 cursor-pointer'
        }
      `}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        className="hidden"
        disabled={isUploading}
      />

      {isUploading ? (
        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="relative bg-white p-4 rounded-2xl shadow-sm border border-indigo-100">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">Processing Project</h3>
          <p className="text-slate-500 font-medium mt-2">AI agents are analyzing your code...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center p-8 transition-transform duration-300 group-hover:-translate-y-1">
          <div className={`
            p-6 rounded-3xl mb-6 transition-all duration-300
            ${isDragging 
              ? 'bg-indigo-100 text-indigo-600 rotate-3 scale-110' 
              : 'bg-white shadow-sm ring-1 ring-slate-100 text-slate-400 group-hover:text-indigo-600 group-hover:ring-indigo-100 group-hover:shadow-indigo-100'
            }
          `}>
            {isDragging ? (
              <FileCode className="w-14 h-14" strokeWidth={1.5} />
            ) : (
              <UploadCloud className="w-14 h-14" strokeWidth={1.5} />
            )}
          </div>
          
          <h3 className={`text-xl font-bold mb-3 transition-colors ${isDragging ? 'text-indigo-600' : 'text-slate-700 group-hover:text-slate-900'}`}>
            {isDragging ? 'Drop to Analyze' : 'Upload Source Code'}
          </h3>
          
          <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm group-hover:border-indigo-100 group-hover:text-indigo-600 transition-colors">
            <MousePointerClick className="w-4 h-4" />
            <span className="font-semibold">Click to browse</span>
            <span className="opacity-50">or drag file</span>
          </div>
          
          <p className="text-xs font-medium text-slate-400 mt-6 tracking-wide uppercase opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
            Supports .ZIP, .JS, .PY, .JAVA, .TS
          </p>
        </div>
      )}
    </div>
  );
};

export default UploadZone;