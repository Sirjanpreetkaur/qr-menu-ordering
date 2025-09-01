import React, { useEffect, useRef } from 'react';
import '../assets/css/menuPage.css';
import { MenuOption } from '../data/menuData.jsx';
import { useParams, Link } from 'react-router-dom';
import Img from '../../src/assets/images/Dhabba_Logo.jpeg';

export default function Header() {
  const { tableId, category } = useParams();
  const activeRef = useRef(null);

  const activeIndex = MenuOption.findIndex(
    item => item.url === category || (!category && item.url === 'home')
  );

  let reorderedCategories = [...MenuOption];

  if (
    activeIndex > -1 &&
    MenuOption[activeIndex].url !== 'home' // don't move "all"
  ) {
    const [activeItem] = reorderedCategories.splice(activeIndex, 1);
    reorderedCategories.splice(1, 0, activeItem); // put active at 2nd
  }

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
      <div className="table-banner">
        🍽️ You are placing an order for <strong>Table {tableId}</strong>
      </div>

      <div className="header-top">
        <div className="logo-section">
          <img src={Img} alt="Debuggers Da Dhabba" className="logo" />
          <h1 className="restaurant-name">Debuggers Da Dhabba</h1>
        </div>
      </div>

      <section className="categories">
        <div className="categories-container">
          {reorderedCategories.map((item, index) => {
            const isActive =
              item.url === category || (!category && item.url === 'home');

            return (
              <div
                key={index}
                ref={isActive ? activeRef : null}
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
