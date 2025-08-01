import { NextResponse } from 'next/server'
import { getFirestore } from 'firebase-admin/firestore'
import { initializeApp, cert, getApps } from 'firebase-admin/app'


const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!)

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) })
}

const db = getFirestore()

export async function DELETE(_: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params
    await db.collection('loginDevices').doc(userId).delete()
    return NextResponse.json({ sucesso: true })
  } catch (error) {
    return NextResponse.json({ erro: 'Erro ao deletar loginDevice', detalhes: error }, { status: 500 })
  }
}
