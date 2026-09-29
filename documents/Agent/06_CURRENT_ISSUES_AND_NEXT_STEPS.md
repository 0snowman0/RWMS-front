# Current Issues & Next Steps

## 1. Build first

```powershell
cd E:\Computer\proj\RWMS_Front
git status
npm run build
```

## 2. Categories Pagination — immediate

هدف کاربر: ظاهر Pagination دسته‌بندی دقیقاً شبیه Product / Waybill / Waybill Template باشد.

Category قبلاً Shared `<Pagination />` داشت. باید به pattern جدید برسد:

```text
Toolbar: Search + Page Size 10/20/50/100
Footer: Page X/Y + total + page size + Previous/Next
```

منطق Query/Sort/Search/DataTable را بی‌دلیل تغییر نده.

## 3. Waybill Template editor quality

نسخه ساده اولیه مورد قبول کاربر نبود. باید حداقل کیفیت Category editor را داشته باشد: type-aware default, validation, type transition cleanup, options validation, settings preservation.

## 4. Waybill template assignment

Assignment باید در UX واضح باشد:

```text
مرحله 1: template_id
مرحله 2: static fields
مرحله 3: template dynamic fields
```

Edit باید assigned template + values قبلی را نشان دهد.

## 5. Template change

اگر template عوض شد dynamic values قبلی ممکن است نامعتبر شوند؛ Confirmation و reset/default initialization منطقی است.

## 6. Status/Priority

باید Select فارسی باشند و enum value دقیق Backend ارسال شود.

## 7. Sidebar

Duplicate Waybill item نباید وجود داشته باشد.

## 8. Real API integration

بعد از ثبات UI، ترتیب پیشنهادی:

```text
Categories → Products → Waybill Templates → Waybills
```

چون Product به Category و Waybill به Template وابسته است.

## 9. Error handling when API is real

422 / 404 / 409 / 500 / network. مخصوصاً WaybillTemplate.name unique.

## 10. Full updates

Product و Waybill را PATCH فرض نکن. current full state را بفرست.

## 11. Later refactor

بعد از تثبیت Pagination همه Listها می‌توان `PageSizeSelect` و `ListPaginationFooter` مشترک ساخت. الان زودهنگام refactor بزرگ نکن.
