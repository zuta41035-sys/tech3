'use client';
import { useAppContext } from "@/context/AppContext";
import React, { useEffect, useState } from "react";

const OrderSummary = () => {
  const {
    currency,
    router,
    getCartCount,
    getCartAmount,
    resetCart,
    products,
    cartItems,
    setCartItems,
  } = useAppContext();

  const [selectedAddress, setSelectedAddress] = useState({
    fullName: "",
    phoneNumber: "",
    area: "",
    city: "",
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);

  const cartItemsList = React.useMemo(() => {
    if (!cartItems || typeof cartItems !== 'object') return [];
    
    const items = Object.keys(cartItems)
      .filter(itemId => cartItems[itemId] > 0)
      .map(itemId => {
        const product = products.find(p => p._id === itemId);
        if (!product) {
          console.warn(`Product with ID ${itemId} not found in products array`);
          return null; 
        }
        return {
          product,
          quantity: cartItems[itemId],
        };
      })
      .filter(item => item !== null); 
    
    console.log('Valid cart items:', items);
    console.log('All cart items:', cartItems);
    console.log('All products:', products);
    return items;
  }, [cartItems, products]);

  useEffect(() => {
    if (cartItems && products.length > 0 && setCartItems) {
      const cleanedCartItems = { ...cartItems };
      let hasChanges = false;
      
      Object.keys(cartItems).forEach(itemId => {
        if (cartItems[itemId] > 0) {
          const productExists = products.find(p => p._id === itemId);
          if (!productExists) {
            console.log(`Removing invalid item from cart: ${itemId}`);
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

  const fetchUserAddresses = () => {
    const storedAddress = localStorage.getItem("userAddress");
    if (storedAddress) {
      const parsedAddress = JSON.parse(storedAddress);
      setUserAddresses([parsedAddress]);
    }
  };

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
      alert("Please complete all shipping address fields.");
      return;
    }

    if (!cartItemsList || cartItemsList.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const amount = getCartAmount();

    const order = {
      items: cartItemsList,
      amount,
      address: {
        ...selectedAddress,
        state: "N/A",
      },
      date: new Date().toISOString(),
      paymentMethod: "COD",
      paymentStatus: "Pending",
    };

    const existingOrders = JSON.parse(localStorage.getItem("userOrders")) || [];
    localStorage.setItem("userOrders", JSON.stringify([...existingOrders, order]));

    await resetCart();
    router.push("/order-placed");
  };

  useEffect(() => {
    fetchUserAddresses();
  }, []);

  return (
    <div className="w-full md:w-96 bg-gray-500/5 p-5 rounded-lg">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">Order Summary</h2>
      <hr className="border-gray-500/30 my-5" />

      <div className="space-y-6">
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Select Address
          </label>
          <div className="relative inline-block w-full text-sm border rounded-md">
            <button
              className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none rounded-md"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              type="button"
            >
              <span>
                {selectedAddress.fullName
                  ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}`
                  : "Select Address"}
              </span>
              <svg
                className={`w-5 h-5 inline float-right transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-0" : "-rotate-90"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#6B7280"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5 rounded-md max-h-48 overflow-auto">
                {userAddresses.length === 0 && (
                  <li className="px-4 py-2 text-gray-500 cursor-default">No saved addresses</li>
                )}
                {userAddresses.map((address, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                    onClick={() => handleAddressSelect(address)}
                  >
                    {address.fullName}, {address.area}, {address.city}
                  </li>
                ))}
                <li
                  onClick={() => router.push("/add-address")}
                  className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center text-orange-600"
                >
                  + Add New Address
                </li>
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Enter Shipping Address
          </label>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={selectedAddress.fullName}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md outline-none"
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={selectedAddress.phoneNumber}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md outline-none"
          />
          <input
            type="text"
            name="area"
            placeholder="Area"
            value={selectedAddress.area}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md outline-none"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={selectedAddress.city}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md outline-none"
          />
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">Items in Cart</h3>
          <ul className="max-h-40 overflow-auto border rounded-md">
            {cartItemsList.length === 0 ? (
              <li className="text-gray-500 p-2">Your cart is empty</li>
            ) : (
              cartItemsList.map(({ product, quantity }, index) => (
                <li
                  key={product._id || index}
                  className="flex justify-between text-gray-700 py-2 px-3 border-b border-gray-200 last:border-b-0"
                >
                  <span>{product.name}</span>
                  <span className="font-medium">x{quantity}</span>
                </li>
              ))
            )}
          </ul>
        </div>

        <hr className="border-gray-500/30 my-5" />

        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">Items ({getCartCount()})</p>
            <p className="text-gray-800">
              {currency}
              {getCartAmount()}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Shipping Fee</p>
            <p className="font-medium text-gray-800">Free</p>
          </div>
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>
              {currency}
              {getCartAmount()}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={createOrder}
        className="w-full bg-orange-600 text-white py-3 mt-5 hover:bg-orange-700 rounded-md"
        disabled={cartItemsList.length === 0}
      >
        Place Order
      </button>
    </div>
  );
};

export default OrderSummary;