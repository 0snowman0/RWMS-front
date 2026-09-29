# UI / UX Design System

## Light

```text
Primary #155E75
Primary Hover #164E63
Primary Soft #ECFEFF
Secondary #0D9488
Background #F8FAFC
Surface #FFFFFF
Surface Muted #F1F5F9
Foreground #1E293B
Muted #64748B
Placeholder #94A3B8
Border #E2E8F0
Border Strong #CBD5E1
Success #16A34A / Soft #DCFCE7
Warning #D97706 / Soft #FEF3C7
Danger #DC2626 / Soft #FEE2E2
Info #2563EB / Soft #DBEAFE
```

## Dark

```text
Primary #0891B2
Primary Hover #0E7490
Primary Soft #164E63
Secondary #14B8A6
Background #0B1220
Surface #111827
Surface Muted #1E293B
Foreground #E5E7EB
Muted #94A3B8
Placeholder #64748B
Border #243244
Border Strong #334155
Success #22C55E / Soft #14532D
Warning #F59E0B / Soft #451A03
Danger #F87171 / Soft #450A0A
Info #60A5FA / Soft #172554
```

## اصول

- RTL فارسی
- Vazirmatn variable
- whitespace زیاد
- border ظریف
- shadow کم
- status colors نرم
- Section-based forms
- theme tokens به جای hard-coded colors

## List page pattern

```text
PageHeader + Create
Summary cards
Table card:
  Search / Filters / Page size
  Table
  Pagination footer
```

## Pagination Standard جدید

بالا:

```text
Search                      تعداد نمایش: [10]
```

Options:

```text
10 / 20 / 50 / 100
```

پایین:

```text
صفحه X از Y
N رکورد
نمایش حداکثر pageSize رکورد در هر صفحه
[قبلی] [بعدی]
```

Category قبلاً Shared `<Pagination />` با 5/10/20/50 داشت و در حال همسان‌سازی است.

## Waybill form sections

- Template assignment
- Main info
- Sender/Receiver
- Route/Vehicle/Driver
- Dynamic template fields
- Description/Internal notes

## Sidebar

```text
بارنامه ▼
├── بارنامه‌ها
└── قالب‌های بارنامه
```

## Enum UI

raw backend value را نشان نده اگر label فارسی داریم؛ ولی value ارسالی Backend انگلیسی بماند.
