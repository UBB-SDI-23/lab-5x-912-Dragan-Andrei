import React from 'react';
import ReactDOM from 'react-dom/client';

// css
import './assets/css/index.css';
import './assets/css/fonts.css';

// utils
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme } from '@mui/material';

// react components
import Menu from './Menu';
import Home from './Home';

// change material UI theme
const theme = createTheme({
  typography: {
    fontFamily: 'Quattrocento Sans'
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
      </Routes>
    </Router>
  </React.StrictMode>,
)
