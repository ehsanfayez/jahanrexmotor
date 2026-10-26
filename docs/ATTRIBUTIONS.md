# دارایی‌ها، انتساب و وضعیت مجوزها

این سند وضعیت قابل‌اثبات از فایل‌های محلی را ثبت می‌کند؛ مجوز یا مالکیت جدیدی ایجاد نمی‌کند.

| مورد | نسخه / وضعیت | مرجع و اعلان محلی |
| --- | --- | --- |
| Vazirmatn | فایل WOFF2 موجود؛ SIL OFL 1.1 | `public/fonts/OFL.txt`؛ Copyright 2015 The Vazirmatn Project Authors |
| Lucide | مسیرهای SVG ثابت در `Icon.astro`، تغییر stroke به 1.5 | اعلان ISC/MIT موجود در `public/licenses/lucide.txt`؛ فهرست آیکن‌ها همان‌جا ثبت شده است |
| GSAP / ScrollTrigger | 3.15.0؛ بسته به Standard “no charge” license ارجاع می‌دهد، نه MIT | `public/licenses/gsap.txt` و [شرایط رسمی](https://gsap.com/standard-license)؛ headerهای بسته حفظ شده‌اند |
| Astro | 7.4.2؛ MIT | `docs/licenses/astro.txt`، کپی از بستهٔ نصب‌شده |
| Tailwind CSS | 4.3.3؛ MIT | `public/licenses/tailwindcss.txt`، کپی از بستهٔ نصب‌شده |
| Tailwind Vite plugin | 4.3.3؛ MIT | `docs/licenses/tailwind-vite.txt` |
| TypeScript | 7.0.2؛ Apache-2.0 | `docs/licenses/typescript.txt` |
| Sharp | 0.35.5؛ Apache-2.0 | `docs/licenses/sharp.txt`؛ وابستگی‌های بومی اعلان‌های خود را در بستهٔ نصب‌شده دارند |
| PostCSS | 8.5.31؛ MIT | `docs/licenses/postcss.txt` |
| Vite | 8.3.5؛ MIT | `docs/licenses/vite.txt` |

وابستگی‌های گذرا و فایل‌های مجوزشان با نصب lockfile دریافت می‌شوند؛ این جدول ادعای پوشش کامل همهٔ مجوزهای گذرا نیست. متن کامل شرایط GSAP در بسته موجود نبود و بررسی آنلاین آن در این ممیزی به صفحهٔ موقت offline هدایت شد؛ پیش از تحویل، شرایط جاری از مرجع رسمی بررسی شود.

## تصاویر و نشان اختصاصی: نیازمند تأیید پیش از ارسال

برای PNGهای قطعات، استودیو، سدان، مشتق‌های WebP، نشان SVG برند و favicon، سند کافی برای تعیین مالکیت یا حق بازتوزیع در سوابق فعلی پیدا نشد. وجود فایل در پروژه یا تولید مشتق، مجوز بازتوزیع را ثابت نمی‌کند. برای هیچ‌کدام مجوز عمومی فرض نشده است.

موارد موردنیاز برای تأیید مالک/کارفرما:

- `public/images/parts/*.png`: موتور، گیربکس، ترمز، تعلیق، روشنایی، آینه، بدنه، صندلی، فرمان، استودیو و سدان.
- `public/images/parts/optimized/*.webp`: مشتق‌های همان منابع و دو دارایی قدیمی سدان که باید دستی بررسی شوند.
- نشان برند در `src/components/Brand.astro` و `public/favicon.svg`.
- حقوق تحویل کد و محتوای اختصاصی به کارفرما و نوع دسترسی مخزن مقصد.

پیش از هر upload عمومی یا خصوصی به سرویس ثالث، منشأ فایل‌ها، اجازهٔ استفاده/تحویل/بازتوزیع و شرایط انتساب احتمالی را ثبت کنید. دارایی‌های نامطمئن در این فاز حذف یا جایگزین نشده‌اند و برای کل پروژه فایل `LICENSE` ساختگی ایجاد نشده است.
