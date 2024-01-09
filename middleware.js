import { NextResponse } from "next/server";

export function middleware(request) {

    //console.log(request.nextUrl);

    if (request.nextUrl.pathname.includes('/dashboard')) {
        /* console.log(request.nextUrl.pathname)
        console.log('dashboard middleware'); */
    }
    return NextResponse.next();
}