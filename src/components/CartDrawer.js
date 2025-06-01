import React from "react";
import "../assets/menuPage.css";

export default function CartDrawer({ cart, setCart, onClose }) {
  const items = Object.values(cart);
  const total = items.reduce(
    (sum, item) =>
      sum + parseFloat(item.price.replace("₹", "")) * item.quantity,
    0
  );

  const increaseQty = (id) => {
    setCart((prev) => ({
      ...prev,
      [id]: { ...prev[id], quantity: prev[id].quantity + 1 },
    }));
  };

  const decreaseQty = (id) => {
    setCart((prev) => {
      const q = prev[id].quantity - 1;
      if (q <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: { ...prev[id], quantity: q } };
    });
  };

  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h4>Your Cart</h4>
          <button onClick={onClose}>×</button>
        </div>
        {items.length === 0 ? (
          <p className="empty-cart">Cart is empty</p>
        ) : (
          <>
            

              <ul className="cart-items">
                {items.map((item) => (
                  <li key={item.id} className="cart-item">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-controls">
                      <button onClick={() => decreaseQty(item.id)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => increaseQty(item.id)}>+</button>
                    </div>
                    <div className="cart-item-price">
                      ₹{parseFloat(item.price.replace("₹", "")) * item.quantity}
                    </div>
                  </li>
                ))}
              </ul>
            
            <div className="cart-footer">
              <div>Total: ₹{total}</div>
              <button className="checkout-btn">Proceed to Checkout</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
