import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import connectDB from "@/lib/db";
import Product from "@/models/Product";
import authSeller from "@/config/authSeller";
import cloudinary from "@/lib/cloudinary";

export async function POST(request) {
  try {
    // Auth
    const auth = getAuth(request);
    const { userId } = auth;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized user",
        },
        { status: 401 }
      );
    }

    // Seller check
    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authorized",
        },
        { status: 403 }
      );
    }

    // Request body
    const data = await request.json();

    // Connect DB
    await connectDB();

    console.log("Uploading images to Cloudinary...");

    // Upload all images
    const imagesUrl = await Promise.all(
      data.image.map(async (item) => {
        const result = await cloudinary.uploader.upload(item, {
          folder: "products",
        });

        return result.secure_url;
      })
    );

    console.log("Cloudinary Upload Success");

    // Create product
    const newProduct = await Product.create({
      userId,
      name: data.name,
      description: data.description,
      category: data.category,

      price: Number(data.price),
      offerPrice: Number(data.offerPrice),

      // Save cloudinary URLs
      image: imagesUrl,

      date: Date.now(),
    });

    return NextResponse.json({
      success: true,
      message: "Upload successful",
      newProduct,
    });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}