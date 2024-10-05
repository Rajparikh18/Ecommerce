import React, { useRef, useEffect, useState } from 'react';
import './otpverification.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export default function OtpInputWithValidation({details, numberOfDigits, onClose, fjkasdf }) {
  const [otp, setOtp] = useState(new Array(numberOfDigits).fill(""));
  const [otpError, setOtpError] = useState(null);
  const [otpSuccess, setOtpSuccess] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const otpBoxReference = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    setIsActive(true);
  }, []);

  function handleChange(value, index) {
    let newArr = [...otp];
    newArr[index] = value;
    setOtp(newArr);

    if (value && index < numberOfDigits - 1) {
      otpBoxReference.current[index + 1]?.focus();
    }
  }

  function handleBackspaceAndEnter(e, index) {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      otpBoxReference.current[index - 1]?.focus();
    }
    if (e.key === "Enter" && e.currentTarget.value && index < numberOfDigits - 1) {
      otpBoxReference.current[index + 1]?.focus();
    }
  }

  const loginadmin = async () => {
    try {
      await axios.post('/api/admin/login', {
        email: details.email,
        password: details.password,
      });
    } catch (error) {
      console.error('Admin login failed:', error);
      setOtpError("❌ Admin login failed. Please try again.");
      shakeModal();
    }
  }

  const userRegister = async () => {
    try {
      await axios.post('/api/createuser', {
        username: details.username,
        email: details.email,
        password: details.password,
        number: details.number
      });
    } catch (error) {
      console.error('User registration failed:', error);
      setOtpError("❌ User registration failed. Please try again.");
      shakeModal();
    }
  }

  const shakeModal = () => {
    const container = document.querySelector('.otp-container');
    container.classList.add('shake');
    setTimeout(() => {
      container.classList.remove('shake');
    }, 600);
  }

  useEffect(() => {
    const otpValue = otp.join("");
    if (otpValue.length === numberOfDigits) {
      if (parseInt(otpValue) !== parseInt(fjkasdf.data)) {
        setOtpError("❌ Wrong OTP. Please check again.");
        setOtpSuccess(null);
        shakeModal();
      } else {
        setOtpError(null);
        if (fjkasdf.statusCode === 237) {
          userRegister();
        } else if (fjkasdf.statusCode === 244) {
          loginadmin();
        }
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        setTimeout(() => {
          setOtpSuccess("✅ Correct OTP. Login Successful");
          setTimeout(() => {
            navigate("/",{ state: { message: fjkasdf.message }});
            window.location.reload();
          }, 300);
        }, 0);
      }
    } else {
      setOtpError(null);
      setOtpSuccess(null);
    }
  }, [otp, numberOfDigits, fjkasdf.data, fjkasdf.statusCode]);

  const handleClose = () => {
    setIsActive(false);
    setTimeout(onClose, 300);
  };

  return (
    <>
      <div className={`otp-overlay ${isActive ? 'active' : ''}`} onClick={handleClose}>
        <div className="otp-container" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={handleClose}>
            <X size={24} />
          </button>
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
              
          {otpError && (
            <div className="error-message">
              <AlertCircle size={20} />
              <span>{otpError}</span>
            </div>
          )}
          {otpSuccess && (
            <div className="success-message">
              <CheckCircle2 size={20} />
              <span>{otpSuccess}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}