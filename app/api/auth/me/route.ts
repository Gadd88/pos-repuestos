// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// export async function GET() {
//   const cookieStore = await cookies()
//   const token = cookieStore.get("auth_token")?.value;
//   if (!token) {
//     return NextResponse.json({ message: "No autenticado" }, { status: 401 });
//   }

//   try {
//     const payload = jwt.verify(token, process.env.JWT_SECRET!);
//     return NextResponse.json({ user: payload });
//   } catch (err) {
//     return NextResponse.json({ message: "Token inválido" }, { status: 401 });
//   }
// }
