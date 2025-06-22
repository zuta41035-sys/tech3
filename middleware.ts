import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware((auth, req) => {
  try {
    return NextResponse.next(); // ✅ Correct response
  } catch (error) {
    console.error('Clerk middleware error:', error);
    return NextResponse.next(); // still allow request even if error occurs
  }
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/(api|trpc)(.*)',
  ],
};
