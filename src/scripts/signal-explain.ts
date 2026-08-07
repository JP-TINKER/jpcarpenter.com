/** Plain-English explainers for instrument readouts. Short on purpose: what it is,
 *  how a page reads it, and why a reader should care. Aimed at a non-technical
 *  visitor, not an engineer. Used by TRACE row clicks and the EXPOSURE GAUGE
 *  slide plate.
 */

export interface SignalExplain {
  title: string;
  what: string;
  how: string;
  means: string;
}

const EXPLAINS: Record<string, SignalExplain> = {
  'ua.browser': {
    title: 'Browser and system label',
    what: 'A name tag your browser attaches to every page it loads, saying which browser and operating system you use.',
    how: 'The page reads it the instant you arrive. You do not click anything.',
    means: 'Alone, it only sorts you into a broad group. Stacked with the rest, it helps narrow down who you are.',
  },
  'tz.offset': {
    title: 'Time zone',
    what: 'The time zone your device is set to.',
    how: 'Read from your device clock the moment the page loads.',
    means: 'A hint about where you are, without ever asking for your location. A VPN hides your IP address but usually does not change this.',
  },
  'lang.list': {
    title: 'Language list',
    what: 'The languages you prefer, in the order you set them.',
    how: 'Sent along with many page requests automatically.',
    means: 'An unusual language order is more identifying than a common one. Another quiet clue to who you are.',
  },
  'screen.geom': {
    title: 'Screen size',
    what: 'The width, height, and color depth of your screen.',
    how: 'Read from your display the moment the page opens.',
    means: 'Common laptop sizes blend in. An unusual resolution or a multi-monitor setup makes you easier to pick out of a crowd.',
  },
  'cpu.cores': {
    title: 'Processor core count',
    what: 'How many processing cores your computer reports it has.',
    how: 'Read on load. Some privacy browsers hide or round this number.',
    means: 'Not very identifying on its own, but it stacks with everything else to narrow the field.',
  },
  'mem.device': {
    title: 'Device memory',
    what: 'A rough estimate of your computer\u2019s memory.',
    how: 'Read on load, when the browser is willing to share it.',
    means: 'Even a missing answer is a clue: it hints at which browser or privacy settings you chose.',
  },
  'nav.platform': {
    title: 'System label',
    what: 'A short label for your operating system and processor type.',
    how: 'Read on load. Older, but still widely checked.',
    means: 'Confirms the operating system your browser runs on. Useful to a tracker when other signals have been hidden.',
  },
  'touch.points': {
    title: 'Touch support',
    what: 'How many fingers your screen can register at once.',
    how: 'Read on load. Most desktops report zero; many touch laptops report five or more.',
    means: 'A cheap way to sort phones and touch laptops from plain desktops. One more piece of the fingerprint.',
  },
  'pdf.viewer': {
    title: 'PDF viewer flag',
    what: 'Whether your browser says it can show PDFs inside a page.',
    how: 'Read on load when the browser offers it.',
    means: 'A tiny signal. Helps a tracker tell browser builds and locked-down corporate machines apart.',
  },
  'media.prefs': {
    title: 'Display and accessibility settings',
    what: 'A bundle of your display and accessibility choices: color range, HDR, contrast, forced colors, inverted colors, reduced motion, reduced transparency.',
    how: 'Checked quietly on load. Trackers usually read several of these at once, not one at a time.',
    means: 'Most people look the same here. An unusual accessibility or display setting makes you stand out, and it stacks with the rest.',
  },
  'media.gamut': {
    title: 'Color range',
    what: 'Which range of colors your screen claims to show: standard, wide, or the widest.',
    how: 'Checked quietly on load. No permission prompt.',
    means: 'Wide-color screens (often Apple) split off from standard panels. One more way to tell machines apart.',
  },
  'media.hdr': {
    title: 'HDR / dynamic range',
    what: 'Whether your screen reports it can show high dynamic range.',
    how: 'Checked quietly on load.',
    means: 'Most machines say standard. An HDR-capable setup is easier to re-spot on a later visit.',
  },
  'media.contrast': {
    title: 'Contrast preference',
    what: 'Whether you asked your system for more or less contrast.',
    how: 'Checked quietly on load.',
    means: 'Usually left at default. A set value is uncommon, and uncommon is identifying.',
  },
  'media.forced': {
    title: 'Forced colors',
    what: 'Whether your system is overriding colors with a limited palette (high-contrast modes).',
    how: 'Checked quietly on load.',
    means: 'Rare when active. A strong tell for an accessibility setup.',
  },
  'media.inverted': {
    title: 'Inverted colors',
    what: 'Whether your system is inverting its colors.',
    how: 'Checked quietly on load.',
    means: 'Uncommon. When on, it is a sharp identity bit that few other people share.',
  },
  'media.motion': {
    title: 'Reduced motion',
    what: 'Whether you asked your system to cut down animation.',
    how: 'Checked quietly on load.',
    means: 'An accessibility choice that also becomes a tracking attribute once a tracker logs it.',
  },
  'media.transparency': {
    title: 'Reduced transparency',
    what: 'Whether you asked your system for less see-through UI.',
    how: 'Checked quietly on load.',
    means: 'Same story as reduced motion: a preference that doubles as a signal.',
  },
  'canvas.render': {
    title: 'Canvas fingerprint',
    what: 'A fingerprint made by drawing hidden text and shapes, then reading back the exact pixels.',
    how: 'The page draws on a hidden canvas and inspects the result. Your graphics chip, drivers, and fonts leave marks in the pixels.',
    means: 'One of the strongest signals there is. It survives clearing your cookies and private browsing, and on most sites nothing tells you it happened.',
  },
  'webgl.renderer': {
    title: 'Graphics chip name',
    what: 'The name of the graphics chip inside your computer.',
    how: 'Read from your graphics driver on load. Privacy browsers may hide or generalize it.',
    means: 'Often names your exact graphics card family. One of the loudest hardware tells a page can get.',
  },
  'audio.context': {
    title: 'Audio fingerprint',
    what: 'A fingerprint made by processing a silent sound and reading back the result.',
    how: 'The page runs audio math you never hear and inspects the output number.',
    means: 'Stable across visits on the same machine. Another independent layer of recognition, even with cookies off.',
  },
  'fonts.detected': {
    title: 'Installed fonts',
    what: 'Which fonts are installed on your computer, figured out by measuring how wide sample text is.',
    how: 'The page renders hidden text in candidate fonts and compares the widths against fallbacks.',
    means: 'Your font set is often unique to you. In published research, this one signal alone can pick you out of a crowd of thousands.',
  },
  'math.engine': {
    title: 'Math quirks',
    what: 'Tiny differences in how your browser does math, exposed by running the same formulas and comparing answers.',
    how: 'The page runs fixed math problems and turns the answers into a short ID.',
    means: 'A quiet signal that helps a tracker tell browser engines apart, even when the browser name has been changed.',
  },
  'composite.hash': {
    title: 'Composite ID',
    what: 'One short ID built from every signal above, passive and active.',
    how: 'Combined locally into one ID and stored only in this browser.',
    means: 'This is the trick that lets a page recognize you on your next visit without any cookie. On a tracker\u2019s site, the same idea runs across many websites at once.',
  },
  'gauge.signals': {
    title: 'Signals score',
    what: 'How many of the 12 passive checks this page could read about you, with credit for turning on Do Not Track or Global Privacy Control.',
    how: 'Each check is a fact your browser hands over on load. Nothing is sent anywhere.',
    means: 'A higher number means a richer free profile of you. Privacy tools that hold fields back pull the needle down.',
  },
  'gauge.reading': {
    title: 'Reading band',
    what: 'A plain label for how specific your combination looks: LOW up to DISTINCTIVE.',
    how: 'Figured from the signals score as a share of the 12 checks.',
    means: 'NOTABLE or DISTINCTIVE does not mean \u201cwe know your name.\u201d It means fewer people share this exact mix, so you are easier to single out.',
  },
  'gauge.note': {
    title: 'Note',
    what: 'A one-line reading of the band.',
    how: 'Tied to the same score as the needle, so the picture and the words cannot disagree.',
    means: 'If the note says \u201cfairly specific,\u201d treat the passive set as already useful to a tracker who wants to follow you.',
  },
  'gauge.detected': {
    title: 'Detected line',
    what: 'A short summary of the loudest facts this page could read: browser, system, language, time zone, cores, screen.',
    how: 'Pulled from the same reads as the score. Shown so you can see the raw facts, not just a needle.',
    means: 'This is the \u201chello, we already know this about you\u201d line that every site can write about you without asking.',
  },
  'gauge.overview': {
    title: 'Exposure gauge',
    what: 'A meter of how much your browser gives away the instant a page loads.',
    how: 'Twelve passive reads, scored once on load. Tap Signals, Reading, Note, or the face for detail.',
    means: 'No fingerprinting tricks here, just the free baseline every site gets. The TRACE below adds the active probes.',
  },
  'email.spf': {
    title: 'SPF',
    what: 'Which servers are allowed to send mail for this domain.',
    how: 'Read from the Authentication-Results or Received-SPF line in the header you pasted.',
    means: 'pass means sent from an allowed server; fail means not; none means the domain published no SPF list.',
  },
  'email.dkim': {
    title: 'DKIM',
    what: 'A cryptographic signature on this message, checked against the domain\'s published key.',
    how: 'Read from the Authentication-Results line, or the DKIM-Signature block.',
    means: 'pass means the signature matched the key; fail means it did not, or there was none to check.',
  },
  'email.dmarc': {
    title: 'DMARC',
    what: 'The domain\'s published rule for what receivers should do with mail that fails SPF or DKIM.',
    how: 'Read from the Authentication-Results line. A "no DMARC record" result is different from "DMARC fail."',
    means: 'pass means the message followed the rule; fail means it broke a published rule; none means the domain published no rule at all.',
  },
  'email.action': {
    title: 'What to do',
    what: 'The decision from the three verdicts combined.',
    how: 'Matched against the combination table in the tutorial: SPF, DKIM, and DMARC posture together.',
    means: 'A clean pass means the mail came from the domain it claims, not that it is safe. AI-era scams often send from real, authenticated accounts or lookalike domains, so confirm money or credential requests out-of-band.',
  },
  'email.summary': {
    title: 'This header',
    what: 'A one-line read of the pasted header.',
    how: 'Parsed locally in your browser. Nothing is sent anywhere; there is no server to send it to.',
    means: 'Tap a verdict row for the plain-English version of that check.',
  },
};

