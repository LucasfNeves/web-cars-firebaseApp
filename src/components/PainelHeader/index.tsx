import { signOut } from 'firebase/auth'
import { Link } from 'react-router-dom'
import { auth } from '../../services/firebaseConection'

export function PainelHeader() {
  async function handleLogout() {
    await signOut(auth)
  }
  return (
    <div className="flex w-full items-center h-10 bg-red-500 rounded-lg text-white gap-4 font-medium px-4">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/dashboard/new">Cadastrar carro</Link>

      <button className="ml-auto" onClick={handleLogout}>
        Sair da conta
      </button>
    </div>
  )
}
