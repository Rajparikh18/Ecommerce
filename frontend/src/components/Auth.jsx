import React, { useRef, useState } from 'react';
import firebase from '../firebase';

const Auth = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [error, setError] = useState('');
  const recaptchaRef = useRef(null);

  const handleSendOtp = () => {
    setError(''); // Clear any previous errors

    if (!phoneNumber.startsWith('+91') || phoneNumber.length !== 13) {
      setError('Please enter a valid Indian phone number in the format +91XXXXXXXXXX');
      return;
    }

    if (recaptchaRef.current) {
      recaptchaRef.current.innerHTML = '<div id="recaptcha-container"></div>';
    }

    const verifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      size: 'invisible',
    });

    firebase.auth().signInWithPhoneNumber(phoneNumber, verifier)
      .then(confirmationResult => {
        setVerificationId(confirmationResult.verificationId);
        console.log('OTP sent successfully');
      })
      .catch(error => {
        console.error('Error sending OTP:', error);
        setError(`Error: ${error.message}`);
        // Reset the reCAPTCHA
        if (recaptchaRef.current) {
          recaptchaRef.current.innerHTML = '';
        }
      });
  };

  return (
    <div>
      <h1>Phone Number OTP Verification</h1>
      <div ref={recaptchaRef}></div>
      <p>Enter your Indian phone number in the format: +91XXXXXXXXXX</p>
      <input
        type="tel"
        placeholder="e.g., +919876543210"
        value={phoneNumber}
        onChange={e => setPhoneNumber(e.target.value)}
      />
      <button onClick={handleSendOtp}>Send OTP</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Auth;