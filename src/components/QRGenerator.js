import React from "react";
import QRCode from "react-qr-code";
import "../assets/menuPage.css";

// Generate QR codes for 12 tables
const tables = Array.from({ length: 12 }, (_, i) => i + 1);

export default function QRGenerator() {
  return (
    <div className="qr-container">
      <h2>Table QR Codes</h2>
      <div className="qr-grid">
        {tables.map((tableId) => {
          const url = `${window.location.origin}/menu/${tableId}/all`;
          return (
            <div key={tableId} className="qr-card">
              {/* Clicking the QR—or scanning on mobile—goes to /menu/:tableId */}
              <a
                href={url}
                title={`Open menu for Table ${tableId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <QRCode value={url} size={128} />
              </a>

              <div className="qr-label">Table {tableId}</div>
              <small>
                <a href={url}>Click here to open menu</a>
              </small>
            </div>
          );
        })}
      </div>
    </div>
  );
}
