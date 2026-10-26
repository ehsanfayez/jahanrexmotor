/** Coalesce image completions into one layout refresh per animation frame. */
export function refreshAfterImages(root: HTMLElement, refresh: () => void): () => void {
  let frame: number | undefined;
  const queue = () => {
    if (frame !== undefined) return;
    frame = requestAnimationFrame(() => {
      frame = undefined;
      refresh();
    });
  };
  const pending = [...root.querySelectorAll<HTMLImageElement>('img')].filter(image => !image.complete);
  pending.forEach(image => image.addEventListener('load', queue, { once: true }));
  return () => {
    if (frame !== undefined) cancelAnimationFrame(frame);
    pending.forEach(image => image.removeEventListener('load', queue));
  };
}
