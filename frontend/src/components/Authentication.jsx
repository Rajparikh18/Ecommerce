import React, { useState } from 'react';
import './Authentication.css';
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Authcomponent = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit =async (e, type) => {
    e.preventDefault();

   const formData={
    email,password,username:name
   }
    try {
      const response = await axios.post(`/api/${type}`, formData);
      const expires = new Date(); 
      expires.setDate(expires.getDate() + 7);
  
      if (response.status === 200) {
        Cookies.set('hegsgeerjyhweffyw', "dbsygygdushcjbsduhyawvkiehjv", {expires});
          navigate("/home")
      }
    } catch (error) {
      console.error('Error submitting form', error);
    }

  };
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const renderForm = (type) => (
    
    <form onSubmit={(e) =>{ console.log(type);handleSubmit(e, type)} }  className="auth-form">
      {type === 'register' && (
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
      )}
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <div className="password-input">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
      </div>
      <button type="submit" className="submit-btn">
        {type}
      </button>
    </form>
  );
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="card-header">
          <h2>Welcome</h2>
          <p>Sign in to your account or create a new one.</p>
        </div>
        <div className="card-content">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button
              className={`tab ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => setActiveTab('register')}
            >
              Sign Up
            </button>
          </div>
          <div className="tab-content">
            {activeTab === 'login' ? renderForm('login') : renderForm('register')}
          </div>
        </div>
        <div className="card-footer">
          <p>
            Protected by reCAPTCHA and subject to the Privacy Policy and Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Authcomponent;