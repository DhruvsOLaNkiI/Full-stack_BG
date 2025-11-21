import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PenTool, LogOut, User } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold' }} className="text-gradient">
                    BlogApp
                </Link>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <Link to="/">Home</Link>

                    {token ? (
                        <>
                            <Link to={`/profile/${user.id}`}>
                                <User size={16} style={{ verticalAlign: 'middle' }} />
                            </Link>
                            <Link to="/dashboard" className="btn btn-primary">
                                <PenTool size={16} style={{ marginRight: '0.5rem' }} />
                                Write
                            </Link>
                            {user.role === 'admin' && <Link to="/admin">Admin</Link>}
                            <button onClick={handleLogout} className="btn btn-outline">
                                <LogOut size={16} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register" className="btn btn-primary">Get Started</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
