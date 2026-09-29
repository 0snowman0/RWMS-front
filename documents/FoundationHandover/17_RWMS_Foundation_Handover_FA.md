**راهنمای 17**

**راهنمای تحویل Foundation و شروع ماژول‌های فاز ۱**

چک‌لیست استفاده از بیس سیستم قبل از ورود به Category، Item و Waybill

|     | **هدف این سند**<br><br>این سند برای استفاده مجدد در ادامه توسعه RWMS تهیه شده است؛ تمرکز آن روی نحوه استفاده، حدود مسئولیت، امکانات، قواعد و نکات مهم است و وارد جزئیات پیاده‌سازی داخلی نمی‌شود. |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

**این بخش چه کاری انجام می‌دهد؟**

این سند وضعیت نهایی Foundation را برای ادامه کار در یک Chat یا AI دیگر خلاصه می‌کند. احراز هویت و RBAC عمداً جزو فاز فعلی نیستند. هدف این است که توسعه ماژول‌های فاز ۱ بدون بازسازی زیرساخت اصلی آغاز شود.

**امکانات و خروجی قابل استفاده**

**•** Build تولیدی پروژه موفق است و Foundation قابل استفاده است.

**•** تمام Featureهای جدید باید روی Router، App Shell، UI Kit، API Client، TanStack Query و Form Foundation موجود سوار شوند.

**•** Auth/RBAC فعلاً فعال نیست اما API Layer نقطه توسعه لازم را برای آینده دارد.

**•** برای Presentation فاز ۱، تمرکز روی ماژول‌های واقعی کسب‌وکار و تجربه کاربری است.

**وضعیت آماده‌به‌کار**

| **قابلیت**            | **وضعیت**         | **نکته**                                         |
| --------------------- | ----------------- | ------------------------------------------------ |
| معماری و Tooling      | **آماده**         | React/TypeScript/Vite/Tailwind و ساختار ماژولار  |
| UI و Theme            | **آماده**         | RTL، Light/Dark، اجزای پایه و Responsive Shell   |
| Routing               | **آماده**         | Data Router، 404 و Route Error                   |
| Data Access           | **آماده**         | Environment، API Client و TanStack Query         |
| Forms                 | **آماده**         | RHF/Zod، 422 Mapping و Controls پایه             |
| Feedback UI           | **آماده**         | Toast، Dialog و Confirm                          |
| List Pages            | **آماده**         | DataTable، Pagination و FilterBar                |
| Authentication / RBAC | **خارج از فاز ۱** | برای Presentation فعلی عمداً پیاده‌سازی نشده است |

**نحوه استفاده**

**•** قبل از شروع هر Feature، قرارداد API Backend و مدل داده همان Feature بررسی شود.

**•** Feature از shared/ui و shared/api استفاده کند و Component عمومی جدید فقط در صورت تکرار واقعی به shared اضافه شود.

**•** هر مرحله با npm run build کنترل شود.

**•** برای List Page از الگوی PageHeader + FilterBar + DataTable + Pagination استفاده شود.

**•** برای Form Page از FormField + Controls + React Hook Form/Zod و 422 Mapping استفاده شود.

**قواعد و نکات مهم**

**•** فعلاً Login، Permission و RBAC به پروژه اضافه نشوند مگر تصمیم جدید کارفرما یا فاز بعدی.

**•** پیاده‌سازی Dynamic Form Engine باید پس از بررسی دقیق مدل Category/Dynamic Field Backend انجام شود.

**•** Foundation نباید برای یک Feature خاص تغییرات Domain-specific بگیرد.

**در ادامه پروژه**

**•** ترتیب پیشنهادی شروع فاز ۱: Categories → Dynamic Fields → Dynamic Form Engine → Items → Waybill Template → Waybill.