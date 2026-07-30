// ═══════════════════════════════════════════════════════════════════════════
// Free Music Stack — Petition backend (Cloudflare Worker + D1)
// Self-hosted signature collection. Your petition, your data. No change.org.
//   POST /sign  {name, place?, msg?}  -> {ok, count}
//   GET  /count                       -> {count}
//   GET  /recent                      -> {signatures:[{name,place,msg}]}  (last 50, newest first)
// Bind D1 as DB. Set the deployed URL as BACKEND in petition/index.html.
// ═══════════════════════════════════════════════════════════════════════════

const cors = { "access-control-allow-origin": "*", "access-control-allow-headers": "*", "access-control-allow-methods": "*" };
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "content-type": "application/json", ...cors } });
const clean = (s, n) => String(s || "").replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, n);

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const p = url.pathname;
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });

    if (p === "/count") {
      const r = await env.DB.prepare("SELECT COUNT(*) AS n FROM signatures").first();
      return json({ count: r?.n || 0 });
    }

    if (p === "/recent") {
      const { results } = await env.DB.prepare(
        "SELECT name, place, msg FROM signatures ORDER BY id DESC LIMIT 50").all();
      return json({ signatures: results || [] });
    }

    if (p === "/sign" && req.method === "POST") {
      const b = await req.json().catch(() => ({}));
      const name = clean(b.name, 80);
      if (!name) return json({ ok: false, error: "name required" }, 400);
      const place = clean(b.place, 80);
      const msg = clean(b.msg, 280);
      await env.DB.prepare("INSERT INTO signatures (name, place, msg, created_at) VALUES (?,?,?,?)")
        .bind(name, place, msg, new Date().toISOString()).run();
      const r = await env.DB.prepare("SELECT COUNT(*) AS n FROM signatures").first();
      return json({ ok: true, count: r?.n || 0 });
    }

    return json({ ok: true, service: "petition", endpoints: ["/sign", "/count", "/recent"] });
  },
};
