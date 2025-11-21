import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Post from './pages/Post';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import { HelmetProvider } from 'react-helmet-async';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="layout">
          <Navbar />
          <main className="main-content container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/post/:id" element={<Post />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute adminOnly={true}>
                  <Admin />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <footer className="container" style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>&copy; 2025 BlogApp. All rights reserved.</p>
          </footer>
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
