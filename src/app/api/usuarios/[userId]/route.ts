import { NextRequest, NextResponse } from 'next/server'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

// Carrega a chave de serviço do Firebase da variável de ambiente
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!)

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  })
}

const auth = getAuth()
const db = getFirestore()

interface Context {
  params: Promise<{
    userId: string
  }>
}

// PUT (edição de validade)
export async function PUT(request: NextRequest, context: Context) {
  const { userId } = await context.params
  const { validade } = await request.json()

  try {
    await db.collection('Licencas').doc(userId).update({ validade })
    return NextResponse.json({ sucesso: true })
  } catch (error) {
    console.error('Erro ao atualizar validade:', error)
    return NextResponse.json({ erro: 'Erro ao atualizar validade.' }, { status: 500 })
  }
}

// DELETE (remoção do usuário)
export async function DELETE(request: NextRequest, context: Context) {
  const { userId } = await context.params

  try {
    await auth.deleteUser(userId)
    await db.collection('Licencas').doc(userId).delete()
    return NextResponse.json({ sucesso: true })
  } catch (error) {
    console.error('Erro ao deletar usuário:', error)
    return NextResponse.json({ erro: 'Erro ao deletar usuário.' }, { status: 500 })
}
} })
  }
}
