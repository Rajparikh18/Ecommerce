import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './TodayOrderDetail.css';
import MorphingLoader from './MorphingLoader';

export default function OrderDetails() {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/admin/order/${id}`);
            if (response && response.data && response.data.data) {
                setOrder(response.data.data[0]);
            } else {
                setError('Failed to fetch order details');
            }
        } catch (error) {
            setError('Error fetching order details');
            console.error('Error fetching order details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <MorphingLoader/>;
    }

    if (error) {
        return <div className="order-details__error">{error}</div>;
    }

    if (!order) {
        return <div className="order-details__not-found">Order not found</div>;
    }

    return (
        <div className="order-details">
            <div className="order-details__info">
                <h1 className="order-details__title">Order Details</h1>
                <p className="order-details__field"><strong>Order ID:</strong> {order.orderId}</p>
                <p className="order-details__field"><strong>Customer:</strong> {`${order.firstName} ${order.lastName}`}</p>
                <p className="order-details__field"><strong>Email:</strong> {order.email}</p>
                <p className="order-details__field"><strong>Phone:</strong> {order.phoneNumber}</p>
                <p className="order-details__field"><strong>Order Date:</strong> {new Date(order.created_At).toLocaleString()}</p>
                <p className="order-details__field"><strong>Total Amount:</strong> &#8377;{order.amount}</p>
            </div>

            <h2 className="order-details__subtitle">Products</h2>
            <div className="order-details__products-table-container">
                <table className="order-details__products-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.cart && order.cart.length > 0 ? (
                            order.cart.map((product, index) => (
                                <tr key={index}>
                                    <td data-label="Product">{product.title}</td>
                                    <td data-label="Quantity">{product.qty}</td>
                                    <td data-label="Price">&#8377;{product.price[0]}</td>
                                    <td data-label="Subtotal">&#8377;{(product.qty * product.price[0]).toFixed(2)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No products found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="order-details__shipping">
                <h2 className="order-details__subtitle">Shipping Information</h2>
                <p className="order-details__address">{order.address}</p>
                <p className="order-details__address">{order.city}, {order.postCode}</p>
            </div>

            <Link to="/todayorders" className="order-details__back-button">Back to Orders</Link>
        </div>
    );
}