import React, { useState } from 'react';
import "../BlogList.css"

const BlogForm = ({ onBlogGenerated }) => {
    const [keywords, setKeywords] = useState('');
    const [loading, setLoading] = useState(false);
    const [lastBlogId, setLastBlogId] = useState(null); // <-- Store the last blog ID
    const [summaryLoading, setSummaryLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const keywordList = keywords.split(',').map(k => k.trim());

        if (keywordList.length === 0) {
            alert('Please enter at least 1 keyword');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/blogs/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keywords: keywordList })
            });
            const data = await res.json();
            onBlogGenerated(data);
            setKeywords('');
        } catch (err) {
            console.error(err);
            alert('Failed to generate blog');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h1>🧠 Blog Generator with AI</h1>
            <form className="blog-form" onSubmit={handleSubmit}>
                <label htmlFor="keywords">Enter the keywords:</label>
                <input
                    id="keywords"
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="e.g. AI, Education, Career, Visa"
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Generating...' : 'Generate Blog'}
                </button>
            </form>
        </div>
    );
};

export default BlogForm;
