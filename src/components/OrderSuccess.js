import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import successSound from "../assets/sound/success.wav";
import { motion } from "framer-motion";
import { useParams, useLocation } from "react-router-dom";

export default function OrderSuccess({ cartItems, onBack }) {
  const { tableId } = useParams();
  const location = useLocation();
  const [paymentId, setPaymentId] = useState(null);

  // Extract payment ID from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idFromUrl = params.get("payment_id");
    console.log("Payment ID from URL:", idFromUrl); // Debug log
    if (idFromUrl) {
      setPaymentId(idFromUrl);
    }
  }, [location.search]);

  // Play success sound on mount
  useEffect(() => {
    const audio = new Audio(successSound);
    audio.play().catch(error => {
      console.log("Audio play failed:", error);
    });
  }, []);

  return (
    <motion.div
      className="order-success-container"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <FaCheckCircle size={60} color="#28a745" />
      <h2>Thank You!</h2>

      {/* Fixed: Removed redundant paragraph wrapper and fixed conditional rendering */}
      {paymentId && (
        <p style={{ fontSize: "0.95rem", marginBottom: "8px" }}>
          <strong>Payment ID:</strong> {paymentId}
        </p>
      )}

      <p style={{ marginTop: "10px", fontSize: "1rem", color: "#333", fontWeight: "500" }}>
        Your order for <strong>Table {tableId}</strong> has been placed and is being prepared.
      </p>

      <p style={{ fontSize: "0.95rem", color: "#666", marginBottom: "20px" }}>
        Estimated preparation time: <strong>15–20 minutes</strong>
      </p>

      <p style={{ fontSize: "1rem", marginBottom: "12px" }}>
        Here's what you've ordered:
      </p>

      <ul className="order-items">
        {cartItems.map((item, index) => (
          <li key={index} className="order-item-row">
            <img src={item.image} alt={item.name} className="order-item-img" />
            <div className="order-item-text">
              <strong>{item.qty}x</strong> {item.name}
            </div>
          </li>
        ))}
      </ul>

      <div className="order-total" style={{ marginTop: "20px" }}>
        <strong>
          Total: ₹
          {cartItems.reduce(
            (sum, item) => sum + parseInt(item.price.replace("₹", "")) * item.qty,
            0
          )}
        </strong>
      </div>

      <button className="checkout-btn" style={{ marginTop: "24px" }} onClick={onBack}>
        Go Back to Menu
      </button>
    </motion.div>
  );
}