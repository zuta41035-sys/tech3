"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";

const EditProductPage = () => {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    offerPrice: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/product/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();

        setForm({
          name: data.name || "",
          description: data.description || "",
          price: data.price || "",
          offerPrice: data.offerPrice || "",
        });
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/product/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: Number(form.price),
          offerPrice: Number(form.offerPrice),
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update product");
      }

      toast.success("Product updated successfully");

      setTimeout(() => {
        router.push("/admin/product-list");
      }, 1000);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-3xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-lg ring-1 ring-gray-200">
      <h1 className="text-3xl font-semibold mb-8 text-gray-900">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
            Product Name
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm
                       focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
            placeholder="Enter product name"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
            Product Description
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm
                       focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition resize-none"
            placeholder="Enter product description"
          />
        </div>

        <div className="flex gap-6">
          <div className="flex-1">
            <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
              Price ($)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              value={form.price}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm
                         focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
              placeholder="0"
            />
          </div>

          <div className="flex-1">
            <label htmlFor="offerPrice" className="block text-sm font-semibold text-gray-700 mb-2">
              Offer Price ($)
            </label>
            <input
              id="offerPrice"
              name="offerPrice"
              type="number"
              min="0"
              value={form.offerPrice}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm
                         focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
              placeholder="0"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed
                     text-white font-semibold rounded-lg shadow-md transition"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
