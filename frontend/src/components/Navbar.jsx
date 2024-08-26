import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <div>
      <ul className="navbar">
        <li>
           <Link to="/home">home</Link>
        </li>
        <div className="categoryParent">
          <a className="categories">Categories</a>
            <div className="categoryHover">
              <a href="">Haldiram</a>
              <br />
              <a href="">G2 Products</a>
            </div>
        </div>
        <li>
          <a href="/aboutus">About Us</a>
        </li>
        <li>
          <a href="/contactus">Contact Us</a>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
