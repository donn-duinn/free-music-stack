# 🎸 Free Music Stack

**The tools big tech charges rent for — given to grassroots music and local artists. Free. Open. Local-first. No cut.**

Built by a self-taught Melbourne musician, using AI, to prove one thing: **AI isn't coming for artists — here it's here to _pay_ them.** Big tech points AI at artists to extract from them. This points AI at big tech to give it back.

Every tool below is a single self-contained HTML file. Edit one `CONFIG` block, drop it on any free host (Cloudflare Pages, GitHub Pages, Netlify), done. No accounts, no monthly fee, no data harvesting, no middleman cut.

## The tools
| Folder | What it does | Replaces |
|---|---|---|
| [`venue-site/`](venue-site/) | One-page music-venue site: gig nights + drinks & food menus + **local art wall** (patrons buy the art off the walls, direct to the artist) | Squarespace/Wix ($30+/mo), Etsy (art cut) |
| [`tickets/`](tickets/) | Event/ticket page — buy goes **direct to the venue/artist's Stripe**. Booking fee: **$0.00** | Ticketek/Ticketmaster (~30% fees) |
| [`artist-merch/`](artist-merch/) | Artist merch page — QR it on the merch table, every "Buy" goes **straight to the artist** | Bandcamp/Shopify (cut + fees) |
| [`artist-hub/`](artist-hub/) | Artist's home base: music, tip jar, merch, mailing list, gigs — own your fans, keep 100% | Linktree / Spotify-for-Artists / Patreon / Meta |
| [`whats-on/`](whats-on/) | Free listing of Melbourne open mics & local gigs — filterable, no paywall; venues get free promo, artists find rooms | paywalled gig guides / ad-choked listings |
| [`loyalty/`](loyalty/) | Digital loyalty card on the customer's own phone, **zero data collected** — the "Pub Plus" for independents | Square/Toast (% + monthly) |

Flagship, live: **openmic** — free open-mic sign-up — https://openmic.techduinn.dpdns.org


## AI onboarding (`scripts/venue-gen`)
Describe a venue in plain English → get a fully-configured, deploy-ready site in ~30 seconds,
using a free local LLM gateway. Onboard a hundred venues in an afternoon.
```bash
scripts/venue-gen "The Retreat Hotel, Brunswick — rock pub, open mic Weds 8pm, craft beer + parmas, @retreat"
```
*This is the proof: AI here to build free infrastructure that pays artists — not replace them.*

## Deploy any tool in 60 seconds
```bash
# 1. edit the CONFIG block at the top of the tool's index.html (name, colours, menus, prices…)
# 2. deploy free on Cloudflare Pages:
npx wrangler pages deploy venue-site
# …or drag the folder onto Netlify, or push to GitHub Pages. It's just HTML.
```

## Why
Read [`docs/MISSION.md`](docs/MISSION.md) and [`docs/the-stack.md`](docs/the-stack.md). Short version:
big tech *must* extract rent to exist. This runs on free tiers and open source, so it doesn't. Every venue
and artist that adopts it is money and data that stops flowing to a platform and stays with the people who
make the culture.

## Roadmap
Direct music sales / tip jar (vs Spotify) · artist-owned mailing list (vs Meta) · free patronage (vs Patreon)
· ticketing backend with QR + door-scanner (Cloudflare Workers + D1) · the what's-on newsletter.
See [`docs/the-stack.md`](docs/the-stack.md).

## Contribute / use it
Take it. Fork it. Run it in your town. Improve it and send it back. That's the whole point — it's yours now.

## License
[MIT](LICENSE) — free forever, for anyone, no strings.

---
*Made in Preston, Melbourne. AI here to pay artists, not replace them.* 🤝
