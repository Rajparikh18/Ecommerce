import React from 'react';
import './adminDeleteProduct.css';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';

const DeleteProduct = ({ productName, id, onClose }) => {
  const navigate = useNavigate();
  const handleConfirmDelete = async (e) => {
    e.stopPropagation(); 
    try {
      const deleteProduct = await axios.delete(`/api/admin/delete/${id}`);
      if (deleteProduct) {
        navigate('/');
        window.location.reload();  // Reload the page after successful deletion
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleClose = (e) => {
    e.stopPropagation(); // Prevent card click event
    onClose();
  };

  return (
    <div className="delete-product">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal">
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete the product: {productName}?</p>
        <div className="modal-actions">
          <button className="confirm-button" onClick={handleConfirmDelete}>
            Yes, Delete
          </button>
          <button className="cancel-button" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProduct;