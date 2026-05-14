import { NextRequest, NextResponse } from "next/server";


export const middleware = (req: NextRequest, res: NextResponse) => {

    const session = req.cookies.get('session')
    console.log("SESSION EN MIDDLEWARE:", session)

    console.log(`METODO: ${req.method}, URL:${req.url}`)

    if (req.nextUrl.pathname.startsWith('/admin') && !session) {
        console.log("MIDDLEWARE LOG: Redirigiendo /admin a /login (sin sesión)");
        return NextResponse.redirect(new URL('/login', req.url))
    }

    if (req.nextUrl.pathname.startsWith('/api') && !session) {
        console.log("MIDDLEWARE LOG: Redirigiendo /api/* a /login (sin sesión)");
        return NextResponse.redirect(new URL('/login', req.url))
    }

    if (req.nextUrl.pathname === '/login' && session) {
        console.log("MIDDLEWARE LOG: Redirigiendo /login a /admin (con sesión)");
        return NextResponse.redirect(new URL('/admin', req.url))
    }

    console.log("MIDDLEWARE LOG: Continuando a la siguiente ruta o handler.");

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*', '/login', '/api/:path*']
}