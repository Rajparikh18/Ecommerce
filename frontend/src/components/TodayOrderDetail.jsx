import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './TodayOrderDetail.css';

export default function OrderDetails() {
    const [order, setOrder] = useState([]); // Set initial state to an empty array
    const { id } = useParams();

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            const response = await axios.get(`/api/admin/order/${id}`);
            console.log("API Response:", response); // Log the response
            if (response && response.data) {
                setOrder(response.data.data); // Set the order to the data received
                console.log("Updated order state:", response.data.data); // Log the updated state
            } else {
                console.error('Failed to fetch order details:', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
    };

    if (order.length === 0) {
        return <div className="order-details">Loading...</div>; // Loading state
    }

    const orderData = order[0]; // Access the first order object from the array

    return (
        <div className="order-details">
            <div className="order-info">
            <h1>Order Details</h1>
                <p><strong>Order ID:</strong> {orderData.orderId}</p>
                <p><strong>Customer:</strong> {`${orderData.firstName} ${orderData.lastName}`}</p>
                <p><strong>Email:</strong> {orderData.email}</p>
                <p><strong>Phone:</strong> {orderData.phoneNumber}</p> {/* Updated to phoneNumber */}
                <p><strong>Order Date:</strong> {new Date(orderData.created_At).toLocaleString()}</p>
                <p><strong>Total Amount:</strong> &#8377;{orderData.amount}</p>
            </div>

            <h2>Products</h2>
            <table className="products-table">
            
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {orderData.cart && orderData.cart.length > 0 ? ( // Access cart from orderData
                        orderData.cart.map((product, index) => (
                            <tr key={index}>
                                <td>{product.title}</td> {/* Assuming product has a title property */}
                                <td>{product.qty}</td>
                                <td>&#8377;{product.price[0]}</td>
                                <td>&#8377;{(product.quantity * product.price).toFixed(2)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No products found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="shipping-info">
                <h2>Shipping Information</h2>
                <p>{orderData.address}</p> {/* Accessing address property */}
                <p>{orderData.city}, {orderData.postCode}</p> {/* Accessing city and postCode */}
            </div>

            <Link to="/" className="back-button">Back to Orders</Link>
        </div>
    );
}
