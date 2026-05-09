// import { NextResponse } from "next/server"

// export async function POST() {
//   // 🧹 Borra el token de la cookie
//   const res = NextResponse.json({ message: "Logout exitoso" })
//   res.cookies.set("token", "", {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax",
//     path: "/",
//     expires: new Date(0), // expira inmediatamente
//   })
//   return res
// }