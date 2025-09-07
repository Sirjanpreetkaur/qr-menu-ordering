import React, { useState } from 'react';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import '../assets/css/loginPopup.css';

const LoginPopup = ({ isOpen, onClose, onSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = credentialResponse => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log('Google login successful:', decoded);

      const userData = {
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
        token: credentialResponse.credential,
      };

      onSuccess(userData);
      onClose();
    } catch (error) {
      console.error('Error decoding token:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
    alert('Google login failed. Please try again.');
  };

  // Alternative custom Google login button using useGoogleLogin hook
  const customGoogleLogin = useGoogleLogin({
    onSuccess: async tokenResponse => {
      setLoading(true);
      try {
        // Fetch user info using the access token
        const userInfoResponse = await fetch(
          'https://www.googleapis.com/oauth2/v2/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const userInfo = await userInfoResponse.json();
        console.log('User info:', userInfo);

        const userData = {
          id: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
          picture: userInfo.picture,
          accessToken: tokenResponse.access_token,
        };

        onSuccess(userData);
        onClose();
      } catch (error) {
        console.error('Error fetching user info:', error);
        alert('Login failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      console.error('Custom Google login failed');
      alert('Google login failed. Please try again.');
      setLoading(false);
    },
  });

  const handlePhoneSubmit = e => {
    e.preventDefault();
    if (phoneNumber.length === 10) {
      console.log('Phone number:', phoneNumber);
      // Implement phone authentication logic here
      alert('Phone authentication not implemented yet');
    } else {
      alert('Please enter a valid 10-digit phone number');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="login-overlay" onClick={onClose}>
      <div className="login-popup" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <div className="login-content">
          <div className="login-left">
            <div className="logo">
              <h1>
                Debuggers
                <br />
                Da
                <br />
                Dhabba
              </h1>
            </div>

            <h2 className="login-title">
              Sign in to start
              <br />
              your food journey
            </h2>

            {/* Google Auth Container */}
            <div className="google-auth-container">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="filled_blue"
                size="large"
                text="signin_with"
                shape="rectangular"
                width="100%"
              />
            </div>

            {/* Terms */}
            <p className="terms-text">
              By signing in, you agree to our{' '}
              <a href="#" className="terms-link">
                Terms
              </a>{' '}
              &{' '}
              <a href="#" className="terms-link">
                Privacy
              </a>
            </p>
          </div>

          <div className="login-right">
            <div className="app-promotion">
              <div className="phone-mockup">
                <div className="phone-icon">🍽️</div>
              </div>

              <h3>
                Order faster
                <br />& easier
                <br />
                everytime
              </h3>
              <hr />
              <div className="tagline">Debug Your Hunger!</div>

              <div className="qr-instructions">
                <div className="instruction-item">
                  <span className="step-number">1</span>
                  <span>Scan QR code on your table</span>
                </div>
                <div className="instruction-item">
                  <span className="step-number">2</span>
                  <span>Browse our digital menu</span>
                </div>
                <div className="instruction-item">
                  <span className="step-number">3</span>
                  <span>Order & pay instantly</span>
                </div>
              </div>

              <div className="restaurant-features">
                <div className="feature">⚡ Fast ordering</div>
                <div className="feature">📱 No app needed</div>
                <div className="feature">🔒 Secure payment</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
