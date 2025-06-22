"use client";

import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [input, setInput] = useState("");

  const handleChange = (e) => {
    setInput(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="w-full max-w-md mx-auto py-6">
      <input
        type="text"
        value={input}
        onChange={handleChange}
        placeholder="Search products..."
        className="w-full border border-gray-300 rounded px-4 py-2"
      />
    </div>
  );
};

export default SearchBar;
