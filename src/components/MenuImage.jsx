import { useNavigate } from 'react-router-dom';

export default function MenuImagePage() {
  const navigate = useNavigate();

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
          src="/src/assets/images/Debuggers_Da_Dhabba_Menu.png"
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
        <p style={{ margin: '5px 0' }}>
          📱 Save this image for offline viewing
        </p>
      </div>

      {/* Bottom spacing for mobile */}
      <div style={{ height: '20px' }}></div>
    </div>
  );
}
