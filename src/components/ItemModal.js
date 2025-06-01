import React, { useEffect, useRef } from "react";
import { FiX } from "react-icons/fi"; // prettier close icon

export default function ItemModal({ item, onClose, onAdd }) {
  const modalRef = useRef();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!item) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box" ref={modalRef}>
        <button className="modal-close" onClick={onClose}>
          <FiX size={22} />
        </button>

        <img src={item.image} alt={item.name} className="modal-img" />
        <h2 style={{ margin: "10px 0" }}>{item.name}</h2>
        <p style={{ color: "#666", fontSize: "0.9rem" }}>{item.description}</p>
        <p style={{ fontWeight: "bold", fontSize: "1rem", margin: "10px 0" }}>
          {item.price}
        </p>

        <button className="modal-add-btn" onClick={() => onAdd(item)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
