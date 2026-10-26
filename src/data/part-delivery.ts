import { stageGroups } from './cinematic-story';
import { mobilePoses } from './mobile-story';

/** The same asset uses the same maximum reading size in both reused layouts.
 * This avoids fetching a second resolution for a hidden static/desktop copy.
 * Conservative bounds also cover static reduced-motion compositions.
 */
export function partImageSizes(id: string): string {
  const item = stageGroups.flatMap(group => group.items).find(item => item.asset.id === id);
  if (!item) throw new Error(`Missing image delivery geometry: ${id}`);
  const mobileWidth = Math.max(item.pose.width, ...Object.values(mobilePoses).map(poses => poses[id]?.width ?? 0));
  const desktopVw = Math.ceil(item.pose.width * .57);
  const tabletPx = Math.ceil(mobileWidth * 5.6); // Mobile canvas is capped at 560px.
  return `(min-width: 1024px) ${desktopVw}vw, (min-width: 601px) ${tabletPx}px, ${mobileWidth}vw`;
}
