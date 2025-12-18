import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PenTool, LogOut, User, Sun, Moon, MoreVertical, X } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        setIsSidebarOpen(false);
        navigate('/login');
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 1100 }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
                    <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold' }} className="navbar-logo">
                        KirdarBarcelona
                    </Link>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        {/* Always Visible: Person Icon (if logged in) & Dark Mode */}
                        {token && (
                            <Link to={`/profile/${user.id}`} className="icon-bounce" style={{ display: 'flex', alignItems: 'center' }}>
                                <User size={24} />
                            </Link>
                        )}

                        <button
                            onClick={toggleDarkMode}
                            className="theme-toggle"
                            aria-label="Toggle dark mode"
                            style={{ display: 'flex', alignItems: 'center' }}
                        >
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* Desktop Menu (Hidden on Mobile) */}
                        <div className="desktop-menu" style={{ display: 'none' }}>
                            <style>{`
                                @media (min-width: 768px) {
                                    .desktop-menu { display: flex !important; gap: 1.5rem; alignItems: center; }
                                    .mobile-menu-btn { display: none !important; }
                                }
                            `}</style>
                            <Link to="/" className="nav-link">Home</Link>

                            {token ? (
                                <>
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
                        </div>

                        {/* Mobile Menu Button (3 Dots) */}
                        <button
                            className="mobile-menu-btn btn btn-ghost"
                            onClick={toggleSidebar}
                            style={{ display: 'flex', alignItems: 'center', padding: '0.5rem' }}
                        >
                            <MoreVertical size={24} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0,0,0,0.5)',
                        zIndex: 1200,
                        backdropFilter: 'blur(4px)'
                    }}
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    width: '280px',
                    height: '100%',
                    background: 'var(--card-bg)',
                    zIndex: 1210,
                    transition: 'transform 0.3s ease, visibility 0.3s ease',
                    transform: isSidebarOpen ? 'translateX(0)' : 'translateX(100%)',
                    visibility: isSidebarOpen ? 'visible' : 'hidden',
                    boxShadow: '-5px 0 15px rgba(0,0,0,0.1)',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Menu</h2>
                    <button onClick={() => setIsSidebarOpen(false)} className="btn btn-ghost">
                        <X size={24} />
                    </button>
                </div>

                <Link to="/" className="nav-link" onClick={() => setIsSidebarOpen(false)}>Home</Link>

                {token ? (
                    <>
                        <Link to="/dashboard" className="btn btn-primary" onClick={() => setIsSidebarOpen(false)} style={{ justifyContent: 'center' }}>
                            <PenTool size={16} style={{ marginRight: '0.5rem' }} />
                            Write Story
                        </Link>

                        {user.role === 'admin' && (
                            <Link to="/admin" className="nav-link" onClick={() => setIsSidebarOpen(false)}>Admin Dashboard</Link>
                        )}

                        <div style={{ borderTop: '1px solid var(--border)', margin: '1rem 0' }}></div>

                        <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                            <LogOut size={16} style={{ marginRight: '0.5rem' }} />
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link" onClick={() => setIsSidebarOpen(false)}>Login</Link>
                        <Link to="/register" className="btn btn-primary" onClick={() => setIsSidebarOpen(false)} style={{ justifyContent: 'center' }}>Register</Link>
                    </>
                )}
            </div>
        </>
    );
};

export default Navbar;
