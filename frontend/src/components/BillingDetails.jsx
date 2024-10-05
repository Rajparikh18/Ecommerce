import React, { useState,useEffect } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import './BillingDetails.css'
import {useNavigate} from 'react-router-dom'

const BillingDetails = () => {
  const navigate = useNavigate()
  useEffect(() => {
    // Dynamically load the Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => console.log('Razorpay script loaded successfully');
    script.onerror = () => console.error('Error loading Razorpay script');
    document.body.appendChild(script);

    return () => {
      // Clean up: remove script if the component unmounts
      document.body.removeChild(script);
    };
  }, []);
  const [formData, setFormData] = useState({
    checkoutOption: 'new',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    city: 'Solapur',
    postCode: '413001',
    country: 'India',
    regionState: 'Maharashtra'
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cartData = Cookies.get('cart');
      const cart = cartData ? JSON.parse(cartData) : [];

      const submissionData = {
        ...formData,
        cart
      };

      const response = await axios.post('/api/payment/createorder', submissionData);
      if (response.data && response.data.data) {
        initializeRazorpay(response.data.data);
      } else {
        console.error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  };

  const initializeRazorpay = (orderData) => {
    const options = {
      key: import.meta.env.VITE_PAYMENT_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "APARNA DISTRIBUTORS",
      description: "THIS IS THE PAYMENT-GATEWAY AT APARNA DISTRIBUTORS FOR YOUR ORDER",
      order_id: orderData.id,
      handler: function (response) {
        verifyPayment(response, orderData);
      },
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: orderData.user.email,
        contact: formData.phoneNumber
      },
      theme: {
        color: "#3399cc"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const verifyPayment = async (paymentResponse, orderData) => {
    try {
      const verificationData = {
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        ...formData,
        cart: orderData.cart,
        amount: orderData.amount
      };

      const response = await axios.post('/api/payment/verify', verificationData);
      if (response.data.success) {
        // Payment verified successfully
        // Clear the cart and redirect to a success page
        let name= Cookies.get('username');
        Cookies.remove('cart');
        navigate(`/${name}/myorders`);
        // Redirect to success page or show success message
      } else {
        // Handle payment verification failure
        console.error('Payment verification failed');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
    }
  };


  return (
    <form className="billing-details" onSubmit={handleSubmit}>
      <h2>Billing Details</h2>
      
      <div className="checkout-options">
        <h3>Checkout Options</h3>
        <label>
          <input
            type="radio"
            name="checkoutOption"
            value="existing"
            checked={formData.checkoutOption === 'existing'}
            onChange={handleInputChange}
          />
          I want to use an existing address
        </label>
        <label>
          <input
            type="radio"
            name="checkoutOption"
            value="new"
            checked={formData.checkoutOption === 'new'}
            onChange={handleInputChange}
          />
          I want to use new address
        </label>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName">First Name*</label>
          <input 
            type="text" 
            id="firstName" 
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="Enter your first name" 
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name*</label>
          <input 
            type="text" 
            id="lastName" 
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Enter your last name" 
            required 
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="phoneNumber">Phone Number*</label>
        <input 
          type="tel" 
          id="phoneNumber" 
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          minLength={10}
              maxLength={10} // Restrict to 10 digits for a standard mobile number
              pattern="[0-9]*"
          placeholder="Enter your phone number" 
          required 
          onInvalid={(e) => e.target.setCustomValidity('Please enter a valid phone number')}
          onInput={(e) => e.target.setCustomValidity('')}
        />
      </div>
      <div className="form-group">
        <label htmlFor="address">Address*</label>
        <input 
          type="text" 
          id="address" 
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Address Line 1" 
          required 
        />
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="city">City *</label>
          <select 
            id="city" 
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            required
          >
            <option value="Solapur">Solapur</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="postCode">Post Code*</label>
          <select 
            name="postCode" 
            id="postCode"
            value={formData.postCode}
            onChange={handleInputChange}
          >
            <option value="413001">413001 - Solapur</option>
            <option value="413002">413002 - Soregaon</option>
            <option value="413003">413003 - Kumbhari</option>
            <option value="413004">413004 - MIDC Solapur</option>
            <option value="413005">413005 - Hotgi Road</option>
            <option value="413006">413006 - Indiranagar</option>
            <option value="413007">413007 - Pandharpur</option>
            <option value="413008">413008 - Barshi</option>
            <option value="413101">413101 - Akkalkot</option>
            <option value="413118">413118 - Mangalvedhe</option>
            <option value="413203">413203 - Kurduwadi</option>
            <option value="413304">413304 - Mohol</option>
            <option value="413401">413401 - Sangola</option>
            <option value="413406">413406 - Akluj</option>
            <option value="413414">413414 - Karmala</option>
          </select>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="country">Country *</label>
          <select 
            id="country" 
            name="country"
            value={formData.country}
            onChange={handleInputChange}
          >
            <option value="India">India</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="regionState">Region State</label>
          <select 
            id="regionState" 
            name="regionState"
            value={formData.regionState}
            onChange={handleInputChange}
          >
            <option value="Maharashtra">Maharashtra</option>
          </select>
        </div>
      </div>
      <button type="submit" className="place-order-btn">Place Order</button>
    </form>
  )
}

export default BillingDetails