# 🎟️ openmic TICKETING — kill the Ticketek tax

**Ticketek/Ticketmaster take 20–30%+ in "booking fees" off tickets to shows they had nothing to do with.**
This is the most extractive middleman in live music. We route ticket money **direct to the venue/artist** —
they pay only the ~1.7% + 30c that the payment processor charges, nothing to us. No booking fee. Open source.

## THE FLOW
1. **Event page** (per gig) — artist(s), venue, date, price, "Get ticket." [FRONT BUILT]
2. **Buy direct** — payment goes to the **venue/artist's own Stripe** account. We touch none of it, take no fee.
3. **Ticket = a QR** — issued to the buyer (email + on-screen), holds a signed unique code.
4. **Door scan** — venue opens a scanner page, scans the QR, it marks the ticket used (can't be reused/copied).
5. **Done.** Artist/venue keeps ~98% instead of ~70%. Fan pays face value, not face-value-plus-30%.

## WHAT'S REAL vs WHAT NEEDS A BACKEND
- **Static (works now):** the event page + a "buy" button that points at the venue's Stripe Payment Link.
  Fan pays direct, gets a Stripe receipt. Good enough for door-list/small gigs today.
- **Backend (v2, on Cloudflare Workers + D1 — his stack):**
  - issue signed QR tickets on purchase (Stripe webhook → Worker → D1 → emailed ticket)
  - a **door-scanner page** (staff scans QR → Worker checks D1 → marks used → green/red)
  - capacity limits, refunds, guest list.
  This is a real but modest build on the free Cloudflare tier — the whole point is it costs ~nothing to run.

## WHY WE WIN vs TICKETEK
- They *must* charge fees (huge company, shareholders). We run on free tiers + open source → we don't.
- Money + fan data stay with the venue/artist, not a monopoly.
- Fits the suite: openmic books the free open mics; **ticketing handles the paid gigs** — same principle,
  buy direct, no middleman cut. Together they cover a venue's whole live-music calendar for free.

## THE STORY (press + grants love this)
"A self-taught Melbourne musician built a free ticketing system so artists keep the money Ticketek takes."
That's a headline. And it's a genuine grant project (civic tech / arts infrastructure / anti-monopoly).

## ROADMAP
1. Event page + Stripe-direct buy (front built) → usable for small gigs now.
2. Worker + D1 backend: signed QR tickets + door scanner.
3. Capacity, guest list, refunds.
4. Wire into openmic + the venue site (a venue's page lists its ticketed gigs).
