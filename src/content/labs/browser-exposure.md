---
title: "What your browser already told this page"
summary: "Two instruments that run real passive-signal reading and real fingerprinting against the visitor viewing them, and disclose every byte they keep."
finding: "Recognizing a repeat visitor without a cookie takes no server, no network call, and no consent prompt. Both instruments below prove it on you, then show you exactly what they kept and let you delete it."
stamp: "Instrument"
discipline: security
date: 2026-08-01
order: 50
tags: ["privacy", "fingerprinting", "javascript"]
---

Two instruments run against the browser you are reading this in. Neither makes a network call.
Nothing either computes is transmitted. These are static files on an edge host.

Tap any row below when you want more depth. The instruments above do the proof; the expandables
do the teaching.

<div class="expand-stack">

<details class="expand-item">
<summary class="expand-term">What the gauge is reading</summary>
<div class="expand-body">
<p>Any site gets these on arrival: user-agent, timezone, language, screen geometry, CPU cores, cookie state, platform, touch support, PDF-viewer flag, CSS media preferences, and your Do Not Track / Global Privacy Control preference. No clicks. No permission prompt.</p>
<p>Privacy tooling is credited, not defeated. A browser that withholds signals scores lower, and the reading says so.</p>
</div>
</details>

<details class="expand-item">
<summary class="expand-term">What the trace is measuring</summary>
<div class="expand-body">
<p>Active probes: canvas pixel readback, WebGL GPU strings, OfflineAudioContext waveform sum, installed-font enumeration, and JS-engine math quirks. Passive rows (timezone, screen, media features, and the rest) are shown in the log and folded into the same composite hash.</p>
<p>That hash is stored under <code>bench-fingerprint-demo</code> in this browser only. On a second visit the page recognizes you with no cookie. <strong>Forget me</strong> deletes that one value for real.</p>
<p>If your browser blocks canvas or WebGL readback (Firefox with <code>resistFingerprinting</code>, Brave, Tor Browser), the instrument reports that as a good outcome instead of working around it.</p>
</div>
</details>

<details class="expand-item">
<summary class="expand-term">How identifying is this?</summary>
<div class="expand-body">
<p>Approximate entropy from published research (EFF Panopticlick / Cover Your Tracks, plus the 2026 state-of-the-art survey). Not measured here.</p>
<table>
<thead>
<tr><th>Signal</th><th>Entropy (approx.)</th><th>Notes</th></tr>
</thead>
<tbody>
<tr><td>Canvas (desktop Chrome)</td><td>~16 bits</td><td>Among the highest-entropy vectors</td></tr>
<tr><td>WebGL renderer + shader</td><td>~14 bits</td><td>GPU vendor/model</td></tr>
<tr><td>Audio (OfflineAudioContext)</td><td>~10 bits</td><td>Stable across versions</td></tr>
<tr><td>Font enumeration (CSS)</td><td>~10 bits</td><td>Indirect detection</td></tr>
<tr><td>Hardware concurrency + memory</td><td>~5 bits</td><td>Coarse but additive</td></tr>
</tbody>
</table>
<p>Add up the top vectors and a desktop browser passes the ~33 bits needed to be unique across the global internet. That is the scale of what the instruments are reading off your device.</p>
</div>
</details>

<details class="expand-item">
<summary class="expand-term">Two defense strategies</summary>
<div class="expand-body">
<p>A Brave user and a Tor user will see different readings on purpose.</p>
<ul>
<li><strong>Randomization</strong> (Brave, LibreWolf): per-site noise on canvas, WebGL, and audio. The hash changes between sites but stays consistent within one. A tracker can spot the defense by noticing the inconsistency.</li>
<li><strong>Static cover</strong> (Tor Browser, Mullvad Browser): every user shows the same fingerprint. The canvas hash is empty or uniform. Within that population, single browsers cannot be told apart.</li>
</ul>
<p>Neither is simply "better." Randomization is easier to use. Static cover is stronger for anonymity, but needs fixed window sizes and disabled JIT.</p>
</div>
</details>

<details class="expand-item">
<summary class="expand-term">Why this is in Labs</summary>
<div class="expand-body">
<p>This used to be the front door. It moved here because a demonstration is evidence of craft, not a professional headline.</p>
<p>The mechanism is exactly how cross-site tracking works, minus the cross-site part, which I neither can nor should build. Disclosing a technique to a consenting reader who can see the whole thing is not the same as practicing it on someone who cannot.</p>
</div>
</details>

<details class="expand-item">
<summary class="expand-term">Beyond recognition</summary>
<div class="expand-body">
<p>Fingerprint signals don't just reidentify you. Published research shows they can be used to <a href="https://arxiv.org/html/2410.06954v3">infer demographics</a> like age and income, putting some groups at higher risk than others.</p>
<p>Storage APIs can become tracking surfaces too. A <a href="https://www.privacyguides.org/news/2026/04/24/fingerprint-com-discovers-vulnerability-that-can-link-your-tor-browsing-together/">2026 IndexedDB ordering flaw</a> linked Tor Browser sessions across sites with no cookie at all, until patched in Firefox 150. The surface keeps moving. This page is a snapshot of where it stood in 2026.</p>
</div>
</details>

<details class="expand-item">
<summary class="expand-term">Test your own browser</summary>
<div class="expand-body">
<p>The EFF's <a href="https://coveryourtracks.eff.org/">Cover Your Tracks</a> tool runs the real measurement against your browser in about thirty seconds and tells you how unique you are. Run it after this page if the demo made the point concrete.</p>
</div>
</details>

<details class="expand-item">
<summary class="expand-term">Sources</summary>
<div class="expand-body">
<ul>
<li>Peter Eckersley, <a href="https://www.freehaven.net/anonbib/papers/pets2010/p1-eckersley.pdf"><em>How Unique Is Your Web Browser?</em></a> (EFF / PETS 2010).</li>
<li>EFF, <a href="https://coveryourtracks.eff.org/">Cover Your Tracks</a>.</li>
<li>Steven Englehardt &amp; Arvind Narayanan, <a href="https://www.cs.princeton.edu/~arvindn/publications/OpenWPM_1_million_site_tracking_measurement.pdf"><em>Online Tracking: A 1-Million-Site Measurement and Analysis</em></a> (CCS 2016).</li>
<li>alexi.sh, <a href="https://alexi.sh/posts/browser-fingerprinting-state-art-2026"><em>Browser Fingerprinting State of the Art 2026</em></a>.</li>
<li>Gómez-Boix et al., <a href="https://arxiv.org/html/2410.06954v3"><em>How Unique is Whose Web Browser?</em></a> (arXiv 2024).</li>
<li>Privacy Guides, <a href="https://www.privacyguides.org/news/2026/04/24/fingerprint-com-discovers-vulnerability-that-can-link-your-tor-browsing-together/">IndexedDB Tor linkability</a> (2026).</li>
</ul>
<p><em>Last reviewed: August 2026.</em></p>
</div>
</details>

</div>
