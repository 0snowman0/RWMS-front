import type {
  Category,
} from '../types/category.types'


export const mockCategories: Category[] = [
  {
    id: 1,

    name: 'اقلام غذایی',

    description:
      'مشخصات موردنیاز برای ثبت و نگهداری اقلام غذایی و بستههای معیشتی',

    fields: [
      {
        field_id:
          '11111111-1111-4111-8111-111111111111',

        name:
          'expiration_date',

        title:
          'تاریخ انقضا',

        field_type:
          'date',

        required:
          true,

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
          'تاریخ انقضای کالا را وارد کنید',

        description:
          'تاریخ انقضای درجشده روی کالا یا بسته غذایی',

        show_in_list:
          true,

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
      },

      {
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
          2,

        unit:
          null,

        placeholder:
          'نوع بستهبندی را انتخاب کنید',

        description:
          'نوع بستهبندی فیزیکی کالا در زمان ورود به انبار',

        show_in_list:
          true,

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

        settings:
          {},
      },

      {
        field_id:
          '33333333-3333-4333-8333-333333333333',

        name:
          'net_weight',

        title:
          'وزن خالص',

        field_type:
          'decimal',

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
          3,

        unit:
          'kg',

        placeholder:
          'وزن خالص کالا را وارد کنید',

        description:
          'وزن خالص هر واحد یا بسته کالا',

        show_in_list:
          false,

        min_value:
          0,

        max_value:
          null,

        decimal_places:
          2,

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
      },
    ],

    created_at:
      '2026-09-18T08:30:00+03:30',

    updated_at:
      '2026-09-26T14:20:00+03:30',
  },


  {
    id: 2,

    name:
      'اقلام بهداشتی',

    description:
      'مشخصات اقلام بهداشتی مصرفی و بستههای سلامت',

    fields:
      [],

    created_at:
      '2026-09-19T09:15:00+03:30',

    updated_at:
      '2026-09-24T11:40:00+03:30',
  },


  {
    id: 3,

    name:
      'پوشاک و البسه',

    description:
      'مشخصات پوشاک کفش و اقلام فردی قابل توزیع',

    fields:
      [],

    created_at:
      '2026-09-20T10:00:00+03:30',

    updated_at:
      '2026-09-25T08:45:00+03:30',
  },


  {
    id: 4,

    name:
      'لوازم اسکان اضطراری',

    description:
      'مشخصات پتو چادر زیرانداز و سایر ملزومات اسکان',

    fields:
      [],

    created_at:
      '2026-09-21T08:20:00+03:30',

    updated_at:
      '2026-09-26T09:30:00+03:30',
  },


  {
    id: 5,

    name:
      'تجهیزات توانبخشی',

    description:
      'مشخصات تجهیزات کمکحرکتی و اقلام توانبخشی',

    fields:
      [],

    created_at:
      '2026-09-22T12:00:00+03:30',

    updated_at:
      '2026-09-22T12:00:00+03:30',
  },


  {
    id: 6,

    name:
      'لوازمالتحریر و آموزشی',

    description:
      'اقلام آموزشی و لوازمالتحریر قابل تخصیص و توزیع',

    fields:
      [],

    created_at:
      '2026-09-23T09:00:00+03:30',

    updated_at:
      '2026-09-23T09:00:00+03:30',
  },


  {
    id: 7,

    name:
      'اقلام گرمایشی',

    description:
      'مشخصات وسایل و ملزومات گرمایشی قابل نگهداری در انبار',

    fields:
      [],

    created_at:
      '2026-09-24T10:10:00+03:30',

    updated_at:
      '2026-09-25T16:30:00+03:30',
  },


  {
    id: 8,

    name:
      'کالاهای اهدایی',

    description:
      'مشخصات عمومی کالاهای اهدایی ورودی به انبار',

    fields:
      [],

    created_at:
      '2026-09-25T08:30:00+03:30',

    updated_at:
      '2026-09-26T13:10:00+03:30',
  },
]