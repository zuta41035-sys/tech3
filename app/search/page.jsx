"use client";
import { useSearchParams } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import ProductCard from "@/components/ProductCard";
import { useEffect, useState, Suspense } from "react";

// Component that uses useSearchParams - must be wrapped in Suspense
function SearchContent() {
  const { products } = useAppContext();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const [filteredResults, setFilteredResults] = useState([]);

  useEffect(() => {
    if (!query || products.length === 0) {
      setFilteredResults([]);
      return;
    }

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredResults(filtered);
  }, [products, query]);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-start px-6 md:px-16 lg:px-32 min-h-screen">
        <div className="flex flex-col items-center pt-12 w-full">
          <div className="p-6 text-center">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start px-6 md:px-16 lg:px-32 min-h-screen">
      <div className="flex flex-col items-center pt-12 w-full">
        <p className="text-2xl font-medium mb-2">
          Search results for: <span className="italic">{query}</span>
        </p>
        <div className="w-16 h-0.5 bg-orange-600 rounded-full mb-6"></div>

        {filteredResults.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
            {filteredResults.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center w-full">No results found.</p>
        )}
      </div>
    </div>
  );
}


function SearchLoading() {
  return (
    <div className="flex flex-col items-start px-6 md:px-16 lg:px-32 min-h-screen">
      <div className="flex flex-col items-center pt-12 w-full">
        <div className="p-6 text-center">Loading search...</div>
      </div>
    </div>
  );
}

// Main page component
const SearchPage = () => {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchContent />
    </Suspense>
  );
};

export default SearchPage;
