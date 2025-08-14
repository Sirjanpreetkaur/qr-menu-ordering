import React, { useState, useMemo, useEffect } from 'react';
import Header from './Header';
import MenuGrid from './MenuGrid';
import CartDrawer from './CartDrawer';
import OrderSuccess from './OrderSuccess';
import Logo from '../../src/assets/images/Dhabba_Logo.jpeg';

// Move utility function outside component
const calculateOrderTotal = (cartItems, couponCode) => {
  const baseAmount = cartItems.reduce(
    (sum, item) => sum + parseInt(item.price.replace('₹', '')) * item.qty,
    0
  );

  if (couponCode === 'Coupon Applied') {
    return {
      baseAmount: 0.68,
      serviceCharge: 0.03,
      gst: 0.29,
      total: 1,
    };
  }

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

export default function MenuPage() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [placedItems, setPlacedItems] = useState([]);
  const [couponCode, setCouponCode] = useState('');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    window.history.replaceState({}, document.title, window.location.pathname);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  function handleCheckout() {
    if (cartItems.length === 0) {
      alert('Cart is empty.');
      return;
    }

    const { baseAmount, serviceCharge, gst, total } = calculateOrderTotal(
      cartItems,
      couponCode
    );

    const options = {
      key: process.env.REACT_APP_TEST_RAZORPAY_KEY_ID, // Fixed: removed escape characters
      amount: total * 100, // in paise - Fixed: removed escape characters
      currency: 'INR',
      name: 'Debuggers Da Dhabba',
      description: 'Food order payment',
      image: Logo,
      handler: function (response) {
        const newUrl = `${window.location.pathname}?payment_id=${response.razorpay_payment_id}`; // Fixed: removed escape characters
        window.history.pushState({}, '', newUrl);
        // Proceed to show success
        setIsCartOpen(false);
        setTimeout(() => {
          setPlacedItems(cartItems);
          setShowSuccess(true);
          setCartItems([]);
        }, 300);
      },
      prefill: {
        name: '',
        email: '',
        contact: '',
      },
      notes: {
        order_items: cartItems // Fixed: removed escape characters
          .map(item => `${item.qty}x ${item.name}`) // Fixed: removed escape characters
          .join(', '),
        base_amount: baseAmount, // Fixed: removed escape characters
        service_charge: serviceCharge, // Fixed: removed escape characters
        gst: gst,
        total_amount: total, // Fixed: removed escape characters
        coupon_applied: couponCode === 'Coupon Applied' ? 'Yes' : 'No', // Fixed: removed escape characters
      },
      method: {
        netbanking: false,
        card: true,
        upi: true,
        wallet: false,
        emi: false,
        paylater: false,
      },
      theme: {
        color: '#528FF0',
      },
      modal: {
        ondismiss: function () {
          console.warn('⚠️ Razorpay payment popup was closed by the user.');
          alert('Payment window closed. You can retry payment from your cart.');
          setIsCartOpen(true);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      console.error('Payment failed:', response.error);
    });

    rzp.open();
  }

  function handleAddToCart(item) {
    const existing = cartItems.find(i => i.name === item.name);
    if (existing) {
      setCartItems(
        cartItems.map(i =>
          i.name === item.name ? { ...i, qty: i.qty + 1 } : i
        )
      );
    } else {
      setCartItems([...cartItems, { ...item, qty: 1 }]);
    }
    setIsCartOpen(true);
  }

  function handleUpdateQty(item, change) {
    const updated = cartItems
      .map(i => {
        if (i.name === item.name) {
          const newQty = i.qty + change;
          return newQty > 0 ? { ...i, qty: newQty } : null;
        }
        return i;
      })
      .filter(Boolean);
    setCartItems(updated);
  }

  function handleBackToMenu() {
    setShowSuccess(false);
  }

  return (
    <>
      {showSuccess ? (
        <OrderSuccess
          cartItems={placedItems}
          onBack={handleBackToMenu}
          couponApplied={couponCode === 'Coupon Applied'}
        />
      ) : (
        <>
          <Header />
          <MenuGrid onItemAddClick={handleAddToCart} />
          {isCartOpen && cartItems.length > 0 && (
            <CartDrawer
              cartItems={cartItems}
              onClose={() => setIsCartOpen(false)}
              onUpdateQty={handleUpdateQty}
              onCheckout={handleCheckout}
              setCouponCode={setCouponCode}
              couponCode={couponCode}
            />
          )}
        </>
      )}
    </>
  );
}
