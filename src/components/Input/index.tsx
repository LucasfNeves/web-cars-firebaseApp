import { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface InputProps {
  type: string
  placeholder: string
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>
  errors?: string
  rules?: RegisterOptions
}

export function Input({
  type,
  placeholder,
  name,
  register,
  errors,
  rules,
}: InputProps) {
  return (
    <div>
      <input
        {...register(name, rules)}
        type={type}
        id={name}
        placeholder={placeholder}
        className="w-full border-2 rounded-md h-11 px-2 font-normal"
      />
      {errors && <span className="text-red-500 font-normal">{errors}</span>}
    </div>
  )
}
