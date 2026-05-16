import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DigitalClock from './pages/DigitalClock';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/clock" element={<DigitalClock />} />
        <Route path="/" element={<Navigate to="/clock" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
