import React from 'react';
import { useCart } from '../context/cartContext';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import '../styles/cartPage.css';

const CartPage = () => {
  const { cart, removeFromCart, getCartTotal, clearCart, updateQuantity } = useCart();

  const cartItems = cart.items || [];
  const subtotal = getCartTotal();
  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over RM50
  const total = subtotal + tax + shipping;

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="cart-empty">
            <div className="empty-cart-icon">
              <i className="pi pi-shopping-cart" style={{ fontSize: '4rem', color: '#ddd' }}></i>
            </div>
            <h2>Your Shopping Cart is empty</h2>
            <p>Shop today's deals</p>
            <Link to="/">
              <Button
                label="Start Shopping"
                className="shop-now-btn"
                icon="pi pi-shopping-bag"
              />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <span className="item-count">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="cart-content">
          <div className="cart-items-section">
            <div className="cart-items-header">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
            </div>

            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.product?._id || item._id || Math.random()} className="cart-item-card">
                  <div className="item-image-section">
                    {item.product && item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name || 'Product'}
                        className="item-image"
                      />
                    ) : (
                      <div className="item-image-placeholder">
                        <i className="pi pi-image" style={{ fontSize: '2rem', color: '#ccc' }}></i>
                      </div>
                    )}
                  </div>

                  <div className="item-info-section">
                    <h3 className="item-name">{item.product?.name || 'Unknown Product'}</h3>
                    <p className="item-description">
                      {item.product?.description || "Premium quality product"}
                    </p>
                    <div className="item-actions">
                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(item.product?._id || item._id)}
                      >
                        <i className="pi pi-trash"></i> Remove
                      </button>
                      <button className="save-later-btn">
                        <i className="pi pi-heart"></i> Save for later
                      </button>
                    </div>
                  </div>

                  <div className="item-price-section">
                    <span className="item-price">RM {item.product?.price ? item.product.price.toFixed(2) : 'N/A'}</span>
                  </div>

                  <div className="item-quantity-section">
                    <div className="quantity-controls">
                      <button
                        className="qty-btn"
                        onClick={() => handleQuantityChange(item.product?._id || item._id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => handleQuantityChange(item.product?._id || item._id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="item-total-section">
                    <span className="item-total">RM {item.product?.price ? (item.product.price * item.quantity).toFixed(2) : 'N/A'}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <Button
                label="Clear Cart"
                icon="pi pi-trash"
                className="clear-cart-btn"
                onClick={clearCart}
                outlined
              />
              <Link to="/">
                <Button
                  label="Continue Shopping"
                  icon="pi pi-arrow-left"
                  className="continue-shopping-btn"
                  outlined
                />
              </Link>
            </div>
          </div>

          <div className="cart-summary-section">
            <div className="summary-card">
              <h3>Order Summary</h3>

              <div className="summary-details">
                <div className="summary-line">
                  <span>Subtotal ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''}):</span>
                  <span>RM {subtotal.toFixed(2)}</span>
                </div>

                <div className="summary-line">
                  <span>Shipping & handling:</span>
                  <span>{shipping === 0 ? 'FREE' : `RM ${shipping.toFixed(2)}`}</span>
                </div>

                <div className="summary-line">
                  <span>Tax (10%):</span>
                  <span>RM {tax.toFixed(2)}</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-line total-line">
                  <span>Order total:</span>
                  <span>RM {total.toFixed(2)}</span>
                </div>
              </div>

              {shipping > 0 && (
                <div className="shipping-notice">
                  <i className="pi pi-info-circle"></i>
                  <span>Add RM {(50 - subtotal).toFixed(2)} more to qualify for FREE shipping</span>
                </div>
              )}

              <Link to="/payment">
                <Button
                  label="Proceed to Checkout"
                  icon="pi pi-arrow-right"
                  className="checkout-btn"
                  iconPos="right"
                />
              </Link>

              <div className="security-notice">
                <i className="pi pi-shield"></i>
                <span>Your information is protected by SSL encryption</span>
              </div>
            </div>

            <div className="recommended-section">
              <h4>Customers who bought items in your cart also bought</h4>
              <div className="recommended-items">
                <div className="recommended-item">
                  <div className="rec-placeholder">
                    <i className="pi pi-image"></i>
                  </div>
                  <span>Related Product</span>
                  <span className="rec-price">RM 29.99</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
