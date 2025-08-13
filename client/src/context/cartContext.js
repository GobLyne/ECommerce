import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { UserContext } from './userContext';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);

  const loadCart = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await axios.get('/api/cart');
      setCart(response.data);
    } catch (error) {
      console.error('Error loading cart:', error);
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load cart when user changes
  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setCart({ items: [] });
    }
  }, [user, loadCart]);

  const addToCart = async (product) => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      const response = await axios.post('/api/cart/add', {
        productId: product._id,
        quantity: 1
      });
      setCart(response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) return;

    try {
      const response = await axios.post('/api/cart/remove', {
        productId
      });
      setCart(response.data);
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!user) return;

    try {
      const response = await axios.post('/api/cart/update', {
        productId,
        quantity
      });
      setCart(response.data);
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      await axios.delete('/api/cart/clear');
      setCart({ items: [] });
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  const getCartTotal = () => {
    return cart.items?.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0) || 0;
  };

  const getCartItemCount = () => {
    return cart.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      loadCart,
      getCartTotal,
      getCartItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext };
