import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Img from '../../src/assets/images/Debuggers_Da_Dhabba_Menu.png';

export default function MenuImagePage() {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [menuImageCached, setMenuImageCached] = useState(false);
  const [cachedImageUrl, setCachedImageUrl] = useState(null);
  const [imageLoadError, setImageLoadError] = useState(false);

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

  // Cache the menu image with blob URL storage
  useEffect(() => {
    const cacheMenuImage = async () => {
      try {
        const response = await fetch(Img);
        if (response.ok) {
          const blob = await response.blob();

          // Create blob URL for offline use
          const blobUrl = URL.createObjectURL(blob);
          setCachedImageUrl(blobUrl);

          // Also store in cache API if supported
          if ('caches' in window) {
            const cache = await caches.open('menu-cache-v1');
            await cache.put(Img, new Response(blob.clone()));
          }

          setMenuImageCached(true);
          console.log('Menu image cached successfully');
        }
      } catch (error) {
        console.log('Failed to cache menu image:', error);
      }
    };

    if (isOnline && !menuImageCached) {
      cacheMenuImage();
    }
  }, [isOnline, menuImageCached]);

  // Try to load from cache when offline
  useEffect(() => {
    const loadFromCache = async () => {
      if (!isOnline && !cachedImageUrl && 'caches' in window) {
        try {
          const cache = await caches.open('menu-cache-v1');
          const response = await cache.match(Img);
          if (response) {
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            setCachedImageUrl(blobUrl);
            console.log('Loaded menu from cache');
          }
        } catch (error) {
          console.log('Failed to load from cache:', error);
        }
      }
    };

    loadFromCache();
  }, [isOnline, cachedImageUrl]);

  // Download menu image function
  const downloadMenuImage = async () => {
    try {
      let blob;

      if (cachedImageUrl) {
        // Use cached version if available
        const response = await fetch(cachedImageUrl);
        blob = await response.blob();
      } else {
        // Fetch fresh if online
        const response = await fetch(Img);
        blob = await response.blob();
      }

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

  // Handle image load error
  const handleImageError = () => {
    setImageLoadError(true);
    console.log('Image failed to load');
  };

  // Determine which image source to use
  const getImageSource = () => {
    if (!isOnline && cachedImageUrl) {
      return cachedImageUrl;
    }
    return Img;
  };

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (cachedImageUrl) {
        URL.revokeObjectURL(cachedImageUrl);
      }
    };
  }, [cachedImageUrl]);

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
            backgroundColor: cachedImageUrl ? '#51cf66' : '#ff6b6b',
            color: 'white',
            padding: '8px',
            borderRadius: '6px',
            marginBottom: '10px',
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          {cachedImageUrl
            ? "📱 You're offline - Showing cached menu"
            : "📱 You're offline - Menu not cached"}
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
        {imageLoadError && !isOnline ? (
          <div
            style={{
              padding: '40px',
              backgroundColor: '#f5f5f5',
              borderRadius: '12px',
              border: '2px dashed #ccc',
              color: '#666',
            }}
          >
            <p>📱 Menu image not available offline</p>
            <p style={{ fontSize: '12px' }}>
              Connect to internet to view and cache the menu
            </p>
          </div>
        ) : (
          <img
            src={getImageSource()}
            alt="Debuggers Da Dhaba Menu"
            onError={handleImageError}
            style={{
              width: '100%',
              maxWidth: '100%',
              height: 'auto',
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              borderRadius: '12px',
              border: '1px solid #e0e0e0',
            }}
          />
        )}
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
              backgroundColor: isOnline || cachedImageUrl ? '#4CAF50' : '#ccc',
              color: 'white',
              cursor: isOnline || cachedImageUrl ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              margin: '0 auto',
              boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
            }}
            disabled={!isOnline && !cachedImageUrl}
          >
            📱 Download Menu for Offline
          </button>
        </div>

        {isOnline ? (
          <p style={{ margin: '10px 0', fontSize: '12px', color: '#888' }}>
            Download the menu to view it anytime, even without internet
          </p>
        ) : cachedImageUrl ? (
          <p style={{ margin: '10px 0', fontSize: '12px', color: '#888' }}>
            Menu available from cache
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
