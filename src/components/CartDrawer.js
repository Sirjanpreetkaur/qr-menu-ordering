import React from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

export default function CartDrawer({ cartItems, onClose, onUpdateQty }) {
  return (
    <div className="cart-drawer-overlay">
      <div className="cart-drawer">
        <div className="cart-header">
          <h3>Cart</h3>
          <button onClick={onClose}><IoMdClose/></button>
        </div>
        <ul className="cart-items">
          {cartItems.map((item, index) => (
            <li key={index} className="cart-item">
              <div>{item.name}</div>
              <div className="cart-item-controls">
                <button onClick={() => onUpdateQty(item, -1)}>
                  <FaMinus />
                </button>
                {item.qty}
                <button onClick={() => onUpdateQty(item, 1)}>
                  <FaPlus />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="cart-footer">
          <strong>
            Total: ₹
            {cartItems.reduce(
              (sum, item) =>
                sum + parseInt(item.price.replace("₹", "")) * item.qty,
              0
            )}
          </strong>
          <button className="checkout-btn">Checkout</button>
        </div>
      </div>
    </div>
  );
}
