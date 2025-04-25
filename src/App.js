import React from 'react';
import BlogForm from './components/BlogForm';
import BlogList from './components/BlogList';
import useBlogs from './hooks/useBlogs';
import "./BlogList.css"

function App() {
  const { blogs, addBlog, deleteBlog } = useBlogs();

  return (
    <div className="App" style={{ padding: '20px' }}>
      {/* <h1>Blog Generator with AI</h1> */}
      <BlogForm onBlogGenerated={addBlog} />
      <BlogList blogs={blogs} onDelete={deleteBlog} />
    </div>
  );
}

export default App;
