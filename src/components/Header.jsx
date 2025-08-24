import React from 'react';
import '../assets/menuPage.css';
import { MenuOption } from '../data/menuData.jsx';
import { useParams } from 'react-router-dom';
import Img from '../../src/assets/images/Dhabba_Logo.jpeg';
export default function Header() {
  const { tableId, category } = useParams();

  return (
    <header id="sticky-header" className="header">
      <div className="table-banner">
        You are placing an order for <strong>Table {tableId}</strong>
      </div>
      <div className="header-top">
        <div className="logo-section">
          <img src={Img} alt="Debuggers Da Dhabba" className="logo" />
          <h1 className="restaurant-name">Debuggers Da Dhabba</h1>
        </div>
        {/* <button className="language-btn">English</button> */}
      </div>

      <section className="categories">
        <div className="categories-container">
          {MenuOption?.map((item, index) => {
            const isActive =
              item.url === category || (!category && item.url === 'home');

            return (
              <div
                key={index}
                className={`category ${isActive ? 'active' : ''}`}
              >
                <a href={`/menu/${tableId}/${item.url}`}>
                  <img
                    src={
                      item.path ??
                      `https://instalacarte.com/media/cache/emoji_small/emoji/${item.img}?v3`
                    }
                    alt={item.name}
                  />
                  <div className="category-name">{item.name}</div>
                </a>
              </div>
            );
          })}
        </div>
      </section>
    </header>
  );
}
