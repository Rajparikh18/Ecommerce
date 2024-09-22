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
import EditProductForm from './components/Editproductdetails';

// Create a custom hook for authentication
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/admin/verify', { withCredentials: true });
        if(response){
          console.log(response.data.data);
        }
        setIsAuthenticated(response.data.data.isAuthenticated);
        setIsAdmin(!!response.data.data.admin); // Change here: removed the negation
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
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
console.log("in app como",isAuthenticated, isAdmin, isLoading);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home isAdmin={isAdmin} />} />
        <Route path="/product/:id" element={<ProductPage isAdmin={isAdmin} />} />
        <Route path="/authpage" element={<Authpage />} />
        <Route 
          path="/admin/create" 
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminCreateProduct />
            </ProtectedRoute>
          } 
        />
        <Route path="/products/:category" element={<Productlist isAdmin={isAdmin} />} />
        <Route path="/otp" element={<OtpInputWithValidation numberOfDigits={6} />} />
        <Route 
          path="/update/:id" 
          element={
            <ProtectedRoute adminOnly={true}>
              <EditProductForm />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;