import { request } from "http";
import { NextRequest, NextResponse } from "next/server";


export const middleware = (req: NextRequest, res: NextResponse) => {

    const session = req.cookies.get('session')

    console.log(`METODO: ${req.method}, URL:${req.url}`)

    if(req.nextUrl.pathname.startsWith('/admin') && !session){
        return NextResponse.redirect(new URL('/login', req.url))
    }

    if(req.nextUrl.pathname === '/api' && !session){
        return NextResponse.redirect(new URL('/login', req.url))
    }

    if(req.nextUrl.pathname === '/login' && session){
        return NextResponse.redirect(new URL('/admin', req.url))
    }


    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*', '/login', '/api/:path*']
}