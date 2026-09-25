function DashboardPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          داشبورد
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          نمای کلی وضعیت سامانه و عملیات انبار
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div className="mb-4 h-1.5 w-16 rounded-full bg-secondary" />

        <h2 className="text-lg font-semibold text-foreground">
          خوش آمدید
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
          زیرساخت اولیه رابط کاربری RWMS آماده شده است. اطلاعات عملیاتی
          و شاخص‌های اصلی انبار در ادامه در این صفحه نمایش داده خواهند شد.
        </p>
      </div>
    </div>
  )
}

export default DashboardPage