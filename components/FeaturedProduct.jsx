'use client';

import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useRouter } from "next/navigation";

const products = [
  {
    id: 1,
    image: assets.girl_with_headphone_image,
    title: "Unparalleled Sound",
    description:
      "Experience crystal-clear audio with premium headphones.",
  },
  {
    id: 2,
    image: assets.holding_Keyboard_image,
    title: "Stay Connected",
    description:
      "Compact and stylish keyboards for every setup.",
  },
  {
    id: 3,
    image: assets.boy_with_laptop_image,
    title: "Power in Every Pixel",
    description:
      "Shop the latest laptops for work, gaming, and more.",
  },
];

const FeaturedProduct = () => {
  const router = useRouter();

  return (
    <div className="mt-14">
      {/* TITLE */}
      <div className="flex flex-col items-center">
        <p className="text-2xl font-medium text-center">
          Handpicked selections from CoreTech
        </p>

        <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-14 mt-12 md:px-14 px-4">

        {products.map(({ id, image, title, description }) => (
          <div
            key={id}
            className="relative group h-[600px] overflow-hidden rounded-xl"
          >
            {/* IMAGE */}
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 group-hover:brightness-75 transition duration-500"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-black/20"></div>

            {/* TEXT */}
            <div className="absolute bottom-8 left-8 text-white space-y-2 z-10 group-hover:-translate-y-3 transition duration-300">
              <p className="font-semibold text-2xl">
                {title}
              </p>

              <p className="text-sm md:text-base leading-6 max-w-64">
                {description}
              </p>

              <button
                onClick={() => router.push("/products")}
                className="mt-3 px-5 py-2 bg-orange-600 hover:bg-orange-700 transition rounded-full text-sm font-medium"
              >
                Shop Now
              </button>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default FeaturedProduct;