import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req) {
  const token = req.cookies.get('token')?.value;

  // console.log("PATH:", req.nextUrl.pathname);
  // console.log("TOKEN:", token);

  if (!token) {
    console.log("NO TOKEN → REDIRECT");
    return NextResponse.redirect(new URL('/control', req.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);

    // console.log("VALID TOKEN ");
    return NextResponse.next();
  } catch (err) {
    // console.log("INVALID TOKEN ");

    // delete the bad cookie
    const response = NextResponse.redirect(new URL('/control', req.url));
    response.cookies.delete('token');
    return response;
  }
}

export const config = {
  matcher: ['/users/:path*'],
};