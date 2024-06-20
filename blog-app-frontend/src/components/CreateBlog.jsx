import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const CreateBlog = () => {
    const [html, setHtml] = useState('');
    const [imageId, setImageId] = useState('');
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    function onChange(e) {
        setHtml(e.target.value);
    }

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await fetch("http://localhost:8000/api/save-temp-image/", {
                method: 'POST',
                body: formData,
                headers:{
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.errors.image || 'Failed to upload image');
            } else {
                setImageId(result.image.id);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image. Please try again.');
            e.target.value = null;
        }
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const formSubmit = async (data) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const newData = { ...data, image_id: imageId };

        try {
            const res = await fetch("http://localhost:8000/api/blogs", {
                method: "POST",
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(newData)
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || 'Failed to create blog');
            }

            toast.success("Blog added successfully.");
            navigate('/');
        } catch (error) {
            console.error('Error creating blog:', error);
            toast.error('Failed to create blog. Please try again.');
        }
    };

    return (
        <div className='container mb-5'>
            <div className="d-flex justify-content-between pt-5 mb-4">
                <h4>Create Blog</h4>
                <Link to="/" className='btn btn-dark'>Back</Link>
            </div>
            <div className='card border-0 shadow-lg'>
                <form onSubmit={handleSubmit(formSubmit)}>
                    <div className='card-body'>
                        <div className="mb-3">
                            <label className='form-label'>Title</label>
                            <input 
                                { ...register('title', { required: true }) } 
                                type="text" 
                                className={`form-control ${errors.title && 'is-invalid'}`} 
                                placeholder='Title' 
                            />
                            {errors.title && <p className='invalid-feedback'>Title field is required</p>}
                        </div>
                        <div className="mb-3">
                            <label className='form-label'>Short Description</label>
                            <textarea 
                                { ...register('shortDesc') } 
                                cols="20" rows="2" 
                                className='form-control'
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <label className='form-label'>Description</label>
                            <textarea 
                                { ...register('description') } 
                                cols="50" rows="8 " 
                                className='form-control'
                            ></textarea>
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>Image</label><br/>
                            <input onChange={handleFileChange} type="file" />
                        </div>
                        <div className="mb-3">
                            <label className='form-label'>Author</label>
                            <input 
                                { ...register('author', { required: true }) } 
                                type="text" 
                                className={`form-control ${errors.author && 'is-invalid'}`} 
                                placeholder='Author' 
                            />
                            {errors.author && <p className='invalid-feedback'>Author field is required</p>}
                        </div>
                        <button className='btn btn-dark'>Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBlog;
