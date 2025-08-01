import React, { useState, useMemo, useEffect } from "react";
import Header from "./Header";
import MenuGrid from "./MenuGrid";
import CartDrawer from "./CartDrawer";
import OrderSuccess from "./OrderSuccess";

export default function MenuPage() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [placedItems, setPlacedItems] = useState([]);


  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);


  const totalAmount = useMemo(() => {
    return cartItems.reduce(
      (sum, item) =>
        sum + parseInt(item.price.replace("₹", "")) * item.qty,
      0
    );
  }, [cartItems]);

  function handleCheckout() {
    const amount = cartItems.reduce(
      (sum, item) => sum + parseInt(item.price.replace("₹", "")) * item.qty,
      0
    );

    if (amount <= 0) {
      alert("Cart is empty.");
      return;
    }

    const options = {
      key: "rzp_live_8xfLoeGJ5OqzWY", // Replace with your Razorpay key
      amount: amount * 100, // in paise
      currency: "INR",
      name: "Restaurant Order",
      description: "Food order payment",
      image: "/logo192.png", // optional logo
      handler: function (response) {
        alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
        // Proceed to show success
        setIsCartOpen(false);
        setTimeout(() => {
          setPlacedItems(cartItems);
          setShowSuccess(true);
          setCartItems([]);
        }, 300);
      },
      prefill: {
        name: "",
        email: "",
        contact: "",
      },
      notes: {
        order_items: cartItems.map((item) => `${item.qty}x ${item.name}`).join(", "),
      },
      theme: {
        color: "#528FF0",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (response) {
      console.error("Payment failed:", response.error);
      alert("Payment failed. Please try again.");
    });

    rzp.open();
  }

  function handleAddToCart(item) {
    const existing = cartItems.find((i) => i.name === item.name);
    if (existing) {
      setCartItems(
        cartItems.map((i) =>
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
      .map((i) => {
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
        <OrderSuccess cartItems={placedItems} onBack={handleBackToMenu} />
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
              totalAmount={totalAmount}
            />
          )}
        </>
      )}
    </>
  );
}
