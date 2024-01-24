import { Link, useNavigate } from 'react-router-dom'
import Logo from '../../assets/logo.svg'
import { Container } from '../../components/Container'
import { Input } from '../../components/Input'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormData, schemaAcess } from '../../schema/schemaAcess'
import {
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth } from '../../services/firebaseConection'
import { useContext, useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { toast } from 'react-toastify'

export function Register() {
  const navigate = useNavigate()
  const { handleInfosUser } = useContext(AuthContext)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schemaAcess),
    mode: 'onChange',
  })

  useEffect(() => {
    async function handleSignOut() {
      await signOut(auth)
    }

    handleSignOut()
  }, [])

  async function onSubmit(data: FormData) {
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(async (user) => {
        await updateProfile(user.user, {
          displayName: data.name,
        })

        handleInfosUser({
          uid: user.user.uid,
          name: data.name || '',
          email: data.email,
        })

        toast.success('Usuário cadastrado com sucesso!')
        navigate('/dashboard', { replace: true })
      })
      .catch((error) => {
        toast.error('Erro ao cadastrar usuário')
        console.log(error)
      })
  }

  return (
    <Container>
      <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
        <Link className="mb-6 max-w-sm w-full" to="/">
          <img src={Logo} alt="Logo do site" className="w-full" />
        </Link>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white max-w-xl w-full rounded-lg p-4"
        >
          <div className="mb-3">
            <Input
              type="text"
              placeholder="Digite seu nome"
              name="name"
              register={register}
              errors={errors.name?.message}
            />
          </div>

          <div className="mb-3">
            <Input
              type="email"
              placeholder="Digite seu e-mail"
              name="email"
              register={register}
              errors={errors.email?.message}
            />
          </div>

          <div className="mb-3">
            <Input
              type="password"
              placeholder="Digite sua senha"
              name="password"
              register={register}
              errors={errors.password?.message}
            />
          </div>

          <button
            className="bg-zinc-900 w-full rounded-md text-white h-10 font-medium "
            type="submit"
          >
            Cadastrar
          </button>
        </form>
        <Link className="text-zinc-900" to="/login">
          Já tem uma conta? Acesse aqui
        </Link>
      </div>
    </Container>
  )
}
