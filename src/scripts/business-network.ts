import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { refreshAfterImages } from './image-refresh';

/** One timeline owns both the desktop pin and its complete reversible reveal. */
export function setupBusinessNetwork(media: gsap.MatchMedia) {
  const section = document.querySelector<HTMLElement>('[data-business-network]');
  if (!section) return;
  media.add({ wide: '(min-width: 1100px)', motion: '(prefers-reduced-motion: no-preference)' }, responsive => {
    const scene = section.querySelector<HTMLElement>('.business-shell');
    const grid = section.querySelector<HTMLElement>('.business-grid');
    const intro = section.querySelector<HTMLElement>('[data-network-intro]');
    const emblem = section.querySelector<HTMLElement>('[data-network-emblem]');
    const wires = section.querySelector<SVGElement>('[data-network-connections]');
    const panels = [...section.querySelectorAll<HTMLElement>('[data-network-panel]')];
    const header = document.querySelector<HTMLElement>('[data-header]');
    if (!scene || !grid || !intro || !emblem || panels.length !== 4) return;
    if (!responsive.conditions?.motion) return;
    let animations: gsap.Context | undefined;
    let master: gsap.core.Timeline | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let disposed = false;
    let signature = '';
    // Observe content geometry, never animated transforms or a pin spacer's height.
    const geometry = () => [innerWidth, innerHeight, grid.offsetWidth, grid.offsetHeight, intro.offsetHeight].join(':');
    const build = () => {
      if (disposed) return;
      const oldPin = master?.scrollTrigger;
      const restore = oldPin?.isActive ? oldPin.progress : undefined;
      animations?.revert();
      master = undefined;
      section.classList.remove('network-business--compact');
      // Use the full desktop header clearance even when its compact treatment is active.
      const pinTop = Math.max(88, header?.offsetHeight ?? 0) + 8;
      const available = innerHeight - pinTop - 16;
      // This auto-height wrapper contains the full grid in normal flow. offsetHeight
      // measures layout; scrollHeight also includes the entrance translations.
      const fullHeight = scene.offsetHeight;
      if (responsive.conditions?.wide && fullHeight > available) section.classList.add('network-business--compact');
      const height = scene.offsetHeight;
      const fits = height <= available;
      try {
        animations = gsap.context(() => {
          if (responsive.conditions?.wide && fits) {
            const distance = Math.round(Math.max(2400, innerHeight * 3.2));
            master = gsap.timeline({
              defaults: { ease: 'none' },
              scrollTrigger: {
                id: 'business-network-desktop', trigger: scene, pin: scene,
                start: () => 'top ' + pinTop + 'px', end: () => '+=' + distance,
                pinSpacing: true, scrub: .22, anticipatePin: 1, invalidateOnRefresh: true,
              },
            });
            master.fromTo(intro, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .10 }, 0);
            // Its position and dimensions are never animated: the emblem is always at the grid junction.
            master.fromTo(emblem, { autoAlpha: 0 }, { autoAlpha: 1, duration: .12 }, 0);
            if (wires) master.fromTo(wires, { opacity: 0 }, { opacity: 1, duration: .12 }, 0);
            panels.forEach((panel, index) => {
              master!.fromTo(panel, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .13 }, .15 + index * .17);
            });
            master.to({}, { duration: .21 }, .79); // A real full-composition reading hold before release.
          } else {
            // No pin or hidden overflow when the complete readable composition cannot fit.
            gsap.fromTo([intro, emblem], { autoAlpha: 0, y: 12 }, {
              autoAlpha: 1, y: 0, ease: 'none',
              scrollTrigger: { id: 'business-network-intro', trigger: intro, start: 'top 94%', end: 'top 70%', scrub: .18 },
            });
            panels.forEach(panel => gsap.fromTo(panel, { autoAlpha: 0, y: 14 }, {
              autoAlpha: 1, y: 0, ease: 'none',
              scrollTrigger: { id: 'business-network-' + panel.dataset.networkPanel, trigger: panel, start: 'top 95%', end: 'top 72%', scrub: .18 },
            }));
          }
        }, section);
        signature = geometry();
        ScrollTrigger.refresh();
        const nextPin = (master as gsap.core.Timeline | undefined)?.scrollTrigger;
        if (restore !== undefined && nextPin) {
          // Preserve the current story position across a settled resize, not wheel input.
          window.scrollTo({ top: nextPin.start + restore * (nextPin.end - nextPin.start), behavior: 'instant' });
          ScrollTrigger.update();
        }
        // Refresh can happen while the browser restores a deep scroll position.
        // Render that position immediately rather than waiting for the next wheel event.
        if (nextPin) (master as gsap.core.Timeline | undefined)?.progress(nextPin.progress);
      } catch (error) {
        animations?.revert();
        master = undefined;
        section.classList.remove('network-business--compact');
        console.warn('Business Network motion unavailable; static content preserved.', error);
      }
    };
    const schedule = () => {
      if (timer !== undefined) clearTimeout(timer);
      timer = setTimeout(() => {
        if (!disposed && geometry() !== signature) build();
      }, 160);
    };
    build();
    const observer = new ResizeObserver(schedule);
    observer.observe(grid);
    observer.observe(intro);
    window.addEventListener('resize', schedule, { passive: true });
    const stopImageRefresh = refreshAfterImages(section, schedule);
    void document.fonts.ready.then(() => { if (!disposed) schedule(); });
    return () => {
      disposed = true;
      if (timer !== undefined) clearTimeout(timer);
      observer.disconnect();
      stopImageRefresh();
      window.removeEventListener('resize', schedule);
      animations?.revert();
      section.classList.remove('network-business--compact');
    };
  });
}
