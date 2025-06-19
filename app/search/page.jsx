"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/products");
      const data = await res.json();

      const filtered = data.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    };

    if (query) fetchData();
  }, [query]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Search results for: {query}</h1>
      {results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {results.map((item) => (
            <div key={item._id} className="border p-2 rounded">
              <img src={item.image} alt={item.name} className="w-full h-32 object-cover" />
              <p className="mt-2 text-sm font-medium">{item.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default SearchPage;
