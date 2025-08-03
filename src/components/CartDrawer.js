import React, { useEffect, useRef } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

export default function CartDrawer({
  cartItems,
  onClose,
  couponCode,
  setCouponCode,
  onUpdateQty,
  onCheckout,
}) {
  const drawerRef = useRef();

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);

  const isCouponApplied = couponCode === "Coupon Applied";

  const total = isCouponApplied
    ? 1
    : cartItems.reduce(
        (sum, item) => sum + parseInt(item.price.replace("₹", "")) * item.qty,
        0
      );

  return (
    <div className="cart-drawer-overlay">
      <div className="cart-drawer" ref={drawerRef}>
        <div className="cart-header">
          <h3>Cart</h3>
          <button onClick={onClose}>
            <IoMdClose size={22} />
          </button>
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

        <div className="coupon-section">
          <label className="coupon-checkbox-label">
            <input
              type="checkbox"
              checked={isCouponApplied}
              onChange={(e) =>
                setCouponCode(e.target.checked ? "Coupon Applied" : "")
              }
            />
            <span>Get this entire order for ₹1</span>
          </label>

          {isCouponApplied && (
            <p className="coupon-message success">
              Discount applied! You're getting this order for just ₹1.
            </p>
          )}
        </div>

        <div className="cart-footer">
          <strong>Total: ₹{total}</strong>
          <button className="checkout-btn" onClick={onCheckout}>
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
