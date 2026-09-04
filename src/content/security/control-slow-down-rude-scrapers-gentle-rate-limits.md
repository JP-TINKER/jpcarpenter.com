---
kind: control
title: "Slow down rude scrapers (gentle rate limits)"
summary: "Slow down rude scrapers (gentle rate limits)"
date: 2026-09-04
order: 140
state: verified
---

**In plain terms:** `robots.txt` is a polite sign on the
              door. Some crawlers ignore signs. Soft rate and connection limits on the web server
              slow machines that hammer the site, without putting a puzzle in front of every
              human visitor.
            

**Why it matters here:** a static portfolio does not need a bot wall.
              It does need a ceiling so one IP cannot soak the origin with thousands of requests
              per second. Limits are set high enough that a normal page load (HTML + many assets)
              never notices.
            

**How:** nginx `limit_req` at `20r/s` per IP with
              `burst=80 nodelay`, plus `limit_conn` at 40 concurrent
              connections per IP. Over-limit responses are `429`. Verified: ordinary
              browsing and a 30-request burst return normally.
            

**Sources**

- [nginx limit_req module](https://nginx.org/en/docs/http/ngx_http_limit_req_module.html)
              
- [nginx limit_conn module](https://nginx.org/en/docs/http/ngx_http_limit_conn_module.html)

