import type {
  Category,
  DynamicFieldDefinition,
} from '../types/category.types'


function createField(
  input:
    Pick<
      DynamicFieldDefinition,
      | 'field_id'
      | 'name'
      | 'title'
      | 'field_type'
    > &
    Partial<DynamicFieldDefinition>,
): DynamicFieldDefinition {
  const {
    field_id,
    name,
    title,
    field_type,
    ...overrides
  } = input

  return {
    field_id,
    name,
    title,
    field_type,

    required:
      false,

    unique:
      false,

    default_value:
      null,

    auto_generate:
      false,

    readonly:
      false,

    is_active:
      true,

    sort_order:
      1,

    unit:
      null,

    placeholder:
      null,

    description:
      null,

    show_in_list:
      false,

    min_value:
      null,

    max_value:
      null,

    decimal_places:
      null,

    min_length:
      null,

    max_length:
      null,

    regex:
      null,

    options:
      [],

    settings:
      {},

    ...overrides,
  }
}

export const mockCategories: Category[] = [
  {
    id: 1,

    name:
      'دستهبندی پایه',

    description:
      'مشخصات عمومی که برای بسیاری از کالاهای انبار قابل استفاده است.',

    fields: [
      createField({
        field_id:
          '11111111-1111-4111-8111-111111111111',

        name:
          'item_code',

        title:
          'کد کالا',

        field_type:
          'string',

        required:
          true,

        unique:
          true,

        show_in_list:
          true,

        sort_order:
          1,

        min_length:
          2,

        max_length:
          50,

        placeholder:
          'مثلا FOOD-001',

        description:
          'کد شناسایی کالا در سیستم',
      }),

      createField({
        field_id:
          '11111111-1111-4111-8111-111111111112',

        name:
          'unit',

        title:
          'واحد شمارش',

        field_type:
          'select',

        required:
          true,

        show_in_list:
          true,

        sort_order:
          2,

        placeholder:
          'واحد کالا را انتخاب کنید',

        options: [
          {
            value:
              'piece',

            label:
              'عدد',
          },
          {
            value:
              'pack',

            label:
              'بسته',
          },
          {
            value:
              'carton',

            label:
              'کارتن',
          },
          {
            value:
              'kg',

            label:
              'کیلوگرم',
          },
          {
            value:
              'liter',

            label:
              'لیتر',
          },
        ],
      }),

      createField({
        field_id:
          '11111111-1111-4111-8111-111111111113',

        name:
          'manufacturer',

        title:
          'شرکت تولیدکننده',

        field_type:
          'string',

        sort_order:
          3,

        show_in_list:
          true,

        max_length:
          150,

        placeholder:
          'نام شرکت تولیدکننده',
      }),
    ],

    created_at:
      '2026-09-01T08:00:00Z',

    updated_at:
      '2026-09-01T08:00:00Z',
  },


  {
    id: 2,

    name:
      'اقلام غذایی',

    description:
      'مشخصات مربوط به مواد غذایی و اقلام خوراکی موجود در انبار.',

    fields: [
      createField({
        field_id:
          '22222222-2222-4222-8222-222222222221',

        name:
          'expiration_date',

        title:
          'تاریخ انقضا',

        field_type:
          'date',

        required:
          true,

        sort_order:
          1,

        show_in_list:
          true,

        description:
          'تاریخ انقضای کالا',
      }),

      createField({
        field_id:
          '22222222-2222-4222-8222-222222222222',

        name:
          'package_type',

        title:
          'نوع بستهبندی',

        field_type:
          'select',

        required:
          true,

        sort_order:
          2,

        options: [
          {
            value:
              'carton',

            label:
              'کارتن',
          },
          {
            value:
              'bag',

            label:
              'کیسه',
          },
          {
            value:
              'single_pack',

            label:
              'بسته تکی',
          },
        ],

        placeholder:
          'نوع بستهبندی را انتخاب کنید',
      }),

      createField({
        field_id:
          '22222222-2222-4222-8222-222222222223',

        name:
          'net_weight',

        title:
          'وزن خالص',

        field_type:
          'decimal',

        sort_order:
          3,

        unit:
          'kg',

        min_value:
          0,

        decimal_places:
          2,

        placeholder:
          'وزن خالص کالا',
      }),
    ],

    created_at:
      '2026-09-02T08:00:00Z',

    updated_at:
      '2026-09-02T08:00:00Z',
  },


  {
    id: 3,

    name:
      'اقلام بهداشتی',

    description:
      'مشخصات اقلام بهداشتی و بستههای سلامت و نظافت.',

    fields: [
      createField({
        field_id:
          '33333333-3333-4333-8333-333333333331',

        name:
          'brand',

        title:
          'برند',

        field_type:
          'string',

        sort_order:
          1,

        show_in_list:
          true,

        max_length:
          100,

        placeholder:
          'نام برند',
      }),

      createField({
        field_id:
          '33333333-3333-4333-8333-333333333332',

        name:
          'package_count',

        title:
          'تعداد در بسته',

        field_type:
          'integer',

        sort_order:
          2,

        min_value:
          1,

        unit:
          'عدد',

        placeholder:
          'تعداد اقلام داخل بسته',
      }),

      createField({
        field_id:
          '33333333-3333-4333-8333-333333333333',

        name:
          'is_personal_use',

        title:
          'مصرف شخصی',

        field_type:
          'boolean',

        sort_order:
          3,

        description:
          'آیا کالا برای استفاده شخصی تحویل میشود',
      }),
    ],

    created_at:
      '2026-09-03T08:00:00Z',

    updated_at:
      '2026-09-03T08:00:00Z',
  },


  {
    id: 4,

    name:
      'پوشاک و منسوجات',

    description:
      'پوشاک پتو ملحفه و سایر اقلام نساجی مورد استفاده در امدادرسانی.',

    fields: [
      createField({
        field_id:
          '44444444-4444-4444-8444-444444444441',

        name:
          'size',

        title:
          'اندازه',

        field_type:
          'select',

        required:
          true,

        sort_order:
          1,

        options: [
          {
            value:
              'small',

            label:
              'کوچک',
          },
          {
            value:
              'medium',

            label:
              'متوسط',
          },
          {
            value:
              'large',

            label:
              'بزرگ',
          },
          {
            value:
              'free',

            label:
              'فری سایز',
          },
        ],
      }),

      createField({
        field_id:
          '44444444-4444-4444-8444-444444444442',

        name:
          'material',

        title:
          'جنس',

        field_type:
          'string',

        sort_order:
          2,

        max_length:
          100,

        placeholder:
          'مثلا پنبه پلیاستر و ...',
      }),

      createField({
        field_id:
          '44444444-4444-4444-8444-444444444443',

        name:
          'color',

        title:
          'رنگ',

        field_type:
          'string',

        sort_order:
          3,

        max_length:
          50,

        placeholder:
          'رنگ کالا',
      }),
    ],

    created_at:
      '2026-09-04T08:00:00Z',

    updated_at:
      '2026-09-04T08:00:00Z',
  },


  {
    id: 5,

    name:
      'اسکان اضطراری',

    description:
      'چادر زیرانداز و اقلام مرتبط با اسکان موقت و اضطراری.',

    fields: [
      createField({
        field_id:
          '55555555-5555-4555-8555-555555555551',

        name:
          'capacity',

        title:
          'ظرفیت',

        field_type:
          'integer',

        required:
          true,

        sort_order:
          1,

        unit:
          'نفر',

        min_value:
          1,

        placeholder:
          'ظرفیت استفاده',
      }),

      createField({
        field_id:
          '55555555-5555-4555-8555-555555555552',

        name:
          'waterproof',

        title:
          'ضد آب',

        field_type:
          'boolean',

        sort_order:
          2,

        default_value:
          false,
      }),

      createField({
        field_id:
          '55555555-5555-4555-8555-555555555553',

        name:
          'dimensions',

        title:
          'ابعاد',

        field_type:
          'string',

        sort_order:
          3,

        placeholder:
          'مثلا ۳ × ۴ متر',
      }),
    ],

    created_at:
      '2026-09-05T08:00:00Z',

    updated_at:
      '2026-09-05T08:00:00Z',
  },


  {
    id: 6,

    name:
      'اقلام اهدایی',

    description:
      'اطلاعات تکمیلی برای کالاهایی که از طریق اهدا وارد انبار میشوند.',

    fields: [
      createField({
        field_id:
          '66666666-6666-4666-8666-666666666661',

        name:
          'donor_reference',

        title:
          'مرجع اهدا',

        field_type:
          'string',

        sort_order:
          1,

        max_length:
          150,

        placeholder:
          'نام فرد یا سازمان اهداکننده',
      }),

      createField({
        field_id:
          '66666666-6666-4666-8666-666666666662',

        name:
          'donation_date',

        title:
          'تاریخ اهدا',

        field_type:
          'date',

        required:
          true,

        sort_order:
          2,
      }),

      createField({
        field_id:
          '66666666-6666-4666-8666-666666666663',

        name:
          'condition',

        title:
          'وضعیت کالا',

        field_type:
          'select',

        required:
          true,

        sort_order:
          3,

        options: [
          {
            value:
              'new',

            label:
              'نو',
          },
          {
            value:
              'good',

            label:
              'سالم',
          },
          {
            value:
              'needs_review',

            label:
              'نیازمند بررسی',
          },
        ],
      }),
    ],

    created_at:
      '2026-09-06T08:00:00Z',

    updated_at:
      '2026-09-06T08:00:00Z',
  },
]