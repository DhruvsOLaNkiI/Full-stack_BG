import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import AdminFeatured from '../components/AdminFeatured';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('write');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [category, setCategory] = useState('Tech');
    const [tags, setTags] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'admin';

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/posts', {
                title,
                content,
                category,
                imageUrl,
                tags: tags.split(',').map(t => t.trim())
            });
            setMessage('Post created successfully!');
            setTitle('');
            setContent('');
            setImageUrl('');
            setTags('');
            // Use the slug from response if available, otherwise just go home
            const newPost = response.data;
            setTimeout(() => navigate(`/post/${newPost.slug || newPost.id}`), 1500);
        } catch (error) {
            setMessage('Failed to create post');
        }
    };

    return (
        <div className="container">
            <Helmet>
                <title>Dashboard | KirdarBarcelona</title>
            </Helmet>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="text-gradient">Dashboard</h1>
                {isAdmin && (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            className={`btn ${activeTab === 'write' ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setActiveTab('write')}
                        >
                            Write Story
                        </button>
                        <button
                            className={`btn ${activeTab === 'featured' ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setActiveTab('featured')}
                        >
                            Manage Featured
                        </button>
                    </div>
                )}
            </div>

            {activeTab === 'write' ? (
                <div className="glass" style={{ padding: '2rem', borderRadius: '1rem' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Write a Story</h2>
                    {message && <div style={{ marginBottom: '1rem', color: message.includes('success') ? 'var(--primary)' : 'var(--secondary)' }}>{message}</div>}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Title</label>
                            <input
                                type="text"
                                className="input"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Category</label>
                            <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="Tech">Tech</option>
                                <option value="Sports">Sports</option>
                                <option value="Lifestyle">Lifestyle</option>
                                <option value="Design">Design</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Featured Image URL (Optional - for thumbnail)</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="https://example.com/image.jpg"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                            />
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                💡 Tip: Use the image button in the editor below to add multiple images within your content!
                            </p>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Tags (comma separated)</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="react, nodejs, tutorial"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Content</label>
                            <div className="quill-wrapper">
                                <ReactQuill
                                    theme="snow"
                                    value={content}
                                    onChange={setContent}
                                    modules={{
                                        toolbar: [
                                            [{ 'header': [1, 2, 3, false] }],
                                            ['bold', 'italic', 'underline'],
                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                            ['blockquote', 'code-block'],
                                            ['link', 'image'],
                                            ['clean']
                                        ]
                                    }}
                                    placeholder="Write your story here..."
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Publish Story</button>
                    </form>
                </div>
            ) : (
                <AdminFeatured />
            )}
        </div>
    );
};

export default Dashboard;
