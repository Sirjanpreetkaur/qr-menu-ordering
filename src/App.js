import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import QRGenerator from './components/QRGenerator';
import MenuPage from './components/MenuPage';
import ReactGA from 'react-ga4'; // <-- notice the package

ReactGA.initialize('G-0YX9MCJ4PF', { send_page_view: false });

function GtagPageviewTracker() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({
      hitType: 'pageview',
      page: location.pathname + location.search,
      title: document.title,
    });
  }, [location]);

  return null;
}

function App() {
  return (
    <Router>
      <GtagPageviewTracker />
      <Routes>
        <Route path="/" element={<QRGenerator />} />
        <Route path="/menu/:tableId/:category" element={<MenuPage />} />
      </Routes>
    </Router>
  );
}

export default App;
