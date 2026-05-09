// import { type NextRequest, NextResponse } from "next/server"
// import cloudinary from "@/lib/cloudinary"

// export async function POST(request: NextRequest) {
//   try {
//     const formData = await request.formData()
//     const file = formData.get("file") as File

//     if (!file) {
//       return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
//     }

//     // Convert file to buffer
//     const bytes = await file.arrayBuffer()
//     const buffer = Buffer.from(bytes)

//     // Upload to Cloudinary
//     const result = await new Promise((resolve, reject) => {
//       cloudinary.uploader
//         .upload_stream(
//           {
//             resource_type: "auto",
//             folder: "saade-motos",
//             transformation: [{ width: 800, height: 600, crop: "limit" }, { quality: "auto" }, { format: "auto" }],
//           },
//           (error, result) => {
//             if (error) reject(error)
//             else resolve(result)
//           },
//         )
//         .end(buffer)
//     })

//     return NextResponse.json({
//       success: true,
//       data: {
//         url: (result as any).secure_url,
//         public_id: (result as any).public_id,
//       },
//     })
//   } catch (error: any) {
//     console.error("Error uploading to Cloudinary:", error)
//     return NextResponse.json({ success: false, error: error.message || "Upload failed" }, { status: 500 })
//   }
// }
