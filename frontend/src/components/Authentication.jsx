import React, { useEffect, useState } from 'react';
import './Authentication.css';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import OtpInputWithValidation from './otpverification';

const correctOTP = "123456"; // Example, replace it with server-side validation

const Authcomponent = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [admin, setAdmin] = useState(false);
  const [isOtpPopupVisible, setIsOtpPopupVisible] = useState(false); // Manage OTP popup visibility
  const [fdjghjd,setFdjghjd]=useState({});
  const [admindetails,setAdmindetails]=useState({});
  // Function to trigger OTP popup
  const otpClick = async() => {
    try {
      const response = await axios.get(`/api/checkotp/sendotp`);
      setFdjghjd(response);
      // Access data only after the state has been updated
      if (response && response.data && response.data.data) {
        setIsOtpPopupVisible(true);
      } else {
        // Handle cases where response.data or response.data.data is missing
        console.error("Response data is missing or invalid.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
  }, [fdjghjd]);
  const handleSubmit = async (e, type) => {
    e.preventDefault();

    const formData = {
      email, password, username: name, number
    };

    try {
      const response = await axios.post(`/api/${type}`, formData);
      const expires = new Date();
      expires.setDate(expires.getDate() + 7);
      if (response.status === 285) {
        setAdmindetails(response.data.data);
        setAdmin(true);
      } else if (response.status === 200) {
        Cookies.set('hegsgeerjyhweffyw', "dbsygygdushcjbsduhyawvkiehjv", { expires });
        Cookies.set("username", `${formData.username}`, { expires });
        navigate("/");
      }
    } catch (error) {
      console.error('Error submitting form', error);
    }
  };

  const ifUserLoggedIn = () => {
    if (Cookies.get('hegsgeerjyhweffyw', "dbsygygdushcjbsduhyawvkiehjv")) {
      navigate("/");
    }
  };

  useEffect(() => {
    if (Cookies.get('hegsgeerjyhweffyw')) {
      ifUserLoggedIn();
    }
  });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const renderForm = (type) => (
    <form onSubmit={(e) => { handleSubmit(e, type) }} className="auth-form">
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
              pattern="[0-9]{10}" minLength="10" maxLength="10"
              placeholder="Enter Mobile Number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
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
      {admin === true && (
        <div className="form-group">
          <button type="button" onClick={otpClick}>GET OTP</button>
        </div>
      )}
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

      {/* Render OTP Popup */}
      {isOtpPopupVisible && (
        <OtpInputWithValidation details={admindetails} numberOfDigits={6} onClose={() => setIsOtpPopupVisible(false)} fjkasdf={fdjghjd.data.data} />
      )}
    </div>
  );
};

export default Authcomponent;
