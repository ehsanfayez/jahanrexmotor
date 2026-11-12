import type { Locale } from './i18n';
type Localized = Record<Locale, string>;
interface Company {
  id: string; url?: string; name: Localized; label: Localized; description: Localized;
  emphasis?: Localized; image: string; alt: Localized; icon: string;
}
export const networkContent = {
  eyebrow: 'OUR BUSINESS NETWORK',
  heading: { fa: 'شبکه برندها و مجموعه‌های ما', en: 'Our network of brands and businesses' },
  intro: { fa: 'جهانرکسان موتور، مجموعه‌ای یکپارچه در تولید، واردات، عرضه و همکاری با برندهای معتبر صنعت خودرو', en: 'Jahanrexan Motor brings together manufacturing, imports, distribution and partnerships with trusted automotive brands.' },
  website: { fa: 'مشاهده وب‌سایت', en: 'Visit website' },
  newWindow: { fa: 'در پنجرهٔ جدید', en: 'opens in a new tab' },
} satisfies Record<string, Localized | string>;
// Semantic order is shared by both locales and the scroll timeline.
// Full copy follows the approved network reference, not the former short directory summaries.
export const companies: readonly Company[] = [
  {
    id: 'rahavard-taklan', url: 'https://rahavardtaklan.ir/', icon: 'settings',
    name: { fa: 'رهاورد تکلان', en: 'Rahavard Taklan' },
    label: { fa: 'تولید داخلی', en: 'Domestic production' },
    description: { fa: 'بازوی تولیدی مجموعه جهانرکسان موتور در صنعت قطعات خودرو است. ما تمرکز بر تولید داخلی قطعات سیستم سوخت‌رسانی، محصولات اختصاصی این برند را در ایران تولید و به بازار عرضه می‌کنیم.', en: 'Rahavard Taklan is Jahanrexan Motor’s manufacturing operation in the automotive parts industry. With a focus on domestic production of fuel-system components, we manufacture this brand’s own products in Iran and supply them to the market.' },
    image: 'rahavard-taklan-vertical', alt: { fa: 'قطعات سیستم سوخت‌رسانی رهاورد تکلان', en: 'Rahavard Taklan fuel-system components' },
  },
  {
    id: 'astroai', url: 'https://astroai.ir/', icon: 'boxes',
    name: { fa: 'آستروآی', en: 'AstroAI' },
    label: { fa: 'واردات و تأمین مستقیم', en: 'Direct import & supply' },
    description: { fa: 'واردات مستقیم محصولات آستروآی در ایران از طریق مجموعه جهانرکسان موتور انجام می‌شود. ما به‌عنوان تأمین‌کننده انحصاری این محصولات در بازار ایران، مجموعه‌ای از تجهیزات کاربردی و حرفه‌ای خودرو را عرضه و پشتیبانی می‌کنیم.', en: 'Jahanrexan Motor directly imports AstroAI products into Iran. As their exclusive supplier in the Iranian market, we provide and support a range of practical and professional automotive equipment.' },
    image: 'astroai-vertical', alt: { fa: 'پمپ باد، جامپ‌استارتر و تجهیزات خودرویی آستروآی', en: 'AstroAI air compressor, jump starter and automotive equipment' },
  },
  {
    id: 'jahanrex', url: 'https://jahanrex.com/', icon: 'car-front',
    name: { fa: 'جهان رکس', en: 'Jahan Rex' },
    label: { fa: 'عرضه و فروش', en: 'Sales and distribution' },
    description: { fa: 'جهان رکس، بخش فروش و عرضه محصولات خودرویی مجموعه است. در این بستر، مجموعه‌ای متنوع از روغن‌های موتوری، مکمل‌های سوخت، تجهیزات کاربردی و قطعات یدکی خودرو را در اختیار مشتریان قرار می‌دهیم.', en: 'Jahan Rex is the group’s automotive sales and distribution operation. Through this platform, we offer customers a diverse selection of engine oils, fuel additives, practical equipment and automotive spare parts.' },
    image: 'jahanrex-vertical', alt: { fa: 'مجموعه محصولات و تجهیزات خودرویی جهان رکس', en: 'Jahan Rex automotive products and equipment' },
  },
  {
    id: 'hyco', url: 'https://hyco.ir/', icon: 'shield-check',
    name: { fa: 'هایکو | HYCO', en: 'HYCO' },
    label: { fa: 'برند همکار', en: 'Partner brand' },
    emphasis: { fa: 'نماینده اصلی فروش در ایران', en: 'Primary sales representation in Iran' },
    description: { fa: 'هایکو از برندهای همکار مجموعه جهانرکسان موتور در حوزه روکش صندلی خودرو است. ما به‌عنوان نماینده اصلی فروش محصولات HYCO در ایران، عرضه و توسعه بازار این برند را بر عهده داریم.', en: 'HYCO is a Jahanrexan Motor partner brand specializing in automotive seat covers. As the brand’s primary sales representative in Iran, we are responsible for supplying its products and developing its market.' },
    image: 'hyco-vertical', alt: { fa: 'روکش‌های صندلی خودروی هایکو', en: 'HYCO automotive seat covers' },
  },
];

// Provider-specific coordinate URLs require live validation; do not substitute homepages.
export const mapLinks = [
  { name: 'Google Maps', url: 'https://www.google.com/maps/search/?api=1&query=35.688851%2C51.426723' },
  { name: 'نشان', url: 'https://neshan.org/maps/share/35.688851,51.426723' },
  { name: 'بلد', url: 'https://balad.ir/location?latitude=35.688851&longitude=51.426723' },
] as const;
