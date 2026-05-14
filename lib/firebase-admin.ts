// import { initializeApp, getApps, cert } from "firebase-admin/app";
// import { getFirestore } from "firebase-admin/firestore";

// const app = getApps().length === 0
//     ? initializeApp({
//         credential: cert({
//             projectId: process.env.FIREBASE_PROJECT_ID,
//             clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//             privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
//         }),
//     })
//     : getApps()[0];

//     export const adminDb = getFirestore(app);
//     export const adminAuth = admin.auth();
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// console.log("🔵 Cargando configuración de Firebase Admin...", process.env.FIREBASE_PROJECT_ID, process.env.FIREBASE_CLIENT_EMAIL, process.env.FIREBASE_PRIVATE_KEY);

const app =
  getApps().length === 0
    ? initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      })
    : getApps()[0];

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);