import React, { useState, useEffect } from 'react';
import { Package, MapPin, Phone, CreditCard, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import './Order.Component.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {username} = useParams();
  console.log(username.trim());
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log("hello");
        const response = await axios.get(`/api/orders`);
        console.log("after");
        console.log(response);
        if (response.status == 200) {
          console.log(response.data);
        }
        setOrders(response.data);  // No need for response.data.json()
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrders();
}, [username]);


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="orders-list">
      {orders.map((order) => (
        <OrderCard key={order.orderId} orderData={order} />
      ))}
    </div>
  );
};

const OrderCard = ({ orderData }) => {
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showItemDetails, setShowItemDetails] = useState(false);

  const toggleOrderDetails = () => setShowOrderDetails(!showOrderDetails);
  const toggleItemDetails = () => setShowItemDetails(!showItemDetails);

  return (
    <div className="order-details-container">
      <div className="card">
        <div className="card-header">
          <div className="card-title text-2xl">Order Summary</div>
        </div>
        <div className="card-content">
          <div className="order-summary">
            <div className="order-info">
              <h3 className="text-lg font-semibold flex items-center">
                <Package className="mr-2" size={20} /> Order #{orderData.orderId}
              </h3>
              <p className="text-muted-foreground">
                Placed on {new Date(orderData.created_At).toLocaleDateString()}
              </p>
            </div>
            <div className="order-total">
              <h3 className="text-lg font-semibold">Total</h3>
              <p className="text-2xl font-bold">${orderData.amount.toFixed(2)}</p>
            </div>
          </div>

          <div className="accordion">
            <div className="accordion-item">
              <button className="accordion-trigger" onClick={toggleOrderDetails}>
                Order Details 
                {showOrderDetails ? (
                  <ChevronUp className="chevron-icon" size={20} />
                ) : (
                  <ChevronDown className="chevron-icon" size={20} />
                )}
              </button>
              {showOrderDetails && (
                <div className="accordion-content">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="detail-section">
                      <h4 className="font-semibold flex items-center">
                        <MapPin className="mr-2" size={16} /> Shipping Address
                      </h4>
                      <p>{orderData.firstName} {orderData.lastName}</p>
                      <p>{orderData.address}</p>
                      <p>{orderData.city}, {orderData.postCode}</p>
                    </div>
                    <div className="detail-section">
                      <h4 className="font-semibold flex items-center">
                        <Phone className="mr-2" size={16} /> Contact
                      </h4>
                      <p>{orderData.phoneNumber}</p>
                    </div>
                    <div className="detail-section">
                      <h4 className="font-semibold flex items-center">
                        <CreditCard className="mr-2" size={16} /> Payment Method
                      </h4>
                      <p>Credit Card (ending in {orderData.paymentId.slice(-4)})</p>
                    </div>
                    <div className="detail-section">
                      <h4 className="font-semibold flex items-center">
                        <Calendar className="mr-2" size={16} /> Order Date
                      </h4>
                      <p>{new Date(orderData.created_At).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Ordered Items</h3>
            <ul className="space-y-2">
              {orderData.cart.map((item, index) => (
                <li key={index} className="flex justify-between items-center p-2 bg-secondary rounded-lg">
                  <span>{item.name} x{item.quantity}</span>
                  <span className="badge">${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          <button className="toggle-button mt-4" onClick={toggleItemDetails}>
            {showItemDetails ? (
              <>Hide Item Details <ChevronUp className="ml-2 h-4 w-4" /></>
            ) : (
              <>Show Item Details <ChevronDown className="ml-2 h-4 w-4" /></>
            )}
          </button>

          {showItemDetails && (
            <div className="mt-4 space-y-4">
              {orderData.cart.map((item, index) => (
                <div key={index} className="card">
                  <div className="card-content p-4">
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-muted-foreground">Quantity: {item.quantity}</p>
                    <p className="text-muted-foreground">Price per item: ${item.price.toFixed(2)}</p>
                    <p className="font-semibold mt-2">Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;