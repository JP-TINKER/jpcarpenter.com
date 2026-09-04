/** Collapsible explore nests + phone Menu drawer. */

const MOBILE_SHELL = '(max-width: 860px)';

export type ExploreShellEls = {
  root: HTMLElement;
  explore: HTMLElement;
  toggle: HTMLElement;
  close: HTMLElement | null;
  backdrop: HTMLElement | null;
  field: HTMLElement | null;
  mobile: boolean;
};

/**
 * Open or close the phone drawer. Always clears field `inert` when closed
 * or when not in the mobile shell (spec-w3-01).
 */
export function applyExploreOpen(
  open: boolean,
  els: ExploreShellEls,
  opts: { focus?: boolean } = {},
): void {
  const { root, explore, toggle, close, backdrop, field, mobile } = els;
  const show = open && mobile;
  const moveFocus = opts.focus !== false;

  root.classList.toggle('explore-open', show);
  explore.classList.toggle('is-open', show);
  toggle.setAttribute('aria-expanded', show ? 'true' : 'false');

  if (mobile) {
    explore.toggleAttribute('inert', !show);
    explore.setAttribute('aria-hidden', show ? 'false' : 'true');
  } else {
    explore.removeAttribute('inert');
    explore.removeAttribute('aria-hidden');
  }

  if (field) {
    if (show) field.setAttribute('inert', '');
    else field.removeAttribute('inert');
  }

  if (backdrop) {
    backdrop.hidden = !show;
    backdrop.setAttribute('aria-hidden', show ? 'false' : 'true');
  }

  if (!moveFocus) return;
  const focusTarget = show ? close : toggle;
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(() => focusTarget?.focus());
  } else {
    focusTarget?.focus();
  }
}

export function initExploreBranch(): void {
  document.documentElement.dataset.exploreJs = 'true';

  initNests();
  initShell();
  syncExploreHashCurrent();
  window.addEventListener('hashchange', syncExploreHashCurrent);
  window.addEventListener('pageshow', syncExploreHashCurrent);
}

function initNests(): void {
  const branches = document.querySelectorAll<HTMLElement>('[data-explore-branch]');

  branches.forEach((branch) => {
    const toggle = branch.querySelector<HTMLButtonElement>('.explore-hinge-btn');
    const shell = branch.querySelector<HTMLElement>('.explore-nest-shell');
    if (!toggle || !shell) return;

    const setOpen = (open: boolean) => {
      branch.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      shell.toggleAttribute('inert', !open);
      shell.setAttribute('aria-hidden', open ? 'false' : 'true');
    };

    setOpen(branch.classList.contains('is-open'));

    toggle.addEventListener('click', (event) => {
      event.preventDefault();
      setOpen(!branch.classList.contains('is-open'));
    });
  });
}

function initShell(): void {
  const explore = document.querySelector<HTMLElement>('[data-explore-shell]');
  const toggle = document.querySelector<HTMLElement>('[data-explore-open]');
  const close = document.querySelector<HTMLElement>('[data-explore-close]');
  const backdrop = document.querySelector<HTMLElement>('[data-explore-backdrop]');
  const field = document.querySelector<HTMLElement>('.field');
  const root = document.documentElement;
  if (!explore || !toggle) return;

  const mq = window.matchMedia(MOBILE_SHELL);

  const els = (): ExploreShellEls => ({
    root,
    explore,
    toggle,
    close,
    backdrop,
    field,
    mobile: mq.matches,
  });

  const setOpen = (open: boolean, focus = true) =>
    applyExploreOpen(open, els(), { focus });

  setOpen(false, false);

  toggle.addEventListener('click', () => {
    const willOpen = toggle.getAttribute('aria-expanded') !== 'true';
    setOpen(willOpen);
  });
  close?.addEventListener('click', () => setOpen(false));
  backdrop?.addEventListener('click', () => setOpen(false));

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (!explore.classList.contains('is-open')) return;
    event.preventDefault();
    setOpen(false);
  });

  mq.addEventListener('change', () => setOpen(false, false));
}

/**
 * Orange pip on hash-driven nest leaves (/projects#cat-…, /labs#disc-…).
 * Does not open the phone drawer (per-tab DOM only).
 */
function syncExploreHashCurrent(): void {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const hash = window.location.hash || '';

  document.querySelectorAll<HTMLElement>('.explore-nest-shell').forEach((shell) => {
    const links = shell.querySelectorAll<HTMLAnchorElement>(
      'a.explore-sub[data-explore-hash]',
    );
    if (!links.length) return;

    const nestPath = [...links]
      .map((l) => (l.getAttribute('href') || '').split('#')[0])
      .find((h) => h && h !== '');
    if (!nestPath || path !== nestPath.replace(/\/$/, '')) {
      return;
    }

    links.forEach((link) => {
      const target = link.dataset.exploreHash ?? '';
      const match = target === '' ? hash === '' : hash === target;
      if (match) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  });
}
