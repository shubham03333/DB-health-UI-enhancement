import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import Dashboard from './components/Dashboard';
import TableDashboard from './components/TableDashboard';
import ErrorPage from './components/ErrorPage';
import ThemeToggle from './components/ThemeToggle';
import ScrollToTopButton from './components/ScrollToTopButton';
import { ThemeProvider } from './contexts/ThemeContext';
import {
  Typography
} from '@mui/material';

import './App.css';
import './styles/themes.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <ThemeProvider>
      <div style={{ paddingTop: '6rem' }}>
        <Typography variant="h4" gutterBottom style={{ color: 'primary', fontWeight:'bold' }}>
          Oracle Health Check Dashboard
        </Typography>
        <nav style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 1000,
          boxSizing: 'border-box'
        }}>
          <div style={{paddingLeft: '80px'}}>
            <Link to="/" style={{ color: 'var(--text-primary)', marginRight: '1rem', textDecoration: 'none' }}>DB Monitor</Link> |{' '}
            <Link to="/tableDashboard" style={{ color: 'var(--text-primary)', marginLeft: '1rem',marginRight: '1rem', textDecoration: 'none' }}>DB Dashboard</Link>  |{' '}
            <Link to="http://135.66.159.106:8081" style={{ color: 'var(--text-primary)', marginLeft: '1rem', textDecoration: 'none' }}>Jobs Monitor</Link>
          </div>

          <div style={{ paddingRight: '5rem' }}>
            <ThemeToggle />
          </div>

        </nav>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tableDashboard" element={<TableDashboard />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
        <ScrollToTopButton />
      </div>
      <Typography variant="body2" color="primary" align="center" sx={{ mt: 4, mb: 2}}>
        🚀 Developed by Shubham Jadhav 🔎
      </Typography>
    </ThemeProvider>
  );
}

export default App;