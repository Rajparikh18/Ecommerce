import React, { useEffect } from "react";
import "./alertSuccess.css";

function AlertSuccessMessage({ message, onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
          onClose();
        }, 3000);
    
        return () => clearTimeout(timer); 
      }, [onClose]);
  return (
    <div id="custom-alert" className="alert">
      <div className="alert-content">
        <span className="alert-message">{message}</span>
        <button className="alert-close" onClick={onClose}>
          &times; {/* Using a close icon */}
        </button>
      </div>
    </div>
  );
}

export default AlertSuccessMessage;

