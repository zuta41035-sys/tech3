"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Loading from "@/components/Loading";
import { useAuth } from "@clerk/nextjs";

const Productid = () => {
  const { id } = useParams();
  const productId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { products, addToCart } = useAppContext();

  const [mainImage, setMainImage] = useState(null);
  const [productData, setProductData] = useState(null);

  const [showSignInToast, setShowSignInToast] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const product = products.find((product) => product._id === productId);
    setProductData(product);
    setMainImage(null);
  }, [productId, products]);

  if (!productData) return <Loading />;

  const getSafeImage = (img) => {
    if (typeof img !== "string" || img.trim() === "") {
      return "/placeholder.png";
    }
    return img;
  };

  const showToast = () => {
    setShowSignInToast(true);
    setTimeout(() => setShowSignInToast(false), 4000);
  };

  const handleBuyNow = () => {
    if (!isSignedIn) {
      showToast();
      return;
    }
    addToCart(productData._id);
    router.push("/cart");
  };

  const handleAddToCart = () => {
    if (!isSignedIn) {
      showToast();
      return;
    }
    addToCart(productData._id);
  };

  return (
    <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10 relative">
      {/* Toast popup for sign in warning */}
      <div
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 max-w-lg w-full bg-white text-black rounded-lg shadow-lg px-6 py-4
          transition-opacity duration-500 ${
            showSignInToast ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setShowSignInToast(false)}
        role="alert"
        aria-live="assertive"
      >
        <p className="font-semibold">Sign In Required</p>
        <p className="text-sm mt-1">
          Please sign in or sign up by clicking the{" "}
          <span className="underline font-semibold">Account</span> icon at the top right.
        </p>
        <small className="block mt-2 opacity-80 cursor-pointer">Click to dismiss</small>
      </div>


      {/* Rest of your component unchanged */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Left Image Section */}
        <div className="px-5 lg:px-16 xl:px-20">
          <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4">
            <Image
              src={getSafeImage(mainImage || (Array.isArray(productData.image) ? productData.image[0] : "/placeholder.png"))}
              alt={`Image of ${productData.name}`}
              className="w-full h-auto object-cover mix-blend-multiply"
              width={1280}
              height={720}
              priority
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {Array.isArray(productData.image) &&
              productData.image.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setMainImage(img)}
                  className="cursor-pointer rounded-lg overflow-hidden bg-gray-500/10"
                >
                  <Image
                    src={getSafeImage(img)}
                    alt={`Thumbnail of ${productData.name}`}
                    className="w-full h-auto object-cover mix-blend-multiply"
                    width={1280}
                    height={720}
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Right Info Section */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-medium text-gray-800/90 mb-4">
            {productData.name}
          </h1>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[...Array(4)].map((_, i) => (
                <Image
                  key={i}
                  className="h-4 w-4"
                  src={assets.star_icon}
                  alt="star"
                  width={16}
                  height={16}
                />
              ))}
              <Image
                className="h-4 w-4"
                src={assets.star_dull_icon}
                alt="star dull"
                width={16}
                height={16}
              />
            </div>
            <p>(4.5)</p>
          </div>

          <p className="text-gray-600 mt-3">{productData.description}</p>

          <p className="text-3xl font-medium mt-6">
            ${productData.offerPrice}
            <span className="text-base font-normal text-gray-800/60 line-through ml-2">
              ${productData.price}
            </span>
          </p>

          <hr className="bg-gray-600 my-6" />

          <div className="overflow-x-auto">
            <table className="table-auto border-collapse w-full max-w-72">
              <tbody>
                <tr>
                  <td className="text-gray-600 font-medium">Brand</td>
                  <td className="text-gray-800/50">{productData.brand || "N/A"}</td>
                </tr>
                <tr>
                  <td className="text-gray-600 font-medium">Color</td>
                  <td className="text-gray-800/50">{productData.color || "N/A"}</td>
                </tr>
                <tr>
                  <td className="text-gray-600 font-medium">Category</td>
                  <td className="text-gray-800/50">{productData.category || "N/A"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex items-center mt-10 gap-4">
            <button
              onClick={handleAddToCart}
              className="w-full py-3.5 bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
            >
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              className="w-full py-3.5 bg-orange-500 text-white hover:bg-orange-600 transition"
            >
              Buy now
            </button>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center mb-4 mt-16">
          <p className="text-3xl font-medium">
            Featured <span className="text-orange-600">Products</span>
          </p>
          <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
          {products.slice(0, 5).map((product) => (
            <ProductCard key={product._id || product.name} product={product} />
          ))}
        </div>

        <button
          onClick={() => router.push("/all-products")}
          className="px-12 py-2.5 mb-16 border rounded text-gray-500/70 hover:bg-slate-50/90 transition"
        >
          See more!
        </button>
      </div>
    </div>
  );
};

export default Productid;
