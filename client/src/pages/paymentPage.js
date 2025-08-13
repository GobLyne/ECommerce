import React, { useState } from 'react';
import { useCart } from '../context/cartContext';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Link } from 'react-router-dom';

const PaymentPage = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [billingInfo, setBillingInfo] = useState({
    email: '',
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    state: ''
  });
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const cartItems = cart.items || [];
  const subtotal = getCartTotal();
  const tax = subtotal * 0.1;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + tax + shipping;

  const paymentMethods = [
    { label: 'Credit or Debit Card', value: 'card', icon: 'pi pi-credit-card' },
    { label: 'PayPal', value: 'paypal', icon: 'pi pi-paypal' },
    { label: 'Bank Transfer', value: 'bank', icon: 'pi pi-building' }
  ];

  const malaysianStates = [
    'Johor', 'Kedah', 'Kelantan', 'Kuala Lumpur', 'Labuan', 'Malacca',
    'Negeri Sembilan', 'Pahang', 'Penang', 'Perak', 'Perlis', 'Putrajaya',
    'Sabah', 'Sarawak', 'Selangor', 'Terengganu'
  ].map(state => ({ label: state, value: state }));

  const handleInputChange = (field, value, section = 'billingInfo') => {
    if (section === 'billingInfo') {
      setBillingInfo(prev => ({ ...prev, [field]: value }));
    } else {
      setCardInfo(prev => ({ ...prev, [field]: value }));
    }
  };

  const handlePayment = async () => {
    // Simulate payment processing
    alert('Payment successful! Order confirmation will be sent to your email.');
    await clearCart();
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="empty-checkout">
            <div className="empty-icon">
              <i className="pi pi-shopping-cart" style={{ fontSize: '3rem', color: '#ddd' }}></i>
            </div>
            <h2>Your cart is empty</h2>
            <p>Add items to your cart to continue with checkout</p>
            <Link to="/">
              <Button label="Continue Shopping" icon="pi pi-arrow-left" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <div className="checkout-steps">
            <div className="step active">
              <span className="step-number">1</span>
              <span>Shipping</span>
            </div>
            <div className="step active">
              <span className="step-number">2</span>
              <span>Payment</span>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <span>Review</span>
            </div>
          </div>
        </div>

        <div className="checkout-content">
          <div className="checkout-main">
            {/* Shipping Address Section */}
            <div className="checkout-section">
              <div className="section-header">
                <h3><i className="pi pi-map-marker"></i> Shipping Address</h3>
              </div>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Email Address</label>
                  <InputText
                    value={billingInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                    className="form-input"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Full Name</label>
                  <InputText
                    value={billingInfo.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    className="form-input"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Address</label>
                  <InputText
                    value={billingInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Street address"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <InputText
                    value={billingInfo.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="City"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Postal Code</label>
                  <InputText
                    value={billingInfo.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    placeholder="Postal code"
                    className="form-input"
                  />
                </div>
                <div className="form-group full-width">
                  <label>State</label>
                  <Dropdown
                    value={billingInfo.state}
                    onChange={(e) => handleInputChange('state', e.value)}
                    options={malaysianStates}
                    placeholder="Select State"
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="checkout-section">
              <div className="section-header">
                <h3><i className="pi pi-credit-card"></i> Payment Method</h3>
              </div>

              <div className="payment-methods">
                {paymentMethods.map(method => (
                  <div
                    key={method.value}
                    className={`payment-method ${paymentMethod === method.value ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod(method.value)}
                  >
                    <div className="method-content">
                      <i className={method.icon}></i>
                      <span>{method.label}</span>
                    </div>
                    <div className="radio-indicator">
                      {paymentMethod === method.value && <i className="pi pi-check"></i>}
                    </div>
                  </div>
                ))}
              </div>

              {paymentMethod === 'card' && (
                <div className="card-details">
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label>Card Number</label>
                      <InputText
                        value={cardInfo.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', e.target.value, 'cardInfo')}
                        placeholder="1234 5678 9012 3456"
                        className="form-input"
                        maxLength="19"
                      />
                    </div>
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <InputText
                        value={cardInfo.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value, 'cardInfo')}
                        placeholder="MM/YY"
                        className="form-input"
                        maxLength="5"
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <InputText
                        value={cardInfo.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value, 'cardInfo')}
                        placeholder="123"
                        className="form-input"
                        maxLength="4"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Cardholder Name</label>
                      <InputText
                        value={cardInfo.cardholderName}
                        onChange={(e) => handleInputChange('cardholderName', e.target.value, 'cardInfo')}
                        placeholder="Name on card"
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div className="paypal-info">
                  <p>You will be redirected to PayPal to complete your payment.</p>
                </div>
              )}

              {paymentMethod === 'bank' && (
                <div className="bank-info">
                  <p>Bank transfer details will be provided after order confirmation.</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="checkout-sidebar">
            <div className="order-summary">
              <h3>Order Summary</h3>

              <div className="summary-items">
                {cartItems.map((item) => (
                  <div key={item.product._id} className="summary-item">
                    <div className="item-image">
                      <img src={item.product.image} alt={item.product.name} />
                      <span className="quantity-badge">{item.quantity}</span>
                    </div>
                    <div className="item-details">
                      <span className="item-name">{item.product.name}</span>
                      <span className="item-price">RM {(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary-totals">
                <div className="total-line">
                  <span>Subtotal:</span>
                  <span>RM {subtotal.toFixed(2)}</span>
                </div>
                <div className="total-line">
                  <span>Shipping:</span>
                  <span>{shipping === 0 ? 'FREE' : `RM ${shipping.toFixed(2)}`}</span>
                </div>
                <div className="total-line">
                  <span>Tax:</span>
                  <span>RM {tax.toFixed(2)}</span>
                </div>
                <div className="total-divider"></div>
                <div className="total-line final-total">
                  <span>Total:</span>
                  <span>RM {total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                label="Complete Order"
                icon="pi pi-check"
                className="complete-order-btn"
                onClick={handlePayment}
                disabled={!billingInfo.email || !billingInfo.fullName || !billingInfo.address}
              />

              <div className="security-badges">
                <div className="badge">
                  <i className="pi pi-shield"></i>
                  <span>SSL Secured</span>
                </div>
                <div className="badge">
                  <i className="pi pi-lock"></i>
                  <span>256-bit Encryption</span>
                </div>
              </div>
            </div>

            <Link to="/cart" className="back-to-cart">
              <i className="pi pi-arrow-left"></i>
              <span>Return to cart</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
