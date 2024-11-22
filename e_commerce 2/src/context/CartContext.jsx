import React, { createContext, useState, useEffect } from 'react';
import { BachelorsProducts  } from '../data/productsData'; // Adjust path if necessary
import { MastersProducts  } from '../data/productsData'; // Adjust path if necessary

export const CartContext = createContext();
const productsData = [...BachelorsProducts, ...MastersProducts];
export const CartProvider = ({ children, loggedInUser, setLoggedInUser }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setLoggedInUser(parsedUser);

      if (parsedUser.cart) {
        setCartItems(parsedUser.cart);
      }
    }
  }, [setLoggedInUser]);

  const addToCart = (product, quantity, selectedSize) => {
    const currentDate = new Date().toLocaleDateString();
    setCartItems((prevItems) => {
      let updatedCart = [...prevItems];
      let productFound = false;
      let newCartItem = null;

      updatedCart = updatedCart.map((cart) => {
        const updatedItems = cart.items.map((item) => {
          if (item.productId === product.id && item.selectedSize === selectedSize) {
            productFound = true;
            return { ...item, quantity: item.quantity + quantity };
          }
          return item;
        });

        return { ...cart, items: productFound ? updatedItems : [...cart.items] };
      });

      if (!productFound) {
        newCartItem = {
          id: Date.now().toString(),
          date: currentDate,
          items: [
            {
              productId: product.id,
              selectedSize: selectedSize,
              quantity: quantity,
            },
          ],
        };
        updatedCart = [...updatedCart, newCartItem];
      }

      if (loggedInUser) {
        const updatedUser = { ...loggedInUser, cart: updatedCart };
        setLoggedInUser(updatedUser);
        localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
      } else {
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      }

      return updatedCart;
    });
  };

  const updateCartQuantity = (cartId, productId, newQuantity) => {
    setCartItems((prevItems) => {
      const updatedCart = prevItems.map((cart) =>
        cart.id === cartId
          ? {
              ...cart,
              items: cart.items.map((item) =>
                item.productId === productId ? { ...item, quantity: newQuantity } : item
              ),
            }
          : cart
      );

      if (loggedInUser) {
        const updatedUser = { ...loggedInUser, cart: updatedCart };
        setLoggedInUser(updatedUser);
        localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
      }

      return updatedCart;
    });
  };

  const removeFromCart = (cartId, productId) => {
    setCartItems((prevItems) => {
      const updatedCart = prevItems
        .map((cart) =>
          cart.id === cartId
            ? {
                ...cart,
                items: cart.items.filter((item) => item.productId !== productId),
              }
            : cart
        )
        .filter((cart) => cart.items.length > 0);

      if (loggedInUser) {
        const updatedUser = { ...loggedInUser, cart: updatedCart };
        setLoggedInUser(updatedUser);
        localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
      }

      return updatedCart;
    });
  };

  const updateUserOrders = (newOrder, selectedItems) => {
    setCartItems((prevItems) => {
      const updatedCart = prevItems.map((cart) => ({
        ...cart,
        items: cart.items.filter(
          (item) =>
            !selectedItems.some(
              (selected) =>
                selected.cartId === cart.id && selected.productId === item.productId
            )
        ),
      })).filter((cart) => cart.items.length > 0); // Remove empty carts

      if (loggedInUser) {
        const updatedUser = {
          ...loggedInUser,
          cart: updatedCart,
          orders: [...(loggedInUser.orders || []), newOrder],
        };
        setLoggedInUser(updatedUser);
        localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
      }

      return updatedCart;
    });
  };

  const getCartDetails = () => {
    return cartItems.map((cart) => {
      const updatedItems = cart.items.map((item) => {
        const product = productsData.find((prod) => prod.id === item.productId);
        const totalPrice = product ? product.price * item.quantity : 0;

        return {
          ...item,
          productDetails: product,
          totalPrice: totalPrice,
        };
      });

      return { ...cart, items: updatedItems };
    });
  };

  return (
    <CartContext.Provider
      value={{
        products: productsData,
        cartItems: getCartDetails(),
        addToCart,
        updateCartQuantity,
        removeFromCart,
        updateUserOrders,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
