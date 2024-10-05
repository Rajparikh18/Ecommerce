import React from "react";
import "./alertFailure.css";
import { useEffect } from "react";
function AlertFailureMessage({ message, onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
          onClose();
        }, 1000);
    
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

export default AlertFailureMessage;