import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const Dashboard = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [category, setCategory] = useState('Tech');
    const [tags, setTags] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/posts', {
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
            setTimeout(() => navigate('/'), 1500);
        } catch (error) {
            setMessage('Failed to create post');
        }
    };

    return (
        <div className="container">
            <Helmet>
                <title>Dashboard | BlogApp</title>
            </Helmet>
            <h1 className="text-gradient" style={{ marginBottom: '2rem' }}>Write a Story</h1>

            <div className="glass" style={{ padding: '2rem', borderRadius: '1rem' }}>
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
                            <option value="Lifestyle">Lifestyle</option>
                            <option value="Design">Design</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Image URL (Optional)</label>
                        <input
                            type="text"
                            className="input"
                            placeholder="https://example.com/image.jpg"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                        />
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
                        <textarea
                            className="input"
                            style={{ minHeight: '300px', fontFamily: 'inherit' }}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Publish Story</button>
                </form>
            </div>
        </div>
    );
};

export default Dashboard;
