import React, { useState } from 'react';
import './Order.Component.css'; // Import the CSS file for styling

// Mock data for orders
const orders = [
  {
    id: '1',
    date: '2023-09-15',
    status: 'Delivered',
    total: 89.99,
    shopkeeper: {
      name: 'Electronics Hub',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    items: [
      { name: 'Wireless Earbuds', quantity: 1, price: 59.99 },
      { name: 'Phone Case', quantity: 1, price: 15.99 },
      { name: 'Screen Protector', quantity: 1, price: 14.01 },
    ],
    estimatedDelivery: '2023-09-20',
  },
  {
    id: '2',
    date: '2023-09-18',
    status: 'In Transit',
    total: 124.50,
    shopkeeper: {
      name: 'Fashion Forward',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    items: [
      { name: 'T-Shirt', quantity: 2, price: 29.99 },
      { name: 'Jeans', quantity: 1, price: 64.52 },
    ],
    estimatedDelivery: '2023-09-25',
  },
];

const Card = ({ children }) => (
  <div className="card">
    {children}
  </div>
);

const Badge = ({ children, variant = 'default' }) => (
  <span className={`badge badge-${variant}`}>
    {children}
  </span>
);

const Avatar = ({ src, alt, fallback }) => (
  <div className="avatar">
    {src ? (
      <img src={src} alt={alt} className="avatar-img" />
    ) : (
      <span className="avatar-fallback">{fallback}</span>
    )}
  </div>
);

const Separator = () => <hr className="separator" />;

const IconPackage = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="icon-package" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
    <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"></path>
    <path d="M12 3v6"></path>
  </svg>
);

const IconTruck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="icon-truck" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h13.5a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5Z"></path>
    <path d="M10 15V6"></path>
    <path d="M15 9h5.5a2 2 0 0 1 2 2v7"></path>
    <circle cx="7" cy="18" r="2"></circle>
    <circle cx="17" cy="18" r="2"></circle>
  </svg>
);

export default function MyOrders() {
    const [expandedOrder, setExpandedOrder] = useState(null);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="container">
      <h1 className="title" style={{color:"black"}} >My Orders</h1>
      {orders.map((order) => (
        <Card key={order.id}>
          <div className="card-content">
            <div className="card-header1">
              <h2 className="card-title">Order #{order.id}</h2>
              <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'}>
                {order.status}
              </Badge>
            </div>
            <p className="order-date">Placed on {order.date}</p>
            <div className="order-details">
              <div className="shopkeeper-info">
                <Avatar 
                  src={order.shopkeeper.avatar} 
                  alt={order.shopkeeper.name} 
                  fallback={order.shopkeeper.name[0]} 
                />
                <div className="shopkeeper-details">
                  <p className="shopkeeper-name">{order.shopkeeper.name}</p>
                  <p className="shopkeeper-role">Seller</p>
                </div>
              </div>
              <div className="order-total">
                <p className="total-amount">${order.total.toFixed(2)}</p>
                <p className="total-label">Total</p>
              </div>
            </div>
            <div className="delivery-info">
              <div className="delivery-details">
                <IconTruck />
                <span className="delivery-date">Estimated Delivery: {order.estimatedDelivery}</span>
              </div>
              <button
                onClick={() => toggleOrderDetails(order.id)}
                className="details-button"
              >
                {expandedOrder === order.id ? 'Hide Details' : 'Show Details'}
              </button>
            </div>
            {expandedOrder === order.id && (
              <div className="order-items">
                <Separator />
                <h4 className="items-title">Order Items</h4>
                {order.items.map((item, index) => (
                  <div key={index} className="item">
                    <div className="item-info">
                      <IconPackage />
                      <span className="item-name">{item.name}</span>
                    </div>
                    <div className="item-total">
                      <p>{item.quantity} x ${item.price.toFixed(2)}</p>
                      <p className="item-subtotal">
                        ${(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
