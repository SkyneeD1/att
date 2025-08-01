'use client'

import { useEffect, useState } from 'react'

interface Usuario {
  uid: string
  email: string
  validade: string
}

interface LoginDevice {
  userId: string
  deviceInfos: string[]
}

export default function PainelLicencas() {
  const [autenticado, setAutenticado] = useState(false)
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [dispositivos, setDispositivos] = useState<LoginDevice[]>([])
  const [abaAtiva, setAbaAtiva] = useState('usuarios')
  const [novoEmail, setNovoEmail] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [novaValidade, setNovaValidade] = useState('')
  const [editandoUid, setEditandoUid] = useState('')
  const [validadeEditando, setValidadeEditando] = useState('')

  const logar = async () => {
    if (email === 'SkyneeD' && senha === '200817Luna@') {
      setAutenticado(true)
      carregarUsuarios()
      carregarDispositivos()
    } else {
      setMensagem('Credenciais inválidas')
    }
  }

  const carregarUsuarios = async () => {
    try {
      const response = await fetch('/api/usuarios')
      const data = await response.json()
      setUsuarios(data)
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    }
  }

  const carregarDispositivos = async () => {
    try {
      const response = await fetch('/api/usuarios/loginDevices')
      const data = await response.json()
      setDispositivos(data)
    } catch (error) {
      console.error('Erro ao carregar dispositivos:', error)
    }
  }

  const criarUsuario = async () => {
    try {
      const response = await fetch('/api/usuarios/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: novoEmail, senha: novaSenha, validade: novaValidade })
      })

      if (response.ok) {
        setNovoEmail('')
        setNovaSenha('')
        setNovaValidade('')
        carregarUsuarios()
      }
    } catch (error) {
      console.error('Erro ao criar usuário:', error)
    }
  }

  const deletarUsuario = async (uid: string) => {
    if (confirm('Tem certeza que deseja deletar este usuário?')) {
      try {
        const response = await fetch(`/api/usuarios/${uid}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          carregarUsuarios()
        }
      } catch (error) {
        console.error('Erro ao deletar usuário:', error)
      }
    }
  }

  const salvarEdicao = async (uid: string) => {
    try {
      const response = await fetch(`/api/usuarios/${uid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ validade: validadeEditando })
      })

      if (response.ok) {
        setEditandoUid('')
        setValidadeEditando('')
        carregarUsuarios()
      }
    } catch (error) {
      console.error('Erro ao salvar edição:', error)
    }
  }

  const deletarDispositivo = async (userId: string, deviceInfo: string) => {
    if (confirm('Tem certeza que deseja deletar este dispositivo?')) {
      try {
        const response = await fetch(`/api/usuarios/loginDevices/${userId}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          carregarDispositivos()
        }
      } catch (error) {
        console.error('Erro ao deletar dispositivo:', error)
      }
    }
  }

  const groupDevices = () => {
    const agrupados: Record<string, string[]> = {}
    dispositivos.forEach(device => {
      agrupados[device.userId] = device.deviceInfos
    })
    return agrupados
  }

  useEffect(() => {
    if (autenticado) {
      carregarUsuarios()
      carregarDispositivos()
    }
  }, [autenticado])

  const dispositivosAgrupados = groupDevices()

  return (
    <div className="min-h-screen bg-black text-cyan-300 p-6 font-sans">
      {!autenticado ? (
        <div className="max-w-md mx-auto mt-32 p-6 bg-gray-900 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
          <input 
            type="text" 
            placeholder="Usuário" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            className="w-full p-2 mb-3 border border-cyan-400 bg-black text-cyan-300 rounded" 
          />
          <input 
            type="password" 
            placeholder="Senha" 
            value={senha} 
            onChange={e => setSenha(e.target.value)} 
            className="w-full p-2 mb-3 border border-cyan-400 bg-black text-cyan-300 rounded" 
          />
          <button 
            onClick={logar} 
            className="w-full bg-cyan-400 text-black font-bold p-2 rounded hover:bg-cyan-300"
          >
            Entrar
          </button>
          {mensagem && <p className="text-red-500 mt-2 text-center">{mensagem}</p>}
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold mb-6">Painel de Licenças</h1>

          <div className="flex gap-4 mb-6">
            <button 
              onClick={() => setAbaAtiva('usuarios')} 
              className={`px-4 py-2 rounded ${abaAtiva === 'usuarios' ? 'bg-cyan-400 text-black font-bold' : 'bg-gray-700'}`}
            >
              Usuários
            </button>
            <button 
              onClick={() => setAbaAtiva('dispositivos')} 
              className={`px-4 py-2 rounded ${abaAtiva === 'dispositivos' ? 'bg-cyan-400 text-black font-bold' : 'bg-gray-700'}`}
            >
              Dispositivos
            </button>
          </div>

          {abaAtiva === 'usuarios' && (
            <>
              <h2 className="text-xl font-semibold mb-2">Criar Novo Usuário</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                <input 
                  value={novoEmail} 
                  onChange={e => setNovoEmail(e.target.value)} 
                  placeholder="Email" 
                  className="p-2 border border-cyan-400 bg-black text-cyan-300 rounded" 
                />
                <input 
                  value={novaSenha} 
                  onChange={e => setNovaSenha(e.target.value)} 
                  placeholder="Senha" 
                  className="p-2 border border-cyan-400 bg-black text-cyan-300 rounded" 
                />
                <input 
                  value={novaValidade} 
                  onChange={e => setNovaValidade(e.target.value)} 
                  placeholder="Validade (yyyy-mm-dd)" 
                  className="p-2 border border-cyan-400 bg-black text-cyan-300 rounded" 
                />
                <button 
                  onClick={criarUsuario} 
                  className="bg-cyan-400 text-black font-bold p-2 rounded hover:bg-cyan-300"
                >
                  Criar
                </button>
              </div>

              {usuarios.map(usuario => (
                <div key={usuario.uid} className="bg-gray-800 p-4 mb-2 rounded">
                  <p><strong>Email:</strong> {usuario.email}</p>
                  <p><strong>UID:</strong> {usuario.uid}</p>
                  {editandoUid === usuario.uid ? (
                    <>
                      <input
                        value={validadeEditando}
                        onChange={e => setValidadeEditando(e.target.value)}
                        className="p-2 border border-cyan-400 bg-black text-cyan-300 rounded w-full mt-2"
                      />
                      <button 
                        onClick={() => salvarEdicao(usuario.uid)} 
                        className="mt-2 w-full bg-cyan-400 text-black font-bold p-2 rounded hover:bg-cyan-300"
                      >
                        Salvar
                      </button>
                    </>
                  ) : (
                    <>
                      <p><strong>Validade:</strong> {usuario.validade}</p>
                      <p><strong>Dias restantes:</strong> {Math.ceil((new Date(usuario.validade).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}</p>
                      <div className="flex gap-2 mt-2">
                        <button 
                          onClick={() => { setEditandoUid(usuario.uid); setValidadeEditando(usuario.validade) }} 
                          className="flex-1 bg-cyan-400 text-black font-bold p-2 rounded hover:bg-cyan-300"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => deletarUsuario(usuario.uid)} 
                          className="flex-1 bg-red-500 text-white font-bold p-2 rounded hover:bg-red-400"
                        >
                          Excluir
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </>
          )}

          {abaAtiva === 'dispositivos' && (
            <>
              <h2 className="text-xl mb-2 font-semibold">Dispositivos por Usuário</h2>
              {Object.entries(dispositivosAgrupados).map(([userId, devices]) => (
                <div key={userId} className="bg-gray-800 p-4 mb-4 rounded">
                  <p className="font-semibold mb-1">Usuário: {userId}</p>
                  {devices.map((info, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <p>{info}</p>
                      <button 
                        onClick={() => deletarDispositivo(userId, info)} 
                        className="text-red-400 hover:text-red-600 ml-4"
                      >
                        Excluir
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}