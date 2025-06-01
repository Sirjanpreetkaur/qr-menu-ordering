import React from "react";
import { FaCheckCircle } from "react-icons/fa";

export default function OrderSuccess({ cartItems }) {
  return (
    <div className="order-success-container">
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
    </div>
  );
}
