import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PenTool, LogOut, User, Sun, Moon } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Dark mode state
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved ? JSON.parse(saved) : false;
    });

    // Apply dark mode to document
    useEffect(() => {
        if (darkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold' }} className="navbar-logo">
                    KirdarBlogs
                </Link>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <Link to="/" className="nav-link">Home</Link>

                    {token ? (
                        <>
                            <Link to={`/profile/${user.id}`} className="icon-bounce">
                                <User size={20} style={{ verticalAlign: 'middle' }} />
                            </Link>
                            <Link to="/dashboard" className="btn btn-primary">
                                <PenTool size={16} style={{ marginRight: '0.5rem' }} />
                                Write
                            </Link>
                            {user.role === 'admin' && <Link to="/admin" className="nav-link">Admin</Link>}
                            <button onClick={handleLogout} className="btn btn-outline">
                                <LogOut size={16} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="btn btn-primary">Register</Link>
                        </>
                    )}

                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className="theme-toggle"
                        aria-label="Toggle dark mode"
                    >
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
