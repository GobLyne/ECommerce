import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { UserContext } from './userContext';

const ChatbotContext = createContext();

export const useChatbot = () => {
  return useContext(ChatbotContext);
};

export const ChatbotProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(UserContext);

  const sendMessage = useCallback(async (message) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/chatbot/chat', {
        message,
        userId: user?.id
      });
      return response.data;
    } catch (error) {
      console.error('Chatbot error:', error);
      throw new Error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const getSuggestions = useCallback(async () => {
    try {
      const response = await axios.get(`/api/chatbot/suggestions${user ? `?userId=${user.id}` : ''}`);
      return response.data.suggestions;
    } catch (error) {
      console.error('Error loading suggestions:', error);
      return [];
    }
  }, [user]);

  const searchProducts = useCallback(async (query) => {
    try {
      const response = await axios.post('/api/chatbot/search-products', { query });
      return response.data.products;
    } catch (error) {
      console.error('Product search error:', error);
      return [];
    }
  }, []);

  const value = {
    sendMessage,
    getSuggestions,
    searchProducts,
    isLoading
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
};

export { ChatbotContext };
