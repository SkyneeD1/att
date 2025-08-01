import { NextResponse } from 'next/server'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'


// Use environment variable for Firebase service account
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!)

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  })
}

const db = getFirestore()

export async function GET() {
  const snapshot = await db.collection('loginDevices').get()

  const lista = snapshot.docs.map(doc => {
    const data = doc.data()
    const deviceIds = Object.values(data) // Assume que há múltiplos campos dentro do doc, cada um um deviceId
    return {
      userId: doc.id,
      deviceInfos: deviceIds
    }
  })

  return NextResponse.json(lista)
}
