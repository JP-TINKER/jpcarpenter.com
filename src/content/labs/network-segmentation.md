---
title: "Network Segmentation Lab: VLANs and Router-on-a-Stick"
summary: "Building a small LAN from scratch, then segmenting it into VLANs and proving inter-VLAN routing with TTL analysis, not just a successful ping."
finding: "A successful ping proves reachability, not segmentation. The decremented TTL is what actually confirmed traffic was crossing the router between VLANs instead of staying flat."
stamp: "Evidence attached"
state: verified
discipline: networking
date: 2026-08-01
order: 20
tags: ["networking", "vlan", "packet-tracer"]
---

Two linked labs in Cisco Packet Tracer: build a flat LAN, then cut it into VLANs and prove,
not just configure, that traffic is actually being routed where it should.

## Lab 1: small business LAN

A router (ISR4321), a switch (2960-24TT), and three workstations, all on `192.168.1.0/24`.
Nothing complicated, except that Cisco routers ship administratively down: the gateway
interface didn't come up until I ran `no shutdown` on it. Ping tests from Workstation1 to a
peer workstation and to the router gateway both came back clean, 4/4 with no loss.

<figure>
  <img src="/labs/network-topology-complete.png" alt="Completed Packet Tracer topology: router, switch, and three workstations, all links green" />
  <figcaption>Lab 1: completed topology, all links up.</figcaption>
</figure>

## Lab 2: VLAN segmentation, router-on-a-stick

Built on top of Lab 1: split the same physical switch into VLAN 10 (Data) and VLAN 20
(Voice), each on its own subnet, with the uplink to the router configured as a trunk carrying
both VLANs' tagged traffic.

<figure>
  <img src="/labs/network-vlan-config.png" alt="Switch CLI creating VLAN 10 (Data) and VLAN 20 (Voice) and assigning ports" />
  <figcaption>Switch config: VLAN creation and naming.</figcaption>
</figure>

Because there's no Layer 3 switch in this topology, inter-VLAN routing needs a
router-on-a-stick: two subinterfaces on the same physical router port, one per VLAN, each
running 802.1Q encapsulation and holding that VLAN's default gateway address.

<figure>
  <img src="/labs/network-router-subinterfaces.png" alt="Router CLI configuring dot1Q subinterfaces for VLAN 10 and VLAN 20, each with its own gateway address" />
  <figcaption>Router config: 802.1Q subinterfaces (router-on-a-stick).</figcaption>
</figure>

## Proving it with TTL, not just "it pinged"

A successful ping tells you traffic arrived. It doesn't tell you *how*: same-VLAN traffic can
switch directly at Layer 2 and still look like a working ping. The tell is the TTL:

- Workstation1 → Workstation2 (same VLAN, 10): reply TTL 128, switched, never reached the
  router
- Workstation1 → Workstation3 (different VLAN, 20, across the trunk): reply TTL 127. The
  router decremented TTL by exactly one hop, confirming the packet was actually routed, not
  switched

<figure>
  <img src="/labs/network-vlan-ping-proof.png" alt="Ping output from Workstation1 showing TTL 128 for same-VLAN and TTL 127 for cross-VLAN replies" />
  <figcaption>Ping output: TTL 128 (same VLAN) vs. TTL 127 (routed across VLANs).</figcaption>
</figure>

That one-point TTL drop is the actual proof that the VLANs are isolated at Layer 2 and depend
on the router to talk to each other: not just two configs that happen to ping.

## What this doesn't claim

This is a simulated lab in Packet Tracer, not a production network: no QoS, no spanning-tree
edge cases, no real voice traffic on VLAN 20 (it's a label, not a live phone). The point was
the segmentation and routing mechanics, which transfer directly to reading a real
switch/router config.

## Why it's here

Segmentation is a control, not just a networking exercise: it's the same "put things in the
right zone and prove the boundary holds" logic behind IoT VLANs, guest Wi-Fi isolation, and
cardholder-data-environment scoping. Building it by hand, then verifying it with TTL instead
of trusting the config, is the habit that matters more than the specific commands.
