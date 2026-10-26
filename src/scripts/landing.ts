import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setupCinematicHero } from './cinematic-hero';
import { setupMobileCinematicHero } from './mobile-cinematic';

gsap.registerPlugin(ScrollTrigger);

let dispose: (() => void) | undefined;

function initializeLanding() {
  dispose?.();
  const hero = document.querySelector<HTMLElement>('[data-experience]');
  if (!hero) return;

  const controller = new AbortController();
  const { signal } = controller;
  const header = document.querySelector<HTMLElement>('[data-header]');
  const menu = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const navigation = document.querySelector<HTMLElement>('[data-navigation]');
  const setMenu = (open: boolean) => {
    if (open && menu?.getAttribute('aria-expanded') !== 'true') {
      const gap = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
      document.documentElement.style.setProperty('--navigation-scrollbar', `${gap}px`);
    } else if (!open) {
      document.documentElement.style.removeProperty('--navigation-scrollbar');
    }
    menu?.setAttribute('aria-expanded', String(open));
    navigation?.classList.toggle('is-open', open);
    header?.classList.toggle('menu-open', open);
  };
  menu?.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'), { signal });
  navigation?.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).closest('a')) setMenu(false);
  }, { signal });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menu.focus();
    }
  }, { signal });
  const closeOnDesktop = () => { if (window.innerWidth >= 900) setMenu(false); };
  window.addEventListener('resize', closeOnDesktop, { signal });

  // This trigger changes only the header treatment; page geometry stays fixed.
  const headerTrigger = ScrollTrigger.create({
    start: 36,
    end: 'max',
    onUpdate: () => header?.classList.toggle('is-compact', window.scrollY > 36),
  });
  header?.classList.toggle('is-compact', window.scrollY > 36);

  const media = gsap.matchMedia();
  setupCinematicHero(media, hero);
  setupMobileCinematicHero(media, hero);
  const reportStoryTriggers = () => {
    const stories = ScrollTrigger.getAll().filter(trigger => trigger.vars.id === 'automotive-experience' || trigger.vars.id === 'automotive-mobile');
    hero.dataset.storyTriggerCount = String(stories.length);
  };
  ScrollTrigger.addEventListener('refresh', reportStoryTriggers);
  reportStoryTriggers();

  // Local font metrics can settle after initial parsing; refresh once ready.
  void document.fonts.ready.then(() => { if (!signal.aborted) ScrollTrigger.refresh(); });
  dispose = () => {
    controller.abort();
    setMenu(false);
    media.revert();
    ScrollTrigger.removeEventListener('refresh', reportStoryTriggers);
    delete hero.dataset.storyTriggerCount;
    headerTrigger.kill();
  };
}

initializeLanding();
document.addEventListener('astro:page-load', initializeLanding);
document.addEventListener('astro:before-swap', () => { dispose?.(); dispose = undefined; });
