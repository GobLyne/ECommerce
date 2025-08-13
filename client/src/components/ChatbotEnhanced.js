import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Badge } from 'primereact/badge';
import { Chip } from 'primereact/chip';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';
import { UserContext } from '../context/userContext';
import { useCart } from '../context/cartContext';
import { useChatbot } from '../context/chatbotContext';
import ReactMarkdown from 'react-markdown';
import '../styles/ChatbotEnhanced.css';

const ChatbotEnhanced = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const { user } = useContext(UserContext);
  const { addToCart } = useCart();
  const { sendMessage: sendChatMessage, getSuggestions, searchProducts, isLoading } = useChatbot();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeChatbot();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      const unreadMessages = messages.filter(msg => msg.type === 'bot' && !msg.isRead);
      setUnreadCount(unreadMessages.length);
    }
  }, [isOpen, messages]);

    const initializeChatbot = useCallback(async () => {
    const welcomeMessage = {
      type: 'bot',
      content: `Hello${user ? ` ${user.username}` : ''}! 👋 I'm your AI shopping assistant. I can help you:

🛍️ Find and recommend products
🛒 Check your cart and orders
💰 Compare prices and deals
📦 Track shipping information
❓ Answer any questions about our store

What would you like to do today?`,
      timestamp: new Date(),
      isRead: true
    };

    setMessages([welcomeMessage]);

    try {
      const suggestionsData = await getSuggestions();
      setSuggestions(suggestionsData);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    }
  }, [user, getSuggestions]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeChatbot();
    }
  }, [isOpen, messages.length, initializeChatbot]);

  const handleSendMessage = async (messageText = currentMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      type: 'user',
      content: messageText,
      timestamp: new Date(),
      isRead: true
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');

    try {
      const response = await sendChatMessage(messageText);

      const botMessage = {
        type: 'bot',
        content: response.message,
        timestamp: new Date(),
        context: response.context,
        isRead: isOpen
      };

      setMessages(prev => [...prev, botMessage]);

      // Refresh suggestions
      const newSuggestions = await getSuggestions();
      setSuggestions(newSuggestions);

      // Check if response mentions products to trigger search
      if (messageText.toLowerCase().includes('search') || messageText.toLowerCase().includes('find product')) {
        setShowProductSearch(true);
      }

    } catch (error) {
      const errorMessage = {
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        isError: true,
        isRead: isOpen
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleProductSearch = async (query) => {
    try {
      const results = await searchProducts(query);
      setSearchResults(results);

      const searchMessage = {
        type: 'bot',
        content: results.length > 0
          ? `I found ${results.length} product(s) matching "${query}". You can view them below and add to cart directly!`
          : `Sorry, I couldn't find any products matching "${query}". Try a different search term.`,
        timestamp: new Date(),
        isRead: isOpen,
        hasProducts: results.length > 0
      };

      setMessages(prev => [...prev, searchMessage]);
    } catch (error) {
      console.error('Product search failed:', error);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product);

      const confirmMessage = {
        type: 'bot',
        content: `Great! I've added "${product.name}" to your cart. Would you like to continue shopping or view your cart?`,
        timestamp: new Date(),
        isRead: isOpen
      };

      setMessages(prev => [...prev, confirmMessage]);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const clearChat = () => {
    setMessages([]);
    setSearchResults([]);
    setUnreadCount(0);
    initializeChatbot();
  };

  const markAllAsRead = () => {
    setMessages(prev => prev.map(msg => ({ ...msg, isRead: true })));
    setUnreadCount(0);
  };

  const openChat = () => {
    setIsOpen(true);
    markAllAsRead();
  };

  if (!isOpen) {
    return (
      <div className="chatbot-trigger">
        <Button
          icon="pi pi-comments"
          className="chatbot-trigger-btn"
          onClick={openChat}
          tooltip="Chat with our AI assistant"
          tooltipOptions={{ position: 'left' }}
        />
        <Badge value="AI" className="chatbot-badge" />
        {unreadCount > 0 && (
          <Badge value={unreadCount} className="unread-badge" />
        )}
      </div>
    );
  }

  return (
    <>
      <div className={`chatbot-container ${isMinimized ? 'minimized' : ''}`}>
        <div className="chatbot-header">
          <div className="chatbot-title">
            <i className="pi pi-robot"></i>
            <span>AI Shopping Assistant</span>
            <Badge value="Online" severity="success" className="status-badge" />
          </div>
          <div className="chatbot-actions">
            <Button
              icon="pi pi-search"
              className="p-button-text p-button-sm"
              onClick={() => setShowProductSearch(true)}
              tooltip="Search products"
            />
            <Button
              icon={isMinimized ? "pi pi-window-maximize" : "pi pi-window-minimize"}
              className="p-button-text p-button-sm"
              onClick={() => setIsMinimized(!isMinimized)}
              tooltip={isMinimized ? "Expand" : "Minimize"}
            />
            <Button
              icon="pi pi-refresh"
              className="p-button-text p-button-sm"
              onClick={clearChat}
              tooltip="Clear chat"
            />
            <Button
              icon="pi pi-times"
              className="p-button-text p-button-sm"
              onClick={() => setIsOpen(false)}
              tooltip="Close chat"
            />
          </div>
        </div>

        {!isMinimized && (
          <>
            <div className="chatbot-messages">
              <ScrollPanel style={{ width: '100%', height: '100%' }}>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`message ${message.type} ${message.isError ? 'error' : ''}`}
                  >
                    <div className="message-content">
                      {message.type === 'bot' && (
                        <div className="bot-avatar">
                          <i className="pi pi-robot"></i>
                        </div>
                      )}
                      <div className="message-text">
                        {message.type === 'bot' ? (
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        ) : (
                          message.content
                        )}
                        <div className="message-time">
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                      {message.type === 'user' && (
                        <div className="user-avatar">
                          <i className="pi pi-user"></i>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Product Search Results */}
                {searchResults.length > 0 && (
                  <div className="product-results">
                    <div className="results-header">
                      <h4>Found Products:</h4>
                    </div>
                    {searchResults.map((product, index) => (
                      <Card key={index} className="product-result-card">
                        <div className="product-info">
                          <h5>{product.name}</h5>
                          <p className="product-price">RM {product.price}</p>
                          <p className="product-category">{product.category}</p>
                          <p className="product-stock">
                            {product.inStock ? `${product.stock} in stock` : 'Out of stock'}
                          </p>
                        </div>
                        <Button
                          label="Add to Cart"
                          icon="pi pi-shopping-cart"
                          className="p-button-sm add-to-cart-btn"
                          onClick={() => handleAddToCart(product)}
                          disabled={!product.inStock || !user}
                        />
                      </Card>
                    ))}
                  </div>
                )}

                {isLoading && (
                  <div className="message bot">
                    <div className="message-content">
                      <div className="bot-avatar">
                        <i className="pi pi-robot"></i>
                      </div>
                      <div className="message-text typing">
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </ScrollPanel>
            </div>

            {suggestions.length > 0 && (
              <div className="chatbot-suggestions">
                <div className="suggestions-label">Quick questions:</div>
                <div className="suggestions-list">
                  {suggestions.slice(0, 3).map((suggestion, index) => (
                    <Chip
                      key={index}
                      label={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="suggestion-chip"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="chatbot-input">
              <div className="input-container">
                <InputText
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about our products..."
                  disabled={isLoading}
                  className="message-input"
                />
                <Button
                  icon={isLoading ? "pi pi-spin pi-spinner" : "pi pi-send"}
                  onClick={() => handleSendMessage()}
                  disabled={isLoading || !currentMessage.trim()}
                  className="send-button"
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Product Search Dialog */}
      <Dialog
        header="Search Products"
        visible={showProductSearch}
        style={{ width: '400px' }}
        onHide={() => setShowProductSearch(false)}
        modal
      >
        <div className="search-dialog">
          <InputText
            placeholder="Search for products..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleProductSearch(e.target.value);
                setShowProductSearch(false);
              }
            }}
            className="search-input"
            autoFocus
          />
          <p>Press Enter to search, or type in the chat for AI assistance!</p>
        </div>
      </Dialog>
    </>
  );
};

export default ChatbotEnhanced;
