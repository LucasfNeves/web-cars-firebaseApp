import { Link } from 'react-router-dom'
import Logo from '../../assets/logo.svg'
import { FiUser, FiLogIn } from 'react-icons/fi'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

export function Header() {
  const { signed, loadingAuth } = useContext(AuthContext)

  return (
    <div className="w-full flex items-center justify-center h-16 bg-white drop-shadow mb-4">
      <header className="flex w-full items-center  max-w-7xl px-4 mx-auto ">
        <nav className="w-full flex items-center justify-between">
          <Link to={'/'}>
            <img src={Logo} alt="Logo principal do site,escrita Web Carros" />
          </Link>
          {!loadingAuth && signed && (
            <Link to={'/dashboard'}>
              <div className="border-2 rounded-full p-1 border-gray-900">
                <FiUser size={22} color="#000" />
              </div>
            </Link>
          )}
          {!loadingAuth && !signed && (
            <Link to={'/login'}>
              <div
                className="border-2 rounded-full p-1 border-gray-900"
                title="Fazer login"
              >
                <FiLogIn size={22} color="#000" />
              </div>
            </Link>
          )}
        </nav>
      </header>
    </div>
  )
}
