import React from 'react';
import QRCode from 'react-qr-code';
import '../assets/menuPage.css';
import { Helmet } from 'react-helmet-async';
import Img from '../../src/assets/images/Dhabba_Logo.jpeg';

// Generate QR codes for 12 tables
const tables = Array.from({ length: 12 }, (_, i) => i + 1);

export default function QRGenerator() {
  return (
    <div className="qr-container">
      <Helmet>
        <title>Table QR Codes • Debuggers Da Dhabba</title>
        <meta
          name="description"
          content="Scan the QR code for your table and explore our digital menu."
        />
      </Helmet>

      {/* Branding header */}
      <div className="qr-header">
        <div className='qr-header-flex'>
          <img src={Img} alt="Debuggers Da Dhabba" className="logo qr" />
          <h1 className="qr-title">Debuggers Da Dhabba</h1>
        </div>
        
        <p className="qr-subtitle">
          Scan your table QR below to <strong>explore menu</strong> & order food instantly
        </p>
      </div>

      {/* QR Grid */}
      <div className="qr-grid">
        {tables.map(tableId => {
          const url = `${window.location.origin}/menu/${tableId}/home`;
          return (
            <div key={tableId} className="qr-card">
              <QRCode value={url} size={128} />
              <div className="qr-label">Table {tableId}</div>
              <a href={url} className="qr-btn">
                Open Menu
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
