import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleLogin = () => {
        setError('');
        const loginUrl = "http://localhost:8000/oauth2/authorization/github";
        const popup = window.open(loginUrl, "GitHub Login", "width=500,height=600");
        
        const timer = setInterval(() => {
            if (!popup || popup.closed) {
                clearInterval(timer);
                
                const token = localStorage.getItem("github_access_token");
                const authError = localStorage.getItem("github_auth_error");
                
                if (token) {
                    navigate("/home"); 
                } else if (authError) {
                    setError("Authorization aborted. Protocol sequence halted.");
                    localStorage.removeItem("github_auth_error");
                } else {
                    setError("Authentication failed. Check your clearance level.");
                }
            }
        }, 500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4 relative overflow-hidden font-mono text-gray-300">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,100,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,100,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
                <div className="absolute top-1/4 -left-1/4 w-[50vw] h-[50vw] bg-[#00ff66]/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/4 -right-1/4 w-[50vw] h-[50vw] bg-[#0099ff]/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-[#0a0a0a] rounded-xl border border-[#333] mb-6 relative group overflow-hidden shadow-[0_0_40px_rgba(0,255,100,0.1)]">
                        <div className="absolute inset-0 border border-[#00ff66]/20 group-hover:border-[#00ff66]/60 transition-colors duration-500 rounded-xl"></div>
                        <svg className="w-12 h-12 text-[#00ff66] transform transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(0,255,100,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                        </svg>
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00ff66]/50 animate-[scan_2s_ease-in-out_infinite]"></div>
                    </div>
                    
                    <h1 className="text-3xl font-bold text-white tracking-widest uppercase mb-2">
                        Guardian of <span className="text-[#00ff66]">Code</span>
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-xs text-[#666] uppercase tracking-[0.2em]">
                        <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-pulse"></span>
                        Automated Codebase Review
                    </div>
                </div>

                <div className="bg-[#0f0f0f] border border-[#222] p-8 relative rounded-sm shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00ff66]/50 to-transparent"></div>
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00ff66]"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#00ff66]"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#00ff66]"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00ff66]"></div>

                    {error && (
                        <div className="flex items-start gap-3 w-full bg-[#1a0505] text-[#ff3333] p-4 mb-6 text-sm border border-[#ff3333]/30 rounded-sm">
                            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span className="leading-relaxed font-medium">{error}</span>
                        </div>
                    )}

                    <div className="space-y-6">
                        <button 
                            onClick={handleLogin}
                            className="group relative w-full flex items-center justify-center gap-3 bg-[#1a1a1a] hover:bg-[#222] text-white px-6 py-4 border border-[#333] hover:border-[#00ff66]/50 transition-all duration-300 rounded-sm overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20 group-hover:opacity-40"></div>
                            
                            <svg className="w-6 h-6 relative z-10 text-white group-hover:text-[#00ff66] transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                            <span className="relative z-10 font-bold tracking-wide">LOGIN USING GITHUB</span>
                        </button>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-[#222]"></span>
                            </div>
                            <div className="relative flex justify-center text-[10px] tracking-[0.2em]">
                                <span className="bg-[#0f0f0f] px-4 text-[#555]">SECURE CONNECTION REQ.</span>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-[11px] text-[#555] leading-relaxed">
                                AUTHORIZATION GRANTS READ-ONLY ACCESS TO <br/>
                                <span className="text-[#888]">REPOSITORY CONTENTS</span> & <span className="text-[#888]">METADATA</span>
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="mt-8 text-center text-[10px] text-[#444] tracking-widest font-mono">
                    <p>SYSTEM STATUS: <span className="text-[#00ff66]">ONLINE</span> | V.2.0.4</p>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                @keyframes scan {
                    0% { top: 0; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
            `}} />
        </div>
    );
};

export default LoginPage;