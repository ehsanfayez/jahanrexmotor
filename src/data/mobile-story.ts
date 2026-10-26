import type { Pose } from './cinematic-story';

export const mobileMotionQuery = '(min-width: 320px) and (max-width: 1023px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)';
export const mobileTravelScreens = 5.8;
export const mobileChapters = [
  { id: 'hero', entrance: 0, hold: 0, anchor: 'parts' },
  { id: 'powertrain', entrance: .10, hold: .22, anchor: 'powertrain' },
  { id: 'brakes', entrance: .28, hold: .40, anchor: 'braking' },
  { id: 'body', entrance: .46, hold: .58, anchor: 'lighting' },
  { id: 'interior', entrance: .64, hold: .76, anchor: 'interior' },
  { id: 'coverage', entrance: .82, hold: .93, anchor: 'brand-statement' },
] as const;
export type MobileChapter = typeof mobileChapters[number]['id'];

// Independent narrow-screen poses; the desktop art direction is not modified.
export const mobilePoses: Record<Exclude<MobileChapter, 'coverage'>, Record<string, Pose>> = {
  hero: {
    'engine-main': { left: 32, top: 12, width: 62 },
    'front-bumper': { left: 0, top: 55, width: 32 },
    'car-seat': { left: 2, top: 0, width: 25 },
  },
  powertrain: {
    'engine-main': { left: 3, top: 4, width: 66 },
    'gearbox-main': { left: 68, top: 58, width: 30 },
  },
  brakes: {
    'brake-disc': { left: 3, top: 5, width: 61 },
    'brake-caliper': { left: 52, top: 53, width: 28 },
    'suspension-main': { left: 68, top: 4, width: 29 },
  },
  body: {
    'front-bumper': { left: 3, top: 20, width: 58 },
    'headlight-main': { left: 7, top: 0, width: 29 },
    'side-mirror': { left: 72, top: 10, width: 24 },
  },
  interior: {
    'car-seat': { left: 5, top: 0, width: 65 },
    'steering-assembly': { left: 59, top: 47, width: 38 },
  },
};

export const mobileDescriptions: Record<Exclude<MobileChapter, 'hero'>, string> = {
  powertrain: 'شناخت فنی مجموعه‌های موتور و انتقال قدرت؛ با توجه به کیفیت قطعات در مسیر همکاری‌های حرفه‌ای.',
  brakes: 'از دیسک و کالیپر تا مجموعه تعلیق؛ اجزای هماهنگ برای توقف، پایداری و ارتباط خودرو با جاده.',
  body: 'قطعات بدنه، روشنایی و تجهیزات بیرونی؛ پیوند میان عملکرد و هویت خودرو، در یک ترکیب هماهنگ.',
  interior: 'صندلی، فرمان و تجهیزات کابین؛ توجه به جزئیات، کاربرد و هماهنگی اجزا در تجربهٔ سرنشین.',
  coverage: 'از پیشرانه و انتقال قدرت تا بدنه، روشنایی و کابین؛ پوشش مجموعه‌های متنوع خودرو برای همکاری‌های حرفه‌ای.',
};
