import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  const { id } = params;
  await connectDB();

  try {
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Order deleted' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
