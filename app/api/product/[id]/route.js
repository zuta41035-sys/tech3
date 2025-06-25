import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { Types } from "mongoose";

export async function GET(request, { params }) {
  const { id } = params;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid product ID" },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const { id } = params;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid product ID" },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    const body = await request.json();
    const { name, description, price, offerPrice } = body;

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    existingProduct.name = name;
    existingProduct.description = description;
    existingProduct.price = price;
    existingProduct.offerPrice = offerPrice;

    const updatedProduct = await existingProduct.save();

    return NextResponse.json(
      { success: true, message: "Product updated", product: updatedProduct },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid product ID" },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
