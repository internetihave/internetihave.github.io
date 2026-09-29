import React, { useState, useEffect } from 'react';
import './App.css';

// Product Catalog Data
const PRODUCTS = [
  {
    id: 1,
    name: 'Silk Rose Two-Piece Set',
    price: 45.0,
    tag: 'Bestseller',
    image:
      'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=600&q=80',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 2,
    name: 'Cozy Flannel Cream Pajamas',
    price: 52.0,
    tag: 'Winter Warm',
    image:
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
    sizes: ['S', 'M', 'L'],
  },
  {
    id: 3,
    name: 'Satin Nightgown & Robe',
    price: 68.0,
    tag: 'Luxury',
    image:
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80',
    sizes: ['M', 'L', 'XL'],
  },
  {
    id: 4,
    name: 'Cotton Lounge Sleepshirt',
    price: 38.0,
    tag: 'Soft Cotton',
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    sizes: ['S', 'M', 'L', 'XL'],
  },
];

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({
    1: 'M',
    2: 'M',
    3: 'M',
    4: 'M',
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Toggle Theme Attribute on HTML
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [darkMode]);

  const handleSizeSelect = (productId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const addToCart = (product, size) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.id === product.id && item.size === size
      );
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prevCart, { ...product, size, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, size, delta) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === id && item.size === size) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (id, size) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.id === id && item.size === size))
    );
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => setContactSubmitted(false), 4000);
    e.target.reset();
  };

  return (
    <div className="app">
      {/* 1. NAVBAR */}
      <nav className="navbar">
        <a href="#home" className="nav-brand">
          <i className="fa-solid fa-moon"></i> Night Nest
        </a>
        <ul className="nav-links">
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#products">Collections</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
        <div className="nav-actions">
          <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle Light/Dark Mode"
          >
            {darkMode ? (
              <i className="fa-solid fa-sun"></i>
            ) : (
              <i className="fa-solid fa-moon"></i>
            )}
          </button>
          <button className="cart-btn" onClick={() => setIsCartOpen(true)}>
            <i className="fa-solid fa-bag-shopping"></i>
            <span className="cart-count">{totalCartCount}</span>
          </button>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <header id="home" className="hero">
        <h1>Dream in Absolute Comfort</h1>
        <p>
          Discover our luxurious collection of women’s pajamas designed for
          peaceful nights and cozy mornings.
        </p>
        <a href="#products" className="hero-btn">
          Shop Collection
        </a>
      </header>

      {/* 3. MAIN PRODUCT CARDS SECTION */}
      <section id="products" className="products-section">
        <h2 className="section-title">Women's Sleepwear Collection</h2>
        <div className="products-grid">
          {PRODUCTS.map((product) => {
            const currentSize = selectedSizes[product.id];
            return (
              <div className="product-card" key={product.id}>
                <div className="product-image-container">
                  <span className="product-tag">{product.tag}</span>
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="product-info">
                  <h3 className="product-title">{product.name}</h3>
                  <div className="product-price">
                    ${product.price.toFixed(2)}
                  </div>

                  <div className="size-selector">
                    <span>Size:</span>
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        className={`size-btn ${currentSize === size ? 'active' : ''}`}
                        onClick={() => handleSizeSelect(product.id, size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  <button
                    className="add-to-cart-btn"
                    onClick={() => addToCart(product, currentSize)}
                  >
                    <i className="fa-solid fa-cart-plus"></i> Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. SIDEBAR SHOPPING CART DRAWER */}
      <>
        <div
          className={`cart-overlay ${isCartOpen ? 'open' : ''}`}
          onClick={() => setIsCartOpen(false)}
        ></div>
        <div className={`sidebar-cart ${isCartOpen ? 'open' : ''}`}>
          <div className="cart-header">
            <h3>
              <i className="fa-solid fa-bag-shopping"></i> Your Cart
            </h3>
            <button
              className="close-cart-btn"
              onClick={() => setIsCartOpen(false)}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div className="cart-body">
            {cart.length === 0 ? (
              <div className="empty-cart">
                <i className="fa-regular fa-face-grimace"></i>
                <p>Your cart is empty.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div className="cart-item" key={`${item.id}-${item.size}`}>
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item-details">
                    <h4 className="cart-item-title">{item.name}</h4>
                    <p className="cart-item-meta">Size: {item.size}</p>
                    <p className="cart-item-price">${item.price.toFixed(2)}</p>

                    <div className="quantity-controls">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.size, -1)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.size, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className="delete-item-btn"
                    onClick={() => removeFromCart(item.id, item.size)}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="cart-footer">
            <div className="cart-subtotal">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <button
              className="checkout-btn"
              onClick={() => alert('Proceeding to cozy checkout!')}
              disabled={cart.length === 0}
            >
              Checkout
            </button>
          </div>
        </div>
      </>

      {/* 5. CONTACT SECTION */}
      <section id="contact" className="contact-section">
        <div className="contact-container">
          <h2 className="section-title" style={{ marginBottom: '10px' }}>
            Get in Touch
          </h2>
          <p
            style={{
              textAlign: 'center',
              color: 'var(--text-secondary)',
              fontSize: '0.95rem',
            }}
          >
            Have questions about sizing, orders, or fabrics? Send us a note!
          </p>

          <form className="contact-form" onSubmit={handleContactSubmit}>
            <div className="form-group">
              <input type="text" placeholder="Your Name" required />
            </div>
            <div className="form-group">
              <input type="email" placeholder="Your Email" required />
            </div>
            <div className="form-group">
              <textarea
                rows="4"
                placeholder="Your Message..."
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-btn">
              Send Message
            </button>
            {contactSubmitted && (
              <p
                style={{
                  color: 'var(--accent)',
                  textAlign: 'center',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                }}
              >
                Thank you! Your message has been sent successfully.
              </p>
            )}
          </form>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-col">
            <h4>
              <i className="fa-solid fa-moon"></i> Night Nest
            </h4>
            <p>
              Your premier online destination for elegant, cozy, and
              ultra-comfortable women's sleepwear.
            </p>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <a href="#home">Home</a>
              </li>
              <li>
                <a href="#products">Collections</a>
              </li>
              <li>
                <a href="#contact">Contact Us</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Customer Care</h4>
            <ul>
              <li>
                <a href="#">Shipping Policy</a>
              </li>
              <li>
                <a href="#">Returns & Exchanges</a>
              </li>
              <li>
                <a href="#">Size Guide</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Connect With Us</h4>
            <p>Follow our cozy journey on social media:</p>
            <div className="social-icons">
              <a href="https://www.instagram.com/night_nest_pyjama/">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="https://www.facebook.com/profile.php?id=61595013027103">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#">
                <i className="fa-brands fa-pinterest-p"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} Night Nest Pajamas. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