export function getSignalExplain(key: string): SignalExplain | null {
  return EXPLAINS[key] ?? null;
}

export type DrawerDirection = 'end' | 'down';

/** Wire a mechanical explain plate: open/close, swap copy, Escape / outside to close. */
export function bindExplainDrawer(opts: {
  root: HTMLElement;
  drawer: HTMLElement;
  titleEl: HTMLElement;
  whatEl: HTMLElement;
  howEl: HTMLElement;
  meansEl: HTMLElement;
  closeBtn: HTMLElement;
  direction: DrawerDirection;
}): { open: (key: string) => void; close: () => void } {
  const { root, drawer, titleEl, whatEl, howEl, meansEl, closeBtn } = opts;
  let openKey: string | null = null;

  function fill(key: string): boolean {
    const expl = getSignalExplain(key);
    if (!expl) return false;
    titleEl.textContent = expl.title;
    whatEl.textContent = expl.what;
    howEl.textContent = expl.how;
    meansEl.textContent = expl.means;
    return true;
  }

  function close(): void {
    openKey = null;
    root.classList.remove('is-drawer-open');
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    root.querySelectorAll('[aria-pressed="true"]').forEach((el) => {
      el.setAttribute('aria-pressed', 'false');
    });
  }

  function open(key: string): void {
    if (!fill(key)) return;
    if (openKey === key) {
      close();
      return;
    }
    openKey = key;
    root.classList.add('is-drawer-open');
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    root.querySelectorAll('[data-explain]').forEach((el) => {
      const pressed = el.getAttribute('data-explain') === key;
      el.setAttribute('aria-pressed', pressed ? 'true' : 'false');
    });
    // Keep the plate on-screen when the instrument is tall (TRACE log scrolls inside).
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    drawer.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  closeBtn.addEventListener('click', () => close());

  drawer.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && openKey) close();
  });

  return { open, close };
}
