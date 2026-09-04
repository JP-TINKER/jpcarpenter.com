---
kind: refuse
title: "Check it yourself"
summary: "Check it yourself"
date: 2026-09-04
order: 170
state: verified
---

You do not have to take this page's word for it. From a terminal, or using your
              browser's developer tools on any page, look for the security headers on the
              response:
            

`curl -sI https://jpcarpenter.com | grep -Ei 'strict-transport|content-security|x-frame|permissions'`
            
Also open [/robots.txt](/robots.txt) and
              [/.well-known/security.txt](/.well-known/security.txt).
            

For how I demonstrate verification craft (not just configuration claims), see
              [Labs](/labs).
            


