---
kind: control
title: "Opt out of AI training, stay findable in AI search"
summary: "Opt out of AI training, stay findable in AI search"
date: 2026-09-04
order: 60
state: verified
---

**In plain terms:** many AI companies now use *different* robots
              for "copy this into the training pile" versus "index this so people can find it in
              AI search." This site says no to the training robots and yes to ordinary search and
              AI search/citation robots.
            

**Why it matters here:** blocking everything hides the work from people
              who search. Allowing everything feeds training without a separate decision. The
              split is the thoughtful middle: stay discoverable, decline silent harvest.
            

**How:** rules live in [/robots.txt](/robots.txt). That file
              is a request polite operators honor, not a hard lock against rude scrapers (rate
              limits on the origin handle the rest). Training bots such as `GPTBot` and
              `ClaudeBot` are Disallow. Live citation / user-fetch tokens such as
              `OAI-SearchBot`, `ChatGPT-User`, `Claude-SearchBot`,
              and `Claude-User` are Allow so a recruiter asking an assistant about this
              site can still get a live fetch.
            

**Sources**

- [OpenAI: Overview of crawlers](https://developers.openai.com/api/docs/bots)
                (GPTBot vs OAI-SearchBot vs ChatGPT-User)
              
- [Anthropic: Claude crawlers and robots.txt](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
              
- Google's `Google-Extended` control, training/Gemini opt-out without
                turning off normal Google Search (documented in Google's AI / robots guidance)

