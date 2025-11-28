import React, { useEffect, useState } from 'react';
import api from '../api';
import { Helmet } from 'react-helmet-async';
import { Trash2 } from 'lucide-react';

import AdminFeatured from '../components/AdminFeatured';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('posts');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedPosts, setSelectedPosts] = useState([]);

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

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedPosts(posts.map(p => p.id));
        } else {
            setSelectedPosts([]);
        }
    };

    const handleSelectOne = (id) => {
        if (selectedPosts.includes(id)) {
            setSelectedPosts(selectedPosts.filter(pid => pid !== id));
        } else {
            setSelectedPosts([...selectedPosts, id]);
        }
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${selectedPosts.length} posts?`)) return;
        try {
            await api.delete('/posts/bulk', { data: { ids: selectedPosts } });
            setPosts(posts.filter(p => !selectedPosts.includes(p.id)));
            setSelectedPosts([]);
            alert('Selected posts deleted successfully');
        } catch (error) {
            console.error("Bulk delete failed", error);
            alert('Failed to delete selected posts');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        try {
            await api.delete(`/posts/${id}`);
            setPosts(posts.filter(p => p.id !== id));
            setSelectedPosts(selectedPosts.filter(pid => pid !== id));
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ margin: 0 }}>Manage Posts</h2>
                        {selectedPosts.length > 0 && (
                            <button
                                onClick={handleBulkDelete}
                                className="btn"
                                style={{
                                    background: 'var(--secondary)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.5rem 1rem',
                                    fontSize: '0.9rem'
                                }}
                            >
                                <Trash2 size={16} /> Delete Selected ({selectedPosts.length})
                            </button>
                        )}
                    </div>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                                        <th style={{ padding: '1rem', width: '40px' }}>
                                            <input
                                                type="checkbox"
                                                onChange={handleSelectAll}
                                                checked={posts.length > 0 && selectedPosts.length === posts.length}
                                                style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                                            />
                                        </th>
                                        <th style={{ padding: '1rem' }}>Title</th>
                                        <th style={{ padding: '1rem' }}>Author</th>
                                        <th style={{ padding: '1rem' }}>Category</th>
                                        <th style={{ padding: '1rem' }}>Date</th>
                                        <th style={{ padding: '1rem' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {posts.map(post => (
                                        <tr key={post.id} style={{ borderBottom: '1px solid var(--border)', background: selectedPosts.includes(post.id) ? 'rgba(0,0,0,0.02)' : 'transparent' }}>
                                            <td style={{ padding: '1rem' }}>
                                                <input
                                                    type="checkbox"
                                                    onChange={() => handleSelectOne(post.id)}
                                                    checked={selectedPosts.includes(post.id)}
                                                    style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                                                />
                                            </td>
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
