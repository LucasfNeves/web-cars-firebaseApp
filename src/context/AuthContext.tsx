import { onAuthStateChanged } from 'firebase/auth'
import { ReactNode, createContext, useEffect, useState } from 'react'
import { auth } from '../services/firebaseConection'

interface UserProps {
  uid: string
  name: string | null
  email: string | null
}

type AuthContextData = {
  signed: boolean
  loadingAuth: boolean
  handleInfosUser: (user: UserProps) => void
  user: UserProps | null
}

export const AuthContext = createContext({} as AuthContextData)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps | null>(null)
  const [loadingAuth, setLoadingAuth] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user?.uid,
          name: user?.displayName,
          email: user?.email,
        })
        setLoadingAuth(false)
      } else {
        setUser(null)
        setLoadingAuth(false)
      }
    })

    return () => unsub()
  }, [])

  function handleInfosUser({ name, uid, email }: UserProps) {
    setUser({
      uid,
      name,
      email,
    })
  }

  return (
    <AuthContext.Provider
      value={{ signed: !!user, loadingAuth, handleInfosUser, user }}
    >
      {children}
    </AuthContext.Provider>
  )
}
