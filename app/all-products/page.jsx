"use client";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";

const SearchPage = () => {
  const { products } = useAppContext();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) {
      // Show all products if no search query
      setResults(products);
      return;
    }

    // Filter products by search query
    const filtered = products.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filtered);
  }, [products, query]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-start px-6 md:px-16 lg:px-32 min-h-screen">
        <div className="flex flex-col items-center pt-12 w-full">
          <p className="text-2xl font-medium mb-2">
            {query ? `Search results for: ${query}` : "All products"}
          </p>
          <div className="w-16 h-0.5 bg-orange-600 rounded-full mb-6"></div>

          {results.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
              {results.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center w-full">
              {query ? "No results found." : "No products available."}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchPage;
