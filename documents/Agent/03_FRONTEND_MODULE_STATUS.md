# Frontend Module Status

## Foundation

تکمیل‌شده:

- Router Data Mode
- MainLayout / AppHeader / AppSidebar
- Light/Dark ThemeProvider
- 404 / Route Error
- env config
- API infra
- TanStack Query
- RHF + Zod
- FastAPI validation mapping
- Shared Inputs / Button / Dialog / ConfirmDialog / PageHeader
- Sonner notifications
- DataTable / Pagination / FilterBar

Auth/RBAC عمداً فعلاً انجام نشده است.

## Categories

دارای List, Search, Sort, Pagination, Create/Edit UI, Dynamic Field builder, add/edit/delete/reorder, preview است.

`DynamicFieldEditor` این Module کامل‌ترین Editor فعلی پروژه است و validation مهم دارد:

```text
^[a-z][a-z0-9_]*$
min <= max
integer bounds integral
decimal_places >= 0 integer
string length min <= max
valid regex
select/multi options complete and unique
default value validation by type
type-change clears irrelevant state
```

کار جاری: Pagination این صفحه باید با Product/Waybill/Template هم‌Style شود.

## Products

Phase 1 UI/Mock تکمیل‌شده.

Routes:

```text
/products
/products/new
/products/:productId/edit
```

Features: search/sort/pagination/delete mock, page size 10/20/50/100, multi-category selector, category search/filter, selected chips, grouped dynamic fields, mock CRUD.

## Waybill Templates

Routes:

```text
/waybill-templates
/waybill-templates/new
/waybill-templates/:templateId/edit
```

Features: list/search/status filter/page size/pagination/create/edit/delete/active-inactive/dynamic fields/reorder/preview.

کاربر از Editor ساده اولیه ناراضی بود و خواست کیفیت آن مانند Category باشد، خصوصاً default value type-aware و validation.

## Waybills

Routes:

```text
/waybills
/waybills/new
/waybills/:waybillId/edit
```

Workflow مورد توافق:

```text
Step 1 Assign Waybill Template
Step 2 Static fields
Step 3 Dynamic template fields
Step 4 Save
```

Static fields مطابق Backend هستند. Edit باید template و dynamic values قبلی را prefill کند. تغییر Template بهتر است Confirmation داشته باشد.

## Sidebar

فقط این ساختار مطلوب است:

```text
بارنامه ▼
├── بارنامه‌ها
└── قالب‌های بارنامه
```

Standalone duplicate Waybill باید حذف شده باشد.

## Mock/API

فعلاً Categories/Products/Waybill Templates/Waybills عمدتاً Demo/Mock هستند. هدف این است Repository واقعی بعداً جایگزین Mock شود بدون بازنویسی Pageها.
