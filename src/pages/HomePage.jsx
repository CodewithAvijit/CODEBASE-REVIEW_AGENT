import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, GitBranch, FolderGit2, FileCode2, Terminal, LogOut, ChevronRight, Activity } from 'lucide-react';

const HomePage = () => {
    const navigate = useNavigate();
    
    const [token, setToken] = useState(null);
    const [username, setUsername] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

    const [repos, setRepos] = useState([]);
    const [selectedRepo, setSelectedRepo] = useState(null);
    
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(null);
    
    const [fileTree, setFileTree] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileContent, setFileContent] = useState('');
    
    const [loading, setLoading] = useState('');
    const [error, setError] = useState(null);
    const [isReviewing, setIsReviewing] = useState(false);

    useEffect(() => {
        const savedToken = localStorage.getItem("github_access_token");
        if (savedToken) {
            setToken(savedToken);
            fetchUserProfile(savedToken);
            fetchUserRepos(savedToken);
        } else {
            setError("UNAUTHORIZED_ACCESS_DETECTED");
        }
    }, []);

    const fetchUserProfile = async (authToken) => {
        try {
            const response = await fetch('https://api.github.com/user', {
                headers: { Authorization: `Bearer ${authToken}`, Accept: 'application/vnd.github.v3+json' }
            });
            if (response.ok) {
                const data = await response.json();
                setUsername(data.login);
                setAvatarUrl(data.avatar_url);
            }
        } catch (err) {}
    };

    const fetchUserRepos = async (authToken) => {
        setLoading('repos');
        setError(null);
        try {
            const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
                headers: { Authorization: `Bearer ${authToken}`, Accept: 'application/vnd.github.v3+json' }
            });
            if (!response.ok) throw new Error("REPO_FETCH_FAILED");
            const data = await response.json();
            setRepos(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading('');
        }
    };

    const handleRepoSelect = async (repo) => {
        setSelectedRepo(repo);
        setSelectedBranch(null);
        setFileTree([]);
        setSelectedFile(null);
        setFileContent('');
        setLoading('branches');
        setError(null);

        try {
            const response = await fetch(`https://api.github.com/repos/${repo.full_name}/branches`, {
                headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3+json' }
            });
            if (!response.ok) throw new Error("BRANCH_FETCH_FAILED");
            const data = await response.json();
            setBranches(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading('');
        }
    };

    const handleBranchSelect = async (branch) => {
        setSelectedBranch(branch);
        setSelectedFile(null);
        setFileContent('');
        setLoading('files');
        setError(null);

        try {
            const response = await fetch(`https://api.github.com/repos/${selectedRepo.full_name}/git/trees/${branch.commit.sha}?recursive=1`, {
                headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3+json' }
            });
            if (!response.ok) throw new Error("FILE_TREE_FETCH_FAILED");
            const data = await response.json();
            
            const sortedTree = data.tree.sort((a, b) => {
                if (a.type === b.type) return a.path.localeCompare(b.path);
                return a.type === 'tree' ? -1 : 1;
            });
            
            setFileTree(sortedTree);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading('');
        }
    };

    const handleFileSelect = async (file) => {
        if (file.type !== 'blob') return; 
        
        setSelectedFile(file);
        setFileContent('');
        setLoading('fileContent');
        setError(null);

        try {
            const response = await fetch(`https://api.github.com/repos/${selectedRepo.full_name}/contents/${file.path}?ref=${selectedBranch.name}`, {
                headers: { 
                    Authorization: `Bearer ${token}`, 
                    Accept: 'application/vnd.github.v3.raw' 
                }
            });
            
            if (!response.ok) throw new Error("FILE_CONTENT_FETCH_FAILED");
            const text = await response.text();
            setFileContent(text);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading('');
        }
    };

    const executeBranchReview = async () => {
        setIsReviewing('branch');
        setError(null);

        try {
            const payload = {
                repo_url: `https://github.com/${selectedRepo.full_name}`, 
                branch_name: selectedBranch.name,
                github_token: token
            };

            const response = await fetch('http://127.0.0.1:8001/review/github-branch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.detail || `Review Failed with status ${response.status}`);
            }
            
            const reportData = await response.json();
            setIsReviewing(false);
            navigate('/report', { state: { reportData } });

        } catch (err) {
            console.error(err);
            setError(`BRANCH_REVIEW_ERROR: ${err.message}`);
            setIsReviewing(false);
        }
    };

    const executeFileReview = async () => {
        setIsReviewing('file');
        setError(null);

        try {
            const filename = selectedFile.path.split('/').pop() || 'code.txt';
            const blob = new Blob([fileContent], { type: 'text/plain' });
            const fileObject = new File([blob], filename, { type: 'text/plain' });

            const formData = new FormData();
            formData.append('file', fileObject);

            const response = await fetch('http://127.0.0.1:8001/review/file', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.detail || `File Review Failed with status ${response.status}`);
            }
            
            const reportData = await response.json();
            setIsReviewing(false);
            navigate('/report', { state: { reportData } });

        } catch (err) {
            console.error(err);
            setError(`FILE_REVIEW_ERROR: ${err.message}`);
            setIsReviewing(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("github_access_token");
        window.location.href = "/";
    };

    return (
        <div className="min-h-screen lg:h-screen w-full bg-[#050505] text-gray-300 font-sans flex flex-col overflow-x-hidden relative selection:bg-[#00ff66] selection:text-black">
            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,100,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,100,0.015)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
                <div className="absolute top-0 left-1/4 w-[40vw] h-[40vw] bg-[#00ff66]/5 rounded-full blur-[100px] opacity-50"></div>
            </div>
            
            {/* Header */}
            <header className="relative z-10 flex flex-wrap items-center justify-between px-4 sm:px-8 py-4 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#222] shadow-md gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-[#0f0f0f] border border-[#00ff66]/30 rounded-lg shadow-[0_0_15px_rgba(0,255,100,0.1)] group transition-all hover:border-[#00ff66]/60">
                        <Shield className="w-5 h-5 text-[#00ff66] group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                        <h1 className="text-lg sm:text-xl font-bold text-white tracking-wider leading-none">
                            Guardian of <span className="text-[#00ff66]">Code</span>
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-pulse"></span>
                            <span className="font-mono text-[10px] text-[#666] tracking-widest uppercase">Target Acquisition</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-6">
                    {username && (
                        <div className="hidden sm:flex items-center gap-3 px-4 py-1.5 bg-[#111] border border-[#333] rounded-full">
                            <Activity className="w-3.5 h-3.5 text-[#00ff66]" />
                            <span className="text-xs text-gray-200 font-medium tracking-wide">{username}</span>
                            {avatarUrl && <img src={avatarUrl} alt="OP" className="w-6 h-6 rounded-full border border-[#444]" />}
                        </div>
                    )}
                    <button 
                        onClick={handleLogout}
                        className="group flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#ff3333] hover:text-white hover:bg-[#ff3333]/10 px-4 py-2 rounded border border-[#ff3333]/20 hover:border-[#ff3333]/50 transition-all duration-300"
                    >
                        <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden sm:inline">Disconnect</span>
                    </button>
                </div>
            </header>

            {/* Error Banner */}
            {error && (
                <div className="relative z-10 mx-4 sm:mx-8 mt-4 bg-[#1a0505] border border-[#ff3333]/40 text-red-200 px-4 py-3 rounded text-sm flex items-center gap-3 shadow-[0_0_20px_rgba(255,51,51,0.1)] font-mono">
                    <AlertTriangle className="w-5 h-5 shrink-0 text-[#ff3333]" />
                    <span className="tracking-wide">{error}</span>
                </div>
            )}

            {/* Main Content Dashboard */}
            <main className="relative z-10 flex-1 flex flex-col lg:flex-row overflow-hidden p-4 sm:p-8 gap-6 h-full">
                
                {/* Panel 1: Repositories */}
                <div className="flex flex-col w-full lg:w-1/4 min-h-[300px] lg:min-h-0 bg-[#0a0a0a]/90 backdrop-blur-xl border border-[#222] rounded-xl shadow-2xl relative overflow-hidden group/panel transition-colors hover:border-[#333]">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00ff66]/40 to-transparent"></div>
                    
                    <div className="px-5 py-4 border-b border-[#222] flex items-center justify-between bg-[#0f0f0f]">
                        <div className="flex items-center gap-2 text-gray-200">
                            <FolderGit2 className="w-4 h-4 text-[#00ff66]" />
                            <span className="text-xs font-bold tracking-widest uppercase font-mono">Repositories</span>
                        </div>
                        {loading === 'repos' && <span className="font-mono text-[10px] text-[#00ff66] animate-pulse tracking-widest">SCANNING...</span>}
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
                        {repos.map(repo => (
                            <button 
                                key={repo.id} 
                                onClick={() => handleRepoSelect(repo)}
                                className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-200 flex items-center justify-between border group ${selectedRepo?.id === repo.id ? 'bg-[#00ff66]/10 border-[#00ff66]/40 text-[#00ff66] shadow-[inset_4px_0_0_#00ff66]' : 'border-transparent hover:bg-[#111] text-gray-400 hover:text-gray-100'}`}
                            >
                                <span className="truncate font-medium">{repo.name}</span>
                                <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${selectedRepo?.id === repo.id ? 'translate-x-1 opacity-100' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Panel 2: Branches & File Tree */}
                <div className="w-full lg:w-1/4 flex flex-col gap-6 min-h-[500px] lg:min-h-0">
                    
                    {/* Branches */}
                    <div className="flex-1 flex flex-col bg-[#0a0a0a]/90 backdrop-blur-xl border border-[#222] rounded-xl shadow-2xl relative overflow-hidden hover:border-[#333] transition-colors">
                        <div className="px-5 py-3 border-b border-[#222] flex items-center justify-between bg-[#0f0f0f]">
                            <div className="flex items-center gap-2 text-gray-200">
                                <GitBranch className="w-4 h-4 text-[#0099ff]" />
                                <span className="text-xs font-bold tracking-widest uppercase font-mono">Branches</span>
                            </div>
                            {loading === 'branches' && <span className="font-mono text-[10px] text-[#0099ff] animate-pulse tracking-widest">FETCHING...</span>}
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
                            {!selectedRepo && <div className="h-full flex items-center justify-center text-xs text-[#555] font-mono uppercase tracking-widest">Awaiting Repo</div>}
                            {branches.map(branch => (
                                <button 
                                    key={branch.name} 
                                    onClick={() => handleBranchSelect(branch)}
                                    className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center gap-3 border ${selectedBranch?.name === branch.name ? 'bg-[#0099ff]/10 border-[#0099ff]/40 text-[#0099ff]' : 'border-transparent hover:bg-[#111] text-gray-400 hover:text-gray-100'}`}
                                >
                                    <GitBranch className="w-3.5 h-3.5 shrink-0 opacity-70" />
                                    <span className="truncate font-medium">{branch.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* File Tree */}
                    <div className="flex-[2] flex flex-col bg-[#0a0a0a]/90 backdrop-blur-xl border border-[#222] rounded-xl shadow-2xl relative overflow-hidden hover:border-[#333] transition-colors">
                        <div className="px-5 py-3 border-b border-[#222] flex items-center justify-between bg-[#0f0f0f]">
                            <div className="flex items-center gap-2 text-gray-200">
                                <FileCode2 className="w-4 h-4 text-[#ffcc00]" />
                                <span className="text-xs font-bold tracking-widest uppercase font-mono">Directory Tree</span>
                            </div>
                            {loading === 'files' && <span className="font-mono text-[10px] text-[#ffcc00] animate-pulse tracking-widest">MAPPING...</span>}
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-0.5 custom-scrollbar text-[13px] font-mono">
                            {!selectedBranch && <div className="h-full flex items-center justify-center text-xs text-[#555] uppercase tracking-widest">Awaiting Branch</div>}
                            {fileTree.map(item => (
                                <div 
                                    key={item.sha} 
                                    onClick={() => handleFileSelect(item)}
                                    className={`px-3 py-2 rounded-lg flex items-center gap-3 transition-colors ${item.type === 'blob' ? 'cursor-pointer hover:bg-[#1a1a1a] hover:text-gray-200' : 'cursor-default opacity-50'} ${selectedFile?.sha === item.sha ? 'bg-[#111] text-[#00ff66] border border-[#00ff66]/20' : 'text-gray-500 border border-transparent'}`}
                                >
                                    {item.type === 'tree' ? (
                                        <svg className="w-4 h-4 text-[#555] shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
                                    ) : (
                                        <FileCode2 className="w-4 h-4 shrink-0 opacity-70" />
                                    )}
                                    <span className="truncate">{item.path}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Panel 3: Code Viewer & Actions */}
                <div className="flex flex-col w-full lg:w-2/4 min-h-[600px] lg:min-h-0 bg-[#050505] border border-[#333] rounded-xl shadow-2xl relative overflow-hidden group/editor">
                    
                    {/* Viewer Header */}
                    <div className="px-5 py-4 bg-[#0a0a0a] border-b border-[#333] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3 overflow-hidden text-[#00ff66] font-mono">
                            <Terminal className="w-5 h-5 shrink-0" />
                            <span className="text-sm tracking-wider truncate font-bold">
                                {selectedFile ? selectedFile.path : "TERMINAL_STANDBY"}
                            </span>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 shrink-0 flex-wrap">
                            {isReviewing && <span className="font-mono text-[10px] text-[#00ff66] animate-pulse tracking-widest bg-[#00ff66]/10 px-3 py-1.5 rounded border border-[#00ff66]/30">ANALYZING {isReviewing.toUpperCase()}...</span>}
                            {loading === 'fileContent' && <span className="font-mono text-[10px] text-[#00ff66] animate-pulse tracking-widest">DECRYPTING...</span>}
                            
                            {selectedFile && fileContent && (
                                <button 
                                    onClick={executeFileReview} 
                                    disabled={!!isReviewing}
                                    className="bg-[#0099ff]/10 text-[#0099ff] border border-[#0099ff]/40 hover:bg-[#0099ff] hover:text-white px-5 py-2 rounded-lg text-xs font-bold font-mono tracking-widest uppercase transition-all duration-300 shadow-[0_0_15px_rgba(0,153,255,0.1)] hover:shadow-[0_0_20px_rgba(0,153,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <FileCode2 className="w-4 h-4" />
                                    Review File
                                </button>
                            )}

                            {fileTree.length > 0 && (
                                <button 
                                    onClick={executeBranchReview} 
                                    disabled={!!isReviewing}
                                    className="bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/40 hover:bg-[#00ff66] hover:text-black px-5 py-2 rounded-lg text-xs font-bold font-mono tracking-widest uppercase transition-all duration-300 shadow-[0_0_15px_rgba(0,255,100,0.1)] hover:shadow-[0_0_20px_rgba(0,255,100,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <GitBranch className="w-4 h-4" />
                                    Review Branch
                                </button>
                            )}
                        </div>
                    </div>
                    
                    {/* Code Display */}
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#020202]">
                        {!selectedFile && (
                            <div className="h-full flex items-center justify-center flex-col gap-5 text-[#333]">
                                <Terminal className="w-20 h-20 opacity-20" />
                                <p className="font-mono uppercase tracking-widest text-sm text-[#555]">Awaiting Target Designation</p>
                            </div>
                        )}
                        
                        {fileContent && (
                            <pre className="m-0 whitespace-pre-wrap break-words text-[13px] leading-relaxed font-mono text-gray-300 selection:bg-[#0099ff]/30 selection:text-white">
                                <code>{fileContent}</code>
                            </pre>
                        )}
                    </div>
                </div>
            </main>

            <style dangerouslySetInnerHTML={{__html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0,0,0,0.2);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #333;
                    border-radius: 4px;
                    border: 2px solid #0a0a0a;
                }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                    background: #555;
                }
            `}} />
        </div>
    );
};

export default HomePage;