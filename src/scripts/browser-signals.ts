/** Shared browser-signal helpers — used by EXPOSURE GAUGE and FINGERPRINT TRACE so both
 *  instruments read the same underlying values instead of two slightly different copies.
 *  Everything here is a pure read of properties the browser already exposes on page load;
 *  nothing here makes a network call or writes anything.
 */

export interface Signal {
  label: string;
  present: boolean;
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
};

/** The 8-point "how much does this combination broadcast" check used by EXPOSURE GAUGE. */
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
  ];

  const dnt =
    nav.doNotTrack === '1' || (window as unknown as { doNotTrack?: string }).doNotTrack === '1';
  const gpc = !!nav.globalPrivacyControl;
  let privacyCredits = 0;
  if (dnt) privacyCredits += 1;
  if (gpc) privacyCredits += 1;

  return { signals, privacyCredits };
}

/** Raw (not boolean) values of the same basic signals, concatenated for use as part of a
 *  composite fingerprint hash — FINGERPRINT TRACE folds this in alongside canvas/WebGL/audio. */
export function getRawSignalString(): string {
  const nav = navigator as ExtendedNavigator;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const languages = nav.languages && nav.languages.length > 0 ? nav.languages.join(',') : nav.language;

  return [
    navigator.userAgent,
    tz,
    languages,
    `${screen.width}x${screen.height}x${screen.colorDepth}`,
    String(nav.hardwareConcurrency ?? ''),
    String(nav.deviceMemory ?? ''),
  ].join('|');
}
