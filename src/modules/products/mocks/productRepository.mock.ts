import {
  mockCategories,
} from '@/modules/categories/mocks/categories.mock'

import type {
  DynamicFieldDefinition,
} from '@/modules/categories/types/category.types'

import type {
  PagedResult,
} from '@/shared/types'

import type {
  CreateProductPayload,
  Product,
  ProductDynamicField,
  ProductListRequest,
  UpdateProductPayload,
} from '../types'


const delay = (
  milliseconds = 220,
) =>
  new Promise<void>(
    (resolve) =>
      window.setTimeout(
        resolve,
        milliseconds,
      ),
  )


function getExampleValue(
  field: DynamicFieldDefinition,
): unknown {
  if (
    field.default_value !== null &&
    field.default_value !== undefined
  ) {
    return field.default_value
  }

  switch (field.name) {
    case 'expiration_date':
      return '2027-06-30'

    case 'package_type':
      return (
        field.options[0]?.value ??
        null
      )

    case 'net_weight':
      return 10

    case 'country_of_origin':
      return 'ایران'

    case 'brand':
      return 'نمونه'

    case 'unit':
      return 'بسته'

    default:
      break
  }

  switch (field.field_type) {
    case 'integer':
      return 1

    case 'decimal':
      return 1

    case 'boolean':
      return true

    case 'date':
      return '2027-12-31'

    case 'datetime':
      return '2026-09-28T08:00'

    case 'select':
      return (
        field.options[0]?.value ??
        null
      )

    case 'multi_select':
      return field.options[0]
        ? [field.options[0].value]
        : []

    case 'string':
    default:
      return 'نمونه'
  }
}


function buildFields(
  categoryIds: number[],
  values?: Map<string, unknown>,
): ProductDynamicField[] {
  return mockCategories
    .filter(
      (category) =>
        categoryIds.includes(
          category.id,
        ),
    )
    .flatMap(
      (category) =>
        [...category.fields]
          .filter(
            (field) =>
              field.is_active,
          )
          .sort(
            (a, b) =>
              a.sort_order -
              b.sort_order,
          )
          .map(
            (field) => ({
              ...field,

              category_id:
                category.id,

              category_name:
                category.name,

              value:
                values?.has(
                  field.field_id,
                )
                  ? values.get(
                      field.field_id,
                    ) ?? null
                  : getExampleValue(
                      field,
                    ),
            }),
          ),
    )
}


function createInitialProduct(
  id: number,
  name: string,
  categoryIds: number[],
): Product {
  const now =
    new Date(
      Date.UTC(
        2026,
        8,
        20 + id,
        8,
        30,
      ),
    ).toISOString()

  const categories =
    mockCategories
      .filter(
        (category) =>
          categoryIds.includes(
            category.id,
          ),
      )
      .map(
        (category) => ({
          id: category.id,
          name: category.name,
        }),
      )

  return {
    id,
    name,
    categories,

    fields:
      buildFields(
        categoryIds,
      ),

    created_at: now,
    updated_at: now,
  }
}


const firstId =
  mockCategories[0]?.id

const secondId =
  mockCategories[1]?.id

const thirdId =
  mockCategories[2]?.id


let products: Product[] = [
  ...(firstId
    ? [
        createInitialProduct(
          1,
          'برنج ایرانی ۱۰ کیلویی',
          [firstId],
        ),
      ]
    : []),

  ...(secondId
    ? [
        createInitialProduct(
          2,
          'بسته بهداشتی خانواده',
          [secondId],
        ),
      ]
    : []),

  ...(thirdId
    ? [
        createInitialProduct(
          3,
          'پتو امدادی',
          [thirdId],
        ),
      ]
    : []),

  ...(firstId && secondId
    ? [
        createInitialProduct(
          4,
          'بسته معیشتی خانواده',
          [
            firstId,
            secondId,
          ],
        ),
      ]
    : []),
]


function cloneProduct(
  product: Product,
): Product {
  return structuredClone(
    product,
  )
}


export async function listProducts(
  request: ProductListRequest,
): Promise<
  PagedResult<Product>
