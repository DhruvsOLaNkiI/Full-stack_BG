import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { Helmet } from 'react-helmet-async';
import { Heart, Eye, MessageCircle } from 'lucide-react';

const Post = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        fetchPost();
        fetchComments();
    }, [id]);

    const fetchPost = async () => {
        try {
            const res = await api.get(`/posts/${id}`);
            setPost(res.data);
        } catch (error) {
            console.error("Failed to fetch post", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const res = await api.get(`/posts/${id}/comments`);
            setComments(res.data || []);
        } catch (error) {
            console.error("Failed to fetch comments", error);
        }
    };

    const handleLike = async () => {
        if (!user.id) {
            alert('Please login to like posts');
            return;
        }
        try {
            const res = await api.post(`/posts/${id}/like`);
            setPost(res.data);
        } catch (error) {
            console.error("Failed to like post", error);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!user.id) {
            alert('Please login to comment');
            return;
        }
        try {
            await api.post(`/posts/${id}/comments`, { content: comment });
            setComment('');
            fetchComments();
            fetchPost(); // Refresh to get updated comment count
        } catch (error) {
            console.error("Failed to add comment", error);
        }
    };

    if (loading) return <div className="container">Loading...</div>;
    if (!post) return <div className="container">Post not found</div>;

    const isLiked = post.likes?.includes(user.id);

    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            <Helmet>
                <title>{post.title} | BlogApp</title>
                <meta name="description" content={post.content.substring(0, 150)} />
            </Helmet>

            <article className="glass" style={{ padding: '3rem', borderRadius: '1rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase' }}>{post.category}</span>
                    <h1 style={{ fontSize: '3rem', lineHeight: 1.2, margin: '1rem 0' }}>{post.title}</h1>
                    <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                        <span>By {post.authorName || 'Anonymous'}</span>
                        <span>•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span>•</span>
                        <span><Eye size={16} style={{ verticalAlign: 'middle' }} /> {post.views || 0} Views</span>
                    </div>
                </div>

                {post.imageUrl && (
                    <img
                        src={post.imageUrl}
                        alt={post.title}
                        style={{ width: '100%', borderRadius: '0.5rem', marginBottom: '2rem' }}
                    />
                )}

                <div style={{ fontSize: '1.2rem', lineHeight: 1.8, whiteSpace: 'pre-wrap', marginBottom: '2rem' }}>
                    {post.content}
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
                    <button
                        onClick={handleLike}
                        className="btn btn-outline"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: isLiked ? 'var(--primary)' : 'inherit',
                            borderColor: isLiked ? 'var(--primary)' : 'var(--border)'
                        }}
                    >
                        <Heart size={18} fill={isLiked ? 'var(--primary)' : 'none'} />
                        {post.likes?.length || 0} Likes
                    </button>
                    <div className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'default' }}>
                        <MessageCircle size={18} />
                        {post.commentsCount || 0} Comments
                    </div>
                </div>

                <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                        {post.tags && post.tags.map(tag => (
                            <span key={tag} style={{ background: 'var(--surface)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.9rem' }}>
                                #{tag}
                            </span>
                        ))}
                    </div>

                    <h3 style={{ marginBottom: '1rem' }}>Comments</h3>

                    {user.id && (
                        <form onSubmit={handleComment} style={{ marginBottom: '2rem' }}>
                            <textarea
                                className="input"
                                placeholder="Write a comment..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                style={{ marginBottom: '0.5rem', minHeight: '80px' }}
                                required
                            />
                            <button type="submit" className="btn btn-primary">Post Comment</button>
                        </form>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {comments.map((c, idx) => (
                            <div key={idx} className="glass" style={{ padding: '1rem', borderRadius: '0.5rem' }}>
                                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{c.authorName || 'Anonymous'}</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{c.content}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                    {new Date(c.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </article>
        </div>
    );
};

export default Post;
