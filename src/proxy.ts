import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';



export default async function proxy(req: NextRequest) {
  const requestHeaders = new Headers(req.headers);
  
  if (process.env.NODE_ENV === 'development') {
    const xForwardedHost = requestHeaders.get('x-forwarded-host');
    const origin = requestHeaders.get('origin');
    
    if (xForwardedHost && (xForwardedHost.includes('devtunnels.ms') || xForwardedHost.includes('app.github.dev'))) {
      if (origin) {
        try {
          const originUrl = new URL(origin);
          requestHeaders.set('x-forwarded-host', originUrl.host);
        } catch (e) {}
      }
    }
  }

  const url = req.nextUrl;

  const isWaitlistApi = url.pathname === '/api/waitlist';
  const isExplorerCardApi = url.pathname === '/api/explorercard';
  const isAuthApi = url.pathname.startsWith('/api/auth');
  const isViewExplorerCard = url.pathname.startsWith('/view/explorercard');
  const isPublicProfileFrontend = url.pathname.startsWith('/profiles/');
  const isPublicResourceApi = 
    url.pathname.startsWith('/api/blogs') ||
    url.pathname.startsWith('/api/profiles') ||
    url.pathname.startsWith('/api/testimonials') ||
    url.pathname.startsWith('/api/upload') ||
    url.pathname.startsWith('/api/proxy-image');

  const isLoginPage = url.pathname === '/admin/login';
  const isAdminLoginApi =
    url.pathname.startsWith('/api/admin/login') ||
    url.pathname.startsWith('/api/cms/login');
  const isJoinExplorerCard = url.pathname.startsWith('/join/explorercard');
  const isEditExplorerCard = url.pathname.startsWith('/edit/explorercard');

  // Allow the public APIs and login routes without auth.
  if (isWaitlistApi || isExplorerCardApi || isViewExplorerCard || isPublicProfileFrontend || isJoinExplorerCard || isEditExplorerCard || isAuthApi || isPublicResourceApi || isLoginPage || isAdminLoginApi) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Require auth for every other route.
  // Django sets admin_session or cms_session cookies upon successful login.
  const hasAdminSession = req.cookies.has('admin_session');
  const hasCmsSession = req.cookies.has('cms_session');
  
  const isAuthenticated = hasAdminSession || hasCmsSession;

  if (isAuthenticated) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  if (url.pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const loginUrl = new URL('/admin/login', req.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    /*
     * Match ALL routes except Next.js internals and static files.
     * The login page bypass is handled inside the middleware function above.
     */
    '/((?!_next/static|_next/image|favicon\\.ico|inter-display/|images/|icons/|flags/).*)',
  ],
};
