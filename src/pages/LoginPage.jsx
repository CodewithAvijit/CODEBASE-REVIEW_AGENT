import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Github, AlertTriangle, Terminal } from 'lucide-react';

const LoginPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isConnecting, setIsConnecting] = useState(false);

    const handleLogin = () => {
        setError('');
        setIsConnecting(true);
        const loginUrl = "https://codebase-review-agent-backend.onrender.com/oauth2/authorization/github";
        const popup = window.open(loginUrl, "GitHub Login", "width=500,height=600");
        
        const timer = setInterval(() => {
            if (!popup || popup.closed) {
                clearInterval(timer);
                setIsConnecting(false);
                
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
        <div className="min-h-screen flex items-center justify-center bg-[#030303] px-4 relative overflow-hidden font-sans text-gray-300 selection:bg-[#00ff66]/30 selection:text-white">
            
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
                <div className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] bg-[#00ff66]/10 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-10000"></div>
                <div className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] bg-[#0099ff]/10 rounded-full blur-[120px] mix-blend-screen"></div>
            </div>

            <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-700">
                
                {/* Header Section */}
                <div className="text-center mb-8 flex flex-col items-center">
                    <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#111] to-[#050505] border border-[#00ff66]/40 rounded-2xl shadow-[0_0_30px_rgba(0,255,100,0.15)] group mb-6 overflow-hidden">
                        <div className="absolute inset-0 rounded-2xl border border-[#00ff66]/20 animate-ping opacity-20"></div>
                        <Shield className="w-10 h-10 text-[#00ff66] relative z-10 transform transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(0,255,100,0.8)]" />
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00ff66]/80 shadow-[0_0_10px_#00ff66] animate-[scan_2s_ease-in-out_infinite] z-20"></div>
                    </div>
                    
                    <h1 className="text-3xl font-bold text-white tracking-wider leading-none mb-3 flex items-center gap-2">
                        Guardian of <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00ff66] to-[#00ccff]">Code</span>
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em]">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff66] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff66]"></span>
                        </span>
                        Automated Codebase Review
                    </div>
                </div>

                {/* Main Glass Card */}
                <div className="bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/10 p-8 relative rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] group hover:border-white/20 transition-colors duration-500">
                    
                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00ff66]/50 rounded-tl-xl"></div>
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#00ff66]/50 rounded-tr-xl"></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#00ff66]/50 rounded-bl-xl"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#00ff66]/50 rounded-br-xl"></div>

                    {error && (
                        <div className="flex items-start gap-3 w-full bg-red-950/50 text-red-300 p-4 mb-6 text-sm border border-red-500/30 rounded-xl font-mono animate-in slide-in-from-top-2 fade-in">
                            <AlertTriangle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
                            <span className="leading-relaxed font-medium">{error}</span>
                        </div>
                    )}

                    <div className="space-y-8">
                        {/* Login Button */}
                        <button 
                            onClick={handleLogin}
                            disabled={isConnecting}
                            className="group relative w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white px-6 py-4 rounded-xl border border-white/10 hover:border-[#00ff66]/50 transition-all duration-300 overflow-hidden shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {/* Hover Gradient Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-[#00ff66]/0 via-[#00ff66]/10 to-[#00ff66]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            
                            {isConnecting ? (
                                <div className="flex items-center gap-3 font-mono text-sm">
                                    <Terminal className="w-5 h-5 text-[#00ff66] animate-pulse" />
                                    <span className="font-bold tracking-widest text-[#00ff66]">ESTABLISHING UPLINK...</span>
                                </div>
                            ) : (
                                <>
                                    <Github className="w-5 h-5 relative z-10 text-gray-300 group-hover:text-[#00ff66] transition-colors duration-300" />
                                    <span className="relative z-10 font-bold tracking-wider text-sm font-mono mt-0.5">LOGIN WITH GITHUB</span>
                                </>
                            )}
                        </button>

                        {/* Divider */}
                        <div className="relative flex items-center justify-center">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/10"></span>
                            </div>
                            <div className="relative flex justify-center text-[10px] tracking-[0.2em] font-mono">
                                <span className="bg-[#080808] px-4 text-gray-500 rounded-full">SECURE CONNECTION</span>
                            </div>
                        </div>

                        {/* Warning Text */}
                        <div className="text-center font-mono">
                            <p className="text-[11px] text-gray-500 leading-relaxed">
                                AUTHORIZATION GRANTS READ ONLY ACCESS TO <br/>
                                <span className="text-gray-400">REPOSITORY CONTENTS</span> & <span className="text-gray-400">METADATA</span>
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Footer */}
                <div className="mt-8 text-center text-[10px] text-gray-600 tracking-widest font-mono flex items-center justify-center gap-2">
                    <Terminal className="w-3 h-3" />
                    <p>SYSTEM STATUS: <span className="text-[#00ff66] font-bold">ONLINE</span> | V.2.0.4</p>
                </div>
            </div>

            {/* Custom Scanner Animation */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes scan {
                    0% { top: -10%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 110%; opacity: 0; }
                }
            `}} />
        </div>
    );
};

export default LoginPage;