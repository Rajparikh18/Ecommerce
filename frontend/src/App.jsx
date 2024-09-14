import React from 'react'
import Home from './pages/Home'
import demoimage from './assets/images/demoimage.jpeg'
import ProductPage from './pages/Productpage';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Authpage from './pages/Authpage';
import AdminCreateProduct from './pages/admin.createProduct';
import Productlist from './pages/Productlist';


function App() {
  
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/authpage" element={<Authpage/>} />
          <Route path="/admin/create" element={<AdminCreateProduct/>} />
          <Route path="/products/:category" element={<Productlist />} />
        </Routes>

    </Router>
    )
}

export default App
