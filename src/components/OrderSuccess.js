import React, { useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import successSound from "../assets/sound/success.wav"; // You must add this file
import { motion } from "framer-motion"; // animation library

export default function OrderSuccess({ cartItems, onBack }) {
  useEffect(() => {
    const audio = new Audio(successSound);
    audio.play();
  }, []);

  return (
    <motion.div
      className="order-success-container"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <FaCheckCircle size={60} color="#28a745" />
      <h2>Order Placed Successfully!</h2>
      <p>Thank you for your order. Here's what you've ordered:</p>

      <ul className="order-items">
        {cartItems.map((item, index) => (
          <li key={index}>
            {item.qty}x {item.name}
          </li>
        ))}
      </ul>

      <div className="order-total">
        <strong>
          Total: ₹
          {cartItems.reduce(
            (sum, item) =>
              sum + parseInt(item.price.replace("₹", "")) * item.qty,
            0
          )}
        </strong>
      </div>

      <button className="checkout-btn" onClick={onBack}>
        Go Back to Menu
      </button>
    </motion.div>
  );
}
