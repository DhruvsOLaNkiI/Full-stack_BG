import React, { useState, useEffect } from 'react';
import api from '../api';
import { Layers, Edit2, Save } from 'lucide-react';

const AdminFeatured = () => {
    const [config, setConfig] = useState({
        hero: '',
        topRight: '',
        middleList: [],
        bottomRight: ''
    });
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [configRes, postsRes] = await Promise.all([
                api.get('/featured'),
                api.get('/posts')
            ]);

            // Map full objects back to IDs for the form
            const currentConfig = {
                hero: configRes.data.hero?.id || '',
                topRight: configRes.data.topRight?.id || '',
                middleList: configRes.data.middleList?.map(p => p.id) || [],
                bottomRight: configRes.data.bottomRight?.id || ''
            };

            setConfig(currentConfig);
            setPosts(postsRes.data);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await api.put('/featured', config);
            alert('✅ Featured blog section updated successfully!');
        } catch (error) {
            console.error("Failed to update", error);
            alert('❌ Failed to update layout. Please try again.');
        }
    };

    const handleMiddleListChange = (e, index) => {
        const newList = [...config.middleList];
        newList[index] = e.target.value;
        setConfig({ ...config, middleList: newList });
    };

    const addMiddleSlot = () => {
        setConfig({ ...config, middleList: [...config.middleList, ''] });
    };

    const removeMiddleSlot = (index) => {
        const newList = config.middleList.filter((_, i) => i !== index);
        setConfig({ ...config, middleList: newList });
    };

    const PostSelect = ({ value, onChange, label, sectionNumber, description }) => (
        <div className="glass" style={{ marginBottom: '1.5rem', padding: '1.5rem', borderRadius: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '0.5rem',
                    background: 'var(--primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.25rem'
                }}>
                    {sectionNumber}
                </div>
                <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>{label}</h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{description}</p>
                </div>
            </div>
            <select
                className="input"
                value={value}
                onChange={onChange}
                style={{ width: '100%', fontSize: '0.95rem' }}
            >
                <option value="">-- Select a Post --</option>
                {posts.map(post => (
                    <option key={post.id} value={post.id}>
                        {post.title} • {post.category} • {new Date(post.createdAt).toLocaleDateString()}
                    </option>
                ))}
            </select>
        </div>
    );

    if (loading) return (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Loading...</div>
        </div>
    );

    return (
        <div>
            {/* Header */}
            <div className="glass" style={{ padding: '2rem', borderRadius: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <Layers size={32} color="var(--primary)" />
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.75rem' }}>Manage Featured Blog Section</h2>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                            Control which posts appear in the highlighted section on the Home page
                        </p>
                    </div>
                </div>
            </div>

            {/* Section 1 - Hero (Large Card) */}
            <PostSelect
                sectionNumber="1"
                label="Hero Section (Large Card)"
                description="Main featured post - appears large on the left side"
                value={config.hero}
                onChange={(e) => setConfig({ ...config, hero: e.target.value })}
            />

            {/* Section 2 - Top Right */}
            <PostSelect
                sectionNumber="2"
                label="Top Right Card"
                description="Secondary featured post - appears in the top right"
                value={config.topRight}
                onChange={(e) => setConfig({ ...config, topRight: e.target.value })}
            />

            {/* Section 3 - Middle List */}
            <div className="glass" style={{ marginBottom: '1.5rem', padding: '2rem', borderRadius: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '0.5rem',
                        background: 'var(--primary)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '1.25rem'
                    }}>
                        3
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>Middle List Section</h3>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Quick reads list - appears in the middle yellow card</p>
                    </div>
                </div>

                {config.middleList.map((id, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <select
                            className="input"
                            value={id}
                            onChange={(e) => handleMiddleListChange(e, idx)}
                            style={{ flex: 1, fontSize: '0.95rem' }}
                        >
                            <option value="">-- Select a Post --</option>
                            {posts.map(post => (
                                <option key={post.id} value={post.id}>
                                    {post.title} • {post.category}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={() => removeMiddleSlot(idx)}
                            className="btn btn-outline"
                            style={{ color: '#ef4444', borderColor: '#ef4444', minWidth: '44px' }}
                        >
                            ✕
                        </button>
                    </div>
                ))}
                <button
                    onClick={addMiddleSlot}
                    className="btn btn-outline"
                    style={{ width: '100%', marginTop: '0.5rem' }}
                >
                    + Add List Item
                </button>
            </div>

            {/* Section 4 - Bottom Right */}
            <PostSelect
                sectionNumber="4"
                label="Bottom Right Card"
                description="Third featured post - appears in the bottom right"
                value={config.bottomRight}
                onChange={(e) => setConfig({ ...config, bottomRight: e.target.value })}
            />

            {/* Save Button */}
            <div style={{ position: 'sticky', bottom: '1rem', paddingTop: '2rem' }}>
                <button
                    onClick={handleSave}
                    className="btn btn-primary"
                    style={{
                        width: '100%',
                        padding: '1.25rem',
                        fontSize: '1.1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                >
                    <Save size={20} />
                    Save Featured Section Configuration
                </button>
            </div>
        </div>
    );
};

export default AdminFeatured;
