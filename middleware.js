// middleware.js (Root directory)
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req) {
  const token = req.cookies.get('token')?.value;
  const { pathname } = req.nextUrl;

  // Protect all routes starting with /users
  if (pathname.startsWith('/users')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
      const secret = new Uint8Array(Buffer.from(process.env.JWT_SECRET, 'utf-8'));
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (err) {
      // Token is invalid or expired
      const response = NextResponse.redirect(new URL('/login', req.url));
      response.cookies.delete('token'); // Clean up the bad cookie
      return response;
    }
  }

  return NextResponse.next();
}