import { NextRequest, NextResponse } from "next/server";


export const middleware = (req: NextRequest, res: NextResponse) => {

    const session = req.cookies.get('session')
    const pathname = req.nextUrl.pathname
    // console.log(`METODO: ${req.method}, URL:${req.url}, PATHNAME:${req.nextUrl.pathname}, SESSION: ${!!session}`);

    if (!session) {
        if (pathname === "/login") {
            return NextResponse.next()
        }
        return NextResponse.redirect(new URL('/login', req.url))
    }


    let sessionData

    try {
        sessionData = JSON.parse(session.value)
        // console.log(sessionData)
    } catch (err) {
        console.error("Error parsing session data:", err);
        return NextResponse.redirect(new URL('/login', req.url))
    }



    if (pathname === '/login') {
        return NextResponse.redirect(new URL('/admin', req.url))
    }
    if (sessionData?.esSuperAdmin) {
        return NextResponse.next()
    }

    if (!sessionData?.activo) {
        if (pathname === "/inactivo") {
            return NextResponse.next()
        }
        return NextResponse.redirect(new URL("/inactivo", req.url))
    }


    
    return NextResponse.next()
    
}

export const config = {
    matcher: ['/admin/:path*', '/login', '/inactivo']
    // , '/api/:path*'
}

// if (req.nextUrl.pathname.startsWith('/admin') && !session) {
//     return NextResponse.redirect(new URL('/login', req.url))
// }

// if (req.nextUrl.pathname.startsWith('/api') && !session) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
// }