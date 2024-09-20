import React, { useRef, useEffect, useState } from 'react';
import './otpverification.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
export default function OtpInputWithValidation({details, numberOfDigits, onClose ,fjkasdf }) {
  const navigate = useNavigate();
    const [otp, setOtp] = useState(new Array(numberOfDigits).fill(""));
    const [otpError, setOtpError] = useState(null);
    const otpBoxReference = useRef([]);
    const [otpSuccess,setOtpSuccess]=useState(null);
    const [method,setMethod]=useState('');
    function handleChange(value, index) {
      let newArr = [...otp];
      newArr[index] = value;
      setOtp(newArr);
  
      if (value && index < numberOfDigits - 1) {
        otpBoxReference.current[index + 1].focus();
      }
    }
    console.log(fjkasdf);
    function handleBackspaceAndEnter(e, index) {
      if (e.key === "Backspace" && !e.target.value && index > 0) {
        otpBoxReference.current[index - 1].focus();
      }
      if (e.key === "Enter" && e.target.value && index < numberOfDigits - 1) {
        otpBoxReference.current[index + 1].focus();
      }
    }
    const loginadmin = async () => {
      try {
        const response = await axios.post('/api/admin/login', {
          email: details.email,
          password: details.password,
        });
        if(response){
        Cookies.set("username" ,`${response.data.data.admin.username}`);
        }
      } catch (error) {
        console.error('Admin login failed:', error.response ? error.response.data : error.message);
        setOtpError("❌ Admin login failed. Please try again.");
      }
    };
    const userRegister = async () => {
      try {
        const response = await axios.post('/api/createuser', {
          username:details.username,
          email: details.email,
          password: details.password,
          number:details.number
        });
        if(response){
        Cookies.set("username" ,`${response.data.data.admin.username}`);
        }
      } catch (error) {
        console.error('Admin login failed:', error.response ? error.response.data : error.message);
        setOtpError("❌ Admin login failed. Please try again.");
      }
    };
    useEffect(() => {
      const otpValue = otp.join("");
      if (otpValue.length < numberOfDigits) {
        setOtpError("⚠️ Please enter the full OTP.");
        setOtpSuccess(null);
      } else if (parseInt(otpValue) !== fjkasdf.data) {
        setOtpError("❌ Wrong OTP. Please check again.");
        setOtpSuccess(null);
      } else {
        setOtpError(null);
        if(fjkasdf.data.statusCode===237){
          userRegister();
        }
        else if(fjkasdf.data.statusCode===244){
          loginadmin();
        }
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        Cookies.set('hegsgeerjyhweffyw', "dbsygygdushcjbsduhyawvkiehjv", { expires });
        setTimeout(() => {
          setOtpSuccess("✅ Correct OTP. Admin Login Successfully");
          // Delay navigation by 2 seconds
          setTimeout(() => {
            navigate("/");
          }, 300); // 2 seconds delay for showing success message
        }, 0);
      }
    }, [otp, numberOfDigits, navigate]);
    return (
      <>
        <div className="popup-overlay" onClick={onClose}></div>
        <article className="otp-container">
          <button className="close-btn" onClick={onClose}>✖</button>
          <p className="label">One Time Password (OTP)</p>
  
          <div className="otp-input-wrapper">
            {otp.map((digit, index) => (
              <input
                key={index}
                value={digit}
                maxLength={1}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyUp={(e) => handleBackspaceAndEnter(e, index)}
                ref={(reference) => (otpBoxReference.current[index] = reference)}
                className="otp-box"
              />
            ))}
          </div>
            
          <p className={`error-message ${otpError ? "error-show" : ""}`}>{otpError}</p>
          <p className={`success-message ${otpSuccess ? "success-show" : ""}`}>{otpSuccess}</p>

        </article>
      </>
    );
  }
  