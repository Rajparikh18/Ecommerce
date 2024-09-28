import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import axios from "axios";
import MyOrders from "../components/Order.Component";

import React from 'react';
import Navbar from "../components/Navbar";

function Orders(){
  return (
    <>
        <Header />
        <Navbar/>
        <MyOrders/>
        <Footer />
    </>
  );
};

export default Orders;