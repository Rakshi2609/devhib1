import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'rakshithganjimut.xyz'

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  const host = req.headers.get('host') || ''

  // Strip port (for local dev where host might be "localhost:3000")
  const hostname = host.split(':')[0]

  // Extract subdomain by removing the root domain
  // e.g. "user1.rakshithganjimut.xyz" → "user1"
  // e.g. "localhost" → ""
  let subdomain = ''

  if (hostname.endsWith(`.${ROOT_DOMAIN}`)) {
    subdomain = hostname.replace(`.${ROOT_DOMAIN}`, '')
  } else if (hostname !== ROOT_DOMAIN && hostname !== 'www' && hostname !== 'localhost' && hostname !== '127.0.0.1') {
    // Potential custom domain – treat entire hostname as subdomain key for dev
    subdomain = hostname
  }

  const isIgnored = !subdomain || subdomain === 'www'

  if (!isIgnored) {
    // Rewrite to internal /sites/[subdomain] path
    url.pathname = `/sites/${subdomain}${url.pathname === '/' ? '' : url.pathname}`
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  // Don't run middleware on API routes, Next internals, or static files
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
