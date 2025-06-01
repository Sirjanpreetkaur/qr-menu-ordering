import React, { useState } from "react";
import Header from "./Header";
import MenuGrid from "./MenuGrid";
import CartDrawer from "./CartDrawer";

export default function MenuPage() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  function handleAddToCart(item) {
    const existing = cartItems.find(i => i.name === item.name);
    if (existing) {
      setCartItems(cartItems.map(i =>
        i.name === item.name ? { ...i, qty: i.qty + 1 } : i
      ));
    } else {
      setCartItems([...cartItems, { ...item, qty: 1 }]);
    }
    setIsCartOpen(true);
  }

  function handleUpdateQty(item, change) {
    const updated = cartItems.map(i => {
      if (i.name === item.name) {
        const newQty = i.qty + change;
        return newQty > 0 ? { ...i, qty: newQty } : null;
      }
      return i;
    }).filter(Boolean);
    setCartItems(updated);
  }

  return (
    <>
      <Header />
      <MenuGrid onItemAddClick={handleAddToCart} />
      {isCartOpen && (
        <CartDrawer
          cartItems={cartItems}
          onClose={() => setIsCartOpen(false)}
          onUpdateQty={handleUpdateQty}
        />
      )}
    </>
  );
}
