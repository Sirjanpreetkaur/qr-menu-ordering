import { useNavigate } from 'react-router-dom';
import Img from '../../src/assets/images/Debuggers_Da_Dhabba_Menu.png';

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
      {/* Header with back button */}
      <div style={{ marginBottom: '15px', padding: '5px 0' }}>
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
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            ⬅ Back to Order Online
          </button>
        </div>

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

      {/* Menu Image */}
      <div style={{ padding: '0 5px', marginBottom: '20px' }}>
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

      {/* Download option */}
      <div style={{ padding: '10px', fontSize: '14px', color: '#666' }}>
        <button
          onClick={() => {
            const link = document.createElement('a');
            link.href = Img;
            link.download = 'Debuggers_Da_Dhaba_Menu.png';
            link.click();
          }}
          style={{
            padding: '12px 20px',
            border: '2px solid #4CAF50',
            borderRadius: '8px',
            backgroundColor: '#4CAF50',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: '0 auto',
            boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
          }}
        >
          📱 Download Menu
        </button>
      </div>
    </div>
  );
}
