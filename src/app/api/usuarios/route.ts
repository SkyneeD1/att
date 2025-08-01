// src/app/api/usuarios/route.ts
import { NextResponse } from 'next/server'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'


// Use environment variable for Firebase service account
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!)

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  })
}

const auth = getAuth()
const db = getFirestore()

export async function GET() {
  const listaFinal = []
  let nextPageToken

  do {
    const result = await auth.listUsers(1000, nextPageToken)
    for (const userRecord of result.users) {
      const uid = userRecord.uid
      const email = userRecord.email
      const licencaDoc = await db.collection('Licencas').doc(uid).get()
      const validade = licencaDoc.exists ? licencaDoc.data().validade : '❌ Sem licença'
      listaFinal.push({ uid, email, validade })
    }
    nextPageToken = result.pageToken
  } while (nextPageToken)

  return NextResponse.json(listaFinal)
}