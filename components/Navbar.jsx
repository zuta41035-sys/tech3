"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useClerk, useUser, UserButton } from "@clerk/nextjs";
import { assets, BagIcon, CartIcon } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { openSignIn } = useClerk();
  const { user: clerkUser } = useUser();
  const { getCartCount } = useAppContext();

  const count = getCartCount();
  const user = clerkUser;
  const isSeller = clerkUser?.publicMetadata?.role === "seller";
  const isClient = user && !isSeller;

  const [searchQuery, setSearchQuery] = useState("");
  const [active, setActive] = useState("");

  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    if (trimmed) {
      router.push(`/search?query=${encodeURIComponent(trimmed)}`);
      setSearchQuery("");
    }
  };

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700 bg-white">

      {/* Logo */}
      <Link href="/">
        <Image
          src={assets.logo}
          alt="logo"
          className="w-28 md:w-32 cursor-pointer"
          priority
        />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-6">

        {/* Home */}
        <Link href="/" className="relative group">
          Home
          <span
            className={`absolute left-0 -bottom-1 h-[2px] bg-blue-600 transition-all duration-300 ease-out
            ${pathname === "/" ? "w-full" : "w-0 group-hover:w-full"}`}
          />
        </Link>

        {/* Shop */}
        <Link href="/all-products" className="relative group">
          Shop
          <span
            className={`absolute left-0 -bottom-1 h-[2px] bg-blue-600 transition-all duration-300 ease-out
            ${pathname === "/all-products" ? "w-full" : "w-0 group-hover:w-full"}`}
          />
        </Link>

        {/* About */}
        <Link href="/about-us" className="relative group">
          About Us
          <span
            className={`absolute left-0 -bottom-1 h-[2px] bg-blue-600 transition-all duration-300 ease-out
            ${pathname === "/about-us" ? "w-full" : "w-0 group-hover:w-full"}`}
          />
        </Link>

        {/* Contact */}
        <Link href="/Contact-Us" className="relative group">
          Contact
          <span
            className={`absolute left-0 -bottom-1 h-[2px] bg-blue-600 transition-all duration-300 ease-out
            ${pathname === "/Contact-Us" ? "w-full" : "w-0 group-hover:w-full"}`}
          />
        </Link>

        {/* Seller Dashboard */}
        {isSeller && (
          <Link
            href="/admin"
            className={`relative group text-xs border px-4 py-1.5 rounded-full transition hover:bg-gray-100`}
          >
            Seller Dashboard
          </Link>
        )}
      </div>

      {/* Search Bar */}
      <div className="hidden md:flex items-center border rounded px-2 bg-white transition hover:bg-gray-200 focus-within:bg-gray-200">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="outline-none text-sm px-2 py-1 bg-transparent"
        />
        <Image
          src={assets.search_icon}
          alt="search"
          className="w-4 h-4 cursor-pointer"
          onClick={handleSearch}
        />
      </div>

      {/* Cart + Account */}
      <div className="hidden md:flex items-center gap-4">

        {/* Cart */}
        <Link
          href="/cart"
          className={`relative flex items-center transition duration-200 ${
            pathname === "/cart" ? "text-blue-600" : "text-gray-700"
          }`}
        >
          <CartIcon className="w-6 h-6" />

          {count > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-600 text-white rounded-full px-1.5 text-xs font-bold">
              {count}
            </span>
          )}
        </Link>

        {/* Account */}
        {user ? (
          <UserButton>
            <UserButton.MenuItems>
              {isClient && (
                <UserButton.Action
                  label="Orders"
                  labelIcon={<BagIcon />}
                  onClick={() => router.push("/my-orders")}
                />
              )}
            </UserButton.MenuItems>
          </UserButton>
        ) : (
          <button
            onClick={() => {
              setActive("account");
              openSignIn();
            }}
            className={`flex items-center gap-2 relative group transition ${
              active === "account"
                ? "text-blue-600"
                : "text-gray-700"
            }`}
          >
            <Image src={assets.user_icon} alt="user icon" />
            Account

            <span
              className={`absolute left-0 -bottom-1 h-[2px] bg-blue-600 transition-all duration-300 ease-out
              ${active === "account" ? "w-full" : "w-0 group-hover:w-full"}`}
            />
          </button>
        )}
      </div>

      {/* Mobile */}
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
          <CartIcon className="w-8 h-8 text-gray-700" />
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