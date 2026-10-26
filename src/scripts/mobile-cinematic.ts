import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mobileChapters, mobileMotionQuery, mobilePoses, mobileTravelScreens, type MobileChapter } from '../data/mobile-story';
import { refreshAfterImages } from './image-refresh';

/** One native-scroll mobile story. Desktop and reduced-motion never enter here. */
export function setupMobileCinematicHero(media: gsap.MatchMedia, experience: HTMLElement) {
  let alignInitialHash = window.matchMedia(mobileMotionQuery).matches;
  media.add(mobileMotionQuery, () => {
    const stage = experience.querySelector<HTMLElement>('[data-stage]')!;
    const panels = mobileChapters.map(chapter => experience.querySelector<HTMLElement>(`[data-panel="${chapter.id}"]`)!);
    const visuals = panels.map(panel => panel.querySelector<HTMLElement>('.panel-static-visual, [data-coverage-visual]')!);
    const copy = panels.map(panel => panel.dataset.panel === 'coverage'
      ? [...panel.querySelectorAll<HTMLElement>('.coverage-copy > *')]
      : [...panel.querySelectorAll<HTMLElement>('.panel-copy, .panel-actions')]);
    const anchors = [...experience.querySelectorAll<HTMLElement>('[data-anchor]')].map(element => ({ element, parent: element.parentElement!, next: element.nextSibling }));
    const savedStyles = [experience, ...experience.querySelectorAll<HTMLElement>('[data-anchor], [data-panel], [data-mobile-asset], .panel-static-visual, .panel-copy, .panel-actions, .coverage-visual, .coverage-copy > *')]
      .map(element => ({ element, style: element.getAttribute('style') }));
    const savedAccess = panels.map(element => ({ element, inert: element.inert, hidden: element.getAttribute('aria-hidden') }));
    let active: MobileChapter | '' = '';
    let travel = 0;
    let alignmentFrame = 0;
    experience.classList.add('is-mobile-enhanced');
    experience.dataset.motionMode = 'mobile';
    const measure = () => {
      // svh is stable while browser toolbars expand/collapse. No refresh in this hook.
      const next = Math.round(stage.clientHeight * mobileTravelScreens);
      if (next !== travel) {
        travel = next;
        experience.style.setProperty('--mobile-travel', `${travel}px`);
      }
    };
    measure();
    const aliases: Record<string, number> = { suspension: .40, 'more-parts': .58 };
    mobileChapters.forEach(chapter => { aliases[chapter.anchor] = chapter.hold; });
    anchors.forEach(({ element }) => {
      element.style.setProperty('--mobile-anchor-progress', String(aliases[element.id] ?? 0));
      experience.append(element);
    });
    const updateAccess = (progress: number) => {
      let name: MobileChapter = 'hero';
      mobileChapters.slice(1).forEach(chapter => { if (progress >= chapter.entrance + .04) name = chapter.id; });
      if (active === name) return;
      active = name;
      experience.dataset.mobileScene = name;
      panels.forEach(element => {
        const visible = element.dataset.panel === name;
        element.inert = !visible;
        element.setAttribute('aria-hidden', String(!visible));
        element.style.pointerEvents = visible ? 'auto' : 'none';
      });
      experience.querySelectorAll<HTMLElement>('[data-story-link]').forEach(link => {
        if (link.dataset.storyLink === name) link.setAttribute('aria-current', 'step');
        else link.removeAttribute('aria-current');
      });
    };
    const context = gsap.context(() => {
      const rest = { x: 0, y: 0, xPercent: 0, yPercent: 0, scale: 1 };
      panels.forEach((panel, index) => {
        gsap.set(panel, { autoAlpha: index === 0 ? 1 : 0 });
        gsap.set(visuals[index], index === 0 ? { ...rest, autoAlpha: 1 } : { ...rest, xPercent: 12, y: 18, scale: .97, autoAlpha: 0 });
        gsap.set(copy[index], index === 0 ? { ...rest, autoAlpha: 1 } : { ...rest, y: 12, autoAlpha: 0 });
        if (index === panels.length - 1) return;
        const poses = mobilePoses[mobileChapters[index].id as keyof typeof mobilePoses];
        panel.querySelectorAll<HTMLElement>('[data-mobile-asset]').forEach(element => {
          const pose = poses[element.dataset.mobileAsset!];
          if (pose) gsap.set(element, { left: `${pose.left}%`, top: `${pose.top}%`, width: `${pose.width}%`, autoAlpha: 1 });
          else gsap.set(element, { autoAlpha: 0 }); // The desktop fender is nonessential here.
        });
      });
      updateAccess(0);
      const master = gsap.timeline({
        defaults: { ease: 'none' },
        onUpdate: function (this: gsap.core.Timeline) { updateAccess(this.progress()); },
        scrollTrigger: {
          id: 'automotive-mobile', trigger: experience, start: 'top top',
          end: () => `+=${travel}`, scrub: .35, invalidateOnRefresh: true,
          onRefresh: self => updateAccess(self.animation?.progress() ?? self.progress),
        },
      });
      mobileChapters.forEach(chapter => {
        master.addLabel(`${chapter.id}Entrance`, chapter.entrance);
        master.addLabel(`${chapter.id}Hold`, chapter.hold);
      });
      mobileChapters.slice(1).forEach((chapter, index) => {
        const at = chapter.entrance;
        const outgoing = index, incoming = index + 1;
        const exitDuration = chapter.id === 'coverage' ? .07 : .085;
        master.fromTo(copy[outgoing], { ...rest, autoAlpha: 1 }, { ...rest, y: -12, autoAlpha: 0, duration: .03, immediateRender: false }, at);
        master.fromTo(visuals[outgoing], { ...rest, autoAlpha: 1 }, { ...rest, xPercent: -15, y: -12, scale: .97, autoAlpha: 0, duration: exitDuration, ease: 'power1.inOut', immediateRender: false }, at);
        master.fromTo(panels[outgoing], { autoAlpha: 1 }, { autoAlpha: 0, duration: .01, immediateRender: false }, at + exitDuration);
        master.fromTo(panels[incoming], { autoAlpha: 0 }, { autoAlpha: 1, duration: .035, immediateRender: false }, at);
        master.fromTo(visuals[incoming], { ...rest, xPercent: 12, y: 18, scale: .97, autoAlpha: 0 }, { ...rest, autoAlpha: 1, duration: .085, ease: 'power1.out', immediateRender: false }, at + .005);
        master.fromTo(copy[incoming], { ...rest, y: 12, autoAlpha: 0 }, { ...rest, autoAlpha: 1, duration: .045, ease: 'power1.out', immediateRender: false }, at + .04);
      });
      master.addLabel('coverageExit', .975);
      master.fromTo(visuals[5], { ...rest, autoAlpha: 1 }, { ...rest, y: -14, autoAlpha: 1, duration: .025, immediateRender: false }, 'coverageExit');
      master.fromTo(copy[5], { ...rest, autoAlpha: 1 }, { ...rest, y: -10, autoAlpha: .65, duration: .025, immediateRender: false }, 'coverageExit');
      master.addLabel('complete', 1);
    }, stage);
    experience.dataset.mobileMotionReady = 'true';
    ScrollTrigger.addEventListener('refreshInit', measure);
    const stopImageRefresh = refreshAfterImages(experience, () => ScrollTrigger.refresh());
    ScrollTrigger.refresh();
    if (alignInitialHash) {
      alignInitialHash = false;
      const id = decodeURIComponent(location.hash.slice(1));
      const target = anchors.find(({ element }) => element.id === id)?.element;
      if (target) alignmentFrame = requestAnimationFrame(() => {
        target.scrollIntoView({ block: 'start', behavior: 'instant' });
        ScrollTrigger.update();
      });
    }
    return () => {
      cancelAnimationFrame(alignmentFrame);
      ScrollTrigger.removeEventListener('refreshInit', measure);
      stopImageRefresh();
      context.revert();
      [...anchors].reverse().forEach(({ element, parent, next }) => parent.insertBefore(element, next));
      experience.classList.remove('is-mobile-enhanced');
      delete experience.dataset.motionMode;
      delete experience.dataset.mobileScene;
      delete experience.dataset.mobileMotionReady;
      savedAccess.forEach(({ element, inert, hidden }) => {
        element.inert = inert;
        if (hidden === null) element.removeAttribute('aria-hidden');
        else element.setAttribute('aria-hidden', hidden);
      });
      experience.querySelectorAll('[data-story-link][aria-current]').forEach(link => link.removeAttribute('aria-current'));
      savedStyles.forEach(({ element, style }) => {
        if (style === null) element.removeAttribute('style');
        else element.setAttribute('style', style);
      });
    };
  });
}
