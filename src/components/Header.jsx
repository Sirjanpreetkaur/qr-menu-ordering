import React, { useEffect, useRef } from 'react';
import '../assets/css/menuPage.css';
import { MenuOption } from '../data/menuData.jsx';
import { useParams, Link } from 'react-router-dom';
import Img from '../../src/assets/images/Dhabba_Logo.jpeg';

export default function Header() {
  const { tableId, category } = useParams();
  const activeRef = useRef(null);

  // ✅ Find active category
  const activeIndex = MenuOption.findIndex(
    item => item.url === category || (!category && item.url === 'home')
  );

  let reorderedCategories = [...MenuOption];

  // ✅ Only reorder if activeIndex is valid and not "all"
  if (
    activeIndex > -1 &&
    MenuOption[activeIndex].url !== 'home' // don't move "all"
  ) {
    const [activeItem] = reorderedCategories.splice(activeIndex, 1);
    reorderedCategories.splice(1, 0, activeItem); // put active at 2nd
  }

  // ✅ Scroll into view when active changes
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [category]);

  return (
    <header id="sticky-header" className="header">
      {/* Banner */}
      <div className="table-banner">
        🍽️ You are placing an order for <strong>Table {tableId}</strong>
      </div>

      {/* Logo + Name */}
      <div className="header-top">
        <div className="logo-section">
          <img src={Img} alt="Debuggers Da Dhabba" className="logo" />
          <h1 className="restaurant-name">Debuggers Da Dhabba</h1>
        </div>
      </div>

      {/* Categories */}
      <section className="categories">
        <div className="categories-container">
          {reorderedCategories.map((item, index) => {
            const isActive =
              item.url === category || (!category && item.url === 'home');

            return (
              <div
                key={index}
                ref={isActive ? activeRef : null} // 👈 attach ref only to active
                className={`category ${isActive ? 'active' : ''}`}
              >
                <Link
                  to={
                    item.url.startsWith('/')
                      ? item.url
                      : `/menu/${tableId}/${item.url}`
                  }
                >
                  <img
                    src={
                      item.path ??
                      `https://instalacarte.com/media/cache/emoji_small/emoji/${item.img}?v3`
                    }
                    alt={item.name}
                  />
                  <div className="category-name">{item.name}</div>
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </header>
  );
}
