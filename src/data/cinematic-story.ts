import { parts, type PartAsset } from './landing';

export const canvasAspect = 1.12;
export interface Pose { left: number; top: number; width: number }
export interface StageItem { asset: PartAsset; pose: Pose; hero?: Pose; depth: number }
export interface StageGroup { id: string; items: StageItem[] }

// One source for authored CSS boxes and normalized GSAP poses; no measured pixel offsets.
export const stageGroups: StageGroup[] = [
  { id: 'powertrain', items: [
    { asset: parts.engine, pose: { left: 7, top: 13, width: 72 }, hero: { left: 24, top: 26, width: 62 }, depth: 3 },
    { asset: parts.gear, pose: { left: 63, top: 57, width: 34 }, hero: { left: 65, top: 7, width: 29 }, depth: 2 },
  ] },
  { id: 'brakes', items: [
    { asset: parts.brake, pose: { left: 3, top: 8, width: 65 }, hero: { left: 6, top: 43, width: 18 }, depth: 2 },
    { asset: parts.caliper, pose: { left: 49, top: 52, width: 28 }, depth: 3 },
    { asset: parts.suspension, pose: { left: 57, top: 4, width: 41 }, hero: { left: 82, top: 68, width: 15 }, depth: 1 },
  ] },
  { id: 'body', items: [
    { asset: parts.bumper, pose: { left: 5, top: 40, width: 62 }, hero: { left: 0, top: 69, width: 24 }, depth: 2 },
    { asset: parts.fender, pose: { left: 59, top: 0, width: 38 }, depth: 1 },
    { asset: parts.light, pose: { left: 10, top: 14, width: 22 }, hero: { left: 43, top: 5, width: 15 }, depth: 3 },
    { asset: parts.exterior, pose: { left: 74, top: 48, width: 20 }, depth: 3 },
  ] },
  { id: 'interior', items: [
    { asset: parts.seat, pose: { left: 4, top: 2, width: 62 }, hero: { left: 13, top: 11, width: 26 }, depth: 1 },
    { asset: parts.steering, pose: { left: 60, top: 48, width: 36 }, depth: 2 },
  ] },
];

export const chapterGroups = ['powertrain', 'brakes', 'body', 'interior'] as const;
export const chapterNames = ['پیشرانه و انتقال قدرت', 'ترمز و تعلیق', 'بدنه و روشنایی', 'فضای داخلی و کابین'] as const;
export const chapterProgress = [.24, .44, .64, .84] as const;
export const stageTravel = 1000;

export function heroTransform(item: StageItem) {
  const { pose, hero } = item;
  return hero ? {
    xPercent: (hero.left - pose.left) / pose.width * 100,
    yPercent: (hero.top - pose.top) / (pose.width * canvasAspect) * 100,
    scale: hero.width / pose.width,
    autoAlpha: 1,
  } : { xPercent: 0, yPercent: 0, scale: 1, autoAlpha: 0 };
}
