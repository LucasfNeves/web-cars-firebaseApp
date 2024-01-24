import * as zod from 'zod'

export const schemaAcess = zod.object({
  email: zod
    .string()
    .email('Insira um e-mail válido')
    .min(1, 'O campo e-mail é obrigatório'),
  password: zod
    .string()
    .min(6, 'A senha deve conter no mínimo 6 caracteres')
    .max(16, 'A senha deve conter no máximo 16 caracteres')
    .min(1, 'O campo senha é obrigatório'),
  name: zod.string().min(1, 'O campo nome é obrigatório').optional(),
})

export type FormData = zod.infer<typeof schemaAcess>
