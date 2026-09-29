# Rules For The Next AI Agent

1. Backend contract را منبع حقیقت فنی بگیر؛ حدس بی‌دلیل نزن.
2. توسعه‌پذیری مهم است: modular, maintainable, replaceable, testable.
3. Premature abstraction نکن؛ Shared فقط برای مفهوم واقعاً عمومی.
4. برای تغییرات چندفایلی، کاربر ترجیح می‌دهد یک PowerShell command کامل بگیرد.
5. قبل از تغییر فایل موجود rolling `.bak` بگیر.
6. UTF-8 فارسی را با ReadAllText/WriteAllText امن نگه دار.
7. هر Batch با `npm run build` تمام شود.
8. Foundation موجود را دوباره نساز مگر دلیل مشخص.
9. AppRouter کوچک بماند؛ module routes را register کن.
10. Module pageها lazy باشند.
11. UI consistency مهم‌تر از cleverness است.
12. UI فارسی و RTL؛ backend values می‌توانند انگلیسی باشند.
13. Mock data باید Domain-appropriate باشد: غذا، بهداشت، پوشاک، اسکان اضطراری، کمک اهدایی، انتقال بین انبارها.
14. Auth/RBAC فعلاً شروع نشود مگر کاربر درخواست کند.
15. Mock→API migration باید بدون بازنویسی Page ممکن باشد.
16. `field_id`, `settings`, `template_id`, `category_ids`, enum values و full-update semantics را preserve کن.
17. Product Phase 1 و Category field editor را بدون دلیل بازنویسی نکن.
18. اگر Refactor روی چند Module اثر دارد، کوتاه دلیلش را قبل از اجرا توضیح بده.
19. کاربر ترجیح می‌دهد سریع جلو برویم ولی کد تمیز و توسعه‌پذیر بماند.
