import { useState, useEffect } from 'react';
import axios from 'axios';

const useBlogs = () => {
    const [blogs, setBlogs] = useState([]);

    const fetchBlogs = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/blogs');
            setBlogs(res.data);
        } catch (error) {
            console.error("Failed to fetch blogs", error);
        }
    };

    const addBlog = (blog) => {
        setBlogs(prev => [blog, ...prev]);
    };

    const deleteBlog = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/blogs/${id}`);
            setBlogs(prev => prev.filter(blog => blog._id !== id));
        } catch (error) {
            alert("Failed to delete blog");
            console.error(error);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    return {
        blogs,
        addBlog,
        deleteBlog
    };
};

export default useBlogs;
