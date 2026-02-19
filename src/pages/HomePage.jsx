import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Shield, GitBranch, FolderGit2, FileCode2, Terminal, 
    LogOut, ChevronRight, Activity, AlertTriangle, Loader2, Code2
} from 'lucide-react';

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
            navigate('/report', { state: { reportData } });

        } catch (err) {
            console.error(err);
            setError(`BRANCH_REVIEW_ERROR: ${err.message}`);
        } finally {
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
            navigate('/report', { state: { reportData } });

        } catch (err) {
            console.error(err);
            setError(`FILE_REVIEW_ERROR: ${err.message}`);
        } finally {
            setIsReviewing(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("github_access_token");
        window.location.href = "/";
    };

    return (
        <div className="min-h-screen w-full bg-[#030303] text-gray-300 font-sans flex flex-col overflow-hidden relative selection:bg-[#00ff66]/30 selection:text-white">
            
            {/* Ambient Animated Background */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
                <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#00ff66]/10 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-10000"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[#0099ff]/10 rounded-full blur-[120px] mix-blend-screen"></div>
            </div>
            
            {/* Header */}
            <header className="relative z-10 flex items-center justify-between px-6 py-4 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl">
                <div className="flex items-center gap-4">
                    <div className="relative flex items-center justify-center w-11 h-11 bg-gradient-to-br from-[#111] to-[#050505] border border-[#00ff66]/40 rounded-xl shadow-[0_0_20px_rgba(0,255,100,0.15)] group transition-all hover:border-[#00ff66] hover:shadow-[0_0_30px_rgba(0,255,100,0.3)]">
                        <Shield className="w-5 h-5 text-[#00ff66] group-hover:scale-110 transition-transform duration-300" />
                        <div className="absolute inset-0 rounded-xl border border-[#00ff66]/20 animate-ping opacity-20"></div>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-wide leading-none flex items-center gap-2">
                            Guardian of <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00ff66] to-[#00ccff]">Code</span>
                        </h1>
                        <div className="flex items-center gap-2 mt-1.5">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff66] opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff66]"></span>
                            </span>
                            <span className="font-mono text-[10px] text-gray-500 tracking-[0.2em] uppercase">System Online</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {username && (
                        <div className="hidden sm:flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">
                            <Activity className="w-4 h-4 text-[#00ff66]" />
                            <span className="text-sm text-gray-200 font-medium">{username}</span>
                            {avatarUrl && <img src={avatarUrl} alt="OP" className="w-7 h-7 rounded-full border border-white/20" />}
                        </div>
                    )}
                    <button 
                        onClick={handleLogout}
                        className="group flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-red-400 hover:text-red-300 hover:bg-red-400/10 px-4 py-2.5 rounded-lg border border-red-500/20 hover:border-red-500/50 transition-all duration-300"
                    >
                        <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden sm:inline">Disconnect</span>
                    </button>
                </div>
            </header>

            {/* Error Banner */}
            {error && (
                <div className="relative z-10 mx-6 mt-6 bg-red-950/50 border border-red-500/30 backdrop-blur-md text-red-200 px-5 py-3.5 rounded-xl text-sm flex items-center gap-3 shadow-[0_0_30px_rgba(255,0,0,0.1)] font-mono animate-in slide-in-from-top-4 fade-in duration-300">
                    <AlertTriangle className="w-5 h-5 shrink-0 text-red-400" />
                    <span className="tracking-wide">{error}</span>
                </div>
            )}

            {/* Main Content Dashboard */}
            <main className="relative z-10 flex-1 flex flex-col lg:flex-row p-6 gap-6 h-[calc(100vh-80px)] overflow-hidden">
                
                {/* Panel 1: Repositories */}
                <div className="flex flex-col w-full lg:w-1/4 bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden transition-colors hover:border-white/20">
                    <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                        <div className="flex items-center gap-2.5 text-gray-200">
                            <FolderGit2 className="w-4 h-4 text-[#00ff66]" />
                            <span className="text-xs font-bold tracking-widest uppercase font-mono">Repositories</span>
                        </div>
                        {loading === 'repos' && <Loader2 className="w-4 h-4 text-[#00ff66] animate-spin" />}
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
                        {repos.map(repo => (
                            <button 
                                key={repo.id} 
                                onClick={() => handleRepoSelect(repo)}
                                className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 flex items-center justify-between group ${
                                    selectedRepo?.id === repo.id 
                                    ? 'bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66] shadow-[inset_3px_0_0_#00ff66]' 
                                    : 'border border-transparent hover:bg-white/5 text-gray-400 hover:text-gray-200'
                                }`}
                            >
                                <span className="truncate font-medium">{repo.name}</span>
                                <ChevronRight className={`w-4 h-4 shrink-0 transition-transform duration-300 ${selectedRepo?.id === repo.id ? 'translate-x-1 opacity-100' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Panel 2: Branches & File Tree */}
                <div className="w-full lg:w-1/4 flex flex-col gap-6 h-full">
                    {/* Branches */}
                    <div className="flex-[0.4] flex flex-col bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden transition-colors hover:border-white/20">
                        <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <div className="flex items-center gap-2.5 text-gray-200">
                                <GitBranch className="w-4 h-4 text-[#00ccff]" />
                                <span className="text-xs font-bold tracking-widest uppercase font-mono">Branches</span>
                            </div>
                            {loading === 'branches' && <Loader2 className="w-4 h-4 text-[#00ccff] animate-spin" />}
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
                            {!selectedRepo && (
                                <div className="h-full flex items-center justify-center text-xs text-gray-600 font-mono uppercase tracking-widest text-center px-4">
                                    Select a repository to scan branches
                                </div>
                            )}
                            {branches.map(branch => (
                                <button 
                                    key={branch.name} 
                                    onClick={() => handleBranchSelect(branch)}
                                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-200 flex items-center gap-3 border ${
                                        selectedBranch?.name === branch.name 
                                        ? 'bg-[#00ccff]/10 border-[#00ccff]/30 text-[#00ccff]' 
                                        : 'border-transparent hover:bg-white/5 text-gray-400 hover:text-gray-200'
                                    }`}
                                >
                                    <GitBranch className="w-3.5 h-3.5 shrink-0 opacity-70" />
                                    <span className="truncate font-medium">{branch.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* File Tree */}
                    <div className="flex-[0.6] flex flex-col bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden transition-colors hover:border-white/20">
                        <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <div className="flex items-center gap-2.5 text-gray-200">
                                <FileCode2 className="w-4 h-4 text-[#ffb700]" />
                                <span className="text-xs font-bold tracking-widest uppercase font-mono">Directory Tree</span>
                            </div>
                            {loading === 'files' && <Loader2 className="w-4 h-4 text-[#ffb700] animate-spin" />}
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-0.5 custom-scrollbar text-[13px] font-mono">
                            {!selectedBranch && (
                                <div className="h-full flex items-center justify-center text-xs text-gray-600 uppercase tracking-widest text-center px-4">
                                    Awaiting Branch Selection
                                </div>
                            )}
                            {fileTree.map(item => (
                                <div 
                                    key={item.sha} 
                                    onClick={() => handleFileSelect(item)}
                                    className={`px-3 py-2.5 rounded-lg flex items-center gap-3 transition-colors ${
                                        item.type === 'blob' ? 'cursor-pointer hover:bg-white/10 hover:text-gray-200' : 'cursor-default opacity-50'
                                    } ${
                                        selectedFile?.sha === item.sha ? 'bg-white/10 text-[#00ff66]' : 'text-gray-400'
                                    }`}
                                >
                                    {item.type === 'tree' ? (
                                        <svg className="w-4 h-4 text-gray-500 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
                                    ) : (
                                        <Code2 className="w-4 h-4 shrink-0 opacity-70" />
                                    )}
                                    <span className="truncate">{item.path}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Panel 3: Code Viewer & Actions */}
                <div className="flex flex-col w-full lg:w-2/4 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden flex-1">
                    
                    {/* Viewer Header */}
                    <div className="px-5 py-3 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.02]">
                        <div className="flex items-center gap-3 overflow-hidden text-gray-300 font-mono">
                            <Terminal className="w-4 h-4 shrink-0 text-gray-500" />
                            <span className="text-sm tracking-wider truncate text-gray-400">
                                {selectedFile ? (
                                    <React.Fragment>
                                        {selectedRepo?.name} <span className="text-gray-600">/</span> <span className="text-white font-medium">{selectedFile.path}</span>
                                    </React.Fragment>
                                ) : "TERMINAL_STANDBY"}
                            </span>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 shrink-0 flex-wrap">
                            {isReviewing && (
                                <div className="flex items-center gap-2 font-mono text-[10px] text-[#00ff66] bg-[#00ff66]/10 px-3 py-1.5 rounded-lg border border-[#00ff66]/30">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    <span className="tracking-widest">ANALYZING {isReviewing.toUpperCase()}...</span>
                                </div>
                            )}
                            
                            {selectedFile && fileContent && (
                                <button 
                                    onClick={executeFileReview} 
                                    disabled={!!isReviewing}
                                    className="relative group bg-gradient-to-r from-[#00ccff]/10 to-[#0099ff]/10 text-[#00ccff] border border-[#00ccff]/30 hover:border-[#00ccff] hover:text-white px-5 py-2 rounded-lg text-xs font-bold font-mono tracking-widest uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <FileCode2 className="w-4 h-4" />
                                    Review File
                                    <div className="absolute inset-0 rounded-lg bg-[#00ccff] opacity-0 group-hover:opacity-10 transition-opacity"></div>
                                </button>
                            )}

                            {fileTree.length > 0 && (
                                <button 
                                    onClick={executeBranchReview} 
                                    disabled={!!isReviewing}
                                    className="relative group bg-gradient-to-r from-[#00ff66]/10 to-[#00cc44]/10 text-[#00ff66] border border-[#00ff66]/30 hover:border-[#00ff66] hover:text-black hover:bg-[#00ff66] px-5 py-2 rounded-lg text-xs font-bold font-mono tracking-widest uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <GitBranch className="w-4 h-4" />
                                    Review Branch
                                </button>
                            )}
                        </div>
                    </div>
                    
                    {/* Code Display */}
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#050505] relative">
                        {loading === 'fileContent' && (
                            <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-sm flex items-center justify-center z-10">
                                <Loader2 className="w-8 h-8 text-[#00ff66] animate-spin" />
                            </div>
                        )}
                        
                        {!selectedFile ? (
                            <div className="h-full flex items-center justify-center flex-col gap-6 text-[#333]">
                                <div className="relative">
                                    <Terminal className="w-24 h-24 opacity-20" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent"></div>
                                </div>
                                <p className="font-mono uppercase tracking-[0.3em] text-xs text-gray-600">Awaiting Target Designation</p>
                            </div>
                        ) : (
                            <pre className="m-0 whitespace-pre-wrap break-words text-[13px] leading-relaxed font-mono text-gray-300 selection:bg-white/20 selection:text-white">
                                <code>{fileContent}</code>
                            </pre>
                        )}
                    </div>
                </div>
            </main>

            <style dangerouslySetInnerHTML={{__html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}} />
        </div>
    );
};

export default HomePage;