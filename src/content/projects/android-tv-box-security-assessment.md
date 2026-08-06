---
title: "Android TV Box Security Assessment"
summary: "An isolated lab built to test one hedged claim from brand-new research: that cheap Android TV boxes run as residential proxies while a display is attached, and switch to ad fraud when it isn't."
finding: "Designed, not yet run. The published claim it tests is four days old and explicitly hedged, so the useful contribution is an instrumented hardware test rather than another traffic capture. Listed before results exist so the record matches reality."
stamp: "Not yet run"
state: open
date: 2026-08-03
order: 10
tags: ["iot", "network-forensics", "in-progress"]
---

On July 30, 2026, Bitsight TRACE published research on Fuyao, an ad-fraud operation running on
unofficial Android TV boxes. One detail stood out. The researchers concluded that infected boxes
run as residential proxies when an HDMI display is attached, and switch to automated ad-fraud
browsing when it isn't.

Their wording is careful, and worth quoting exactly: `CheckSelf()` "mostly translates to run proxy
when the HDMI cable is on, run ad-fraud when the HDMI cable is off." Krebs on Security restated it
as "usually." That conclusion came from reading decompiled code and correlating it with
proxy-network data, not from testing hardware. Bitsight had telemetry from roughly 38,000 devices
and no way to unplug a single one of them.

I have one box and a cable. That's the whole reason this lab is worth running.

## Status: designed, not yet run

The protocol is written and the isolation network is planned. No capture has happened yet, so
there are no results to report, and I'm not going to publish results that don't exist. This entry
gets updated when there's a completed run, including if the answer is that the device came back
clean.

## What it tests

The experiment manipulates one variable, display state, and measures what the box does. The part
that takes the work is proving the control actually worked.

1. **Four arms, not two.** Display attached and powered on; attached with the display off; cable
   unplugged; and cable connected to an EDID emulator, which tells the box a display is present
   when nobody is watching. That last arm is the one that separates "the box detects a display"
   from "someone is actually using it."
2. **Verify the control.** Read the HDMI hotplug state and the wake state off the device itself,
   on a timeline that lines up with the packet capture. If the box simply went to sleep when the
   cable came out, the traffic drop means nothing, and without this check there's no way to tell
   the difference.
3. **Run it long enough to mean something.** Bitsight observed proxy activity on one in six boxes
   in a 24-hour window. A 90-minute capture would return nothing on a fully infected device, so
   the run is seven days with a rotating schedule, and the minimum observation time is fixed in
   advance rather than decided once the numbers are in.
4. **Include a control device.** A certified streaming device on the same segment, same tooling,
   same duration. Without it, no measurement from the suspect box has anything to be compared to.
5. **Publish the artifacts, not just the story.** The most reusable signal here needs no
   indicator list at all: an outbound connection to a literal IP address with no DNS lookup
   preceding it. Consumer devices almost never do that, and it survives infrastructure changes
   that break every published domain and hash.

## Why it's here before it's finished

Showing the scoping and the hypothesis before knowing the answer is most of what doing this
honestly looks like. The prediction is on the record and dated, which means it can be wrong in
public.

Three outcomes are all worth publishing. The behavior tracks display state, which is independent
hardware support for a code-derived inference. It doesn't, which puts a bound on a claim already
circulating as settled fact. Or the box is quiet, which is a characterized negative and a method
other people can run against their own hardware.

The last one is the least exciting and the most likely, and it still counts.
