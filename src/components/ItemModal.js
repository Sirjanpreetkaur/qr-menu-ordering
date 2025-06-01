import React, { useState } from "react";
import "../assets/menuPage.css"; // use your styles

export default function ItemModal({ item, onClose, onAdd }) {
  const [spiceLevel, setSpiceLevel] = useState("normal");

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>×</button>
        <img src={item.image} alt={item.name} className="modal-img" />
        <h2>{item.name}</h2>
        <p>{item.description}</p>
        <div className="modal-option">
          <label>Spice Level:</label>
          <select value={spiceLevel} onChange={e => setSpiceLevel(e.target.value)}>
            <option value="mild">Mild</option>
            <option value="normal">Normal</option>
            <option value="hot">Hot</option>
          </select>
        </div>
        <button className="modal-add-btn" onClick={() => onAdd(item, { spiceLevel })}>
          Add to Cart - {item.price}
        </button>
      </div>
    </div>
  );
}
