# 🎟️ Ticketing backend — fee-free, self-hosted

Signed single-use tickets + a door scanner, on Cloudflare Workers + D1. Free tier runs it.
Booking fee: **$0**. Money goes to the venue/artist's **own Stripe** — this only issues + checks tickets.

## Deploy (5 commands)
```bash
npm i -g wrangler && wrangler login
wrangler d1 create freemusic-tickets          # paste the database_id into wrangler.toml
wrangler d1 execute freemusic-tickets --file=schema.sql --remote
wrangler secret put ADMIN_KEY                 # for issuing tickets / the Stripe webhook
wrangler secret put DOOR_KEY                  # the PIN staff use at the door
wrangler deploy
```

## Use
- **Issue a ticket** (or point a Stripe `checkout.session.completed` webhook here):
  ```bash
  curl -X POST https://YOURWORKER.workers.dev/issue \
    -H "x-admin-key: $ADMIN_KEY" -H "content-type: application/json" \
    -d '{"event":"Friday Night Sessions","buyer":"sam@x.com"}'
  # → {"code":"...","url":".../t/..."}  — email that url to the buyer
  ```
- **Buyer** opens the ticket URL → sees the QR (ADMIT ONE).
- **Door:** staff open `/scan`, enter the door PIN, point the camera at the QR → ✅ ADMIT / ⛔ ALREADY USED / ❌ INVALID.
  (Uses the browser's native BarcodeDetector — no app, no library. Manual code entry as fallback.)

## Why it's safe
Codes are random UUIDs (unguessable). First scan flips the ticket to `used`; any copy/screenshot scanned
after that is rejected. No central ticketing monopoly, no fees, venue owns the data.

## Wire it to the front
The `tickets/` event page's buy button points at the venue's Stripe Payment Link. On payment, the Stripe
webhook calls `/issue`, and the buyer gets their ticket URL. Front + back = a complete fee-free ticketing system.
