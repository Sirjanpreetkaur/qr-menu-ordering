import React, { useEffect, useRef, useState } from 'react';
import { FaPlus, FaMinus, FaInfoCircle } from 'react-icons/fa';
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
  const tooltipTimeoutRef = useRef(null); // ✅ Added ref for timeout
  const [showTestAlert, setShowTestAlert] = useState(false);
  const [showTaxTooltip, setShowTaxTooltip] = useState(false);

  useEffect(() => {
    const handleOutsideClick = e => {
      // Close tooltip if clicking outside
      if (showTaxTooltip && !e.target.closest('.tax-info')) {
        setShowTaxTooltip(false);
        // ✅ Clear timeout when tooltip is closed by outside click
        if (tooltipTimeoutRef.current) {
          clearTimeout(tooltipTimeoutRef.current);
          tooltipTimeoutRef.current = null;
        }
      }

      // Only detect outside click if modal is NOT open
      if (
        !showTestAlert &&
        drawerRef.current &&
        !drawerRef.current.contains(e.target)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      // ✅ Cleanup timeout on unmount
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, [onClose, showTestAlert, showTaxTooltip]);

  const isCouponApplied = couponCode === 'Coupon Applied';

  // Calculate totals with taxes
  const calculateTotals = () => {
    if (isCouponApplied) {
      return {
        baseAmount: 0.68,
        serviceCharge: 0.03,
        gst: 0.29,
        total: 1,
      };
    }

    const baseAmount = cartItems.reduce(
      (sum, item) => sum + parseInt(item.price.replace('₹', '')) * item.qty,
      0
    );

    const serviceCharge = Math.round(baseAmount * 0.05 * 100) / 100;
    const subtotalAfterService = baseAmount + serviceCharge;
    const gst = Math.round(subtotalAfterService * 0.18 * 100) / 100;
    const total = Math.round((baseAmount + serviceCharge + gst) * 100) / 100;

    return {
      baseAmount,
      serviceCharge,
      gst,
      total,
    };
  };

  const { baseAmount, serviceCharge, gst, total } = calculateTotals();

  const handleCheckoutClick = () => {
    setShowTestAlert(true);
  };

  const proceedCheckout = e => {
    e.stopPropagation();
    console.log('111111');
    setShowTestAlert(false);
    onCheckout();
  };

  const handleTooltipClick = e => {
    e.preventDefault();
    e.stopPropagation();

    // Clear existing timeout
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
      tooltipTimeoutRef.current = null;
    }

    setShowTaxTooltip(prev => {
      const newState = !prev;

      if (newState) {
        tooltipTimeoutRef.current = setTimeout(() => {
          setShowTaxTooltip(false);
          tooltipTimeoutRef.current = null;
        }, 4500);
      }

      return newState;
    });
  };

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
              <div className="item-info">
                <div className="item-name">{item.name}</div>
                <div className="item-price">₹{item.price.replace('₹', '')}</div>
              </div>
              <div className="cart-item-controls">
                <button onClick={() => onUpdateQty(item, -1)}>
                  <FaMinus />
                </button>
                <span className="item-qty">{item.qty}</span>
                <button onClick={() => onUpdateQty(item, 1)}>
                  <FaPlus />
                </button>
                <div className="item-total">
                  ₹{parseInt(item.price.replace('₹', '')) * item.qty}
                </div>
              </div>
            </li>
          ))}
        </ul>

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

        <div className="cart-footer">
          <div className="checkout-row">
            <div className="total-section">
              <strong>Total: ₹{total}</strong>
              <div className="tax-info">
                <button
                  className="tax-info-btn"
                  onClick={handleTooltipClick}
                  aria-label="Show tax breakdown"
                  type="button"
                >
                  <FaInfoCircle size={14} />
                </button>
                {showTaxTooltip && (
                  <div className="tax-tooltip">
                    <div className="tooltip-header">Inclusive of taxes</div>
                    <div className="tax-breakdown">
                      <div className="tax-line">
                        <span>Base Amount:</span>
                        <span>₹{baseAmount.toFixed(2)}</span>
                      </div>
                      <div className="tax-line">
                        <span>Service Charge (5%):</span>
                        <span>₹{serviceCharge.toFixed(2)}</span>
                      </div>
                      <div className="tax-line">
                        <span>GST (18%):</span>
                        <span>₹{gst.toFixed(2)}</span>
                      </div>
                      <div className="tax-line total-line">
                        <span>
                          <strong>Total:</strong>
                        </span>
                        <span>
                          <strong>₹{total.toFixed(2)}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button className="checkout-btn" onClick={handleCheckoutClick}>
              Checkout
            </button>
          </div>
        </div>
      </div>

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
