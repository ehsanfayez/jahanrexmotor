import type { Locale } from './i18n';
interface Company { url: string; name: Record<Locale, string>; description: Record<Locale, string> }
export const companies: readonly Company[] = [
  { url: 'https://jahanrex.com/', name: { fa: 'جهان رکس', en: 'Jahan Rex' }, description: { fa: 'فروشگاه تخصصی روکش صندلی، مکمل‌های سوخت، قطعات یدکی و گجت‌های کاربردی خودرو.', en: 'A specialist automotive store offering seat covers, fuel additives, spare parts, and practical car gadgets.' } },
  { url: 'https://rahavardtaklan.ir/', name: { fa: 'رهاورد تکلان', en: 'Rahavard Taklan' }, description: { fa: 'تأمین و معرفی قطعات سیستم سوخت خودرو با تمرکز بر همکاری با فروشگاه‌ها و توزیع‌کنندگان.', en: 'An automotive fuel-system parts supplier focused on cooperation with retailers and distributors.' } },
  { url: 'https://astroai.ir/', name: { fa: 'آستروآی', en: 'AstroAI' }, description: { fa: 'واردکننده مستقیم و عرضه‌کننده انواع تجهیزات کاربردی خودرو از برند آستروآی (AstroAI)، شامل پمپ باد، جامپ‌استارتر، فشارسنج و ابزارهای همراه خودرو، با تمرکز بر کیفیت و کارایی محصولات.', en: 'A direct importer and supplier of AstroAI automotive equipment, including air compressors, jump starters, pressure gauges, and practical car accessories, with an emphasis on product quality and functionality.' } },
];
// Provider-specific coordinate URLs require live validation; do not substitute homepages.
export const mapLinks = [
  { name: 'Google Maps', url: 'https://www.google.com/maps/search/?api=1&query=35.688851%2C51.426723' },
  { name: 'نشان', url: 'https://neshan.org/maps/share/35.688851,51.426723' },
  { name: 'بلد', url: 'https://balad.ir/location?latitude=35.688851&longitude=51.426723' },
] as const;
