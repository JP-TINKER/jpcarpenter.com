---
title: "Tellina"
summary: "A silent Linux post-download guard for ~/Downloads: scan in RAM when possible, release clean files, quarantine the rest."
finding: "Clean downloads stay quiet; malware and disguised launchers get blocked without a settings screen. ClamAV plus a few hard rules, not theater."
stamp: "Build"
state: verified
date: 2026-08-01
order: 20
tags: ["linux", "security", "clamav"]
---

Tellina watches `~/Downloads` on a normal Linux desktop. When a download finishes, it
checks the file before you would usually open it. Clean files show up like nothing
happened. Bad ones get quarantined and you get a popup. If nothing is wrong, you see
nothing: one line in a log.

Small files can stage in a short-lived RAM hold, scan with ClamAV, and only land back on
disk if they come back clean. It also catches a few cases signature scan alone misses:
disguised executables wearing document names, and `.desktop` launchers with an `Exec=`
line. Limits are written down in the threat model: it is not real-time EDR, and it does
not invent zero-day detection.

Code and docs: [github.com/JP-TINKER/tellina](https://github.com/JP-TINKER/tellina)
(v0.2.0). Install is one script; uninstall is another. This page is a personal build note,
not a claim that Tellina replaces a SOC stack.
