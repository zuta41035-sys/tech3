import { NextResponse } from 'next/server';
import connectDB from '@/config/mongodb'; 
import Product from '@/models/Product';

export async function GET() {
  await connectDB();
  const products = await Product.find({});
  return NextResponse.json(products);
}

export async function POST(req) {
  await connectDB();
  const data = await req.json();
  console.log('Incoming product:', data); 

  try {
    const newProduct = new Product(data);
    const saved = await newProduct.save();
    return NextResponse.json(saved);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
