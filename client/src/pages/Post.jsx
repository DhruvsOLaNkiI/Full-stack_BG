import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import api from '../api';
import { Helmet } from 'react-helmet-async';
import { Heart, Eye, MessageCircle } from 'lucide-react';
import InteractionButtons from '../components/InteractionButtons';

const Post = () => {
    const { id } = useParams();
    const location = useLocation();
    // Initialize with passed state if available for instant load
    const [post, setPost] = useState(location.state?.post || null);
    const [loading, setLoading] = useState(!location.state?.post);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        title: '',
        content: '',
        imageUrl: '',
        category: '',
        tags: ''
    });
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        // Always fetch to get latest data (likes, comments, etc)
        // But if we have post data, we don't show loading spinner
        fetchPost();
        fetchComments();
    }, [id]);

    const fetchPost = async () => {
        try {
            const res = await api.get(`/posts/${id}`);
            setPost(res.data);
            setEditForm({
                title: res.data.title,
                content: res.data.content,
                imageUrl: res.data.imageUrl || '',
                category: res.data.category || 'General',
                tags: res.data.tags ? res.data.tags.join(', ') : ''
            });
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

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const tagsArray = editForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            const updatedData = {
                ...editForm,
                tags: tagsArray
            };
            const res = await api.put(`/posts/${id}`, updatedData);
            setPost({ ...post, ...updatedData }); // Optimistic update or use res.data
            setIsEditing(false);
            alert('Post updated successfully!');
        } catch (error) {
            console.error("Failed to update post", error);
            alert('Failed to update post');
        }
    };

    if (loading) return <div className="container">Loading...</div>;
    if (!post) return <div className="container">Post not found</div>;

    const isLiked = post.likes?.includes(user.id);
    const isAuthor = user.id === post.authorId;

    return (
        <div className="container" style={{ maxWidth: '800px', padding: '1rem' }}>
            <Helmet>
                <title>{post.title} | KirdarBarcelona</title>
                <meta name="description" content={post.content.substring(0, 150)} />
                <meta property="og:title" content={`${post.title} | KirdarBarcelona`} />
                <meta property="og:description" content={post.content.substring(0, 150)} />
                <meta property="og:type" content="article" />
                {post.imageUrl && <meta property="og:image" content={post.imageUrl} />}
            </Helmet>

            {isEditing ? (
                <div className="glass" style={{ padding: '2rem', borderRadius: '1rem' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Edit Post</h2>
                    <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Title</label>
                            <input
                                type="text"
                                className="input"
                                value={editForm.title}
                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Image URL</label>
                            <input
                                type="text"
                                className="input"
                                value={editForm.imageUrl}
                                onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Category</label>
                            <select
                                className="input"
                                value={editForm.category}
                                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                            >
                                <option value="General">General</option>
                                <option value="Tech">Tech</option>
                                <option value="Sports">Sports</option>
                                <option value="Lifestyle">Lifestyle</option>
                                <option value="Design">Design</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Tags (comma separated)</label>
                            <input
                                type="text"
                                className="input"
                                value={editForm.tags}
                                onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Content</label>
                            <textarea
                                className="input"
                                value={editForm.content}
                                onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                                style={{ minHeight: '200px' }}
                                required
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="submit" className="btn btn-primary">Save Changes</button>
                            <button type="button" onClick={() => setIsEditing(false)} className="btn btn-outline">Cancel</button>
                        </div>
                    </form>
                </div>
            ) : (
                <article className="glass" style={{ padding: 'clamp(1.5rem, 5vw, 3rem)', borderRadius: '1rem' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <span style={{ color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase' }}>{post.category}</span>
                            {isAuthor && (
                                <button onClick={() => setIsEditing(true)} className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}>
                                    Edit Post
                                </button>
                            )}
                        </div>
                        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.2, margin: '1rem 0' }}>{post.title}</h1>
                        <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                            <span>By <Link to={`/profile/${post.authorId}`} style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={(e) => e.target.style.color = 'var(--primary)'} onMouseOut={(e) => e.target.style.color = 'inherit'}>{post.authorName || 'Anonymous'}</Link></span>
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

                    <div
                        style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', lineHeight: 1.8, marginBottom: '2rem' }}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
                        <InteractionButtons
                            likes={post.likes?.length || 0}
                            comments={post.commentsCount || 0}
                            isLiked={isLiked}
                            onLike={handleLike}
                            onComment={() => document.querySelector('textarea')?.focus()}
                        />
                    </div>

                    <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
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
            )}
        </div>
    );
};

export default Post;
