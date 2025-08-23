// web-app/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import {
  AUTHOR_PROTECT,
  PUBLIC_ROUTES,
  STUDENT_STATUS,
  USER_ROLE,
} from './constant/authorProtect';

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const currentPath = req.nextUrl.pathname;

  const accept = req.headers.get('accept') || '';
  const isRSC = accept.includes('text/x-component') || req.headers.has('RSC');
  if (isRSC) {
    return NextResponse.next();
  }

  if (isPublicRoute(req)) {
    const { userId, sessionClaims } = await auth();

    interface SessionClaims {
      metadata?: { role?: string; status?: string };
    }
    const role = ((sessionClaims as unknown as SessionClaims)?.metadata?.role ??
      USER_ROLE.ANONYMUS) as string;
    console.log('Public route accessed by role:', role);
    if (role.toUpperCase() === USER_ROLE.STUDENT) {
      const status =
        (
          sessionClaims as unknown as SessionClaims
        )?.metadata?.status?.toUpperCase() || STUDENT_STATUS.ACTIVATE;
      if (status !== STUDENT_STATUS.ACTIVATE) {
        console.log('Student status is not active:', status);
        return NextResponse.redirect(new URL('/405', req.url));
      }
    }
    return NextResponse.next();
  }
  if (
    PUBLIC_ROUTES.some((route) =>
      new RegExp(`^${route}$`, 'i').test(currentPath),
    )
  ) {
    return NextResponse.next();
  }

  const matchedRoute = AUTHOR_PROTECT.find(({ routerUrl }) => {
    const regex = new RegExp(`^${routerUrl}$`, 'i');
    return regex.test(currentPath);
  });

  if (!matchedRoute) {
    return NextResponse.next();
  }

  await auth.protect();
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }
  interface SessionClaims {
    metadata?: { role?: string; status?: string };
  }
  const role = ((sessionClaims as unknown as SessionClaims)?.metadata?.role ??
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
