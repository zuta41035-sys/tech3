'use client';
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";
import axios from "axios";

export const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = (props) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY || "$";
  const router = useRouter();

  const { user } = useUser();
  const { getToken } = useAuth();

  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [cartItems, setCartItems] = useState({});

  const cleanCartItems = (cart) => {
    const cleaned = {};
    Object.keys(cart || {}).forEach(itemId => {
      if (cart[itemId] > 0) {
        cleaned[itemId] = cart[itemId];
      }
    });
    return cleaned;
  };

  const fetchProductData = async () => {
    try {
      const { data } = await axios.get('/api/product');
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Could not load products.");
    }
  };

  const fetchUserData = async () => {
    try {
      setIsSeller(false);

      if (user?.publicMetadata?.role === 'seller') {
        setIsSeller(true);
      }

      const token = await getToken();
      const { data } = await axios.get('/api/user/data', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserData(data.user);
        const cleanedCart = cleanCartItems(data.user.cartItems);
        setCartItems(cleanedCart);
      } else {
        toast.error(data.message || "Failed to load user data.");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong fetching user data.");
      console.error("Error fetching user data:", error);
    }
  };

  const saveCart = async (cartData) => {
    try {
      const token = await getToken();
      const cleanedCart = cleanCartItems(cartData);
      await axios.post(
        '/api/user/data',
        { cartItems: cleanedCart },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      toast.error("Failed to save cart.");
      console.error("Error saving cart:", error);
    }
  };

  const addToCart = async (itemId) => {
    const updatedCart = { ...(cartItems || {}) };
    updatedCart[itemId] = (updatedCart[itemId] || 0) + 1;
    const cleanedCart = cleanCartItems(updatedCart);
    setCartItems(cleanedCart);
    await saveCart(cleanedCart);
  };

  const updateCartQuantity = async (itemId, quantity) => {
    const updatedCart = { ...(cartItems || {}) };
    if (quantity <= 0) {
      delete updatedCart[itemId];
    } else {
      updatedCart[itemId] = quantity;
    }
    const cleanedCart = cleanCartItems(updatedCart);
    setCartItems(cleanedCart);
    await saveCart(cleanedCart);
  };

  const getCartCount = () => {
    if (!cartItems || typeof cartItems !== 'object') return 0;
    return Object.keys(cartItems)
      .filter(itemId => cartItems[itemId] > 0)
      .reduce((total, itemId) => total + cartItems[itemId], 0);
  };

  const getCartAmount = () => {
    if (!cartItems || products.length === 0) return 0;
    let total = 0;
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        const product = products.find((p) => p._id === itemId);
        if (product) {
          total += (product.offerPrice || 0) * cartItems[itemId];
        }
      }
    }
    return Math.round(total * 100) / 100;
  };

  const resetCart = async () => {
    setCartItems({});
    await saveCart({});
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      setUserData(null);
      setCartItems({});
      setIsSeller(false);
    }
  }, [user]);

  const isClient = !isSeller && userData?.role !== 'admin';

  const value = {
    user,
    getToken,
    currency,
    router,
    isSeller,
    setIsSeller,
    userData,
    fetchUserData,
    products,
    setProducts,
    fetchProductData,
    cartItems,
    setCartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
    getCartAmount,
    resetCart,
    isClient,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
