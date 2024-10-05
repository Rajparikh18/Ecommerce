import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
// Import your components
import Home from './pages/Home';
import ProductPage from './pages/Productpage';
import Authpage from './pages/Authpage';
import AdminCreateProduct from './pages/admin.createProduct';
import Productlist from './pages/Productlist';
import OtpInputWithValidation from './components/otpverification';
import EditProductForm from './components/Editproductdetails';
import Checkout from './pages/Checkoutpage';
import Auth from './components/Auth';
import Orders from './pages/Orders';
import OrderManagement from './pages/adminTodayorder.jsx';
import OrderToday from './pages/adminTodayorder.jsx';
import AdminOrderTodayDetail from './pages/AdminTodayOrderDetail.jsx';

// Create a custom hook for authentication
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [details, setDetails] = useState({});

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/admin/verify', { withCredentials: true });
        
        const { isAuthenticated, admin, user } = response.data.data;
        
        setIsAuthenticated(isAuthenticated);
        setIsAdmin(!!admin);
        
        if (admin) {
          setDetails(admin);
        } else if (user) {
          setDetails(user);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setIsAdmin(false);
        setDetails({});
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { isAuthenticated, isAdmin, isLoading, details };
};

// Create a ProtectedRoute component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || (adminOnly && !isAdmin)) {
    return <Navigate to="/authpage" replace />;
  }

  return children;
};

const UserProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/authpage" replace />;
  }

  return children;
};

function App() {
  const { isAuthenticated, isAdmin, isLoading, details } = useAuth();

  useEffect(() => {
    if (details.username) {
      Cookies.set('username', `${details.username}`, { expires: isAdmin ? 1 : 7 });
    } else if (!isAuthenticated) {
      Cookies.remove('username');
    }
  }, [details, isAdmin, isAuthenticated]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home isAdmin={isAdmin} />} />
        <Route path="/product/:id" element={<ProductPage isAdmin={isAdmin} />} />
        <Route path="/authpage" element={<Authpage  isAdmin={isAdmin}/>} />
        <Route 
          path="/admin/create" 
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminCreateProduct isAdmin={isAdmin}/>
            </ProtectedRoute>
          } 
        />
        <Route path="/products/:category" element={<Productlist isAdmin={isAdmin} />} />
        <Route 
          path="/update/:id" 
          element={
            <ProtectedRoute adminOnly={true}>
              <EditProductForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/checkout" 
          element={
            <UserProtectedRoute>
              <Checkout isAdmin={isAdmin} />
            </UserProtectedRoute>
          }
        />
         <Route path="/mobileotp" element={<Auth />} />
         <Route 
          path="/todayorders" 
          element={
            <ProtectedRoute adminOnly={true}>
              <OrderToday isAdmin={isAdmin}/>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/order/:id" 
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminOrderTodayDetail isAdmin={isAdmin}/>
            </ProtectedRoute>
          } 
        />
         <Route path='/:username/myorders' element={<UserProtectedRoute><Orders isAdmin={isAdmin}/></UserProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
