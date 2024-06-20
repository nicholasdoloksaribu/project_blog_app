// import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Route, Routes,} from 'react-router-dom';
import Blogs from './components/Blogs';
import CreateBlog from './components/CreateBlog';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BlogDetail } from './components/BlogDetail';
import  EditBlog  from './components/EditBlog';
import Register from './components/Register';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import { useAuth } from './components/AuthContext';
import Cookies from 'js-cookie';

function App() {

  const isAuthenticated = useAuth();
  const checkAuth = () => {
    const token = Cookies.get('token') || localStorage.getItem('token');
    return token ? true : false;
  };

  const isUserAuthenticated = isAuthenticated && checkAuth();
  
  return (
    <>
     {/* <div className='bg-dark text-center py-2 shadow-lg'> */}
       
        <Navbar/>
     {/* </div>  */}
     
      <Routes>
        <Route path='/' element= {isUserAuthenticated ? <Blogs/> :<Login/> } /> 
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/create' element={isUserAuthenticated ?<CreateBlog/> : <ProtectedRoute><CreateBlog/></ProtectedRoute>}/>
        <Route path='/blog/:id' element={isUserAuthenticated ? <BlogDetail/> : <ProtectedRoute><BlogDetail/></ProtectedRoute>}/>
        <Route path='/blog/edit/:id' element={isUserAuthenticated ? <EditBlog/>:<ProtectedRoute><EditBlog/></ProtectedRoute>}/>
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App
