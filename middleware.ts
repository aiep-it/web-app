// web-app/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { AUTHOR_PROTECT, PUBLIC_ROUTES, USER_ROLE } from './constant/authorProtect';

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const currentPath = req.nextUrl.pathname;

  // --- 1) BYPASS RSC/FLIGHT REQUESTS (QUAN TRỌNG) ---
  const accept = req.headers.get('accept') || '';
  const isRSC = accept.includes('text/x-component') || req.headers.has('RSC');
  if (isRSC) {
    // Không redirect/rewrite gì cho RSC, để Next xử lý nội bộ
    return NextResponse.next();
  }

  // --- 2) BYPASS PUBLIC ROUTES ---
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }
  if (PUBLIC_ROUTES.some((route) => new RegExp(`^${route}$`, 'i').test(currentPath))) {
    return NextResponse.next();
  }

  // --- 3) TÌM ROUTE CẦN BẢO VỆ ---
  const matchedRoute = AUTHOR_PROTECT.find(({ routerUrl }) => {
    const regex = new RegExp(`^${routerUrl}$`, 'i');
    return regex.test(currentPath);
  });

  if (!matchedRoute) {
    // Không có rule đặc biệt -> cho qua
    return NextResponse.next();
  }

  // --- 4) BẮT ĐĂNG NHẬP ---
  await auth.protect();
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  // --- 5) CHECK ROLE ---
  interface SessionClaims {
    metadata?: { role?: string };
  }
  const role =
    ((sessionClaims as unknown as SessionClaims)?.metadata?.role ??
      USER_ROLE.ANONYMUS) as string;

  const allowedRoles = matchedRoute.role.map((r) => r.toUpperCase());
  if (!allowedRoles.includes(role.toString().toUpperCase())) {
    // Điều hướng hợp lý theo role thực tế
    if (role.toString().toUpperCase() === USER_ROLE.ADMIN) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return NextResponse.redirect(new URL('/', req.url));
  }

  // --- 6) (Optional) CHECK PERMISSIONS ---
  if (matchedRoute.permission?.length) {
    // TODO: Implement permission checks khi sẵn sàng
    // const allowedPermissions = matchedRoute.permission.map((p) => p.toUpperCase());
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Bỏ qua assets/nội bộ Next. Phần negative lookahead đã ổn,
    // nhưng thêm _vercel/favicons cho chắc.
    '/((?!_next|_vercel|favicon\\.ico|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
