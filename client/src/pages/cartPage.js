import React from 'react';
import { useCart } from '../context/cartContext';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import '../styles/cartPage.css';

const CartPage = () => {
  const { cart, removeFromCart, getCartTotal, clearCart } = useCart();

  const cartItems = cart.items || [];
  const subtotal = getCartTotal();
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty</h2>
        <p>Add some products to get started!</p>
        <Link to="/">
          <Button label="Shop Now" icon="pi pi-shopping-bag" />
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <div className="receipt">
        <h1 className="receipt-header">Your Order</h1>

        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.product._id} className="cart-item">
              <img src={item.product.image} alt={item.product.name} className="product-image-cart" />
              <div className="item-details">
                <span className="item-name">{item.quantity} x {item.product.name}</span>
                <span className="item-price">RM {(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
              <Button
                icon="pi pi-trash"
                className="p-button-danger p-button-sm"
                onClick={() => removeFromCart(item.product._id)}
                tooltip="Remove item"
              />
            </div>
          ))}
        </div>

        <div className="receipt-summary">
          <div className="summary-line">
            <span>Subtotal:</span>
            <span>RM {subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-line">
            <span>Tax (10%):</span>
            <span>RM {tax.toFixed(2)}</span>
          </div>
          <div className="summary-line total">
            <span>Total:</span>
            <span>RM {total.toFixed(2)}</span>
          </div>
        </div>

        <div className="receipt-actions">
          <Button
            label="Clear Cart"
            icon="pi pi-trash"
            className="p-button-outlined p-button-danger"
            onClick={clearCart}
          />
          <Link to="/payment">
            <Button
              label="Proceed to Payment"
              icon="pi pi-credit-card"
              className="p-button-success"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
