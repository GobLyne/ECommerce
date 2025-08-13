import React from 'react';
import { useCart } from '../context/cartContext';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';

const PaymentPage = () => {
  const { cart, getCartTotal, clearCart } = useCart();

  const cartItems = cart.items || [];
  const total = getCartTotal();

  const handlePayment = async () => {
    // Simulate payment processing
    alert('Payment successful! Order has been placed.');
    await clearCart();
  };

  if (cartItems.length === 0) {
    return (
      <div className="payment-empty">
        <h2>No items to pay for</h2>
        <Link to="/"><Button label="Continue Shopping" /></Link>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <h1>Payment</h1>

      <div className="order-summary">
        <h3>Order Summary</h3>
        {cartItems.map((item) => (
          <div key={item.product._id} className="payment-item">
            <span>{item.quantity}x {item.product.name}</span>
            <span>RM {(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="payment-total">
          <strong>Total: RM {total.toFixed(2)}</strong>
        </div>
      </div>

      <div className="payment-form">
        <h3>Payment Details</h3>
        <p>Payment integration is not yet implemented.</p>
        <Button
          label="Complete Payment"
          icon="pi pi-credit-card"
          className="p-button-success"
          onClick={handlePayment}
        />
      </div>
    </div>
  );
};

export default PaymentPage;
