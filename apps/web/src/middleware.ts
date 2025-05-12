import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isLoggedInEdge } from '@/lib/api/auth'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = request.cookies.toString();
    console.log("Token: ", token);
    const isLoggedInResponse = await isLoggedInEdge(request);
    const url = request.nextUrl;
    if (isLoggedInResponse && (url.pathname.startsWith('/signin') || url.pathname.startsWith('/signup') || url.pathname.startsWith('/reset-password') || url.pathname.startsWith('/otp'))) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    if (isLoggedInResponse && (url.pathname.startsWith('/dashboard'))) {
        return NextResponse.next();
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/dashboard/:path*', '/signin/:path*', '/signup/:path*', '/reset-password/:path*', '/otp/:path*']

}