import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ReportPage from './pages/ReportPage';
import ProtectedRoute from './pages/ProtectedRoute';
import AuthSuccess from './pages/AuthSucess';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/auth-success" element={<AuthSuccess />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<HomePage/>} />
        <Route path="/report" element={<ReportPage />} />
      </Route>
    </Routes>
  );
}

export default App;