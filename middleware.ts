// // web-app/middleware.ts
// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
// import { NextResponse } from 'next/server';

// const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)']);

// const isProtectedRouter = createRouteMatcher(['/admin(.*)']);

// export default clerkMiddleware(async (auth, req) => {

//   if (!isPublicRoute(req)) {
//     const session = await auth();
//   if (!session.userId) {
//     return NextResponse.redirect(new URL('/', req.url)); 
//   }
//   }
  


// });
// export const config = {
//   matcher: [
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     '/(api|trpc)(.*)',
//   ],
// };
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return;

  const session = await auth();
  if (!session.userId) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  const pathname = req.nextUrl.pathname;
  const token = await session.getToken(); // lấy access token từ Clerk
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  try {
    const res = await fetch(`${apiUrl}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    const user = await res.json();
    const role = user?.role;

    // ⚠️ Quy tắc phân quyền
    const roleAccessMap: Record<string, string> = {
      '/admin': 'admin',
      '/teacher': 'teacher',
      '/staff': 'staff',
      '/student': 'student',
      '/parent': 'parent',
    };

    for (const path in roleAccessMap) {
      if (pathname.startsWith(path) && role !== roleAccessMap[path]) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    return NextResponse.next();
  } catch (err) {
    console.error('Error in middleware role fetch:', err);
    return NextResponse.redirect(new URL('/', req.url));
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
