import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';
import Routeur from './components/routes/Routeur'
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Routeur />
  </React.StrictMode>
);

reportWebVitals();