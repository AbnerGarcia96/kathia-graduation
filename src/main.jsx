import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import Admin from './Admin.jsx';
import './styles.css';

const pathname = window.location.pathname;
const RootComponent = pathname === '/admin' ? Admin : App;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootComponent />
  </React.StrictMode>
);
