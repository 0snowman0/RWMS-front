import type {
  FieldErrors,
  UseFormRegister,
} from 'react-hook-form'

import {
  FormField,
} from '@/shared/ui/form'

import {
  Input,
} from '@/shared/ui/input'

import {
  Textarea,
} from '@/shared/ui/textarea'

import type {
  CategoryFormValues,
} from '../schemas/category.schema'

interface CategoryBasicInfoFormProps {
  register:
    UseFormRegister<CategoryFormValues>

  errors:
    FieldErrors<CategoryFormValues>
}

export function CategoryBasicInfoForm({
  register,
  errors,
}: CategoryBasicInfoFormProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface">
      <div className="border-b border-border px-5 py-4">
        <h2 className="font-semibold text-foreground">
          اطلاعات دسته‌بندی
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          نام و توضیحات اصلی دسته‌بندی را وارد کنید.
        </p>
      </div>

      <div className="grid gap-5 p-5">
        <FormField
          label="نام دسته‌بندی"
          htmlFor="category-name"
          required
          error={
            errors.name?.message
          }
        >
          <Input
            id="category-name"
            placeholder="مثلاً مشخصات فنی دوربین"
            autoComplete="off"
            {...register('name')}
          />
        </FormField>

        <FormField
          label="توضیحات"
          htmlFor="category-description"
          error={
            errors.description
              ?.message
          }
          description="توضیح کوتاهی درباره کاربرد این دسته‌بندی وارد کنید."
        >
          <Textarea
            id="category-description"
            rows={4}
            placeholder="مثلاً فیلدهای فنی مربوط به دوربین مداربسته"
            {...register(
              'description',
            )}
          />
        </FormField>
      </div>
    </div>
  )
}