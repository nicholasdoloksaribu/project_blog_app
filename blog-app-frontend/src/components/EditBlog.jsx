import  { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { Link, useNavigate, useParams } from 'react-router-dom';

 const EditBlog = () => {
    const [blog, setBlog] = useState([]);
    const params = useParams();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const [imageId, setImageId] = useState('');
    const navigate = useNavigate();

    

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await fetch("http://localhost:8000/api/save-temp-image/", {
                method: 'POST',
                body: formData
            });

            const result = await res.json();

            if (result.status === false) {
                alert(result.errors.image);
                e.target.value = null;
            } else {
                setImageId(result.image.id);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image. Please try again.');
            e.target.value = null;
        }
    };

    

    const fetchBlog = async () =>{
        const res = await fetch("http://localhost:8000/api/blogs/"+ params.id);
        const result = await res.json();
        setBlog(result.data);
        reset(result.data);
         
    }

    const formSubmit = async (data) => {
        const newData = { ...data, image_id: imageId };

        try {
            const res = await fetch("http://localhost:8000/api/blogs/"+params.id, {
                method: "PUT",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(newData)
            });

            if (!res.ok) {
                const result = await res.json();
                throw new Error(result.message || 'gagal mengubah blog');
            }

            toast.success("Blog berhasil diubah.");
            navigate('/');
        } catch (error) {
            console.error('Error creating blog:', error);
            toast.error('gagal mengubah blog. tolong coba lagi.');
        }
    };

    useEffect(()=>{
        fetchBlog();
    },[])
    
  return (
    <div className='container mb-5'>
    <div className="d-flex justify-content-between pt-5 mb-4">
        <h4>Edit Blog</h4>
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
                    <div className='mt-3'>
                    {
                     (blog.image) &&  <img className='w-50 h-80' src={`http://localhost:8000/uploads/temp/${blog.image}`}/>
                    }
                    </div>
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
                <button className='btn btn-dark'>Update</button>
            </div>
        </form>
    </div>
</div>
  )
}
export default EditBlog;