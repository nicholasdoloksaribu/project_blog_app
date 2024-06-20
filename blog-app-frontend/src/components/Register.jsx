// src/components/Register.js
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    if (data.password !== data.password_confirmation) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            {...register('name', { required: 'Name is required' })}
            type="text"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
          />
          {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            {...register('email', { required: 'Email is required' })}
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          />
          {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            {...register('password', { required: 'Password is required' })}
            type="password"
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
          />
          {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Confirm Password</label>
          <input
            {...register('password_confirmation', {
              required: 'Please confirm your password',
              validate: (value) =>
                value === password || 'Passwords do not match',
            })}
            type="password"
            className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`}
          />
          {errors.password_confirmation && <div className="invalid-feedback">{errors.password_confirmation.message}</div>}
        </div>
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
};

export default Register;
