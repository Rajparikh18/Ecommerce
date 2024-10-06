import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import './Adminmyorder.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Truck, Package } from 'lucide-react';
import AlertSuccessMessage from './alertSuccess.jsx'; // Import Alert component
import MorphingLoader from './MorphingLoader.jsx'; // Import the loader component

export default function TodaysOrders() {
    const currentDateInIST = new Date(Date.now());

    const [orders, setOrders] = useState([]);
    const [date, setDate] = useState(currentDateInIST);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [orderStatuses, setOrderStatuses] = useState({});
    const [alertVisible, setAlertVisible] = useState(false); 
    const [alertMessage, setAlertMessage] = useState('');
    const [loading, setLoading] = useState(false); // New loading state

    const ordersPerPage = 5;
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;

    useEffect(() => {
        fetchOrders(date);
    }, [date]);

    useEffect(() => {
        setOrderStatuses(
            orders.reduce((acc, order) => {
                acc[order._id] = order.orderStatus; // Initialize with current status
                return acc;
            }, {})
        );
    }, [orders]);

    const fetchOrders = async (fetchDate) => {
        setLoading(true); // Set loading to true when fetching starts
        try {
            const fetchDateInUTC = new Date(fetchDate.getTime());
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
        } finally {
            setLoading(false); // Set loading to false when fetching completes
        }
    };

    const handleStatusChange = (event) => {
        const { name, value } = event.target;
        const orderId = name.split('_')[1]; // Extract order ID from name
        setOrderStatuses((prevStatuses) => ({
            ...prevStatuses,
            [orderId]: value, // Update the status of the specific order
        }));
    };

    const updatestatusindb = async () => {
        const updatedStatus = orders.map((order) => ({
            orderId: order._id,
            status: orderStatuses[order._id], // Get the updated status from state
        }));

        try {
            const response = await axios.post('/api/admin/updateOrderStatus', updatedStatus);
            console.log('response', response);
            setAlertMessage(response.data.message);
            setAlertVisible(true);
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Failed to update order statuses');
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

    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.amount, 0);

    return (
        <div className="todays-orders">
            {alertVisible && (
                <AlertSuccessMessage 
                    message={alertMessage} 
                    onClose={() => setAlertVisible(false)}
                />
            )}

            {loading ? ( // Show loader if loading is true
                <MorphingLoader />
            ) : (
                <>
                    <div className="heading1">
                        <h1>Today's Orders</h1>
                        <div className="date-picker">
                            <input
                                type="date"
                                value={date.toISOString().split("T")[0]}
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
                                <th>Order Status</th>
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
                                    <td>
                                        <div className="status-checkbox">
                                            <label>
                                                <input
                                                    type="radio"
                                                    name={`order_${order._id}`}
                                                    value="Dispatched"
                                                    checked={orderStatuses[order._id] === "Dispatched"}
                                                    onChange={handleStatusChange}
                                                />
                                                <Truck size={24} className='truck' />
                                            </label>
                                            <label>
                                                <input
                                                    type="radio"
                                                    name={`order_${order._id}`}
                                                    value="Delivered"
                                                    checked={orderStatuses[order._id] === "Delivered"}
                                                    onChange={handleStatusChange}
                                                />
                                                <Package size={24} className='package' />
                                            </label>
                                        </div>
                                    </td>
                                    <td>{format(new Date(order.created_At), "HH:mm:ss")}</td>
                                    <td>&#8377;{order.amount.toFixed(2)}</td>
                                    <td>
                                        <Link to={`/order/${order._id}`}>View Details</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <button
          onClick={updatestatusindb}
          style={{
            backgroundColor: "#28a745",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#218838")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#28a745")
          }
        >
          Update in Database
        </button>

                    <div className="pagination">
                        <button
                            className="button1"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <button
                            className="button1"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}