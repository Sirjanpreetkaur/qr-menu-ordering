import React, { useState } from 'react';
import { menuItems } from '../data/menuData.jsx';
import { useParams } from 'react-router-dom';
import ItemModal from './ItemModal';

export default function MenuGrid({ onItemAddClick }) {
  const { category } = useParams();
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
              <div className="menu-card-img">
                <img src={item.image} alt={item.name} loading="lazy" />
              </div>

              <div className="menu-card-body">
                <h3 className="menu-card-name">{item.name}</h3>
                <p className="menu-card-description">{item.description}</p>
                <div className="menu-card-footer">
                  <span className="menu-card-price">{item.price}</span>
                  <button
                    className="menu-card-btn"
                    onClick={() => setSelectedItem(item)}
                  >
                     Add
                  </button>
                </div>
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
