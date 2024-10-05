import React, { useState, useEffect } from 'react';
import { Package, MapPin, Phone, CreditCard, Calendar, ChevronDown, ChevronUp, ShoppingCart } from 'lucide-react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Order.Component.css'
import MorphingLoader from './MorphingLoader';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { username } = useParams();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`/api/orders`);
        if (response.status === 200) {
          setOrders(response.data.data.ordersUser);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [username]);

  if (loading) return <MorphingLoader />;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="orders-list">
      {orders.map((order) => (
        <OrderCard key={order.orderId} order={order} />
      ))}
    </div>
  );
};

const OrderCard = ({ order }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => setShowDetails(!showDetails);

  return (
    <div className="order-card">
      <div className="order-header" onClick={toggleDetails}>
        <h3 className="order-title">
          <Package className="icon" /> Order #{order.orderId}
        </h3>
        <p className="order-date">
          Placed on {new Date(order.created_At).toLocaleDateString()}
        </p>
        <p className='order-status'>
            Order Status : {order.orderStatus}
        </p>
        <p className="order-total">Total: ₹{order.amount}</p>
        {showDetails ? <ChevronUp className="icon" /> : <ChevronDown className="icon" />}
      </div>
      {showDetails && (
        <div className="order-details">
          <div className="detail-section">
            <h4><MapPin className="icon" /> Shipping Address</h4>
            <p>{order.firstName} {order.lastName}</p>
            <p>{order.address}</p>
            <p>{order.city}, {order.postCode}</p>
          </div>
          <div className="detail-section">
            <h4><Phone className="icon" /> Contact</h4>
            <p>{order.phoneNumber}</p>
          </div>
          <div className="detail-section">
            <h4><Calendar className="icon" /> Order Date</h4>
            <p>{new Date(order.created_At).toLocaleString()}</p>
          </div>
          <div className="detail-section">
            <h4><ShoppingCart className="icon" /> Ordered Items</h4>
            {order.cart.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.imageUrl} alt={item.title} className="cart-item-image" />
                <div className="cart-item-details">
                  <h5>{item.title}</h5>
                  <p>Quantity: {item.qty}</p>
                  <p>Purchased Price: ₹{item.price[0]}</p>
                  <p>Market Price: ₹{item.price[1]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;