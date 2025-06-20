"use client";
import React, { useState } from "react";
import { assets, BagIcon, CartIcon } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const { isSeller, router, user, getCartCount } = useAppContext();
  const { openSignIn } = useClerk();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    if (trimmed) {
      router.push(`/search?query=${encodeURIComponent(trimmed)}`);
      setSearchQuery(""); // optional: clear input after search
    }
  };

  const count = getCartCount();

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={() => router.push("/")}
        src={assets.logo}
        alt="logo"
      />

      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/">
          <span className="hover:text-gray-900 transition">Home</span>
        </Link>
        <Link href="/all-products">
          <span className="hover:text-gray-900 transition">Shop</span>
        </Link>
        <Link href="/about-us">
          <span className="hover:text-gray-900 transition">About Us</span>
        </Link>
        <Link href="/Contact-Us">
          <span className="hover:text-gray-900 transition">Contact</span>
        </Link>


        {isSeller && (
          <button
            onClick={() => router.push("/seller")}
            className="text-xs border px-4 py-1.5 rounded-full"
          >
            Seller Dashboard
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="hidden md:flex items-center border rounded px-2 bg-white">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          className="outline-none text-sm px-2 py-1"
        />
        <Image
          src={assets.search_icon}
          alt="search"
          className="w-4 h-4 cursor-pointer"
          onClick={handleSearch}
        />
      </div>

      <div className="hidden md:flex items-center gap-4">
        <div
          className="relative cursor-pointer"
          onClick={() => router.push("/cart")}
          aria-label="View cart"
          title="View cart"
        >
          <CartIcon className="w-6 h-6 text-gray-700 hover:text-gray-900" />
          {count > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-600 text-white rounded-full px-1.5 text-xs font-bold select-none">
              {count}
            </span>
          )}
        </div>

        {user ? (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="Orders"
                labelIcon={<BagIcon />}
                onClick={() => router.push("/my-orders")}
              />
            </UserButton.MenuItems>
          </UserButton>
        ) : (
          <button
            onClick={openSignIn}
            className="flex items-center gap-2 hover:text-gray-900 transition"
          >
            <Image src={assets.user_icon} alt="user icon" />
            Account
          </button>
        )}
      </div>

      <div className="flex items-center md:hidden gap-3">
        {isSeller && (
          <button
            onClick={() => router.push("/seller")}
            className="text-xs border px-4 py-1.5 rounded-full"
          >
            Seller Dashboard
          </button>
        )}

        <div
          className="relative cursor-pointer p-1"
          onClick={() => router.push("/cart")}
          aria-label="View cart"
          title="View cart"
        >
          <CartIcon className="w-8 h-8 text-gray-700 hover:text-gray-900" />
          {count > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-600 text-white rounded-full px-1.5 text-xs font-bold select-none">
              {count}
            </span>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
