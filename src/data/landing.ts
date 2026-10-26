export interface PartAsset {
  id: string; src: string; alt: string; label: string;
  kind: string; placeholder: boolean;
}
// Supplied original PNGs are preserved; PartSlot serves responsive lossless WebP derivatives.
export const parts: Record<string, PartAsset> = {
  engine: { id: 'engine-main', src: '/images/parts/engine-main.png', alt: 'مجموعه موتور خودرو', label: 'POWER UNIT', kind: 'engine', placeholder: false },
  gear: { id: 'gearbox-main', src: '/images/parts/gearbox-main.png', alt: 'مجموعه گیربکس خودرو', label: 'TRANSMISSION', kind: 'gear', placeholder: false },
  brake: { id: 'brake-disc', src: '/images/parts/brake-disc.png', alt: 'دیسک ترمز خودرو', label: 'BRAKE DISC', kind: 'brake', placeholder: false },
  caliper: { id: 'brake-caliper', src: '/images/parts/brake-caliper.png', alt: 'کالیپر ترمز خودرو', label: 'BRAKE CALIPER', kind: 'caliper', placeholder: false },
  light: { id: 'headlight-main', src: '/images/parts/headlight-main.png', alt: 'چراغ جلوی خودرو', label: 'HEADLIGHT', kind: 'light', placeholder: false },
  exterior: { id: 'side-mirror', src: '/images/parts/side-mirror.png', alt: 'آینه جانبی خودرو', label: 'SIDE MIRROR', kind: 'exterior', placeholder: false },
  suspension: { id: 'suspension-main', src: '/images/parts/suspension-main.png', alt: 'مجموعه تعلیق خودرو', label: 'SUSPENSION', kind: 'suspension', placeholder: false },
  bumper: { id: 'front-bumper', src: '/images/parts/front-bumper.png', alt: 'سپر جلوی خودرو', label: 'FRONT BUMPER', kind: 'bumper', placeholder: false },
  fender: { id: 'front-fender', src: '/images/parts/front-fender.png', alt: 'گلگیر جلوی خودرو', label: 'FRONT FENDER', kind: 'fender', placeholder: false },
  seat: { id: 'car-seat', src: '/images/parts/car-seat.png', alt: 'صندلی خودرو', label: 'CABIN SEAT', kind: 'seat', placeholder: false },
  steering: { id: 'steering-assembly', src: '/images/parts/steering-assembly.png', alt: 'مجموعه فرمان و داشبورد خودرو', label: 'STEERING ASSEMBLY', kind: 'steering', placeholder: false },
};
export const scenes = [
  { id: 'powertrain', number: '۰۱', en: 'THE POWER WITHIN', title: ['قلب تپنده،', 'آغاز هر حرکت.'], text: 'از مجموعه‌های مرتبط با موتور تا سیستم انتقال قدرت، شناخت دقیق قطعات و توجه به کیفیت، بخشی از نگاه تخصصی جهانرکسان موتور به صنعت خودرو است.', tags: ['موتور', 'گیربکس', 'انتقال قدرت'], assets: [parts.engine, parts.gear], note: 'ENGINE & TRANSMISSION' },
  { id: 'braking', number: '۰۲', en: 'CONFIDENCE IN CONTROL', title: ['کنترل و تعادل،', 'اطمینان در مسیر.'], text: 'از دیسک و کالیپر تا مجموعه تعلیق؛ اجزایی که ارتباط خودرو با جاده را شکل می‌دهند. شناخت درست این قطعات، نگاهی یکپارچه به توقف، پایداری و حرکت می‌سازد.', tags: ['سیستم ترمز', 'تعلیق', 'پایداری'], assets: [parts.brake, parts.caliper, parts.suspension], note: 'BRAKE & SUSPENSION' },
  { id: 'lighting', number: '۰۳', en: 'FORM MEETS FUNCTION', title: ['فرم، در جزئیات.', 'دید، در حرکت.'], text: 'از سپر و گلگیر تا چراغ و آینه؛ قطعات بدنه و روشنایی، پیوند میان عملکرد و هویت خودرو را شکل می‌دهند. هر جزء، بخشی از یک تصویر هماهنگ است.', tags: ['قطعات بدنه', 'روشنایی', 'تجهیزات بیرونی'], assets: [parts.bumper, parts.fender, parts.light, parts.exterior], note: 'LIGHTING & BODY' },
  { id: 'interior', number: '۰۴', en: 'THE HUMAN SIDE OF MOTION', title: ['درون خودرو،', 'نزدیک‌تر به انسان.'], text: 'صندلی، فرمان و مجموعه‌های کابین، نزدیک‌ترین بخش خودرو به تجربه سرنشین‌اند؛ جایی که توجه به جزئیات، کاربرد و هماهنگی اجزا معنا پیدا می‌کند.', tags: ['صندلی', 'فرمان', 'مجموعه‌های کابین'], assets: [parts.seat, parts.steering], note: 'INTERIOR & CABIN' },
];
// Official phone supplied by the user; other channels remain unspecified.
export const contact = { email: '', phone: '09373020028', address: '' };
