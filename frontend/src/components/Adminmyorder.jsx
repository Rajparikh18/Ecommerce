import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import './Adminmyorder.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function TodaysOrders() {
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const currentDateInIST = new Date(Date.now());

    const [orders, setOrders] = useState([]);
    const [date, setDate] = useState(currentDateInIST);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;

    useEffect(() => {
        fetchOrders(date);
    }, []);

    useEffect(() => {
        fetchOrders(date);
    }, [date]);

    const fetchOrders = async (fetchDate) => {
        try {
            const fetchDateInUTC = new Date(fetchDate.getTime() );
            const formattedDate = fetchDateInUTC.toISOString().split('T')[0];
            const response = await axios.get(`/api/admin/getorders/${formattedDate}`);

            if (response.data.success) {
                setOrders(response.data.data);
            } else {
                console.error('Failed to fetch orders:', response.data.message);
                setOrders([]);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleDateChange = (e) => {
        const newDate = new Date(e.target.value);
        setDate(newDate);
    };

    // Filter orders based on search term
    const filteredOrders = orders.filter(order =>
        order.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.product && order.product.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Pagination logic
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.amount, 0);

    return (
        <div className="todays-orders">
            <div className="header">
                <h1>Today's Orders</h1>
                <div className="date-picker">
                    <input
                        type="date"
                        value={date.toISOString().split('T')[0]}
                        onChange={handleDateChange}
                    />
                </div>
            </div>

            <div className="summary">
                <div className="card">
                    <h2>Total Orders</h2>
                    <p>{totalOrders}</p>
                </div>
                <div className="card">
                    <h2>Total Revenue</h2>
                    <p>&#8377;{totalRevenue.toFixed(2)}</p>
                </div>
            </div>

            <div className="search">
                <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Product</th>
                        <th>Order Time</th>
                        <th>Amount</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentOrders.map((order) => (
                        <tr key={order._id}>
                            <td>{order.orderId}</td>
                            <td>{`${order.firstName} ${order.lastName}`}</td>
                            <td>{order.cart.length} unique products</td>
                            <td>{format(new Date(order.created_At), 'HH:mm:ss')}</td>
                            <td>&#8377;{order.amount.toFixed(2)}</td>
                            <td>
                                <Link to={`/order/${order._id}`}>View Details</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                <button className='button1'
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <button className='button1'
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}