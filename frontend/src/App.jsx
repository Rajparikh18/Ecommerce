import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';

// Import your components
import Home from './pages/Home';
import ProductPage from './pages/Productpage';
import Authpage from './pages/Authpage';
import AdminCreateProduct from './pages/admin.createProduct';
import Productlist from './pages/Productlist';
import OtpInputWithValidation from './components/otpverification';

// Create a custom hook for authentication
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/admin/verify', { withCredentials: true });
        setIsAuthenticated(response.data.data.isAuthenticated);
        setIsAdmin(!!response.data.data.admin); // Assuming the presence of 'admin' indicates admin status
      } catch (error) {
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { isAuthenticated, isAdmin, isLoading };
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/authpage" element={<Authpage />} />
        <Route 
          path="/admin/create" 
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminCreateProduct />
            </ProtectedRoute>
          } 
        />
        <Route path="/products/:category" element={<Productlist />} />
        <Route path="/otp" element={<OtpInputWithValidation numberOfDigits={6} />} />
      </Routes>
    </Router>
  );
}

export default App;