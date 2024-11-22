import React, { useContext, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group'; // For animations
import { CartContext } from '../context/CartContext'; // Adjust the path if necessary
import { Link , useNavigate} from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Cart = ({ loggedInUser }) => {
    const { products, cartItems, removeFromCart, updateUserOrders } = useContext(CartContext);
    const navigate = useNavigate();

    const [selectedItems, setSelectedItems] = useState([]);

    const handleCheckboxChange = (cartId, productId) => {
        setSelectedItems((prevSelected) => {
            const isSelected = prevSelected.some(
                (item) => item.cartId === cartId && item.productId === productId
            );
            if (isSelected) {
                return prevSelected.filter(
                    (item) => !(item.cartId === cartId && item.productId === productId)
                );
            } else {
                return [...prevSelected, { cartId, productId }];
            }
        });
    };

    const selectedTotalPrice = selectedItems.reduce((total, selectedItem) => {
        const cart = cartItems.find((c) => c.id === selectedItem.cartId);
        if (!cart) return total;

        const item = cart.items.find((i) => i.productId === selectedItem.productId);
        const product = products.find((prod) => prod.id === selectedItem.productId);

        return total + (product ? product.price * item.quantity : 0);
    }, 0);

    // const checkout = () => {
    //     const selectedOrders = selectedItems.map((selectedItem) => {
    //         const cart = cartItems.find((c) => c.id === selectedItem.cartId);
    //         const item = cart.items.find((i) => i.productId === selectedItem.productId);

    //         return {
    //             productId: selectedItem.productId,
    //             quantity: item.quantity,
    //             selectedSize: item.selectedSize,
    //         };
    //     });

    //     const newOrder = {
    //         id: String(Date.now()),
    //         status: "Ordered",
    //         date: new Date().toISOString().split('T')[0],
    //         items: selectedOrders,
    //     };

    //     updateUserOrders(newOrder, selectedItems);
    //     // console.log("newOrder", updateUserOrders)
    //     setSelectedItems([]);
    //     alert('Order placed successfully!');
    // };
    const checkout = () => {
        const selectedOrders = selectedItems.map((selectedItem) => {
          const cart = cartItems.find((c) => c.id === selectedItem.cartId);
          const item = cart.items.find((i) => i.productId === selectedItem.productId);
      
          return {
            productId: selectedItem.productId,
            quantity: item.quantity,
            selectedSize: item.selectedSize,
          };
        });
      
        navigate("/payment", {
          state: {
            cartId: selectedItems[0].cartId,
            selectedItems: selectedItems,
            totalPrice: selectedTotalPrice,
          },
        });
      };
      
    return (
        <div>
            <Navbar loggedInUser={loggedInUser} />
            <div className="cart-container">
    <h2>Your Cart</h2>
    {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
    ) : (
        <table className="cart-table">
            <thead>
                <tr>
                    <th>Select</th>
                    <th>Product Image</th>
                    <th>Product Name</th>
                    <th>Size</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <TransitionGroup component="tbody" className="cart-table-body">
                {cartItems.map((cart) =>
                    cart.items.map((item) => {
                        const product = products.find(
                            (prod) => prod.id === item.productId
                        );
                        const isSelected = selectedItems.some(
                            (selected) =>
                                selected.cartId === cart.id &&
                                selected.productId === item.productId
                        );

                        return (
                            <CSSTransition
                                key={`${cart.id}-${item.productId}`}
                                timeout={300}
                                classNames="fade"
                            >
                                <tr className="cart-row">
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() =>
                                                handleCheckboxChange(
                                                    cart.id,
                                                    item.productId
                                                )
                                            }
                                            className="cart-checkbox"
                                        />
                                    </td>
                                    <td>
                                        <Link
                                            to={`/cartProduct/${product.id}`}
                                            state={{
                                                selectedSize: item.selectedSize,
                                                quantity: item.quantity,
                                            }}
                                        >
                                            <img
                                                src={
                                                    product?.images[0] ||
                                                    '/default-image.jpg'
                                                }
                                                alt={
                                                    product?.name ||
                                                    'Product image'
                                                }
                                                className="product-image-cart"
                                            />
                                        </Link>
                                    </td>
                                    <td>{product?.name || 'Product not found'}</td>
                                    <td>{item.selectedSize}</td>
                                    <td>${product?.price || 0}</td>
                                    <td>{item.quantity}</td>
                                    <td>
                                        $
                                        {(
                                            product?.price * item.quantity || 0
                                        ).toFixed(2)}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() =>
                                                removeFromCart(
                                                    cart.id,
                                                    item.productId
                                                )
                                            }
                                            className="remove-btn"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            </CSSTransition>
                        );
                    })
                )}
            </TransitionGroup>
        </table>
    )}
    {cartItems.length > 0 && (
        <div className="cart-summary">
            <h3>Selected Total Price: ${selectedTotalPrice.toFixed(2)}</h3>
            <button
                onClick={checkout}
                className="checkout-btn"
                disabled={selectedItems.length === 0}
            >
                Checkout
            </button>
        </div>
    )}
</div>

            <Footer />
        </div>
    );
};

export default Cart;
