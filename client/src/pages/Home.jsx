import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Heart, MessageCircle, Eye } from 'lucide-react';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetchPosts();
    }, [filter]);

    const fetchPosts = async () => {
        try {
            const query = filter ? `?category=${filter}` : '';
            const res = await api.get(`/posts${query}`);
            setPosts(res.data);
        } catch (error) {
            console.error("Failed to fetch posts", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Helmet>
                <title>Home | BlogApp</title>
                <meta name="description" content="Latest blogs and stories from our community." />
            </Helmet>

            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h1 className="text-gradient">Explore Ideas</h1>
                <p style={{ color: 'var(--text-muted)' }}>Discover stories, thinking, and expertise from writers on any topic.</p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
                <button onClick={() => setFilter('')} className={`btn ${filter === '' ? 'btn-primary' : 'btn-outline'}`}>All</button>
                <button onClick={() => setFilter('Tech')} className={`btn ${filter === 'Tech' ? 'btn-primary' : 'btn-outline'}`}>Tech</button>
                <button onClick={() => setFilter('Lifestyle')} className={`btn ${filter === 'Lifestyle' ? 'btn-primary' : 'btn-outline'}`}>Lifestyle</button>
                <button onClick={() => setFilter('Design')} className={`btn ${filter === 'Design' ? 'btn-primary' : 'btn-outline'}`}>Design</button>
            </div>

            {loading ? (
                <p style={{ textAlign: 'center' }}>Loading...</p>
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
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
                                    <Link to={`/post/${post.id}`}>{post.title}</Link>
                                </h2>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                                    by {post.authorName || 'Anonymous'}
                                </p>
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
                                        {new Date(post.createdAt).toLocaleDateString()} • {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <Link to={`/post/${post.id}`} className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.9rem' }}>Read More</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
