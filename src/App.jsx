import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import ReportPage from './pages/ReportPage';

function App() {
  return (
      <Routes>
        <Route path="/" element={<UploadPage/>} />
        <Route path="/report" element={<ReportPage/>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  );
}

export default App;