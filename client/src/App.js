import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import './styles/App.css';
import ProductCard from './components/productCard';
import ChatbotEnhanced from './components/ChatbotEnhanced';
import CartPage from './pages/cartPage';
import PaymentPage from './pages/paymentPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { useCart } from './context/cartContext';
import { UserContext } from './context/userContext';
import { ChatbotProvider } from './context/chatbotContext';

const API_BASE = process.env.REACT_APP_API_BASE || '';

// Protected Route Component
const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, getCartItemCount } = useCart();

  useEffect(() => {
    axios.get(`${API_BASE}/api/products`)
      .then(res => {
        setProducts(res.data);
        setFilteredProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Product load error:', err?.response?.data || err.message);
        setError('Failed to load products');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product);
      // Success feedback is handled in the ProductCard component
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading amazing products...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <i className="pi pi-exclamation-triangle"></i>
      <p>{error}</p>
    </div>
  );

  return (
    <div className="homepage">
      <div className="homepage-header">
        <div className="header-content">
          <h1>Discover Amazing Products</h1>
          <p>Shop the latest collection of premium products at unbeatable prices</p>
          <div className="search-bar">
            <i className="pi pi-search"></i>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>

      <div className="products-section">
        <div className="section-header">
          <h2>Featured Products</h2>
          <p>{filteredProducts.length} products {searchTerm ? `found for "${searchTerm}"` : 'available'}</p>
        </div>

        <div className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={() => handleAddToCart(product)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function App() {
  const { user, logout } = useContext(UserContext);
  const { getCartItemCount } = useCart();

  return (
    <div className="app-container">
      <header className="site-header">
        <Link to="/" className="logo">
          <i className="pi pi-shopping-bag"></i>
          MyShop
        </Link>
        <nav>
          {user ? (
            <>
              <span className="user-welcome">
                <i className="pi pi-user"></i>
                Welcome, {user.username}!
              </span>
              <Link to="/cart" className="cart-link">
                <Button
                  icon="pi pi-shopping-cart"
                  className="p-button-text cart-button"
                  badge={getCartItemCount() > 0 ? getCartItemCount().toString() : null}
                />
                <span className="cart-text">Cart</span>
              </Link>
              <Button
                label="Logout"
                icon="pi pi-sign-out"
                className="p-button-text logout-button"
                onClick={logout}
              />
            </>
          ) : (
            <>
              <Link to="/login">
                <Button label="Login" icon="pi pi-sign-in" className="p-button-outlined login-button" />
              </Link>
              <Link to="/register">
                <Button label="Register" icon="pi pi-user-plus" className="p-button register-button" />
              </Link>
            </>
          )}
        </nav>
      </header>
      <main className="main-content">
        <Routes>
          <Route path="/" element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          } />
          <Route path="/login" element={
            user ? <Navigate to="/" /> : <LoginPage />
          } />
          <Route path="/register" element={
            user ? <Navigate to="/" /> : <RegisterPage />
          } />
          <Route path="/cart" element={
            <PrivateRoute>
              <CartPage />
            </PrivateRoute>
          } />
          <Route path="/payment" element={
            <PrivateRoute>
              <PaymentPage />
            </PrivateRoute>
          } />
        </Routes>
      </main>
      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>MyShop</h4>
            <p>Your trusted online shopping destination</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/cart">Cart</Link>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <i className="pi pi-facebook"></i>
              <i className="pi pi-twitter"></i>
              <i className="pi pi-instagram"></i>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} MyShop. All rights reserved.
        </div>
      </footer>
      {/* Show chatbot only if user is logged in and not on login/register pages */}
      {user && window.location.pathname !== '/login' && window.location.pathname !== '/register' && (
        <ChatbotEnhanced />
      )}
    </div>
  );
}

export default App;
