import * as z from 'zod'

export const schemaNewCar = z.object({
  name: z.string().min(1, 'O nome é obrigatório!'),
  model: z.string().min(1, 'O modelo é obrigatório!'),
  year: z.string().min(1, 'O ano é obrigatório!'),
  km: z.string().min(1, 'A quilometragem é obrigatória!'),
  price: z.string().min(1, 'O preço é obrigatório!'),
  city: z.string().min(1, 'A cidade é obrigatória!'),
  whatsApp: z
    .string()
    .min(1, 'O WhatsApp é obrigatório!')
    .refine((value) => /^(\d{11,12})$/.test(value), {
      message: 'Número de telefone inválido!',
    }),
  description: z.string().min(1, 'A descrição é obrigatória!'),
})

export type FormData = z.infer<typeof schemaNewCar>
