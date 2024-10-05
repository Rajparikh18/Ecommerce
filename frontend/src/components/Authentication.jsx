import React, { useEffect, useState } from 'react';
import './Authentication.css';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import OtpInputWithValidation from './otpverification';

const Authcomponent = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [logger, setLogger] = useState(false);
  const [isOtpPopupVisible, setIsOtpPopupVisible] = useState(false);
  const [fdjghjd, setFdjghjd] = useState({});
  const [loggerdetails, setLoggerdetails] = useState({});

  const otpClick = async () => {
    try {
      const response = await axios.post(`/api/checkotp/sendotp`, loggerdetails);
      setFdjghjd(response);
      if (response && response.data && response.data.data) {
        setIsOtpPopupVisible(true);
      } else {
        console.error("Response data is missing or invalid.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (Cookies.get("username")) {
      navigate("/");
    }
  }, []);

  const handleSubmit = async (e, type) => {
    e.preventDefault();

    const formData = {
      email, password, username: name, number
    };

    try {
      const response = await axios.post(`/api/${type}`, formData);
      if (response.status === 285) {
        setLoggerdetails(response.data.data);
        setLogger(true);
      }
      else if (response.status === 200) {
          navigate("/", { 
          state: { 
            message: response.data.message, 
            alert: true 
          },
          replace: true
        });
        window.location.reload();
      }
      else if(response.status==402){
        
      }
    } catch (error) {
      console.log('Error submitting form', error);
      console.error('Error submitting form', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const renderForm = (type) => (
    <form onSubmit={(e) => handleSubmit(e, type)} className="auth-form">
      {type === 'register' && (
        <>
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
          <div className="form-group">
            <label htmlFor="number">Mobile Number</label>
            <input
              id="number"
              type="tel"
              placeholder="Enter Mobile Number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              minLength={10}
              maxLength={10}
              pattern="[0-9]*"
              required
              onInvalid={(e) => e.target.setCustomValidity('Please enter a valid phone number')}
              onInput={(e) => e.target.setCustomValidity('')}
            />
          </div>
        </>
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
      {logger === true && (
        <div className="form-group">
          <button type="button" onClick={otpClick}>GET OTP</button>
        </div>
      )}
      <button type="submit" className="submit-btn">
        {type.charAt(0).toUpperCase() + type.slice(1)}
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

      {isOtpPopupVisible && (
        <OtpInputWithValidation 
          details={loggerdetails} 
          numberOfDigits={6} 
          onClose={() => setIsOtpPopupVisible(false)} 
          fjkasdf={fdjghjd.data} 
        />
      )}
    </div>
  );
};

export default Authcomponent;