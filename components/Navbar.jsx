"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useClerk, UserButton } from "@clerk/nextjs";
import { assets, BagIcon, CartIcon } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isSeller, user, getCartCount } = useAppContext();
  const { openSignIn } = useClerk();
  const [searchQuery, setSearchQuery] = useState("");
  const count = getCartCount();

  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    if (trimmed) {
      router.push(`/search?query=${encodeURIComponent(trimmed)}`);
      setSearchQuery("");
    }
  };

  const navLinkClass = (path) =>
    `transition duration-200 hover:text-blue-600 hover:underline underline-offset-4 ${
      pathname === path ? "text-blue-600 font-medium underline" : ""
    }`;

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700 bg-white">
      <Link href="/">
        <Image
          src={assets.logo}
          alt="logo"
          className="w-28 md:w-32 cursor-pointer"
          priority
        />
      </Link>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-6">
        <Link href="/" className={navLinkClass("/")}>
          Home
        </Link>
        <Link href="/all-products" className={navLinkClass("/all-products")}>
          Shop
        </Link>
        <Link href="/about-us" className={navLinkClass("/about-us")}>
          About Us
        </Link>
        <Link href="/Contact-Us" className={navLinkClass("/Contact-Us")}>
          Contact
        </Link>
        {isSeller && (
          <Link
            href="/admin"
            className={`text-xs border px-4 py-1.5 rounded-full transition hover:bg-gray-100 ${
              pathname === "/admin" ? "bg-gray-100 text-blue-600 font-semibold" : ""
            }`}
          >
            Seller Dashboard
          </Link>
        )}
      </div>

      {/* Search Bar */}
      <div className="hidden md:flex items-center border rounded px-2 bg-white">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="outline-none text-sm px-2 py-1"
        />
        <Image
          src={assets.search_icon}
          alt="search"
          className="w-4 h-4 cursor-pointer"
          onClick={handleSearch}
        />
      </div>

      {/* Cart & Account */}
      <div className="hidden md:flex items-center gap-4">
        <Link href="/cart" className="relative cursor-pointer">
          <CartIcon className="w-6 h-6 text-gray-700 hover:text-gray-900 transition" />
          {count > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-600 text-white rounded-full px-1.5 text-xs font-bold">
              {count}
            </span>
          )}
        </Link>

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

      {/* Mobile Nav */}
      <div className="flex items-center md:hidden gap-3">
        {isSeller && (
          <Link
            href="/admin"
            className="text-xs border px-4 py-1.5 rounded-full inline-block text-center"
          >
            Seller Dashboard
          </Link>
        )}
        <Link href="/cart" className="relative cursor-pointer p-1">
          <CartIcon className="w-8 h-8 text-gray-700 hover:text-gray-900" />
          {count > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-600 text-white rounded-full px-1.5 text-xs font-bold">
              {count}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
