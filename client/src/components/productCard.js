import { Button } from 'primereact/button';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import '../styles/App.css';

const ProductCard = ({ product, onAddToCart }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsAdding(true);
    try {
      await onAddToCart();
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR'
    }).format(price);
  };

  return (
    <div className="product-card-modern">
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-image-modern"
        />
        <div className="product-badges">
          {product.discount && (
            <span className="badge discount">-{product.discount}%</span>
          )}
          {product.isNew && (
            <span className="badge new">New</span>
          )}
        </div>
        <div className="quick-actions">
          <Button
            icon="pi pi-heart"
            className="p-button-rounded p-button-text quick-action-btn"
            tooltip="Add to Wishlist"
          />
          <Button
            icon="pi pi-eye"
            className="p-button-rounded p-button-text quick-action-btn"
            tooltip="Quick View"
          />
        </div>
      </div>

      <div className="product-info">
        <div className="product-category">
          {product.category || 'Electronics'}
        </div>
        <h3 className="product-title">{product.name}</h3>
        <p className="product-description">{product.description}</p>

        <div className="rating-section">
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <i
                key={star}
                className={`pi pi-star${star <= (product.rating || 4) ? '-fill' : ''}`}
              />
            ))}
          </div>
          <span className="rating-text">({product.reviews || 127} reviews)</span>
        </div>

        <div className="price-section">
          {product.originalPrice && (
            <span className="original-price">{formatPrice(product.originalPrice)}</span>
          )}
          <span className="current-price">{formatPrice(product.price)}</span>
        </div>

        <div className="product-actions">
          <Button
            label={
              isAdded ? "Added!" :
              isAdding ? "Adding..." :
              user ? "Add to Cart" : "Login to Add"
            }
            icon={
              isAdded ? "pi pi-check" :
              isAdding ? "pi pi-spin pi-spinner" :
              "pi pi-shopping-cart"
            }
            className={`add-to-cart-modern ${isAdded ? 'success' : ''}`}
            onClick={handleAddToCart}
            disabled={isAdding}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;