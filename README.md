# 🎸 Free Music Stack

**The tools big tech charges rent for — given to grassroots music and local artists. Free. Open. No cut.**

![License: MIT](https://img.shields.io/badge/License-MIT-7C5CFF.svg) ![PRs welcome](https://img.shields.io/badge/PRs-welcome-3ecf8e.svg) ![Built in](https://img.shields.io/badge/idea%20to%20live-48%20hours-f5b83d.svg) ![Made in](https://img.shields.io/badge/made%20in-Preston%2C%20Melbourne-8b6dff.svg)

> Started as an idea on a Tuesday night. **48 hours later it was live and given away for free.** Built by one self-taught musician, priced out of the live music he loved, using AI to prove one thing: **AI is here to _pay_ artists, not replace them.**

**This can't be done by one — [come build it with us](CONTRIBUTING.md).** 🤝

---

## 👀 See it live

| | |
|---|---|
| ⚓ **[Donn's Quest](https://donn-duinn.github.io/free-music-stack/project/)** — the whole movement, one page | 🧭 **[One-stop shop](https://donn-duinn.github.io/free-music-stack/start/)** — every tool by role |
| ✊ **[Why we built it](https://donn-duinn.github.io/free-music-stack/why/)** — the story, signed | ⚡ **[Gonzo Engineering](https://donn-duinn.github.io/free-music-stack/gonzo/)** — how we work |
| 📜 **[The charter](https://donn-duinn.github.io/free-music-stack/petition/)** — sign it | 📅 **[What's on](https://donn-duinn.github.io/free-music-stack/calendar/)** — the calendar |
| 💚 **[Help & support](https://donn-duinn.github.io/free-music-stack/help/)** — crisis lines baked in | 🤝 **[Join the quest](https://donn-duinn.github.io/free-music-stack/join/)** — find your way in |

Front door: **https://donn-duinn.github.io/free-music-stack/** · Press kit: **[/press](https://donn-duinn.github.io/free-music-stack/press/)**

---

## 🧰 The tools

Every tool is a **single self-contained HTML file**. No build step, no framework, no npm install. Edit the `CONFIG`/`EVENTS` block at the top, drop it on any free host, done.

| Folder | What it does | Replaces |
|---|---|---|
| [`venue-site/`](venue-site/) | Venue site: gigs, drink & food menus, **local art wall** (buy art off the walls, direct to the artist) | Squarespace/Wix ($30+/mo) |
| [`tickets/`](tickets/) | Ticket page, buy goes **direct to the venue's Stripe**. Booking fee: **$0** | Ticketek/Ticketmaster (~15–30%) |
| [`artist-merch/`](artist-merch/) | Merch page, QR it on the table, every buy goes **straight to the artist** | Bandcamp/Shopify (cut + fees) |
| [`artist-hub/`](artist-hub/) | Artist home base: music, tips, merch, mailing list, gigs, own your fans | Linktree / Patreon / Meta |
| [`music-player/`](music-player/) | Stream, then buy/download **direct** — artist keeps 100% | Spotify ($0.003/stream) |
| [`calendar/`](calendar/) | What's-on calendar, tap to save a night to your phone (.ics), add your own | Songkick/Bandsintown |
| [`loyalty/`](loyalty/) | Loyalty card on the customer's phone, **zero data collected** | Square/Toast (% + monthly) |
| [`tickets-backend/`](tickets-backend/) · [`petition-backend/`](petition-backend/) | Cloudflare Workers + D1 backends (single-use tickets, signatures) | — |

Flagship, live: **openmic** — free open-mic sign-up — https://openmic.techduinn.dpdns.org

## 🚀 Run your own copy (any venue can self-host)

- **Easiest:** fork this repo → Settings → Pages → deploy from `master`. Free, done.
- **Or:** download any tool's `index.html`, edit the `CONFIG` at the top, open it anywhere.
- **AI onboarding:** `scripts/venue-gen "The Retreat Hotel, Brunswick — rock pub, open mic Weds 8pm"` → a deploy-ready site in ~30s.

## 🤝 Contribute

You don't need to be an expert. No permission, no degree, no gatekeeping. **Proof over education.**

- 🌱 [Good first issues](https://github.com/donn-duinn/free-music-stack/labels/good%20first%20issue) · 🔧 [Help wanted](https://github.com/donn-duinn/free-music-stack/labels/help%20wanted)
- 📖 [How to contribute](CONTRIBUTING.md) · 💬 [Discussions](https://github.com/donn-duinn/free-music-stack/discussions)

A rough PR that helps beats a perfect one that never gets sent.

## 💜 Our promise

We're trying to make the world a little better, one broken thing at a time. **We will make mistakes — and we own them, out loud, and fix them.** Built by people who care more than they're perfect, and that honesty is the point.

Every dollar goes to artists and venues. It stays free and open (MIT). That never changes.

## License

[MIT](LICENSE) — free forever, for anyone, no strings.

---
*Made in Preston, Melbourne. Trying to make the world a little better. AI here to pay artists, not replace them.* ⚓🎸
