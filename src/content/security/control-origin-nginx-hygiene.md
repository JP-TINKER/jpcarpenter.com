---
kind: control
title: "Origin nginx hygiene"
summary: "Origin nginx hygiene"
date: 2026-09-04
order: 130
state: verified
---

**In plain terms:** the public site is static files behind nginx on a
              Njalla VPS. The server should not advertise its exact version, should send one
              consistent security-header set, and should not leave old TLS generations enabled
              "just in case."
            

**Why it matters here:** version banners help scanners triage targets.
              Split header configs create gaps (for example assets without HSTS). Old TLS is free
              attack surface on a site that never needs it.
            

**How:** `server_tokens off` (responses say
              `Server: nginx` without a version). One header snippet covers HTML and
              `/_astro/` assets: 1-year HSTS with `includeSubDomains; preload`,
              `X-Frame-Options: DENY`, and the rest of the posture headers. TLS 1.0 and
              1.1 are disabled in the TLS config. Ghost stays off the public origin.
            

**Sources**

- [nginx server_tokens](https://nginx.org/en/docs/http/ngx_http_core_module.html#server_tokens)
              
- [OWASP HTTP Headers Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html)

