import React from 'react';
import ReactDOM from 'react-dom/client';

// css
import './assets/css/index.css';
import './assets/css/fonts.css';

// utils
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { theme } from './utils/theme';

// react components
import Menu from './components/Menu';
import Home from './components/Home';
import DetailedCoffeeItem from './components/DetailedCoffeeItem';
import AddCoffee from './components/AddCoffee';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coffees" element={<Menu />} />
        <Route path="/coffees/add" element={<AddCoffee />} />
        <Route path="/coffees/:id" element={<DetailedCoffeeItem />} />
      </Routes>
    </Router>
    </ThemeProvider>
  </React.StrictMode>,
)
