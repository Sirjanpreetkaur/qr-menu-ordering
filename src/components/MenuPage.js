import React, { useState } from "react";
import Header from "./Header";
import MenuGrid from "./MenuGrid";
import CartDrawer from "./CartDrawer";
import OrderSuccess from "./OrderSuccess";
import RazorpayUPIPayment from "./RazorpayUPIPayment"

export default function MenuPage() {
const [cartItems, setCartItems] = useState([]);
const [isCartOpen, setIsCartOpen] = useState(false);
const [showSuccess, setShowSuccess] = useState(false);
const [placedItems, setPlacedItems] = useState([]);


function handleCheckout() {
  setIsCartOpen(false);
  setTimeout(() => {
    setPlacedItems(cartItems);      // ✅ Store before clearing
    setShowSuccess(true);           // ✅ Show success screen
    setCartItems([]);               // ✅ Clear only after copying
  }, 300);
}

    console.log("cartItems:", cartItems);


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
        <OrderSuccess  cartItems={placedItems} onBack={handleBackToMenu}/>
      ) : (
        <>
          <Header />

          <MenuGrid onItemAddClick={handleAddToCart} />
          <RazorpayUPIPayment />;
          {isCartOpen && cartItems?.length>0&& (
            <CartDrawer
              cartItems={cartItems}
              onClose={() => setIsCartOpen(false)}
              onUpdateQty={handleUpdateQty}
              onCheckout={handleCheckout}
            />
            
          )}
        </>
      )}
    </>
  );
}
