import React, { useEffect, useRef, useState } from 'react';
import '../assets/css/menuPage.css';
import { MenuOption } from '../data/menuData.jsx';
import { useParams, Link } from 'react-router-dom';
import Img from '../../src/assets/images/Dhabba_Logo.jpeg';
import LoginPopup from './loginPopup';
import ReactGA from 'react-ga4';

export default function Header() {
  const { tableId, category } = useParams();
  const activeRef = useRef(null);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [imageError, setImageError] = useState(false);

  // Login functionality
  const handleLoginSuccess = userData => {
    setUser(userData);
    setImageError(false); // Reset image error on new login
    console.log('User logged in successfully:', userData);

    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify(userData));

    // Track login event in GA4
    ReactGA.event({
      category: 'User',
      action: 'Login',
      label: 'Google OAuth',
    });
  };

  const handleLogout = () => {
    setUser(null);
    setImageError(false);
    localStorage.removeItem('user');
    console.log('User logged out');

    // Track logout event in GA4
    ReactGA.event({
      category: 'User',
      action: 'Logout',
      label: 'Manual',
    });
  };

  // Check for existing user on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const activeIndex = MenuOption.findIndex(
    item => item.url === category || (!category && item.url === 'home')
  );

  let reorderedCategories = [...MenuOption];

  if (
    activeIndex > -1 &&
    MenuOption[activeIndex].url !== 'home' // don't move "all"
  ) {
    const [activeItem] = reorderedCategories.splice(activeIndex, 1);
    reorderedCategories.splice(1, 0, activeItem); // put active at 2nd
  }

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [category]);

  // Function to get user initials
  const getUserInitials = name => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Function to handle image error
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <>
      <header id="sticky-header" className="header">
        <div className="table-banner">
          🍽️ You are placing an order for <strong>Table {tableId}</strong>
          {/* Login Section - Extreme Right */}
          <div className="login-section">
            {user ? (
              <div className="user-info">
                <div className="user-avatar-container">
                  {user.picture && !imageError ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="user-avatar"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="user-avatar-fallback">
                      {getUserInitials(user.name)}
                    </div>
                  )}
                </div>
                <span className="user-greeting">
                  👋 Hi,{' '}
                  <span className="user-name">
                    {user.name?.split(' ')[0] || 'User'}
                  </span>
                </span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            ) : (
              <button onClick={() => setShowLogin(true)} className="login-btn">
                Login
              </button>
            )}
          </div>
        </div>

        <div className="header-top">
          <div className="logo-section">
            <img src={Img} alt="Debuggers Da Dhabba" className="logo" />
            <h1 className="restaurant-name">Debuggers Da Dhabba</h1>
          </div>
        </div>

        <section className="categories">
          <div className="categories-container">
            {reorderedCategories.map((item, index) => {
              const isActive =
                item.url === category || (!category && item.url === 'home');

              return (
                <div
                  key={index}
                  ref={isActive ? activeRef : null}
                  className={`category ${isActive ? 'active' : ''}`}
                >
                  <Link
                    to={
                      item.url.startsWith('/')
                        ? item.url
                        : `/menu/${tableId}/${item.url}`
                    }
                  >
                    <img
                      src={
                        item.path ??
                        `https://instalacarte.com/media/cache/emoji_small/emoji/${item.img}?v3`
                      }
                      alt={item.name}
                    />
                    <div className="category-name">{item.name}</div>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      </header>

      {/* Login Popup */}
      <LoginPopup
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
}
