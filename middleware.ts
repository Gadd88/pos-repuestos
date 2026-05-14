import { NextRequest, NextResponse } from "next/server";


export const middleware = (req: NextRequest, res: NextResponse) => {

    const session = req.cookies.get('session')
    
    console.log(`METODO: ${req.method}, URL:${req.url}, PATHNAME:${req.nextUrl.pathname}, SESSION_EXISTS: ${!!session}`);

    if (req.nextUrl.pathname.startsWith('/admin') && !session) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    // if (req.nextUrl.pathname.startsWith('/api') && !session) {
    //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    if (req.nextUrl.pathname === '/login' && session) {
        return NextResponse.redirect(new URL('/admin', req.url))
    }


    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*', '/login']
    // , '/api/:path*'
}