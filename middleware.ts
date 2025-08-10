// web-app/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { AUTHOR_PROTECT, PUBLIC_ROUTES, USER_ROLE } from './constant/authorProtect';
const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)']);

// const isProtectedRouter = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const currentPath = req.nextUrl.pathname;
  if (PUBLIC_ROUTES.some((route) => new RegExp(`^${route}$`, "i").test(currentPath))) {
    return NextResponse.next();
  }
  const matchedRoute = AUTHOR_PROTECT.find(({ routerUrl }) => {
    const regex = new RegExp(`^${routerUrl}$`, "i");
    return regex.test(currentPath);
  });

  if (matchedRoute) {
    
    await auth.protect();

    const { userId, sessionClaims } = await auth();
    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
    console.log("User ID:", userId);
    interface SessionClaims {
      metadata: {
        role?: string; // Define role as optional
      };
    }

    const { role = USER_ROLE.ANONYMUS }: { role?: string } = (sessionClaims as unknown as SessionClaims)?.metadata || {};
    // Check role
    const allowedRoles = matchedRoute.role.map((r) => r.toUpperCase());
    if (!allowedRoles.includes(role.toString().toUpperCase())) {
      // return new Response("Forbidden: Role not allowed", { status: 403 });
      if(role.toString().toUpperCase() === USER_ROLE.ADMIN) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      else {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    // // Check permission nếu config có
    if (matchedRoute.permission?.length) {
      const allowedPermissions = matchedRoute.permission.map((p) =>
        p.toUpperCase()
      );
      //TODO: Uncomment when permissions are implemented
    //  const hasPermission = allowedPermissions.every((perm) =>
    //     permissions.includes(perm)
    //   );
    //   if (!hasPermission) {
    //     return new Response("Forbidden: Missing permissions", { status: 403 });
    //   }
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
