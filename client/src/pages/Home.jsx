import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import api from '../api';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Eye } from 'lucide-react';
import InteractionButtons from '../components/InteractionButtons';

import BentoGrid from '../components/BentoGrid';

const Home = () => {
    const containerRef = useRef(null);
    const [posts, setPosts] = useState([]);
    const [featuredData, setFeaturedData] = useState(null);
    const [featuredLoading, setFeaturedLoading] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('feed'); // feed, mostLiked, custom
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    // Helper function to strip HTML tags from content
    const stripHtml = (html) => {
        return html.replace(/<[^>]*>?/gm, '') || '';
    };

    useScrollAnimation(containerRef, [posts]);

    // Fetch featured only once on mount
    useEffect(() => {
        fetchFeatured();
    }, []);

    // Fetch posts when tab changes
    useEffect(() => {
        fetchPosts();
    }, [activeTab]);

    const fetchFeatured = useCallback(async () => {
        try {
            setFeaturedLoading(true);
            const res = await api.get('/featured');
            setFeaturedData(res.data);
        } catch (error) {
            console.error("Failed to fetch featured posts", error);
        } finally {
            setFeaturedLoading(false);
        }
    }, []);

    const fetchPosts = useCallback(async () => {
        try {
            setError(null);
            setLoading(true);
            let query = '';

            if (activeTab === 'mostLiked') {
                query = '?sortBy=likes';
            } else if (activeTab === 'custom') {
                if (dateRange.start || dateRange.end) {
                    const params = new URLSearchParams();
                    if (dateRange.start) params.append('startDate', new Date(dateRange.start).toISOString());
                    if (dateRange.end) params.append('endDate', new Date(dateRange.end).toISOString());
                    query = `?${params.toString()}`;
                }
            }

            const res = await api.get(`/posts${query}`);
            setPosts(res.data);
        } catch (error) {
            console.error("Failed to fetch posts", error);
            setError("Failed to load posts. Please check if the server is running and configured correctly.");
        } finally {
            setLoading(false);
        }
    }, [activeTab, dateRange.start, dateRange.end]);

    const handleDateApply = () => {
        if (activeTab === 'custom') {
            fetchPosts();
        }
    };

    return (
        <div>
            <Helmet>
                <title>Home | KirdarBlogs</title>
                <meta name="description" content="Latest blogs and stories from our community." />
                <meta property="og:title" content="KirdarBlogs - Share Your Stories" />
                <meta property="og:description" content="Latest blogs and stories from our community." />
                <meta property="og:type" content="website" />
            </Helmet>



            {/* Featured Section */}
            <BentoGrid data={featuredData} loading={featuredLoading} />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                {/* Main Filter Tabs */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button
                        onClick={() => { setActiveTab('feed'); setDateRange({ start: '', end: '' }); }}
                        className={`btn ${activeTab === 'feed' ? 'btn-primary' : 'btn-outline'}`}
                    >
                        Feed
                    </button>
                    <button
                        onClick={() => { setActiveTab('mostLiked'); setDateRange({ start: '', end: '' }); }}
                        className={`btn ${activeTab === 'mostLiked' ? 'btn-primary' : 'btn-outline'}`}
                    >
                        Most Liked
                    </button>
                    <button
                        onClick={() => setActiveTab('custom')}
                        className={`btn ${activeTab === 'custom' ? 'btn-primary' : 'btn-outline'}`}
                    >
                        Custom Filter
                    </button>
                </div>

                {/* Custom Date Inputs */}
                {activeTab === 'custom' && (
                    <div className="glass" style={{ padding: '1rem', borderRadius: '0.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Start Date</label>
                            <input
                                type="date"
                                value={dateRange.start}
                                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                className="input"
                                style={{ padding: '0.5rem' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>End Date</label>
                            <input
                                type="date"
                                value={dateRange.end}
                                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                className="input"
                                style={{ padding: '0.5rem' }}
                            />
                        </div>
                        <button onClick={handleDateApply} className="btn btn-primary" style={{ alignSelf: 'flex-end' }}>
                            Apply
                        </button>
                    </div>
                )}
            </div>

            {loading ? (
                <p style={{ textAlign: 'center' }}>Loading...</p>
            ) : error ? (
                <div style={{ textAlign: 'center', color: 'red', padding: '2rem', background: 'rgba(255,0,0,0.1)', borderRadius: '8px' }}>
                    <p>{error}</p>
                </div>
            ) : (
                <div ref={containerRef} className="post-grid">
                    {posts.length === 0 ? (
                        <p style={{ textAlign: 'center', gridColumn: '1/-1' }}>No posts found.</p>
                    ) : (
                        posts.map(post => (
                            <div key={post.id} className="glass scroll-animate" style={{ borderRadius: '1rem', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                {post.imageUrl && (
                                    <img
                                        src={post.imageUrl}
                                        alt={post.title}
                                        loading="lazy"
                                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                    />
                                )}
                                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--primary)', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                        {post.category}
                                    </span>
                                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
                                        <Link to={`/post/${post.slug || post.id}`} state={{ post }}>{post.title}</Link>
                                    </h2>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                                        by <Link to={`/profile/${post.authorId}`} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '500' }} onMouseOver={(e) => e.target.style.color = 'var(--primary)'} onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}>{post.authorName || 'Anonymous'}</Link>
                                    </p>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', flex: 1 }}>
                                        {stripHtml(post.content).substring(0, 150)}...
                                    </p>

                                    <div style={{ marginBottom: '1rem' }}>
                                        <InteractionButtons
                                            likes={post.likes?.length || 0}
                                            comments={post.commentsCount || 0}
                                            size="small"
                                            onLike={(e) => {
                                                e.preventDefault();
                                                // Navigate to post or handle like if implemented
                                            }}
                                            onComment={(e) => {
                                                e.preventDefault();
                                            }}
                                        />
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            {new Date(post.createdAt).toLocaleDateString()} • {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <Link to={`/post/${post.slug || post.id}`} state={{ post }} className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.9rem' }}>Read More</Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Home;
