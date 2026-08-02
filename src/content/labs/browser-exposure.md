---
title: "What Your Browser Already Told This Page"
summary: "Two instruments that run real passive-signal reading and real canvas/WebGL/audio fingerprinting against the visitor viewing them — and disclose every byte they keep."
finding: "Recognizing a repeat visitor without a cookie takes no server, no network call, and no consent prompt. Both instruments below prove it on you, then show you exactly what they kept and let you delete it."
stamp: "Instrument"
discipline: security
date: 2026-08-01
order: 50
tags: ["privacy", "fingerprinting", "javascript"]
---

Two working instruments, both running against the browser you are reading this in. Neither one
makes a network call. Nothing either of them computes is transmitted anywhere, because there is
no server behind this site to transmit it to — it is static files on an edge host.

This page used to be the front door of the site. It was moved here because a demonstration is
evidence of craft, not a professional headline.

## Instrument 1 — passive signals

The gauge reads what any site receives automatically the moment you arrive: user-agent, timezone,
language, screen geometry, CPU cores, cookie state, and your Do Not Track / Global Privacy Control
preference. No clicks, no permission prompt, no interaction. That is the point — this is the
baseline every page already gets for free.

Privacy tooling is credited, not defeated. A browser that withholds these signals scores lower,
and the reading says so.

## Instrument 2 — active fingerprinting

The trace runs the real techniques: rendering to a `<canvas>` and reading the pixels back,
querying WebGL for the GPU and driver strings, and generating an inaudible audio buffer to
measure the waveform your hardware produces. Those outputs vary subtly by GPU, font stack, and
operating system, which is what makes the combination identifying.

The composite hash is written to this browser's `localStorage` under `bench-fingerprint-demo`,
scoped to this origin. On a second visit the page recognizes you with no cookie involved. The
**Forget me** button deletes that one stored value, and it genuinely deletes it.

If your browser blocks canvas or WebGL readback — Firefox with `resistFingerprinting`, Brave,
Tor Browser — the instrument reports that plainly as a good outcome rather than working around
it. Defeating a visitor's privacy tooling would be the opposite of the point.

## Why this is in Labs and not on the homepage

The mechanism above is exactly how cross-site tracking works, minus the cross-site part, which I
neither can nor should build. Disclosing a technique against a consenting reader who can see the
whole thing is not the same activity as practicing it on one who cannot.

The glossary below the instruments names the real-world tracker types this demo is an honest
stand-in for. None of them run here.
