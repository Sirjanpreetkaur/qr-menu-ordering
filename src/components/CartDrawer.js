import React, { useEffect, useRef, useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

export default function CartDrawer({
  cartItems,
  onClose,
  couponCode,
  setCouponCode,
  onUpdateQty,
  onCheckout,
}) {
  const drawerRef = useRef();
  const [showTestAlert, setShowTestAlert] = useState(false);

  useEffect(() => {
    const handleOutsideClick = e => {
      // ✅ Only detect outside click if modal is NOT open
      if (
        !showTestAlert &&
        drawerRef.current &&
        !drawerRef.current.contains(e.target)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [onClose, showTestAlert]);

  const isCouponApplied = couponCode === 'Coupon Applied';

  const total = isCouponApplied
    ? 1
    : cartItems.reduce(
        (sum, item) => sum + parseInt(item.price.replace('₹', '')) * item.qty,
        0
      );

  const handleCheckoutClick = () => {
    setShowTestAlert(true);
  };

  const proceedCheckout = e => {
    e.stopPropagation(); // ✅ Prevent bubbling to overlay
    console.log('111111');
    setShowTestAlert(false);
    onCheckout();
  };

  return (
    <div className="cart-drawer-overlay">
      <div className="cart-drawer" ref={drawerRef}>
        {/* Header */}
        <div className="cart-header">
          <h3>Cart</h3>
          <button onClick={onClose}>
            <IoMdClose size={22} />
          </button>
        </div>

        {/* Items */}
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

        {/* Coupon */}
        <div className="coupon-section">
          <label className="coupon-checkbox-label">
            <input
              type="checkbox"
              checked={isCouponApplied}
              onChange={e =>
                setCouponCode(e.target.checked ? 'Coupon Applied' : '')
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

        {/* Footer */}
        <div className="cart-footer">
          <strong>Total: ₹{total}</strong>
          <button className="checkout-btn" onClick={handleCheckoutClick}>
            Checkout
          </button>
        </div>
      </div>

      {/* ✅ Test Mode Alert Modal */}
      {showTestAlert && (
        <div className="modal-overlay" style={{ pointerEvents: 'auto' }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h4>⚠ Test Mode Notice</h4>
            <p>
              You're using our test envionment. During UPI payment, you may see
              error messages, but the payment will complete successfully. This
              is normal behavior in our test environment.
            </p>
            <div className="modal-actions">
              <button onClick={() => setShowTestAlert(false)}>Cancel</button>
              <button onClick={proceedCheckout} className="proceed-btn">
                Continue to Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
