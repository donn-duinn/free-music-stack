# Petition backend — self-hosted signatures

Your petition, your data. No change.org. Runs free on Cloudflare Workers + D1.

## Deploy (once, ~3 minutes)
```bash
cd petition-backend
npm i -g wrangler          # if you don't have it
wrangler login
wrangler d1 create petition           # copy the database_id it prints
# paste that id into wrangler.toml -> database_id
wrangler d1 execute petition --file=schema.sql
wrangler deploy                        # prints your worker URL
```

## Turn it on
Put the worker URL into `petition/index.html`:
```js
const BACKEND = "https://petition.<your-subdomain>.workers.dev";
```
Redeploy the site. The live counter and "Sign" button now write to your D1.

## Before it's deployed
The page already works with **no backend** — signing opens a pre-filled email to
`donn-duinn@agentmail.to` so names still reach you. Deploy the worker only when you
want a live public counter.

## Endpoints
- `POST /sign` `{name, place?, msg?}` -> `{ok, count}`
- `GET /count` -> `{count}`
- `GET /recent` -> `{signatures:[{name,place,msg}]}` (last 50)

## Notes
- Inputs are length-capped (name/place 80, msg 280) and control-chars stripped.
- Values are stored raw; **HTML-escape them** if you ever render `/recent` into a page.
- Add a Cloudflare rate-limit rule on `/sign` before you promote it widely (stops spam floods).