> {
  await delay()

  const search =
    request.search
      ?.trim()
      .toLocaleLowerCase(
        'fa',
      ) ?? ''

  let result =
    [...products]


  if (search) {
    result =
      result.filter(
        (product) =>
          product.name
            .toLocaleLowerCase(
              'fa',
            )
            .includes(
              search,
            ) ||
          product.categories.some(
            (category) =>
              category.name
                .toLocaleLowerCase(
                  'fa',
                )
                .includes(
                  search,
                ),
          ),
      )
  }


  const sortBy =
    request.sort_by

  if (sortBy) {
    result.sort(
      (a, b) => {
        let compare = 0

        if (
          sortBy === 'name'
        ) {
          compare =
            a.name.localeCompare(
              b.name,
              'fa',
            )
        } else if (
          sortBy ===
          'created_at'
        ) {
          compare =
            a.created_at.localeCompare(
              b.created_at,
            )
        } else if (
          sortBy ===
          'updated_at'
        ) {
          compare =
            a.updated_at.localeCompare(
              b.updated_at,
            )
        } else {
          compare =
            a.id - b.id
        }

        return request.is_ascending
          ? compare
          : -compare
      },
    )
  }


  const totalCount =
    result.length

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        totalCount /
          request.page_size,
      ),
    )

  const safePage =
    Math.min(
      request.page_number,
      totalPages,
    )

  const start =
    (safePage - 1) *
    request.page_size

  const items =
    result
      .slice(
        start,
        start +
          request.page_size,
      )
      .map(
        cloneProduct,
      )


  return {
    items,

    total_count:
      totalCount,

    page_number:
      safePage,

    page_size:
      request.page_size,

    total_pages:
      totalPages,

    has_previous_page:
      safePage > 1,

    has_next_page:
      safePage <
      totalPages,
  }
}


export async function getProductById(
  id: number,
): Promise<
  Product | null
> {
  await delay(150)

  const product =
    products.find(
      (item) =>
        item.id === id,
    )

  return product
    ? cloneProduct(
        product,
      )
    : null
}


export async function createProduct(
  payload: CreateProductPayload,
): Promise<Product> {
  await delay(300)

  const id =
    products.length === 0
      ? 1
      : Math.max(
          ...products.map(
            (item) =>
              item.id,
          ),
        ) + 1

  const attributeMap =
    new Map(
      payload.attributes.map(
        (attribute) => [
          attribute.field_id,
          attribute.value,
        ],
      ),
    )

  const categories =
    mockCategories
      .filter(
        (category) =>
          payload.category_ids.includes(
            category.id,
          ),
      )
      .map(
        (category) => ({
          id: category.id,
          name: category.name,
        }),
      )

  const now =
    new Date().toISOString()

  const product: Product = {
    id,

    name:
      payload.name.trim(),

    categories,

    fields:
      buildFields(
        payload.category_ids,
        attributeMap,
      ),

    created_at: now,
    updated_at: now,
  }

  products = [
    product,
    ...products,
  ]

  return cloneProduct(
    product,
  )
}


export async function updateProduct(
  id: number,
  payload: UpdateProductPayload,
): Promise<Product> {
  await delay(300)

  const current =
    products.find(
      (item) =>
        item.id === id,
    )

  if (!current) {
    throw new Error(
      'Product not found.',
    )
  }

  const attributeMap =
    new Map(
      payload.attributes.map(
        (attribute) => [
          attribute.field_id,
          attribute.value,
        ],
      ),
    )

  const categories =
    mockCategories
      .filter(
        (category) =>
          payload.category_ids.includes(
            category.id,
          ),
      )
      .map(
        (category) => ({
          id: category.id,
          name: category.name,
        }),
      )

  const updated: Product = {
    ...current,

    name:
      payload.name.trim(),

    categories,

    fields:
      buildFields(
        payload.category_ids,
        attributeMap,
      ),

    updated_at:
      new Date().toISOString(),
  }

  products =
    products.map(
      (item) =>
        item.id === id
          ? updated
          : item,
    )

  return cloneProduct(
    updated,
  )
}


export async function deleteProduct(
  id: number,
): Promise<void> {
  await delay(220)

  products =
    products.filter(
      (item) =>
        item.id !== id,
    )
}