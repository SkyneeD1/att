// src/app/api/usuarios/create/route.ts
import { NextResponse } from 'next/server'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'


const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!)

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  })
}

const auth = getAuth()
const db = getFirestore()

export async function POST(request: Request) {
  try {
    const { email, senha, validade } = await request.json()

    // Cria o usuário no Firebase Auth
    const user = await auth.createUser({
      email,
      password: senha,
    })

    // Cria o documento de licença no Firestore
    await db.collection('Licencas').doc(user.uid).set({
      validade,
    })

    return NextResponse.json({ sucesso: true, uid: user.uid })
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    return NextResponse.json({ sucesso: false, erro: (error as Error).message }, { status: 500 })
   }
}
  }
}
 
