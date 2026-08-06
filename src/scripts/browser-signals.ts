/** Shared browser-signal helpers, used by EXPOSURE GAUGE and FINGERPRINT TRACE so both
 *  instruments read the same underlying values instead of two slightly different copies.
 *  Everything here is a pure read of properties the browser already exposes on page load;
 *  nothing here makes a network call or writes anything.
 */

export interface Signal {
  label: string;
  present: boolean;
}

export interface SignalPart {
  label: string;
  value: string;
}

export function parseUserAgent(ua: string): { browser: string; os: string } {
  let browser = 'an unidentified browser';
  if (/Edg\//.test(ua)) browser = 'Edge';
  else if (/Firefox\//.test(ua)) browser = 'Firefox';
  else if (/Chrome\//.test(ua)) browser = 'Chrome';
  else if (/Safari\//.test(ua)) browser = 'Safari';

  let os = 'an unidentified OS';
  if (/Windows/.test(ua)) os = 'Windows';
  else if (/Mac OS X/.test(ua)) os = 'macOS';
  else if (/Android/.test(ua)) os = 'Android';
  else if (/iPhone|iPad/.test(ua)) os = 'iOS';
  else if (/Linux/.test(ua)) os = 'Linux';

  return { browser, os };
}

type ExtendedNavigator = Navigator & {
  deviceMemory?: number;
  globalPrivacyControl?: boolean;
  connection?: { effectiveType?: string };
  pdfViewerEnabled?: boolean;
  msMaxTouchPoints?: number;
};

function getTouchPoints(nav: ExtendedNavigator): number {
  if (typeof nav.maxTouchPoints === 'number') return nav.maxTouchPoints;
  if (typeof nav.msMaxTouchPoints === 'number') return nav.msMaxTouchPoints;
  return 0;
}

/** CSS media features trackers commonly fold in. Quiet matchMedia reads only. */
export function getMediaFeatures(): SignalPart[] {
  let gamut = 'unknown';
  for (const g of ['rec2020', 'p3', 'srgb'] as const) {
    if (window.matchMedia(`(color-gamut: ${g})`).matches) {
      gamut = g;
      break;
    }
  }

  const hdr = window.matchMedia('(dynamic-range: high)').matches ? 'high' : 'standard';
  let contrast = 'no-preference';
  if (window.matchMedia('(prefers-contrast: more)').matches) contrast = 'more';
  else if (window.matchMedia('(prefers-contrast: less)').matches) contrast = 'less';

  const forced = window.matchMedia('(forced-colors: active)').matches ? 'active' : 'none';
  const inverted = window.matchMedia('(inverted-colors: inverted)').matches ? 'yes' : 'no';
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 'reduce'
    : 'no-preference';
  const transparency = window.matchMedia('(prefers-reduced-transparency: reduce)').matches
    ? 'reduce'
    : 'no-preference';

  return [
    { label: 'media.gamut', value: gamut },
    { label: 'media.hdr', value: hdr },
    { label: 'media.contrast', value: contrast },
    { label: 'media.forced', value: forced },
    { label: 'media.inverted', value: inverted },
    { label: 'media.motion', value: motion },
    { label: 'media.transparency', value: transparency },
  ];
}

/** The "how much does this combination broadcast" check used by EXPOSURE GAUGE. */
export function getBasicSignals(): { signals: Signal[]; privacyCredits: number } {
  const nav = navigator as ExtendedNavigator;

  const signals: Signal[] = [
    { label: 'User-Agent string', present: true },
    { label: 'Timezone', present: true },
    { label: 'Language list', present: (nav.languages?.length ?? 0) > 0 },
    { label: 'Screen geometry', present: true },
    { label: 'CPU core count', present: typeof nav.hardwareConcurrency === 'number' },
    { label: 'Device memory estimate', present: typeof nav.deviceMemory === 'number' },
    { label: 'Cookies enabled', present: nav.cookieEnabled },
    { label: 'Network type hint', present: !!nav.connection?.effectiveType },
    { label: 'Platform string', present: typeof nav.platform === 'string' && nav.platform.length > 0 },
    {
      label: 'Touch support',
      present: typeof nav.maxTouchPoints === 'number' || typeof nav.msMaxTouchPoints === 'number',
    },
    { label: 'PDF viewer flag', present: typeof nav.pdfViewerEnabled === 'boolean' },
    { label: 'Media preference hints', present: true },
  ];

  const dnt =
    nav.doNotTrack === '1' || (window as unknown as { doNotTrack?: string }).doNotTrack === '1';
  const gpc = !!nav.globalPrivacyControl;
  let privacyCredits = 0;
  if (dnt) privacyCredits += 1;
  if (gpc) privacyCredits += 1;

  return { signals, privacyCredits };
}

/** Labeled passive values for TRACE log lines. Media features collapse to one row for
 *  scanability; getRawSignalString still hashes each media field individually. */
export function getPassiveSignalParts(): SignalPart[] {
  const nav = navigator as ExtendedNavigator;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const languages =
    nav.languages && nav.languages.length > 0 ? nav.languages.join(',') : nav.language;
  const touchPoints = getTouchPoints(nav);
  const pdf =
    typeof nav.pdfViewerEnabled === 'boolean' ? String(nav.pdfViewerEnabled) : 'unavailable';

  const media = getMediaFeatures();
  const gamut = media.find((m) => m.label === 'media.gamut')?.value ?? 'unknown';
  const hdr = media.find((m) => m.label === 'media.hdr')?.value ?? 'standard';
  const contrast = media.find((m) => m.label === 'media.contrast')?.value ?? 'no-preference';
  const motion = media.find((m) => m.label === 'media.motion')?.value ?? 'no-preference';

  return [
    { label: 'ua.browser', value: navigator.userAgent.slice(0, 64) + (navigator.userAgent.length > 64 ? '…' : '') },
    { label: 'tz.offset', value: tz },
    { label: 'lang.list', value: languages || 'unavailable' },
    { label: 'screen.geom', value: `${screen.width}x${screen.height}x${screen.colorDepth}` },
    { label: 'cpu.cores', value: String(nav.hardwareConcurrency ?? 'unavailable') },
    { label: 'mem.device', value: String(nav.deviceMemory ?? 'unavailable') },
    { label: 'nav.platform', value: nav.platform || 'unavailable' },
    { label: 'touch.points', value: String(touchPoints) },
    { label: 'pdf.viewer', value: pdf },
    {
      label: 'media.prefs',
      value: `${gamut} · ${hdr} · contrast ${contrast} · motion ${motion}`,
    },
  ];
}

/** Full passive set including each media feature, used only for composite hashing. */
export function getRawSignalString(): string {
  const nav = navigator as ExtendedNavigator;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const languages =
    nav.languages && nav.languages.length > 0 ? nav.languages.join(',') : nav.language;
  const touchPoints = getTouchPoints(nav);
  const pdf =
    typeof nav.pdfViewerEnabled === 'boolean' ? String(nav.pdfViewerEnabled) : 'unavailable';

  const base = [
    `ua.browser=${navigator.userAgent}`,
    `tz.offset=${tz}`,
    `lang.list=${languages || ''}`,
    `screen.geom=${screen.width}x${screen.height}x${screen.colorDepth}`,
    `cpu.cores=${nav.hardwareConcurrency ?? ''}`,
    `mem.device=${nav.deviceMemory ?? ''}`,
    `nav.platform=${nav.platform || ''}`,
    `touch.points=${touchPoints}`,
    `pdf.viewer=${pdf}`,
  ];

  const media = getMediaFeatures().map((p) => `${p.label}=${p.value}`);
  return base.concat(media).join('|');
}
