import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { Helmet } from 'react-helmet-async';
import { Heart, MessageCircle, Eye, PenTool, Edit2 } from 'lucide-react';

const Profile = () => {
    const { id } = useParams();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalPosts: 0, totalViews: 0, totalLikes: 0 });
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState('');
    const [userName, setUserName] = useState('');
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const isOwnProfile = currentUser.id === id;

    useEffect(() => {
        fetchUserPosts();
        fetchUserProfile();
    }, [id]);

    const fetchUserProfile = async () => {
        try {
            const res = await api.get(`/users/${id}`);
            setUserName(res.data.name || 'Anonymous');
            setNewName(res.data.name || '');
        } catch (error) {
            console.error("Failed to fetch user profile", error);
        }
    };

    const fetchUserPosts = async () => {
        try {
            const res = await api.get('/posts');
            const userPosts = res.data.filter(post => post.authorId === id);
            setPosts(userPosts);

            // Calculate stats
            const totalViews = userPosts.reduce((sum, post) => sum + (post.views || 0), 0);
            const totalLikes = userPosts.reduce((sum, post) => sum + (post.likes?.length || 0), 0);
            setStats({
                totalPosts: userPosts.length,
                totalViews,
                totalLikes
            });
        } catch (error) {
            console.error("Failed to fetch user posts", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateName = async () => {
        try {
            await api.put(`/users/${id}`, { name: newName });
            setUserName(newName);
            setIsEditing(false);
            // Update localStorage
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            user.name = newName;
            localStorage.setItem('user', JSON.stringify(user));
            alert('Name updated successfully!');
        } catch (error) {
            console.error("Failed to update name", error);
            alert('Failed to update name');
        }
    };

    const getInitials = (name) => {
        return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '??';
    };

    return (
        <div className="container" style={{ maxWidth: '1000px' }}>
            <Helmet>
                <title>{userName} | KirdarBlogs</title>
            </Helmet>

            {/* Profile Header Card */}
            <div className="glass" style={{ position: 'relative', borderRadius: '1.5rem', overflow: 'hidden', marginBottom: '3rem' }}>
                {/* Cover Background */}
                <div style={{ height: '150px', background: 'linear-gradient(to right, var(--primary), var(--secondary))', opacity: 0.8 }}></div>

                <div style={{ padding: '0 2rem 2rem', marginTop: '-50px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Avatar */}
                    <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: 'var(--surface)',
                        border: '4px solid var(--surface)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        color: 'var(--primary)',
                        marginBottom: '1rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}>
                        {getInitials(userName)}
                    </div>

                    {/* Name & Edit Section */}
                    <div style={{ textAlign: 'center', marginBottom: '2rem', width: '100%', maxWidth: '500px' }}>
                        {isEditing ? (
                            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Display Name</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        type="text"
                                        className="input"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        style={{ flex: 1 }}
                                        autoFocus
                                    />
                                    <button onClick={handleUpdateName} className="btn btn-primary">Save</button>
                                    <button onClick={() => setIsEditing(false)} className="btn btn-outline">Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem', fontWeight: '800' }}>{userName || 'Loading...'}</h1>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Writer & Contributor</p>

                                {isOwnProfile && (
                                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                        <button onClick={() => setIsEditing(true)} className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}>
                                            <Edit2 size={14} style={{ marginRight: '0.5rem' }} /> Edit Profile
                                        </button>
                                        <Link to="/dashboard" className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}>
                                            <PenTool size={14} style={{ marginRight: '0.5rem' }} /> Write Post
                                        </Link>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Stats Row */}
                    <div style={{
                        display: 'flex',
                        gap: '2rem',
                        padding: '1.5rem 3rem',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '1rem',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        border: '1px solid var(--border)'
                    }}>
                        <div style={{ textAlign: 'center', minWidth: '80px' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text)' }}>{stats.totalPosts}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.25rem' }}>Posts</div>
                        </div>
                        <div style={{ width: '1px', background: 'var(--border)' }}></div>
                        <div style={{ textAlign: 'center', minWidth: '80px' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text)' }}>{stats.totalViews}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.25rem' }}>Views</div>
                        </div>
                        <div style={{ width: '1px', background: 'var(--border)' }}></div>
                        <div style={{ textAlign: 'center', minWidth: '80px' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text)' }}>{stats.totalLikes}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.25rem' }}>Likes</div>
                        </div>
                    </div>
                </div>
            </div>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid var(--primary)', paddingLeft: '1rem' }}>
                {isOwnProfile ? 'My Articles' : `Articles by ${userName}`}
            </h2>

            {loading ? (
                <p style={{ textAlign: 'center', padding: '2rem' }}>Loading posts...</p>
            ) : posts.length === 0 ? (
                <div className="glass" style={{ padding: '4rem', borderRadius: '1rem', textAlign: 'center' }}>
                    <div style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
                        <PenTool size={48} style={{ opacity: 0.5 }} />
                    </div>
                    <h3 style={{ marginBottom: '0.5rem' }}>No posts yet</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                        {isOwnProfile ? "You haven't published any stories yet." : "This user hasn't published any stories yet."}
                    </p>
                    {isOwnProfile && (
                        <Link to="/dashboard" className="btn btn-primary">Write Your First Post</Link>
                    )}
                </div>
            ) : (
                <div className="post-grid">
                    {posts.map(post => (
                        <div key={post.id} className="glass" style={{ borderRadius: '1rem', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s' }}>
                            {post.imageUrl && (
                                <img
                                    src={post.imageUrl}
                                    alt={post.title}
                                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                />
                            )}
                            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                    {post.category}
                                </span>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                                    <Link to={`/post/${post.slug || post.id}`} style={{ textDecoration: 'none' }}>{post.title}</Link>
                                </h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', flex: 1, fontSize: '0.9rem', lineHeight: 1.6 }}>
                                    {post.content.substring(0, 100)}...
                                </p>

                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Heart size={14} />
                                        <span>{post.likes?.length || 0}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <MessageCircle size={14} />
                                        <span>{post.commentsCount || 0}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Eye size={14} />
                                        <span>{post.views || 0}</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                    <Link to={`/post/${post.slug || post.id}`} className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>Read</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Profile;
