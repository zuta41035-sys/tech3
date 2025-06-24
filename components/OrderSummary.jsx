"use client";
import { useAppContext } from "@/context/AppContext";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const OrderSummary = () => {
  const {
    currency,
    getCartCount,
    getCartAmount,
    resetCart,
    products,
    cartItems,
    setCartItems,
    user, // user object with user.id expected here
  } = useAppContext();

  const router = useRouter();

  const [selectedAddress, setSelectedAddress] = useState({
    fullName: "",
    phoneNumber: "",
    area: "",
    city: "",
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);

  // Build cart items list from cartItems and products
  const cartItemsList = React.useMemo(() => {
    if (!cartItems || typeof cartItems !== "object") return [];

    return Object.keys(cartItems)
      .filter((itemId) => cartItems[itemId] > 0)
      .map((itemId) => {
        const product = products.find((p) => p._id === itemId);
        if (!product) return null;
        return {
          product,
          quantity: cartItems[itemId],
        };
      })
      .filter((item) => item !== null);
  }, [cartItems, products]);

  useEffect(() => {
    // Clean cart if product missing from products list
    if (cartItems && products.length > 0 && setCartItems) {
      const cleanedCartItems = { ...cartItems };
      let hasChanges = false;

      Object.keys(cartItems).forEach((itemId) => {
        if (cartItems[itemId] > 0) {
          const productExists = products.find((p) => p._id === itemId);
          if (!productExists) {
            delete cleanedCartItems[itemId];
            hasChanges = true;
          }
        }
      });

      if (hasChanges) {
        setCartItems(cleanedCartItems);
      }
    }
  }, [cartItems, products, setCartItems]);

  useEffect(() => {
    // Load saved address from localStorage (or replace with your API call)
    const storedAddress = localStorage.getItem("userAddress");
    if (storedAddress) {
      setUserAddresses([JSON.parse(storedAddress)]);
    }
  }, []);

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createOrder = async () => {
  if (
    !selectedAddress.fullName.trim() ||
    !selectedAddress.phoneNumber.trim() ||
    !selectedAddress.area.trim() ||
    !selectedAddress.city.trim()
  ) {
    toast.error("Please complete all shipping address fields.");
    return;
  }

  if (cartItemsList.length === 0) {
    toast.error("Your cart is empty!");
    return;
  }

  const amount = getCartAmount();

  const order = {
    userId: user.id, // <-- this line is important
    items: cartItemsList.map(({ product, quantity }) => ({
      productId: product._id,
      name: product.name,
      quantity,
      price: product.price,
    })),
    amount: amount, // <--- must match backend key
    address: {
      ...selectedAddress,
      state: "N/A",
    },
    paymentMethod: "COD",
    paymentStatus: "Pending",
  };

  try {
    const res = await fetch("/api/order/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to place order");
    }

    await resetCart();
    toast.success("Order placed successfully!");
    router.push("/order-placed");
  } catch (error) {
    toast.error(error.message);
  }
};


  return (
    <div className="w-full md:w-96 bg-gray-50 p-5 rounded-lg shadow-md">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">Order Summary</h2>
      <hr className="border-gray-300 my-5" />

      {/* Address selection */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Select Address</label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full border rounded-md p-3 text-left bg-white flex justify-between items-center"
          >
            {selectedAddress.fullName
              ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}`
              : "Select Address"}
            <span>{isDropdownOpen ? "▲" : "▼"}</span>
          </button>
          {isDropdownOpen && (
            <ul className="absolute bg-white border w-full mt-1 max-h-48 overflow-auto rounded-md z-10">
              {userAddresses.length === 0 && (
                <li className="p-2 text-gray-500">No saved addresses</li>
              )}
              {userAddresses.map((addr, idx) => (
                <li
                  key={idx}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleAddressSelect(addr)}
                >
                  {addr.fullName}, {addr.area}, {addr.city}
                </li>
              ))}
              <li
                className="p-2 text-center text-blue-600 cursor-pointer hover:bg-gray-100"
                onClick={() => router.push("/add-address")}
              >
                + Add New Address
              </li>
            </ul>
          )}
        </div>

        {/* Manual input */}
        <div className="mt-4 space-y-2">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={selectedAddress.fullName}
            onChange={handleInputChange}
            className="w-full border rounded-md p-2"
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={selectedAddress.phoneNumber}
            onChange={handleInputChange}
            className="w-full border rounded-md p-2"
          />
          <input
            type="text"
            name="area"
            placeholder="Area"
            value={selectedAddress.area}
            onChange={handleInputChange}
            className="w-full border rounded-md p-2"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={selectedAddress.city}
            onChange={handleInputChange}
            className="w-full border rounded-md p-2"
          />
        </div>
      </div>

      {/* Cart items */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Items in Cart</h3>
        <ul className="max-h-40 overflow-auto border rounded-md bg-white">
          {cartItemsList.length === 0 ? (
            <li className="p-2 text-gray-500">Your cart is empty</li>
          ) : (
            cartItemsList.map(({ product, quantity }) => (
              <li
                key={product._id}
                className="flex justify-between px-4 py-2 border-b last:border-b-0"
              >
                <span>{product.name}</span>
                <span className="font-medium">x{quantity}</span>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Price summary */}
      <div className="border-t pt-3 space-y-3">
        <div className="flex justify-between font-medium">
          <p>Items ({getCartCount()})</p>
          <p>
            {currency}
            {getCartAmount()}
          </p>
        </div>
        <div className="flex justify-between">
          <p>Shipping Fee</p>
          <p>Free</p>
        </div>
        <div className="flex justify-between font-semibold text-lg border-t pt-3">
          <p>Total</p>
          <p>
            {currency}
            {getCartAmount()}
          </p>
        </div>
      </div>

      <button
        onClick={createOrder}
        disabled={cartItemsList.length === 0}
        className="w-full mt-5 bg-orange-600 text-white py-3 rounded-md hover:bg-orange-700 disabled:opacity-50"
      >
        Place Order
      </button>
    </div>
  );
};

export default OrderSummary;
