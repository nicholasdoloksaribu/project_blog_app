import React, { useEffect, useState } from 'react';
import BlogCard from './BlogCard';
import { useAuth } from './AuthContext';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import Cookies

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [keyword, setKeyword] = useState('');
  const { isAuthenticated } = useAuth();

  const fetchBlogs = async () => {
    if (!isAuthenticated) return;

    const token = Cookies.get('token') || localStorage.getItem('token'); // Get token from cookies or localStorage
    
    const res = await fetch('http://localhost:8000/api/blogs', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await res.json();
    setBlogs(result.data);
  };

  const searchBlogs = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) return;

    const token = Cookies.get('token') || localStorage.getItem('token'); // Get token from cookies or localStorage

    const res = await fetch('http://localhost:8000/api/blogs?keyword=' + keyword, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await res.json();
    setBlogs(result.data);
  };

  const resetSearch = () => {
    fetchBlogs();
    setKeyword('');
  };


  useEffect(() => {
    fetchBlogs();
  }, [isAuthenticated]);

  return (
    <div className='container'>
      <div className="d-flex justify-content-center pt-5">
        <form onSubmit={(e) => searchBlogs(e)}>
          <div className='d-flex'>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className='form-control'
              placeholder='Search Blogs'
            />
            <button className='btn btn-dark ms-2'>Search</button>
            <button
              type='button'
              onClick={() => resetSearch()}
              className='btn btn-success ms-2'
            >
              Reset
            </button>
          </div>
        </form>
      </div>
      <div className="d-flex justify-content-between pt-5 mb-4">
        <h4>Blogs</h4>
        <Link to="/create" className='btn btn-dark'>Create</Link>
      </div>
      <div className="row">
        {blogs && blogs.map((blog) => (
          <BlogCard blogs={blogs} setBlogs={setBlogs} blog={blog} key={blog.id} />
        ))}
      </div>
    </div>
  );
};

export default Blogs;
