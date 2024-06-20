import { useForm } from 'react-hook-form';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:8000/api/login', data);

      if (response.status !== 200) {
        throw new Error(response.data.message || 'Login gagal');
      }

      const result = response.data;
      console.log(result.token);
      await login(result.token);  // Pastikan fungsi login dari context dipanggil dengan benar
      toast.success('Login berhasil!');
      navigate('/');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login gagal';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            {...register('email', { required: 'Email wajib diisi' })}
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          />
          {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Kata Sandi</label>
          <input
            {...register('password', { required: 'Kata sandi wajib diisi' })}
            type="password"
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
          />
          {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
       
      </form>
    </div>
  );
};

export default Login;
