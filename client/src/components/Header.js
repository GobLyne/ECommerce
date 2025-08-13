// components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'primereact/button';
import './Header.css';

const Header = () => (
  <header>
    <Link to="/">🛒 MyShop</Link>
    <nav>
      <Link to="/">
        <Button label="Home" icon="pi pi-home" className="p-button-text" />
      </Link>
      <Link to="/cart">
        <Button label="Cart" icon="pi pi-shopping-cart" className="p-button-text" />
      </Link>
    </nav>
  </header>
);

export default Header;
