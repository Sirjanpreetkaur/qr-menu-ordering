import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { HelmetProvider } from 'react-helmet-async';
import { registerSW } from 'virtual:pwa-register';
import { GoogleOAuthProvider } from '@react-oauth/google';

registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="594800687551-ffp6n8soenumlr1m2rag7mdc94fcb90q.apps.googleusercontent.com">
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </GoogleOAuthProvider>
);
