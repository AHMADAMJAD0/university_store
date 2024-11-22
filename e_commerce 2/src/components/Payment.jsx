import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Payment.css";
import Navbar from "./Navbar";
import { CartContext } from "../context/CartContext"; // Adjust the path
import {BachelorsProducts } from "../data/productsData";
import {MastersProducts } from "../data/productsData";
import Footer from "./Footer";

const Payment = ({ loggedInUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartId, selectedOrders = [], selectedItems = [], totalPrice = 0 } = location.state || {};
  const { products, cartItems, removeFromCart, updateUserOrders } = useContext(CartContext);
  { console.log("Selected Orders", selectedOrders, cartId) }
  const [discountCode, setDiscountCode] = useState("");
  const [shippingFee, setShippingFee] = useState(5.0); // Base shipping fee
  const [discount, setDiscount] = useState(0);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const [paymentDetails, setPaymentDetails] = useState({
    billingName: "",
    billingAddress: "",
    billingCardNumber: "",
    billingExpiration: "",
    billingCVC: "",
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(""); // Tracks the payment method

  // Pre-fill shipping info if available
  useEffect(() => {
    if (loggedInUser) {
      setShippingAddress({
        fullName: loggedInUser.name || "",
        addressLine1: loggedInUser.address1 || "",
        addressLine2: loggedInUser.address2 || "",
        city: loggedInUser.city || "",
        state: loggedInUser.state || "",
        zip: loggedInUser.zipCode || "",
        country: loggedInUser.country || "",
      });
      setPaymentDetails({
        billingName: loggedInUser.billingName || "",
        billingCardNumber: loggedInUser.billingCardNumber || "",
        billingExpiration: loggedInUser.billingExpiration || "",
        billingCVC: loggedInUser.billingCVC || "",
      });
    }
  }, [loggedInUser]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyDiscount = () => {
    if (discountCode === "SAVE10") {
      setDiscount(10); // Example: Apply $10 discount
      alert("Discount applied!");
    } else {
      alert("Invalid discount code.");
    }
  };

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);

    // Adjust shipping fee for Cash on Delivery
    if (method === "Cash on Delivery") {
      setShippingFee(10.0); // Increased shipping fee for COD
    } else {
      setShippingFee(5.0); // Default shipping fee for other methods
    }
  };

  const handlePaymentSubmit = () => {
    // Validate shipping address fields
    if (Object.values(shippingAddress).some((field) => !field.trim())) {
      alert("Please fill in all the shipping address fields!");
      return;
    }

    // Validate payment method
    if (!selectedPaymentMethod) {
      alert("Please select a payment method!");
      return;
    }

    // Validate card details if payment method is "Card"
    if (selectedPaymentMethod === "Card") {
      if (!paymentDetails.billingCardNumber || !paymentDetails.billingExpiration || !paymentDetails.billingCVC) {
        alert("Please fill in all card details!");
        return;
      }
    }

    // Create new order object
    const finalPrice = (totalPrice + shippingFee - discount).toFixed(2);

    const selectedOrders = selectedItems.map((selectedItem) => {
      const cart = cartItems.find((c) => c.id === selectedItem.cartId);
      const item = cart.items.find((i) => i.productId === selectedItem.productId);

      return {
        productId: selectedItem.productId,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
      };
    });

    const newOrder = {
      id: String(Date.now()),
      status: "Ordered",
      date: new Date().toISOString().split('T')[0],
      items: selectedOrders,
    };

    updateUserOrders(newOrder, selectedItems);
    console.log("newOrder", updateUserOrders)
    // setSelectedItems([]);
    alert('Order placed successfully!');

    // Remove items from the cart (assumes `removeFromCart` is passed via props or context)
    // if (loggedInUser && removeFromCart) {
    //   selectedOrders.forEach((order) => {
    //     removeFromCart(cartId, order.productId); // Remove each product by ID
    //   });
    // } else {
    //   console.error("removeFromCart is not available!");
    // }

    // Redirect to the Thank You page
    alert("Order placed successfully!");
    navigate("/"); // Replace with your confirmation or orders page
  };

  const finalPrice = (totalPrice + shippingFee - discount).toFixed(2);

  return (
    <div>
      <Navbar />
      <div className="payment-page">
        {/* Order Summary Section */}
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-details">
            {selectedOrders.map((order, index) => {
              // Map productId to product details
              const product = products.find((prod) => prod.id === order.productId);
              return product ? (
                <div key={index} className="order-item">
                  <img
                    src={product.images[0]} // Use the first image from the product
                    alt={product.name}
                    className="order-item-image"
                  />
                  <div className="order-item-details">
                    <h2>{product.name}</h2>
                    <p>
                      <strong>Quantity:</strong> {order.quantity}
                    </p>
                    <p>
                      <strong>Size:</strong> {order.selectedSize}
                    </p>
                    <p>
                      <strong>Price:</strong> ${product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ) : (
                <p key={index}>Product details not found for ID {order.productId}</p>
              );
            })}
            <p>Subtotal: <span>${totalPrice.toFixed(2)}</span></p>
            <p>Shipping Fee: <span>${shippingFee.toFixed(2)}</span></p>
            <p>Discount: <span>- ${discount.toFixed(2)}</span></p>
            <div className="total-price">
              <h3>Total:</h3> <span>${finalPrice}</span>
            </div>
          </div>
        </div>

        {/* Payment and Address Section */}
        <div className="payment-section">
          <h2>Shipping Address</h2>
          <div className="address-form">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={shippingAddress.fullName}
              onChange={handleAddressChange}
              placeholder="Enter full name"
              className="full-width"
            />
            <label>Address Line 1</label>
            <input
              type="text"
              name="addressLine1"
              value={shippingAddress.addressLine1}
              onChange={handleAddressChange}
              placeholder="Enter address"
              className="full-width"
            />
            <label>Address Line 2</label>
            <input
              type="text"
              name="addressLine2"
              value={shippingAddress.addressLine2}
              onChange={handleAddressChange}
              placeholder="Enter address (optional)"
              className="full-width"
            />
            <label>City</label>
            <input
              type="text"
              name="city"
              value={shippingAddress.city}
              onChange={handleAddressChange}
              placeholder="Enter city"
              className="full-width"
            />
            <label>State</label>
            <input
              type="text"
              name="state"
              value={shippingAddress.state}
              onChange={handleAddressChange}
              placeholder="Enter state"
              className="full-width"
            />
            <label>ZIP Code</label>
            <input
              type="text"
              name="zip"
              value={shippingAddress.zip}
              onChange={handleAddressChange}
              placeholder="Enter ZIP code"
              className="full-width"
            />
            <label>Country</label>
            <input
              type="text"
              name="country"
              value={shippingAddress.country}
              onChange={handleAddressChange}
              placeholder="Enter country"
              className="full-width"
            />
          </div>

          <h2>Payment Methods</h2>
          <div className="payment-methods">
            {["Card", "Google Pay", "Bank", "Cash on Delivery"].map((method) => (
              <button
                key={method}
                className={`payment-method-btn ${selectedPaymentMethod === method ? "active" : ""}`}
                onClick={() => handlePaymentMethodChange(method)}
              >
                {method}
              </button>
            ))}
          </div>

          {selectedPaymentMethod === "Card" && (
            <div className="payment-card-details">
              <input
                type="text"
                name="billingCardNumber"
                placeholder="Card Number"
                value={paymentDetails.billingCardNumber}
                onChange={handlePaymentChange}
              />
              <input
                type="text"
                name="billingExpiration"
                placeholder="Expiration Date"
                value={paymentDetails.billingExpiration}
                onChange={handlePaymentChange}
              />
              <input
                type="text"
                name="billingCVC"
                placeholder="CVC"
                value={paymentDetails.billingCVC}
                onChange={handlePaymentChange}
              />
            </div>
          )}

          <button className="submit-payment" onClick={handlePaymentSubmit}>
            Place Order
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Payment;
