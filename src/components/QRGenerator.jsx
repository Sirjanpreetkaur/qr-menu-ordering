import React, { useMemo, useState } from 'react';
import QRCode from 'react-qr-code';
import { Helmet } from 'react-helmet-async';
import '../assets/css/qrGenerator.css';
import Logo from '../assets/images/Dhabba_Logo.jpeg';
const tables = Array.from({ length: 12 }, (_, i) => i + 1);

const BASE_URL =
  typeof window !== 'undefined'
    ? `${window.location.origin}/menu`
    : 'https://example.com/menu';

export default function QRGenerator() {
  const [copied, setCopied] = useState(false);

  const qrList = useMemo(
    () =>
      tables.map(t => ({
        table: t,
        url: `${BASE_URL}/${t}/home`,
      })),
    []
  );

  const handleCopyBase = async () => {
    try {
      await navigator.clipboard.writeText(`${BASE_URL}/{tableId}/home`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {
      // no-op
    }
  };

  const pageTitle = 'Debuggers Da Dhabba • Table QR Codes';

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>

      <main className="qr-root">
        <header className="qr-header" role="banner">
          <div className="qr-header-inner">
            <div className="qr-title" aria-label="Page title">
              <img src={Logo} alt="Dhaba Logo" className="qr-logo" />
              <div className="qr-title-left-accent" aria-hidden="true" />
              <h1
                className="qr-title-text"
                aria-label="Welcome to Debuggers Da Dhaba"
              >
                Welcome to Debuggers Da Dhaba
                <span className="qr-title-underline" aria-hidden="true"></span>
                <span className="qr-title-tagline">
                  Your meal is just a scan away!
                </span>
              </h1>
            </div>
          </div>
        </header>

        <section className="qr-content">
          <div className="qr-grid" role="list">
            {qrList.map(({ table, url }) => (
              <article className="qr-card" role="listitem" key={table}>
                <span className="qr-badge">Table {table}</span>

                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="qr-link"
                  aria-label={`Open menu for table ${table} in a new tab`}
                  title={`Open ${url}`}
                >
                  <div
                    className="qr-box"
                    aria-label={`QR code for table ${table}`}
                  >
                    <QRCode
                      value={url}
                      size={150}
                      fgColor="#2b2b2b"
                      bgColor="#ffffff"
                    />
                  </div>

                  <div className="qr-label">Scan or Click to Open</div>
                </a>
              </article>
            ))}
          </div>
        </section>
      </main>

      {copied && (
        <div className="toast" role="status">
          Base URL copied
        </div>
      )}
    </>
  );
}
