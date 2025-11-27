import React, { useEffect, useState } from 'react';
import api from '../api';
import { Helmet } from 'react-helmet-async';
import { Trash2 } from 'lucide-react';

import AdminFeatured from '../components/AdminFeatured';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('posts');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();

        // 5 Minute Session Timeout
        const timer = setTimeout(() => {
            alert("Admin session expired (5 mins). Redirecting to Home.");
            window.location.href = '/';
        }, 5 * 60 * 1000);

        return () => clearTimeout(timer);
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await api.get('/posts');
            setPosts(res.data);
        } catch (error) {
            console.error("Failed to fetch posts", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        try {
            await api.delete(`/posts/${id}`);
            setPosts(posts.filter(p => p.id !== id));
        } catch (error) {
            alert('Failed to delete post');
        }
    };

    return (
        <div className="container">
            <Helmet>
                <title>Admin Panel | KirdarBarcelona</title>
            </Helmet>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="text-gradient">Admin Dashboard</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        className={`btn ${activeTab === 'posts' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setActiveTab('posts')}
                    >
                        Manage Posts
                    </button>
                    <button
                        className={`btn ${activeTab === 'featured' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setActiveTab('featured')}
                    >
                        Manage Featured
                    </button>
                </div>
            </div>

            {activeTab === 'posts' ? (
                <div className="glass" style={{ padding: '2rem', borderRadius: '1rem' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Manage Posts</h2>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                                        <th style={{ padding: '1rem' }}>Title</th>
                                        <th style={{ padding: '1rem' }}>Author</th>
                                        <th style={{ padding: '1rem' }}>Category</th>
                                        <th style={{ padding: '1rem' }}>Date</th>
                                        <th style={{ padding: '1rem' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {posts.map(post => (
                                        <tr key={post.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '1rem' }}>{post.title}</td>
                                            <td style={{ padding: '1rem' }}>{post.authorName || 'Unknown'}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{ background: 'var(--surface)', padding: '0.25rem 0.5rem', borderRadius: '0.5rem', fontSize: '0.8rem' }}>
                                                    {post.category}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem' }}>{new Date(post.createdAt).toLocaleDateString()}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <button
                                                    onClick={() => handleDelete(post.id)}
                                                    className="btn btn-outline"
                                                    style={{ color: 'var(--secondary)', borderColor: 'var(--secondary)' }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ) : (
                <AdminFeatured />
            )}
        </div>
    );
};

export default Admin;
