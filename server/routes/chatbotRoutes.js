const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');

// Gemini AI integration - using global fetch (Node.js 18+)
const geminiApiCall = async (prompt) => {
  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('Gemini API Error:', error);
    return 'Sorry, I am experiencing technical difficulties. Please try again later.';
  }
};

// Get store context (products, user cart, etc.) for AI
const getStoreContext = async (userId = null) => {
  try {
    // Get all products
    const products = await Product.find();

    // Get user cart if authenticated
    let cart = null;
    if (userId) {
      cart = await Cart.findOne({ user: userId }).populate('items.product');
    }

    // Build context
    const context = {
      availableProducts: products.map(p => ({
        name: p.name,
        price: p.price,
        category: p.category,
        description: p.description,
        inStock: p.stock > 0,
        stock: p.stock
      })),
      userCart: cart ? cart.items.map(item => ({
        product: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        total: item.product.price * item.quantity
      })) : [],
      cartTotal: cart ? cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0) : 0,
      totalProducts: products.length,
      categories: [...new Set(products.map(p => p.category).filter(Boolean))]
    };

    return context;
  } catch (error) {
    console.error('Error getting store context:', error);
    return {
      availableProducts: [],
      userCart: [],
      cartTotal: 0,
      totalProducts: 0,
      categories: []
    };
  }
};

// Main chatbot endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get store context
    const storeContext = await getStoreContext(userId);

    // Build enhanced prompt with store context
    const systemPrompt = `You are a helpful e-commerce assistant for an online store. You have access to the following store information:

AVAILABLE PRODUCTS:
${storeContext.availableProducts.map(p =>
  `- ${p.name}: RM${p.price} (${p.category || 'No category'}) - ${p.inStock ? `${p.stock} in stock` : 'Out of stock'}`
).join('\n')}

PRODUCT CATEGORIES: ${storeContext.categories.join(', ')}

${userId && storeContext.userCart.length > 0 ? `
USER'S CURRENT CART:
${storeContext.userCart.map(item =>
  `- ${item.quantity}x ${item.product} - RM${item.total.toFixed(2)}`
).join('\n')}
Cart Total: RM${storeContext.cartTotal.toFixed(2)}
` : userId ? 'USER\'S CART: Empty' : ''}

INSTRUCTIONS:
- Help users find products, answer questions about items, pricing, and availability
- Provide product recommendations based on their needs
- Help with cart-related questions and checkout guidance
- Be friendly, helpful, and concise
- If asked about products not in our store, politely explain we don't carry them and suggest alternatives
- For cart operations, guide users to use the website interface
- Always mention prices in Malaysian Ringgit (RM)
- If users ask about shipping, mention we offer free shipping for orders over RM100

USER MESSAGE: ${message}

IMPORTANT: Format your response using Markdown. Use lists, bold, italics, tables, and other Markdown features to make your answer visually appealing and easy to read. For product lists, use bullet points or tables. For instructions, use numbered lists. For totals, use bold. Do not include any code blocks unless asked. Do not explain Markdown, just use it.

Please provide a helpful response in Markdown:`;

    const aiResponse = await geminiApiCall(systemPrompt);

    res.json({
      message: aiResponse,
      context: {
        hasProducts: storeContext.totalProducts > 0,
        hasCartItems: storeContext.userCart.length > 0,
        cartTotal: storeContext.cartTotal
      }
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Sorry, I am experiencing technical difficulties. Please try again later.' });
  }
});

// Get suggested questions/quick actions
router.get('/suggestions', async (req, res) => {
  try {
    const { userId } = req.query;
    const storeContext = await getStoreContext(userId);

    let suggestions = [
      "What products do you have available?",
      "Can you recommend something popular?",
      "What are your product categories?",
      "Do you offer free shipping?"
    ];

    // Add cart-specific suggestions if user has items
    if (storeContext.userCart.length > 0) {
      suggestions.unshift(
        "What's in my cart?",
        "How much is my total?",
        "Do I qualify for free shipping?"
      );
    }

    // Add category-specific suggestions
    if (storeContext.categories.length > 0) {
      suggestions.push(`Show me ${storeContext.categories[0]} products`);
    }

    res.json({ suggestions: suggestions.slice(0, 6) });
  } catch (error) {
    console.error('Suggestions error:', error);
    res.json({ suggestions: ["How can I help you today?"] });
  }
});

// Get quick product search
router.post('/search-products', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    }).limit(5);

    res.json({
      products: products.map(p => ({
        id: p._id,
        name: p.name,
        price: p.price,
        category: p.category,
        inStock: p.stock > 0,
        stock: p.stock
      }))
    });

  } catch (error) {
    console.error('Product search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;
