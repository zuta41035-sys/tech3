"use client";
import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";

const AddProduct = () => {
  const { getToken } = useAppContext();

  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Earphone");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [loading, setLoading] = useState(false);

  // Clean up created object URLs on unmount or file change
  useEffect(() => {
    return () => {
      if (file && file.previewUrl) {
        URL.revokeObjectURL(file.previewUrl);
      }
    };
  }, [file]);

  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return;

    // Validate file type (basic)
    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Only image files are allowed.");
      return;
    }

    // Create a preview URL for display
    const previewUrl = URL.createObjectURL(selectedFile);
    setFile(Object.assign(selectedFile, { previewUrl }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !price || !offerPrice) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!file) {
      toast.error("Please upload a product image.");
      return;
    }

    setLoading(true);

    try {
      const token = await getToken();
      let uploadedImageUrl = "";

      const imgForm = new FormData();
      imgForm.append("file", file);
      imgForm.append("upload_preset", "techs3");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dhecpwubj/image/upload",
        {
          method: "POST",
          body: imgForm,
        }
      );

      const data = await res.json();

      if (data.secure_url) {
        uploadedImageUrl = data.secure_url;
      } else {
        throw new Error(data.error?.message || "Image upload failed");
      }

      const productData = {
        name,
        description,
        category,
        price: Number(price),
        offerPrice: Number(offerPrice),
        image: [uploadedImageUrl], // Keep as array for consistency with your backend
        date: Date.now(),
      };

      const response = await axios.post("/api/product/add", productData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = response.data;

      if (result.success) {
        toast.success(result.message);
        // Reset form & file
        setFile(null);
        setName("");
        setDescription("");
        setCategory("Earphone");
        setPrice("");
        setOfferPrice("");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Upload failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex items-center gap-3 mt-2">
            <label htmlFor="image">
              <input
                type="file"
                id="image"
                hidden
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files[0])}
              />
              {file?.previewUrl || assets.upload_area ? (
                <Image
                  className="max-w-24 cursor-pointer"
                  src={
                    file?.previewUrl ||
                    assets.upload_area ||
                    "/images/placeholder.jpg"
                  }
                  alt="product-image"
                  width={100}
                  height={100}
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 flex items-center justify-center cursor-pointer rounded">
                  <span className="text-gray-500">Upload</span>
                </div>
              )}
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label htmlFor="product-name" className="text-base font-medium">
            Product Name
          </label>
          <input
            id="product-name"
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
            disabled={loading}
          />
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label htmlFor="product-description" className="text-base font-medium">
            Product Description
          </label>
          <textarea
            id="product-description"
            rows={4}
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
            disabled={loading}
          />
        </div>

        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex flex-col gap-1 w-32">
            <label htmlFor="category" className="text-base font-medium">
              Category
            </label>
            <select
              id="category"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              disabled={loading}
            >
              
              <option value=   "Earphone" >Earphone</option>
              <option value=  "Headphone" >Headphone</option>
              <option value=    "Laptop"  >Laptop</option>
              <option value=      "PC"    >PC</option>
              <option value=   "Monitor"  >Monitor</option>
              <option value="Accessories" >Accessories</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 w-32">
            <label htmlFor="product-price" className="text-base font-medium">
              Product Price
            </label>
            <input
              id="product-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
              disabled={loading}
              min={0}
            />
          </div>

          <div className="flex flex-col gap-1 w-32">
            <label htmlFor="offer-price" className="text-base font-medium">
              Offer Price
            </label>
            <input
              id="offer-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setOfferPrice(e.target.value)}
              value={offerPrice}
              required
              disabled={loading}
              min={0}
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Uploading..." : "ADD"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;