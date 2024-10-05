import React, { useEffect } from "react";
import "./alertSuccess.css";

function AlertSuccessMessage({ message, onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
          onClose();
        }, 1000);
    
        return () => clearTimeout(timer); 
      }, [onClose]);
  return (
    <div id="custom-alert" className="alerts">
      <div className="alert-contents">
        <span className="alert-messages">{message}</span>
        <button className="alert-closes" onClick={onClose}>
          &times; {/* Using a close icon */}
        </button>
      </div>
    </div>
  );
}

export default AlertSuccessMessage;

