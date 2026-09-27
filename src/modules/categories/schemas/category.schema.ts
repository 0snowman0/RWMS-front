import { z } from 'zod'

export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      1,
      'نام دسته‌بندی الزامی است.',
    )
    .max(
      255,
      'نام دسته‌بندی نمی‌تواند بیشتر از ۲۵۵ کاراکتر باشد.',
    ),

  description: z
    .string()
    .trim()
    .optional(),
})

export type CategoryFormValues =
  z.infer<typeof categoryFormSchema>