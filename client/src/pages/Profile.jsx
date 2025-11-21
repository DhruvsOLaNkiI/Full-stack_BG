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

    return (
        <div className="container">
            <Helmet>
                <title>{userName} | BlogApp</title>
            </Helmet>

            <div className="glass" style={{ padding: '2rem', borderRadius: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <h1 className="text-gradient" style={{ margin: 0 }}>
                            {userName || 'Loading...'}
                        </h1>
                        {isOwnProfile && !isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="btn btn-outline"
                                style={{ padding: '0.5rem' }}
                            >
                                <Edit2 size={16} />
                            </button>
                        )}
                    </div>
                    {isOwnProfile && (
                        <Link to="/dashboard" className="btn btn-primary">
                            <PenTool size={16} style={{ marginRight: '0.5rem' }} />
                            Write New Post
                        </Link>
                    )}
                </div>

                {isEditing && (
                    <div style={{ marginBottom: '2rem', padding: '1rem', background: 'var(--surface)', borderRadius: '0.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Display Name</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="text"
                                className="input"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                style={{ flex: 1 }}
                            />
                            <button onClick={handleUpdateName} className="btn btn-primary">Save</button>
                            <button onClick={() => setIsEditing(false)} className="btn btn-outline">Cancel</button>
                        </div>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{stats.totalPosts}</div>
                        <div style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Posts</div>
                    </div>
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{stats.totalViews}</div>
                        <div style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Total Views</div>
                    </div>
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{stats.totalLikes}</div>
                        <div style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Total Likes</div>
                    </div>
                </div>
            </div>

            <h2 style={{ marginBottom: '1.5rem' }}>
                {isOwnProfile ? 'My Posts' : `Posts by ${userName}`}
            </h2>

            {loading ? (
                <p style={{ textAlign: 'center' }}>Loading...</p>
            ) : posts.length === 0 ? (
                <div className="glass" style={{ padding: '3rem', borderRadius: '1rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No posts yet</p>
                    {isOwnProfile && (
                        <Link to="/dashboard" className="btn btn-primary">Write Your First Post</Link>
                    )}
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                    {posts.map(post => (
                        <div key={post.id} className="glass" style={{ borderRadius: '1rem', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            {post.imageUrl && (
                                <img
                                    src={post.imageUrl}
                                    alt={post.title}
                                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                />
                            )}
                            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--primary)', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                    {post.category}
                                </span>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                                    <Link to={`/post/${post.id}`}>{post.title}</Link>
                                </h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', flex: 1 }}>
                                    {post.content.substring(0, 100)}...
                                </p>

                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Heart size={16} />
                                        <span>{post.likes?.length || 0}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <MessageCircle size={16} />
                                        <span>{post.commentsCount || 0}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Eye size={16} />
                                        <span>{post.views || 0}</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                    <Link to={`/post/${post.id}`} className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.9rem' }}>View</Link>
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
