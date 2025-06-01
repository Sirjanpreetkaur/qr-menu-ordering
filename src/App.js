import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QRGenerator from './components/QRGenerator';
import MenuPage from './components/MenuPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<QRGenerator />} />
        <Route path="/menu/:tableId/:category" element={<MenuPage />} />
      </Routes>
    </Router>
  );
}

export default App;
