# Architecture & Coding Conventions

## ساختار

```text
src/
├── app/
│   ├── config/
│   ├── layouts/
│   ├── providers/
│   └── router/
├── modules/
│   ├── categories/
│   ├── products/
│   ├── waybill-templates/
│   ├── waybills/
│   └── ...
└── shared/
    ├── api/
    ├── dynamic-fields/
    ├── forms/
    ├── hooks/
    ├── notifications/
    ├── types/
    ├── ui/
    └── utils/
```

Feature pattern:

```text
modules/<feature>/
├── api/
├── components/
├── hooks/
├── mocks/
├── pages/
├── routes/
├── schemas/
├── services/
├── types/
├── utils/
└── index.ts
```

## Routing

از `createBrowserRouter` و `RouterProvider` استفاده شده است. `AppRouter.tsx` باید کوچک بماند. Routeهای هر Module داخل همان Module تعریف و از طریق `src/app/router/moduleRoutes.ts` Register می‌شوند. صفحه‌های Module باید Lazy load شوند.

## State

تا نیاز واقعی وجود ندارد Redux/Zustand اضافه نشود. ترجیح: React local state + TanStack Query + RHF.

## API

Foundation دارای `apiClient`, `ApiError`, mapping خطاهای FastAPI و آمادگی Auth آینده است. Fetch پراکنده داخل Pageها نساز.

## Forms

`@/shared/forms`، `zodResolver` export می‌کند. نام `createZodResolver` صحیح نیست.

## Shared UI مهم

- Button (`isLoading`, نه `loading`)
- Input / Textarea / Select / Checkbox
- Dialog / ConfirmDialog
- Card / PageHeader
- DataTable
- Pagination

`ConfirmDialog` props شناخته‌شده:

```text
open
onOpenChange
title
description
confirmLabel?
cancelLabel?
variant: 'primary' | 'danger'
isLoading?
onConfirm
```

## Backup policy

برای Commandهای خودکار فقط یک rolling `.bak` نگه دار.

## UTF-8 فارسی

در PowerShell برای فایل فارسی از `Get-Content/Set-Content` استفاده نکن. روش امن:

```powershell
$utf8 = [System.Text.Encoding]::UTF8
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$content = [System.IO.File]::ReadAllText((Resolve-Path $path).Path, $utf8)
[System.IO.File]::WriteAllText($fullPath, $content, $utf8NoBom)
```

بعد از تغییر Source فارسی برای mojibake scan کن: `Ø|Ù|Û|Ã|â€`.

## Build

هر Batch تغییر باید با `npm run build` تمام شود. Unused importها را جدی بگیر؛ قبلاً حذف لینک مستقل Waybill باعث unused شدن `FileText` و TS6133 شده بود.
