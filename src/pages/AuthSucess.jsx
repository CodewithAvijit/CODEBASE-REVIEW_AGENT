import React, { useEffect } from 'react';

const AuthSuccess = () => {
    useEffect(() => {
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.substring(1));
        const token = params.get("access_token");
        const error = params.get("error");

        if (token) {
            localStorage.setItem("github_access_token", token);
        } else if (error) {
            localStorage.setItem("github_auth_error", "true");
        }
        
        window.close();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
                <p className="text-gray-600 font-medium">Finalizing Authentication...</p>
            </div>
        </div>
    );
};

export default AuthSuccess;