// import { NextResponse } from "next/server";
// import {
//     collection,
//     doc,
//     getDocs,
//     getDoc,
//     addDoc,
//     updateDoc,
//     deleteDoc,
//     query,
//     orderBy,
//     where,
//     Timestamp,
//     writeBatch,
//     serverTimestamp,
//     increment,
// } from "firebase/firestore";
// import { collection, getDocs } from "firebase/firestore/lite"
// import { db } from "@/config/firebase"
// import { ProductoType } from "@/lib/types";

// export async function GET(){

//         const COLLECTION_NAME = "productos"
//     try{
//         const productosRef = collection(db, COLLECTION_NAME);
//         const q = query(productosRef, orderBy("nombre", "asc"));
//         const snapshot = await getDocs(q);
//         const productosList = snapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//             creadoEn: doc.data().creadoEn?.toDate() || new Date(),
//             actualizadoEn: doc.data().actualizadoEn?.toDate() || new Date(),
//         })) as ProductoType[];
    
//         return NextResponse.json(productosList)
//     }catch(error){
//         console.error(error)
//         return NextResponse.json({sucess: false, error}, {status: 500})
//     }
// }

// export async function POST(req: Request) {
//     const COLLECTION_NAME = "productos"
//     try {
//         const body = await req.json();
//         const ahora = Timestamp.now();

//         const newProducto = {
//             ...body,
//             creadoEn: ahora,
//             actualizadoEn: ahora
//         };
//         const docRef = await addDoc(collection(db, COLLECTION_NAME), newProducto);
//         const createdProducto = { id: docRef.id, ...newProducto } as ProductoType;
//         return NextResponse.json(createdProducto);
//     }
//     catch (error) {
//         console.error(error);
//         return NextResponse.json({ success: false, error }, { status: 500 });
//     }

// }