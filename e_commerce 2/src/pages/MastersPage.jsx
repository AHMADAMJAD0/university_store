import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { MastersProducts as products } from '../data/productsData'; // Import the products from products.js
import { motion } from 'framer-motion';
import "../styles/AllProducts.css";


const categories = ['All', 'Gown', 'Cap', 'Tassel']; // Add 'All' option

const MastersPage = ({ loggedInUser }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [category, setCategory] = useState('All'); // Set default category to 'All'
  const [priceRange, setPriceRange] = useState([0, 100]);
  const navigate = useNavigate();

  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);
  };

  const handlePriceChange = (e) => {
    setPriceRange([0, e.target.value]);
  };

  const filteredProducts = products.filter(
    (product) =>
      (category === 'All' || product.category === category) &&
      product.price >= priceRange[0] &&
      product.price <= priceRange[1]
  );

  const handleQuickReview = (id) => {
    navigate(`/product/${id}`);
  };

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div>
      <Navbar loggedInUser={loggedInUser} onMenuToggle={setMenuOpen} />
      <div
        className={`product-page transition-all duration-300 ${isMenuOpen ? 'mt-64' : ''
          }`}
      >
        <header className="header">
          <img
            src="/BachelorsBg.jpg"
            alt=""
            style={{
              width: '100%',
              height: '100vh',
            }}
          />
        </header>

        <div className="content">
          {/* Filter Bar */}
          <div className="filter-bar">
            <motion.div
              className="filter_layer flex justify-between gap-48"
              initial={{ y: '-100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.5,
                ease: 'easeOut',
              }}
            >
              {/* Category Filter */}
              <div className="filter-category">
                <label htmlFor="category" className="filter-label">
                  Category:
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="filter-select"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Filter */}
              <div className="filter-price">
                <label htmlFor="price" className="filter-label">
                  Max Price: ${priceRange[1]}
                </label>
                <input
                  id="price"
                  type="range"
                  min="0"
                  max="100"
                  value={priceRange[1]}
                  onChange={handlePriceChange}
                  className="price-range"
                />
              </div>
            </motion.div>
          </div>

          {/* Product Grid */}
          <main className="product-grid">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                className="product-card"
                onClick={() => handleProductClick(product.id)}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                viewport={{
                  once: false,
                  amount: 0.1,
                }}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                />{' '}
                {/* Display only the first image */}
                <h3
                  style={{
                    color: '#48728e',
                    fontWeight: '400',
                    fontSize: '17px',
                  }}
                >
                  {product.name}
                </h3>
                <p
                  style={{
                    color: '#48728e',
                    fontWeight: '400',
                    fontSize: '17px',
                  }}
                >
                  Price: ${product.price}
                </p>
                <button
                  className="quick-review-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickReview(product.id);
                  }}
                >
                  Quick Review
                </button>
              </motion.div>
            ))}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MastersPage;
