import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../assets/menuPage.css";
import Header from "./Header.js";
import MenuGrid from "./MenuGrid.js";
import ItemModal from "./ItemModal";
import CartDrawer from "./CartDrawer.js";

export default function MenuPage() {
  const [cart, setCart] = useState({});
  const [selectedItem, setSelectedItem] = useState(null); // for modal
  const [showCartDrawer, setShowCartDrawer] = useState(false);

const addToCart = (item, options = {}) => {
  const id = item.id;
  setCart(prev => {
    const prevQty = prev[id]?.quantity || 0;
    return {
      ...prev,
      [id]: {
        ...item,
        ...options,
        quantity: prevQty + 1,
      }
    };
  });
  setSelectedItem(null);
  setShowCartDrawer(true); // show drawer when item is added
};


  return (
    <>
      <Header />
      <MenuGrid onItemAddClick={setSelectedItem} />
      {selectedItem && (
        <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} onAdd={addToCart} />
        
      )}
      {showCartDrawer && (
  <CartDrawer
    cart={cart}
    setCart={setCart}
    onClose={() => setShowCartDrawer(false)}
  />
)}

    </>
     );
}
