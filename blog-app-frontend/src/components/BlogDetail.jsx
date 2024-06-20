import  { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';

export const BlogDetail = () => {
    const [blog, setBlog] = useState([]);
    const params = useParams();
    
    const fetchBlog = async () =>{
        const res = await fetch("http://localhost:8000/api/blogs/"+ params.id);
        const result = await res.json();
        setBlog(result.data);
        // console.log(params.id);
    }

    useEffect(()=>{
        fetchBlog();
    },[])
  return (
    <div className='container'>
    <div className="d-flex justify-content-between pt-5 mb-4">
      <h2>{blog.title}</h2>
      <div>
         <Link to="/" className='btn btn-dark'>Back</Link>
      </div>
    </div>
    <div className="row">
        <div className="col-md-12">
            <p>by <strong>{blog.author}</strong> on {blog.date}</p>

            {
                (blog.image) &&  <img className='d-block mx-auto w-50 h-80 mb-3' src={`http://localhost:8000/uploads/temp/${blog.image}`}/>
            }
            
            <div>{blog.description}</div>   
            
        </div>
    </div>
   </div>
  )
}
