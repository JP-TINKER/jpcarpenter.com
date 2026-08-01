---
title: "Android TV Box Security Assessment"
summary: "Isolated FOSS lab in progress: testing whether an unofficial Android TV stick behaves like a residential proxy or ad-fraud bot."
date: 2026-08-01
tags: ["iot", "network-forensics", "in-progress"]
---

Public security research (Bitsight TRACE, Krebs on Security, Synthient) has documented a
pattern in cheap unofficial Android TV streaming sticks: some quietly resell home bandwidth
as a residential proxy while the TV is on, then shift to automated ad-fraud browsing while
it's off. This project is my attempt to reproduce that observation myself, using only free and
open-source tools, against a device I own.

## Status: lab designed, not yet run

To be direct about where this stands: the isolation network, tooling list, and phased test
plan are fully designed — an outbound-isolated VLAN/gateway, a `tcpdump` / `tshark` / `nmap`
/ `adb` toolchain, an HDMI-on vs. HDMI-off A/B capture plan, and a 0–5 scoring rubric. What
hasn't happened yet is the actual capture run. I'm not publishing results that don't exist —
this entry gets updated with real findings once there's a completed capture, or it says
plainly that the device came back clean.

## The plan

1. Isolate the stick on its own VLAN/gateway with no route to the trusted LAN.
2. Inventory it — check for an open, unauthenticated ADB port (a real and common finding on
   this class of device), dump installed packages, and look for phone-model identity
   spoofing on TV hardware.
3. Capture idle baseline traffic, then two more captures with the HDMI connection toggled on
   and off.
4. Compare upload/download ratios and TLS SNI diversity across the on/off windows — an
   upload-heavy, long-tunnel pattern during "TV on" plus diverse short-session browsing
   during "TV off" would match the published proxy/ad-fraud pattern.
5. Score the result 0–5 against a fixed rubric, and publish sanitized artifacts (redacted SNI
   lists, port scan results, and screenshots) rather than raw packet captures.

## Why it's here before it's finished

Half of doing security work honestly is showing the scoping and hypothesis before you know
the answer, not just the clean write-up after. If this comes back a boring, well-behaved
device, that's a real (if unexciting) negative result, and it gets published as one.
