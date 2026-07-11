import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || 'change-this-admin-session-secret';
}

async function verifyAdminSessionTokenEdge(token: string) {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const expRaw = parts[0];
  const nonce = parts[1];
  const providedSig = parts[2];

  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp <= Math.floor(Date.now() / 1000)) {
    return false;
  }

  const payload = `${expRaw}.${nonce}`;
  const secret = getSessionSecret();

  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const sigBytes = new Uint8Array(
      providedSig.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
    );

    return await crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(payload));
  } catch (e) {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  
  const isAdminRoute = url.pathname.startsWith('/admin');
  const isAdminApiRoute = url.pathname.startsWith('/api/admin');
  
  // Allow access to public routes
  if (!isAdminRoute && !isAdminApiRoute) {
    return NextResponse.next();
  }

  // Allow access to the login page and admin API routes
  if (
    url.pathname === '/admin/login' || 
    url.pathname.startsWith('/api/admin/login') ||
    url.pathname.startsWith('/api/cms/login') ||
    url.pathname.startsWith('/_next')
  ) {
    return NextResponse.next();
  }

  // Check for the admin session cookie
  const SESSION_COOKIE_NAME = "travingat_cms_session";
  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (sessionCookie && (await verifyAdminSessionTokenEdge(sessionCookie))) {
    return NextResponse.next();
  }

  // Redirect to admin login if not authenticated
  const loginUrl = new URL('/admin/login', req.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
