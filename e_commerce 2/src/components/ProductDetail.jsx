import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';
import { BachelorsProducts  } from '../data/productsData'; // Import products from the productData file
import { MastersProducts  } from '../data/productsData'; // Import products from the productData file
import { CartContext } from '../context/CartContext';

const ProductDetail = ({ loggedInUser }) => {
  const { cartItems, addToCart } = useContext(CartContext);
  const products = [...BachelorsProducts, ...MastersProducts];
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id)); // Find the product by its ID from the params
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError] = useState(''); // Error state for size selection

  // Check if the size already exists in the cart for this product
  const isSizeInCart = (size) => {
    return cartItems.some(item => item.productId === product.id && item.selectedSize === size);
  };

  if (!product) {
    return <p>Product not found</p>;
  }

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomOrigin({ x, y });
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev)); // Prevents quantity from going below 1
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (!value || parseInt(value) < 1) {
      setQuantity(''); // Allow empty input temporarily
    } else {
      setQuantity(parseInt(value));
    }
  };

  const handleQuantityBlur = () => {
    if (!quantity || quantity < 1) {
      setQuantity(1); // Reset to minimum if input is invalid
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError('Please select a size before adding to the cart.');
      return;
    }
    setSizeError(''); // Clear the error if a size is selected
    addToCart(product, quantity, selectedSize); // Pass selectedSize and quantity
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleNextImage = () => {
    setSelectedImage((prevIndex) => (prevIndex + 1) % product.images.length);
  };

  const handlePreviousImage = () => {
    setSelectedImage((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className='bg-white'>
      <Navbar loggedInUser={loggedInUser} onMenuToggle={setMenuOpen} />
      <div className={`product-detail-page  transition-all duration-300 ${isMenuOpen ? 'mt-72' : ''}`}>
        <div className="product-detail-container">
          <div
            className="product-image-section"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setZoomOrigin({ x: 50, y: 50 })}
          >
            <div className="image-wrapper">
              {console.log("dta",product.images)}
              <button className="arrow-button left" onClick={handlePreviousImage}>
                &lt;
              </button>
              <img
                src={product.images[selectedImage]}
                alt={`${product.name} view ${selectedImage + 1}`}
                className="product-image"
                style={{
                  transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                }}
              />
              <button className="arrow-button right" onClick={handleNextImage}>
                &gt;
              </button>
            </div>

            <div className="thumbnail-container">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className={`thumbnail ${index === selectedImage ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          </div>

          <div className="product-info-section">
            <h1 className="product-title mb-2 text-2xl font-semibold">{product.name}</h1>
            <p className="product-price mb-2">${product.price.toFixed(2)}</p>
            <p className="product-sku mb-2 flex gap-14">
              SKU : <span style={{ color: 'rgb(139, 112, 139)' }}> {product.sku}</span>
            </p>

            <div className="quantity-section flex items-center gap-4 mb-2">
              <p>Quantity :</p>
              <span className="quantity-controls flex items-center gap-2">
                <button onClick={decreaseQuantity} className="quantity-decrement-button">
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  onBlur={handleQuantityBlur}
                  className="quantity-input text-center w-16"
                  min="1"
                />
                <button onClick={increaseQuantity} className="quantity-increment-button">
                  +
                </button>
              </span>
            </div>

            <div className="gown-sizes mb-2">
              <p className="mb-4">Size</p>
              <div className="size-options">
                {product.sizeOptions.map((size, index) => (
                  <button
                    key={index}
                    onClick={() => handleSizeSelect(size)}
                    className={`size-button ${selectedSize === size ? 'active' : ''} ${isSizeInCart(size) ? 'in-cart' : ''}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
                {/* Error Message */}
                {sizeError && <p className="size-error text-red-500 mt-3">{sizeError}</p>}
            </div>

            <button onClick={handleAddToCart} className="add-to-cart-button">
              Add to Cart
            </button>
          </div>
        </div>

        <div className="product-description">
          <h3>Description : </h3>
          <p>
            <strong>
              All graduation regalia is available for rent only. This item is not available for sale. You can rent this
              product return it after use.
            </strong>
          </p>
          <p>{product.description}</p>
          {product.category === 'Gown' && (
            <ul className="gown-details">
              <li>5'0 Gown = 5'0 - 5'2, under 160lbs</li>
              <li>4'9 Gown = 4'9 - 4'11, under 160lbs</li>
              <li>5'3 Gown = 5'3 - 5'5, under 190lbs</li>
              <li>5'6 Gown = 5'6 - 5'8, under 220lbs</li>
              <li>5'9 Gown = 5'9 - 5'11, under 250lbs</li>
              <li>6'0 Gown = 6'0 - 6'2, under 290lbs</li>
              <li>6'3 Gown = 6'3 - 6'6, under 310lbs</li>
              <li>6’6 Gown = 6'6 - 6'8, under 360lbs</li>
              <li>PS1 Gown = Plus Size for 4'9 - 5'5</li>
              <li>PS2 Gown = Plus Size for 5'6 - 5'11</li>
              <li>PS3 Gown = Plus Size for 6'0 - 6'6</li>
            </ul>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
