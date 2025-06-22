import { NextResponse } from 'next/server';
import Product from '@/models/Product';
import connectDB from '@/lib/db';

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching products' }, { status: 500 });
  }
}
