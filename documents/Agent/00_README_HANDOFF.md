# RWMS Frontend — AI Handoff Pack

این بسته برای تحویل ادامه توسعه فرانت‌اند RWMS به یک AI Agent دیگر تهیه شده است.

## پروژه

- مسیر پروژه: `E:\Computer\proj\RWMS_Front`
- Frontend: React + TypeScript + Vite + Tailwind CSS v4
- Routing: React Router Data Mode
- Data: TanStack Query
- Tables: TanStack Table
- Forms: React Hook Form + Zod
- Dialog/Toast: Radix + Sonner
- Icons: lucide-react
- Backend: FastAPI + PostgreSQL

## ماژول‌های فعلی

- Categories
- Products
- Waybill Templates
- Waybills

بخش مهمی از Repositoryها هنوز Mock هستند و اتصال واقعی API در فاز بعدی انجام می‌شود.

## اولین کار Agent جدید

```powershell
cd E:\Computer\proj\RWMS_Front
git status
npm run build
```

آخرین کار در حال انجام، هماهنگ‌سازی Pagination صفحه Categories با Product / Waybill / Waybill Template بوده است. یک خطای موقت `Cannot find name 'Pagination'` رخ داد چون import قدیمی حذف شده بود ولی JSX باقی مانده بود؛ برای آن Command اصلاحی داده شد. Agent جدید باید وضعیت واقعی فایل و Build فعلی را ابتدا بررسی کند.

## ترتیب مطالعه فایل‌ها

1. `00_README_HANDOFF.md`
2. `01_ARCHITECTURE_AND_CONVENTIONS.md`
3. `02_BACKEND_CONTRACTS.md`
4. `03_FRONTEND_MODULE_STATUS.md`
5. `04_DYNAMIC_FIELDS_SYSTEM.md`
6. `05_UI_UX_DESIGN_SYSTEM.md`
7. `06_CURRENT_ISSUES_AND_NEXT_STEPS.md`
8. `07_AGENT_WORKING_RULES.md`
9. `08_ROUTES_AND_TEST_CHECKLIST.md`

## اصل محصول

سیستم Enterprise برای مدیریت انبار، اقلام امدادی، حمل، دریافت و توزیع است. UI باید ساده، آرام، حرفه‌ای، مدرن، RTL و قابل توسعه باشد. پیچیدگی Domain نباید UI را شلوغ کند.
