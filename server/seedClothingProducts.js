const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');

const clothingProducts = [
  {
    name: "Classic White T-Shirt",
    price: 29.99,
    description: "Comfortable cotton t-shirt perfect for everyday wear. Made from 100% organic cotton.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center",
    category: "T-Shirts",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Black", "Gray"]
  },
  {
    name: "Vintage Denim Jacket",
    price: 89.99,
    description: "Classic denim jacket with a vintage wash. Perfect for layering and casual outfits.",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&crop=center",
    category: "Jackets",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blue", "Light Blue", "Dark Blue"]
  },
  {
    name: "Slim Fit Chinos",
    price: 59.99,
    description: "Versatile chino pants with a modern slim fit. Great for both casual and semi-formal occasions.",
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop&crop=center",
    category: "Pants",
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Khaki", "Navy", "Black", "Olive"]
  },
  {
    name: "Cozy Knit Sweater",
    price: 79.99,
    description: "Soft wool blend sweater perfect for cooler weather. Features a classic crew neck design.",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop&crop=center",
    category: "Sweaters",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Cream", "Gray", "Navy", "Burgundy"]
  },
  {
    name: "Casual Button-Up Shirt",
    price: 49.99,
    description: "Lightweight cotton shirt perfect for layering or wearing on its own. Features a relaxed fit.",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop&crop=center",
    category: "Shirts",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Light Blue", "Pink", "Mint"]
  },
  {
    name: "Athletic Joggers",
    price: 45.99,
    description: "Comfortable joggers made from moisture-wicking fabric. Perfect for workouts or lounging.",
    image: "https://images.unsplash.com/photo-1506629905542-b5842f25cd6b?w=400&h=400&fit=crop&crop=center",
    category: "Activewear",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Gray", "Navy", "Charcoal"]
  },
  {
    name: "Floral Summer Dress",
    price: 69.99,
    description: "Light and airy summer dress with a beautiful floral print. Perfect for warm weather occasions.",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop&crop=center",
    category: "Dresses",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Pink", "Blue", "Yellow", "White"]
  },
  {
    name: "Leather Ankle Boots",
    price: 129.99,
    description: "Stylish ankle boots made from genuine leather. Features a comfortable low heel and versatile design.",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center",
    category: "Shoes",
    sizes: ["6", "7", "8", "9", "10", "11"],
    colors: ["Black", "Brown", "Tan"]
  },
  {
    name: "Hooded Sweatshirt",
    price: 55.99,
    description: "Comfortable pullover hoodie made from soft cotton blend. Features a kangaroo pocket and adjustable hood.",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center",
    category: "Hoodies",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Gray", "Black", "Navy", "Maroon"]
  },
  {
    name: "High-Waisted Jeans",
    price: 79.99,
    description: "Classic high-waisted jeans with a flattering fit. Made from premium denim with slight stretch.",
    image: "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=400&h=400&fit=crop&crop=center",
    category: "Jeans",
    sizes: ["24", "26", "28", "30", "32", "34"],
    colors: ["Dark Blue", "Medium Blue", "Light Blue", "Black"]
  },
  {
    name: "Striped Long Sleeve Tee",
    price: 34.99,
    description: "Classic striped long sleeve t-shirt made from soft cotton. Perfect for layering or wearing alone.",
    image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop&crop=center",
    category: "T-Shirts",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black/White", "Navy/White", "Red/White"]
  },
  {
    name: "Blazer Jacket",
    price: 119.99,
    description: "Tailored blazer perfect for professional or semi-formal occasions. Features a modern fit and quality construction.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center",
    category: "Blazers",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Gray", "Charcoal"]
  }
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing products (optional)
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new clothing products
    const insertedProducts = await Product.insertMany(clothingProducts);
    console.log(`Successfully inserted ${insertedProducts.length} clothing products`);

    console.log('Sample products:');
    insertedProducts.slice(0, 3).forEach(product => {
      console.log(`- ${product.name}: $${product.price}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();
