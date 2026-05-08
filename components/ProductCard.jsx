"use client";

import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";

const ProductCard = ({ product }) => {
  const { currency, addToCart } = useAppContext();
  const router = useRouter();

  const imageSrc =
    product?.image?.[0] && typeof product.image[0] === "string"
      ? product.image[0]
      : "/placeholder.jpg";

  return (
    <div
      onClick={() => {
        router.push("/all-products/productid/" + product._id);
        scrollTo(0, 0);
      }}
      className="flex flex-col items-start gap-0.5 max-w-[200px] w-full cursor-pointer"
    >
      <div className="group relative bg-white rounded-lg w-full h-52 flex items-center justify-center p-3 shadow-md">
        <Image
          src={imageSrc}
          alt={product?.name || "Product Image"}
          className="group-hover:scale-105 transition-transform duration-300 object-contain w-full h-full"
          width={800}
          height={800}
          unoptimized
        />
        <button
          className="group absolute top-2 right-2 bg-white p-2 rounded-full shadow-md transition hover:bg-red-500"
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product._id);
          }}
          aria-label="Add to cart"
        >
          <Image
            className="h-3 w-3 transition group-hover:brightness-0 group-hover:invert"
            src={assets.heart_icon}
            alt="heart_icon"
          />
        </button>
      </div>

      <p className="md:text-base font-medium pt-2 w-full truncate">
        {product.name}
      </p>
      <p className="w-full text-xs text-gray-500/70 max-sm:hidden truncate">
        {product.description}
      </p>

      <div className="flex items-center gap-2">
        <p className="text-xs">4.5</p>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Image
              key={index}
              className="h-3 w-3"
              src={
                index < 4 ? assets.star_icon : assets.star_dull_icon
              }
              alt="star_icon"
            />
          ))}
        </div>
      </div>

      <div className="flex items-end justify-between w-full mt-1">
        <p className="text-base font-medium">
          {currency}
          {product.offerPrice}
        </p>
        <button className="max-sm:hidden px-4 py-1.5 text-gray-500 border border-gray-500/20 rounded-full text-xs transition hover:bg-red-500 hover:text-white">
          Buy now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
