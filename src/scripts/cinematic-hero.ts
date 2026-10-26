import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { stageGroups, heroTransform } from '../data/cinematic-story';
import { refreshAfterImages } from './image-refresh';

export const storyLabels = {
  hero: 0, heroHold: .04, heroDeparture: .12,
  engineHold: .20, engineExit: .30,
  brakeHold: .40, brakeExit: .50,
  bodyHold: .60, bodyExit: .70,
  cabinHold: .80, cabinExit: .85,
  coverageEntrance: .86, coverageHold: .92, coverageExit: .975,
  corporateHandoff: .99, complete: 1,
} as const;

/** One rendered playhead owns all four chapters and their accessible text panels. */
export function setupCinematicHero(media: gsap.MatchMedia, experience: HTMLElement) {
  media.add('(min-width: 1024px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)', () => {
    const stage = experience.querySelector<HTMLElement>('[data-stage]')!;
    const canvas = experience.querySelector<HTMLElement>('[data-visual-window]')!;
    const panel = (name: string) => experience.querySelector<HTMLElement>(`[data-panel="${name}"]`)!;
    const group = (name: string) => experience.querySelector<HTMLElement>(`[data-group="${name}"]`)!;
    const part = (name: string) => canvas.querySelector<HTMLElement>(`[data-asset-slot="${name}"] [data-part-motion]`)!;
    const panels = ['hero', 'powertrain', 'brakes', 'body', 'interior', 'coverage'].map(panel);
    const coverageVisual = experience.querySelector<HTMLElement>('[data-coverage-visual]')!;
    const coverageCopy = experience.querySelector<HTMLElement>('[data-coverage-copy]')!;
    const coverageCategories = experience.querySelector<HTMLElement>('[data-coverage-categories]')!;
    const anchors = [...experience.querySelectorAll<HTMLElement>('[data-anchor]')].map(element => ({ element, parent: element.parentElement!, next: element.nextSibling }));
    const originalStyles = [...experience.querySelectorAll<HTMLElement>('[data-group], [data-part-motion], [data-panel], [data-coverage-visual], [data-coverage-copy], [data-coverage-categories], [data-flow-light], [data-brake-light], [data-body-light], [data-cabin-light], .composition-reference')]
      .map(element => ({ element, style: element.getAttribute('style') }));
    let active = '';
    const updateAccess = (progress: number) => {
      const name = progress < .12 ? 'hero' : progress < .34 ? 'powertrain' : progress < .54 ? 'brakes' : progress < .74 ? 'body' : progress < .875 ? 'interior' : 'coverage';
      if (name === active) return;
      active = name;
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
    experience.classList.add('is-enhanced');
    anchors.forEach(({ element }) => experience.append(element));
    updateAccess(0);
    const context = gsap.context(() => {
      const rest = { x: 0, y: 0, xPercent: 0, yPercent: 0, scale: 1 };
      const hidden = { ...rest, autoAlpha: 0 };
      gsap.set(experience.querySelectorAll('[data-group]'), { ...rest, autoAlpha: 1 });
      stageGroups.forEach(g => g.items.forEach(item => gsap.set(part(item.asset.id), { ...rest, ...heroTransform(item), transformOrigin: 'top left' })));
      gsap.set(panels.slice(1), { autoAlpha: 0, y: 25 });
      // The full-stage coverage panel owns its own image/copy transforms.
      gsap.set(panel('coverage'), { y: 0 });
      gsap.set(coverageCopy, { autoAlpha: 0, y: 18 });
      gsap.set(coverageCategories, { autoAlpha: 0, y: 10 });
      const master = gsap.timeline({
        defaults: { ease: 'none' },
        onUpdate: function (this: gsap.core.Timeline) { updateAccess(this.progress()); },
        scrollTrigger: {
          id: 'automotive-experience', trigger: experience, start: 'top top',
          end: 'bottom bottom', scrub: .65, invalidateOnRefresh: true,
          onRefresh: self => updateAccess(self.animation?.progress() ?? self.progress),
        },
      });
      Object.entries(storyLabels).forEach(([name, time]) => master.addLabel(name, time));
      master.fromTo(panel('hero'), { ...rest, autoAlpha: 1 }, { ...hidden, y: -30, duration: .08, ease: 'power1.in', immediateRender: false }, 'heroHold');
      master.fromTo(group('powertrain'), { ...rest, autoAlpha: 1 }, { ...rest, yPercent: -2, duration: .12, immediateRender: false }, 'hero');
      master.fromTo(group('powertrain'), { ...rest, yPercent: -2 }, { ...rest, duration: .08, ease: 'power1.out', immediateRender: false }, 'heroDeparture');
      stageGroups[0].items.forEach(item => master.fromTo(part(item.asset.id), { ...rest, ...heroTransform(item) }, { ...rest, autoAlpha: 1, duration: .08, ease: 'power1.inOut', immediateRender: false }, 'heroDeparture'));
      master.fromTo(panel('powertrain'), { ...hidden, y: 25 }, { ...rest, autoAlpha: 1, duration: .08, ease: 'power1.out', immediateRender: false }, 'heroDeparture');
      ['brakes', 'body', 'interior'].forEach((name, index) => master.fromTo(group(name), { ...rest, autoAlpha: 1 }, {
        ...hidden, xPercent: -24 - index * 8, yPercent: 15 + index * 4, duration: .14, ease: 'power1.inOut', immediateRender: false,
      }, 'heroHold'));

      const exchange = (outgoing: string, incoming: string, at: number, exit: {xPercent:number;yPercent:number;scale:number}, enter: {xPercent:number;yPercent:number;scale:number}) => {
        master.fromTo(group(outgoing), { ...rest, autoAlpha: 1 }, { ...rest, ...exit, autoAlpha: 0, duration: .10, ease: 'power1.inOut', immediateRender: false }, at);
        master.fromTo(panel(outgoing), { ...rest, autoAlpha: 1 }, { ...hidden, x: -18, y: -22, duration: .04, immediateRender: false }, at);
        // Reset normalized child poses only while this incoming group is fully hidden.
        const items = stageGroups.find(g => g.id === incoming)!.items;
        master.set(items.map(item => part(item.asset.id)), { ...rest, autoAlpha: 1 }, at);
        master.fromTo(group(incoming), { ...rest, ...enter, autoAlpha: 0 }, { ...rest, autoAlpha: 1, duration: .10, ease: 'power1.inOut', immediateRender: false }, at);
        master.fromTo(panel(incoming), { ...hidden, y: 25 }, { ...rest, autoAlpha: 1, duration: .06, ease: 'power1.out', immediateRender: false }, at + .04);
      };
      exchange('powertrain', 'brakes', storyLabels.engineExit, { xPercent: -100, yPercent: -12, scale: .97 }, { xPercent: 85, yPercent: 18, scale: .94 });
      exchange('brakes', 'body', storyLabels.brakeExit, { xPercent: -90, yPercent: 4, scale: .98 }, { xPercent: 88, yPercent: -6, scale: .98 });
      exchange('body', 'interior', storyLabels.bodyExit, { xPercent: -92, yPercent: -6, scale: .98 }, { xPercent: 72, yPercent: 10, scale: .97 });
      // Hide the entire cabin group, including both children; autoAlpha restores
      // visibility when the same master playhead reverses through this interval.
      master.fromTo(group('interior'), { ...rest, autoAlpha: 1 }, { ...hidden, xPercent: -18, yPercent: -7, scale: .98, duration: .04, ease: 'power1.inOut', immediateRender: false }, 'cabinExit');
      master.fromTo(panel('interior'), { ...rest, autoAlpha: 1 }, { ...hidden, y: -24, duration: .025, immediateRender: false }, 'cabinExit');
      master.fromTo(panel('coverage'), { autoAlpha: 0 }, { autoAlpha: 1, duration: .04, ease: 'power1.inOut', immediateRender: false }, 'coverageEntrance');
      master.fromTo(coverageVisual, { ...rest, x: -10, y: 18, scale: 1.03 }, { ...rest, duration: .06, ease: 'power1.out', immediateRender: false }, 'coverageEntrance');
      master.fromTo(coverageCopy, { ...hidden, y: 18 }, { ...rest, autoAlpha: 1, duration: .04, ease: 'power1.out', immediateRender: false }, .88);
      master.fromTo(coverageCategories, { ...hidden, y: 10 }, { ...rest, autoAlpha: 1, duration: .025, ease: 'power1.out', immediateRender: false }, .895);
      // The image remains substantial at release; normal page flow carries it
      // into the existing diagonal light boundary instead of leaving black space.
      master.fromTo(coverageVisual, { ...rest }, { ...rest, y: -18, duration: .025, immediateRender: false }, 'coverageExit');
      master.fromTo(coverageCopy, { ...rest, autoAlpha: 1 }, { ...rest, autoAlpha: .55, y: -14, duration: .025, immediateRender: false }, 'coverageExit');
      master.fromTo(experience.querySelector('[data-brake-light]'), { opacity: 0 }, { opacity: 1, duration: .10, immediateRender: false }, 'engineExit');
      master.fromTo(experience.querySelector('[data-body-light]'), { opacity: 0 }, { opacity: 1, duration: .10, immediateRender: false }, 'brakeExit');
      master.fromTo(experience.querySelector('[data-cabin-light]'), { opacity: 0 }, { opacity: 1, duration: .10, immediateRender: false }, 'bodyExit');
      master.fromTo(experience.querySelector('[data-flow-light]'), { opacity: 0 }, { opacity: 1, duration: .04, immediateRender: false }, 'cabinExit');
      master.fromTo(experience.querySelector('.composition-reference'), { autoAlpha: 1 }, { autoAlpha: 0, duration: .04, immediateRender: false }, 'cabinExit');
      experience.dataset.motionReady = 'true';
    }, stage);
    const stopImageRefresh = refreshAfterImages(experience, () => ScrollTrigger.refresh());
    ScrollTrigger.refresh();
    return () => {
      stopImageRefresh();
      context.revert();
      // Restore adjacent alias markers from last to first so each next sibling exists.
      [...anchors].reverse().forEach(({ element, parent, next }) => parent.insertBefore(element, next));
      experience.classList.remove('is-enhanced');
      delete experience.dataset.motionReady;
      panels.forEach(element => { element.inert = false; element.removeAttribute('aria-hidden'); element.style.removeProperty('pointer-events'); });
      experience.querySelectorAll('[aria-current]').forEach(link => link.removeAttribute('aria-current'));
      originalStyles.forEach(({ element, style }) => {
        if (style === null) element.removeAttribute('style');
        else element.setAttribute('style', style);
      });
    };
  });
}
