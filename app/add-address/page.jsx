'use client';

import { assets } from "@/assets/assets";
import Image from "next/image";
import { useState } from "react";

const AddAddress = () => {
  const [address, setAddress] = useState({
    fullName: '',
    phoneNumber: '',
    area: '',
    city: '',
  });

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(address),
      });

      if (!response.ok) {
        throw new Error("Failed to save address");
      }

      const resData = await response.json();
      alert("✅ Address saved successfully with ID: " + resData.id);

      setAddress({ fullName: '', phoneNumber: '', area: '', city: '' });
    } catch (error) {
      alert("❌ " + error.message);
    }
  };

  return (
    <div className="px-6 md:px-16 lg:px-32 py-16 flex flex-col md:flex-row justify-between">
      <form onSubmit={onSubmitHandler} className="w-full">
        <p className="text-2xl md:text-3xl text-gray-500">
          Add Shipping <span className="font-semibold text-orange-600">Address</span>
        </p>
        <div className="space-y-4 max-w-sm mt-10">
          <input
            className="px-4 py-3 focus:border-orange-500 transition border border-gray-500/30 rounded-lg outline-none w-full text-gray-600"
            type="text"
            placeholder="Full name"
            value={address.fullName}
            onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
            required
          />
          <input
            className="px-4 py-3 focus:border-orange-500 transition border border-gray-500/30 rounded-lg outline-none w-full text-gray-600"
            type="text"
            placeholder="Phone number"
            value={address.phoneNumber}
            onChange={(e) => setAddress({ ...address, phoneNumber: e.target.value })}
            required
          />
          <textarea
            className="px-4 py-3 focus:border-orange-500 transition border border-gray-500/30 rounded-lg outline-none w-full text-gray-600 resize-none"
            placeholder="Address (Area and Street)"
            rows={4}
            value={address.area}
            onChange={(e) => setAddress({ ...address, area: e.target.value })}
            required
          ></textarea>
          <input
            className="px-4 py-3 focus:border-orange-500 transition border border-gray-500/30 rounded-lg outline-none w-full text-gray-600"
            type="text"
            placeholder="City/District/Town"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            required
          />
        </div>
        <button
          type="submit"
          className="max-w-sm w-full mt-6 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 uppercase"
        >
          Save address
        </button>
      </form>

      <Image
        className="md:mr-16 mt-16 md:mt-0"
        src={assets.my_location_image}
        alt="my_location_image"
      />
    </div>
  );
};

export default AddAddress;
