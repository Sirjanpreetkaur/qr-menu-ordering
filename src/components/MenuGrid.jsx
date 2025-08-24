import React, { useState } from 'react';
import { menuItems } from '../data/menuData.jsx';
import { useParams } from 'react-router-dom';
import ItemModal from './ItemModal';

export default function MenuGrid({ onItemAddClick }) {
  const { category, tableId } = useParams();
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredItems =
    !category || category === 'home'
      ? menuItems
      : menuItems.filter(item => item.category === category);

  return (
    <div className="menu-grid-wrapper">
      <section className="menu-grid-section">
        <div className="menu-grid">
          {filteredItems.map((item, index) => (
            <div key={index} className="menu-card">
              <div className="menu-card-inner">
                <div className="menu-card-img">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="menu-card-top">
                  <div className="menu-card-name">{item.name}</div>
                  <div className="menu-card-price">{item.price}</div>
                </div>
                <div className="menu-card-description">{item.description}</div>
                <button
                  className="menu-card-btn"
                  onClick={() => setSelectedItem(item)}
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ItemModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onAdd={item => {
          onItemAddClick(item);
          setSelectedItem(null);
        }}
      />
    </div>
  );
}
