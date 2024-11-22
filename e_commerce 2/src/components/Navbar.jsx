import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaSearch, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';


const Navbar = ({ onMenuToggle }) => {
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setDropdownOpen] = useState(false); // Track dropdown visibility
  const [loggedInUser, setLoggedInUser] = useState(null); // Track logged-in user
  const navigate = useNavigate();
  const { cartItems } = useContext(CartContext);


  useEffect(() => {
    // Check if there's a logged-in user in localStorage on initial render
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    setLoggedInUser(user);
  }, []);

  const toggleSearchInput = () => {
    setSearchVisible((prev) => !prev);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
    if (onMenuToggle) {
      onMenuToggle(!isMenuOpen); // Call onMenuToggle only if it's defined
    }
  };
  
  // const handleSearch = (e) => {
  //   e.preventDefault();
  //   console.log(searchTerm);
  //   setSearchVisible(false);
  // };
  const handleSearch = (e) => {
    e.preventDefault();
  
    if (searchTerm.trim() === '') {
      alert('Please enter a search term.');
      return;
    }
  
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  
    // Select all visible elements that might contain text
    const elements = document.querySelectorAll('body *');
  
    let matchFound = false;
  
    elements.forEach((element) => {
      if (
        element.textContent.toLowerCase().includes(normalizedSearchTerm) &&
        element.offsetParent !== null // Ensure the element is visible
      ) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.style.outline = '2px solid purple'; // Highlight the found element
        setTimeout(() => (element.style.outline = 'none'), 2000); // Remove highlight after 2 seconds
        matchFound = true;
      }
    });
  
    if (!matchFound) {
      alert('No matching content found!');
    }
  
    setSearchVisible(false); // Hide the search bar after performing the search
  };
  

  const handleUserIconClick = () => {
    if (!loggedInUser) {
      navigate('/auth'); // Redirect to login if no user
    } else {
      setDropdownOpen(!isDropdownOpen); // Toggle dropdown visibility
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser'); // Clear user from localStorage
    setLoggedInUser(null); // Update the state immediately
    setDropdownOpen(false); // Close dropdown
    navigate('/'); // Redirect to home page
  };

  const handleProfileClick = () => {
    navigate(`/profile/${loggedInUser.email}`);
    setDropdownOpen(false); // Close dropdown after redirect
  };

  return (
    <nav className="navBar flex justify-between items-center bg-white shadow-md rounded-lg px-1 md:px-4 py-3">
    <div className="flex gap-10 items-center">
      <Link
        to="/"
        className="navtext text-2xl font-bold transition-all duration-500 transform hover:scale-110 hover:text-purple-700"
      >
        <span className="transition-transform duration-500 hover:rotate-6">
          University
        </span>
        <span className="ml-1 transition-transform duration-500 hover:-rotate-6">
          Store
        </span>
      </Link>
  
      <div className="hidden md:flex pl-6 space-x-5 text-gray-700 font-ubuntu">
        {['Home', 'Features', 'About', 'Contact', 'New Article'].map((item, idx) => (
          <Link
            key={idx}
            // to={`/${item.toLowerCase().replace(' ', '-')}`}
            to={`/`}
            className="nav_item transition-all duration-500 transform hover:scale-110 hover:text-purple-700 hover:translate-y-1"
          >
            {item}
          </Link>
        ))}
      </div>
    </div>
  
    <div className="Icons flex items-center gap-6 text-gray-700">
      <div className="hidden md:flex items-center gap-2 h-1">
        {isSearchVisible && (
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="text"
              placeholder="Search..."
              className="border rounded p-1 transition-transform duration-500 focus:scale-110"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onBlur={() => setSearchVisible(false)}
            />
          </form>
        )}
        <div onClick={toggleSearchInput} className="cursor-pointer">
          <FaSearch className="hover:text-purple-700 transition-all duration-500 transform hover:scale-125 hover:rotate-12" />
        </div>
      </div>
      {/* <FaShoppingCart className="hover:text-purple-700 cursor-pointer transition-all duration-500 transform hover:scale-125 hover:rotate-12" /> */}
      <div className="relative">
  <FaShoppingCart
    onClick={() => navigate('/cart')}
    className="hover:text-purple-700 cursor-pointer transition-all duration-500 transform hover:scale-125 hover:rotate-12"
  />
  {cartItems.length > 0 && (
    <span
      className="absolute -top-3 -right-4 bg-purple-700 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
    >
      {cartItems.length}
    </span>
  )}
</div>

      <div onClick={handleUserIconClick} className="relative cursor-pointer">
        <FaUser className="hover:text-purple-700 transition-all duration-500 transform hover:scale-125 hover:-rotate-12" />
  
        {isDropdownOpen && loggedInUser && (
          <div className="absolute top-10 right-0 bg-white shadow-lg rounded-lg w-48 py-2 z-10 border">
            <button
              onClick={handleProfileClick}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-300"
            >
              Your Account
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-300"
            >
              Logout
            </button>
          </div>
        )}
      </div>
  
      <div className="md:hidden cursor-pointer" onClick={toggleMenu}>
        {isMenuOpen ? (
          <FaTimes className="hover:text-purple-700 transition-all duration-500 transform hover:scale-125 hover:-rotate-12" />
        ) : (
          <FaBars className="hover:text-purple-700 transition-all duration-500 transform hover:scale-125 hover:rotate-12" />
        )}
      </div>
    </div>
  
    {isMenuOpen && (
      <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-lg rounded-lg flex flex-col items-center space-y-4 py-4 z-10">
        <form onSubmit={handleSearch} className="flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="border rounded p-1 transition-transform duration-500 focus:scale-110"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="ml-2">
            <FaSearch className="hover:text-purple-700 transition-transform duration-500 hover:scale-125 hover:rotate-12" />
          </button>
        </form>
        {['Home', 'Features', 'About', 'Contact', 'New Article'].map((item, idx) => (
          <Link
            key={idx}
            to={`/${item.toLowerCase().replace(' ', '-')}`}
            className="hover:text-purple-700 transition-all duration-500 transform hover:scale-110 hover:translate-y-1"
            onClick={toggleMenu}
          >
            {item}
          </Link>
        ))}
      </div>
    )}
  </nav>
  
  
  );
};

export default Navbar;
