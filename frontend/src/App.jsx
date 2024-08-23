import React from 'react'
import Home from './pages/Home'
import demoimage from './assets/images/demoimage.jpeg'
import ProductPage from './pages/Productpage';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';


function App() {
  
    return (
      <Router>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/product" element={<ProductPage />} />
        </Routes>

    </Router>
    )
}

export default App
