import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Img from '../../src/assets/images/Debuggers_Da_Dhabba_Menu.png';

export default function MenuImagePage() {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [menuImageCached, setMenuImageCached] = useState(false);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Cache the menu image
  useEffect(() => {
    const cacheMenuImage = async () => {
      try {
        const response = await fetch(Img);
        if (response.ok) {
          const blob = await response.blob();
          // Store in cache API if supported
          if ('caches' in window) {
            const cache = await caches.open('menu-cache-v1');
            await cache.put(Img, new Response(blob));
            setMenuImageCached(true);
          }
        }
      } catch (error) {
        console.log('Failed to cache menu image:', error);
      }
    };

    if (isOnline) {
      cacheMenuImage();
    }
  }, [isOnline]);

  // Download menu image function
  const downloadMenuImage = async () => {
    try {
      const response = await fetch(Img);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Debuggers_Da_Dhaba_Menu.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download menu:', error);
      alert('Failed to download menu. Please try again when online.');
    }
  };

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '10px',
        maxWidth: '100vw',
        minHeight: '100vh',
        backgroundColor: '#fafafa',
      }}
    >
      {/* Offline status indicator */}
      {!isOnline && (
        <div
          style={{
            backgroundColor: '#ff6b6b',
            color: 'white',
            padding: '8px',
            borderRadius: '6px',
            marginBottom: '10px',
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          📱 You're offline - Menu is cached for viewing
        </div>
      )}

      {/* Menu cached indicator */}
      {menuImageCached && isOnline && (
        <div
          style={{
            backgroundColor: '#51cf66',
            color: 'white',
            padding: '8px',
            borderRadius: '6px',
            marginBottom: '10px',
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          ✅ Menu cached for offline viewing
        </div>
      )}

      {/* Header with back button and title stacked */}
      <div
        style={{
          marginBottom: '15px',
          padding: '5px 0',
        }}
      >
        {/* Back button */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: '10px',
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: '10px 16px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: 'black',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              whiteSpace: 'nowrap',
              minWidth: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            ⬅ Back to Order Online
          </button>
        </div>

        {/* Title */}
        <h2
          style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: '600',
            textAlign: 'center',
            color: '#333',
          }}
        >
          Our Full Menu
        </h2>
      </div>

      {/* Menu Image Container */}
      <div
        style={{
          padding: '0 5px',
          marginBottom: '20px',
        }}
      >
        <img
          src={Img}
          alt="Debuggers Da Dhaba Menu"
          style={{
            width: '100%',
            maxWidth: '100%',
            height: 'auto',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
          }}
        />
      </div>

      {/* Additional mobile-friendly features */}
      <div
        style={{
          padding: '10px',
          fontSize: '14px',
          color: '#666',
          lineHeight: '1.4',
        }}
      >
        <p style={{ margin: '5px 0' }}>
          💡 Tip: Pinch to zoom for better readability
        </p>

        {/* Download button */}
        <div style={{ marginTop: '15px' }}>
          <button
            onClick={downloadMenuImage}
            style={{
              padding: '12px 20px',
              border: '2px solid #4CAF50',
              borderRadius: '8px',
              backgroundColor: isOnline ? '#4CAF50' : '#ccc',
              color: 'white',
              cursor: isOnline ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              margin: '0 auto',
              boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
            }}
            disabled={!isOnline}
          >
            📱 Download Menu for Offline
          </button>
        </div>

        {isOnline ? (
          <p style={{ margin: '10px 0', fontSize: '12px', color: '#888' }}>
            Download the menu to view it anytime, even without internet
          </p>
        ) : (
          <p style={{ margin: '10px 0', fontSize: '12px', color: '#888' }}>
            Connect to internet to download menu
          </p>
        )}
      </div>

      {/* Bottom spacing for mobile */}
      <div style={{ height: '20px' }}></div>
    </div>
  );
}
