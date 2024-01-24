import { Link, useNavigate } from 'react-router-dom'
import Logo from '../../assets/logo.svg'
import { Container } from '../../components/Container'
import { Input } from '../../components/Input'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormData, schemaAcess } from '../../schema/schemaAcess'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../../services/firebaseConection'
import { toast } from 'react-toastify'
import { useEffect } from 'react'

export function Login() {
  const navigate = useNavigate()
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

  function onSubmit(data: FormData) {
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((user) => {
        console.log(user)
        navigate('/dashboard', { replace: true })
        toast.success(
          `Usuário logado com sucesso! Bem vindo, ${user?.user?.displayName}`,
        )
      })
      .catch((error) => {
        toast.error('Usuário ou senha inválidos')
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
            Acessar
          </button>
        </form>
        <Link className="text-zinc-900" to="/register">
          Não tem uma conta? Cadastre-se
        </Link>
      </div>
    </Container>
  )
}
