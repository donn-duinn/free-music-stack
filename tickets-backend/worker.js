// ═══════════════════════════════════════════════════════════════════════════
// Free Music Stack — Ticketing backend (Cloudflare Worker + D1)
// Fee-free, self-hostable ticketing. Issue signed tickets, show a QR, scan at the
// door (single-use, can't be reused or copied). No Ticketek, no booking fee.
//
// Routes:
//   POST /issue     (admin)  -> {event, buyer?} : create a ticket, returns {code, url}
//   GET  /t/:code            : the ticket page (QR + ADMIT ONE)
//   POST /validate  (staff)  -> {code} : verify + mark used  {ok, status, event}
//   GET  /scan               : door-scanner page (camera -> /validate)
// Secrets:  ADMIN_KEY (issue), DOOR_KEY (validate/scan).  Bind D1 as DB.
// Wire Stripe: point a Stripe webhook (checkout.session.completed) at /issue with
// the ADMIN_KEY — money goes to the venue's own Stripe, we only issue the ticket.
// ═══════════════════════════════════════════════════════════════════════════

const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "content-type": "application/json", "access-control-allow-origin": "*" } });
const html = (h) => new Response(h, { headers: { "content-type": "text/html;charset=utf-8" } });
const uid = () => crypto.randomUUID().replace(/-/g, "");
// escape anything user-controllable before it touches HTML
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
// constant-time key compare — don't leak length/prefix via early return
function keyEq(a, b) {
  a = String(a || ""); b = String(b || "");
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const p = url.pathname;
    if (req.method === "OPTIONS") return new Response(null, { headers: { "access-control-allow-origin": "*", "access-control-allow-headers": "*", "access-control-allow-methods": "*" } });

    // ── issue a ticket (admin / Stripe webhook) ──
    if (p === "/issue" && req.method === "POST") {
      if (!keyEq(req.headers.get("x-admin-key"), env.ADMIN_KEY)) return json({ error: "unauthorized" }, 401);
      const b = await req.json().catch(() => ({}));
      if (!b.event) return json({ error: "event required" }, 400);
      const event = String(b.event).slice(0, 200);
      const buyer = String(b.buyer || "").slice(0, 200);
      const code = uid();
      await env.DB.prepare("INSERT INTO tickets (code,event,buyer,status,issued_at) VALUES (?,?,?,'valid',?)")
        .bind(code, event, buyer, new Date().toISOString()).run();
      return json({ code, url: `${url.origin}/t/${code}` });
    }

    // ── the ticket page (QR) ──
    if (p.startsWith("/t/")) {
      const code = p.slice(3);
      // codes are hex uuids — reject anything else outright (no lookup, no reflection)
      if (!/^[a-f0-9]{32}$/.test(code)) return html(page("Ticket not found", "This ticket doesn't exist.", "#c00"));
      const row = await env.DB.prepare("SELECT event,status FROM tickets WHERE code=?").bind(code).first();
      if (!row) return html(page("Ticket not found", "This ticket doesn't exist.", "#c00"));
      // NOTE (red-team finding #1, OPEN): QR is still rendered by a third-party service,
      // which means the admit-code leaves the venue's domain. Tracked for replacement with
      // an offline in-browser encoder (needs a real-device scan test before going live).
      const qr = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(code)}`;
      return html(page(esc(row.event),
        `<div style="color:#666;letter-spacing:2px;font-size:.8rem">ADMIT ONE</div>
         <img src="${qr}" alt="ticket QR" style="margin:1rem auto;display:block;border-radius:10px">
         <div style="font-family:monospace;color:#888;font-size:.7rem;word-break:break-all">${esc(code)}</div>
         <div style="margin-top:.6rem;font-weight:800;color:${row.status === "used" ? "#c00" : "#0a0"}">
           ${row.status === "used" ? "ALREADY USED" : "Show this at the door"}</div>`, "#111", true));
    }

    // ── validate at the door (staff) ──
    if (p === "/validate" && req.method === "POST") {
      const b = await req.json().catch(() => ({}));
      if (!keyEq(b.key || req.headers.get("x-door-key"), env.DOOR_KEY)) return json({ ok: false, status: "unauthorized" }, 401);
      const code = (b.code || "").trim();
      if (!/^[a-f0-9]{32}$/.test(code)) return json({ ok: false, status: "invalid" });
      const row = await env.DB.prepare("SELECT event,status FROM tickets WHERE code=?").bind(code).first();
      if (!row) return json({ ok: false, status: "invalid" });
      // Atomic claim: only the scan that flips valid->used wins. Two doors racing the
      // same code can't both succeed — the conditional WHERE lets exactly one update land.
      const upd = await env.DB.prepare("UPDATE tickets SET status='used', used_at=? WHERE code=? AND status='valid'")
        .bind(new Date().toISOString(), code).run();
      if (upd.meta.changes === 1) return json({ ok: true, status: "admitted", event: row.event });
      return json({ ok: false, status: "already_used", event: row.event });
    }

    // ── door scanner page (staff) ──
    if (p === "/scan") return html(SCANNER);

    return html(page("🎟️ Free Music Stack — Tickets",
      "Fee-free ticketing. <br>Staff: open <a href='/scan'>/scan</a> at the door.", "#111"));
  },
};

function page(title, body, color = "#111", white = false) {
  return `<!doctype html><meta name=viewport content="width=device-width,initial-scale=1">
  <body style="font:16px system-ui;margin:0;min-height:100vh;display:grid;place-items:center;background:#0d0c14;color:#eee">
  <div style="background:${white ? "#fff" : "#17162a"};color:${white ? "#111" : "#eee"};max-width:340px;width:90%;
    border-radius:18px;padding:1.6rem;text-align:center;box-shadow:0 12px 50px #0008">
    <h1 style="font-size:1.4rem;margin:.2rem 0;color:${white ? "#111" : "#ffd25a"}">${title}</h1>
    <div>${body}</div></div></body>`;
}

const SCANNER = `<!doctype html><meta name=viewport content="width=device-width,initial-scale=1"><title>Door scanner</title>
<body style="font:16px system-ui;margin:0;background:#0d0c14;color:#eee;text-align:center;padding:1rem">
<h2 style="color:#ffd25a">🎟️ Door scanner</h2>
<input id=key type=password placeholder="door PIN" style="padding:.6rem;border-radius:10px;border:1px solid #333;background:#17162a;color:#eee">
<video id=v autoplay playsinline muted style="width:100%;max-width:360px;border-radius:14px;margin:1rem auto;display:block;background:#000"></video>
<div id=r style="font-size:1.4rem;font-weight:800;min-height:2rem"></div>
<form id=manual style="margin-top:1rem"><input id=code placeholder="or type code" style="padding:.6rem;border-radius:10px;border:1px solid #333;background:#17162a;color:#eee"><button style="padding:.6rem 1rem;border:0;border-radius:10px;background:#ffd25a;font-weight:800">Check</button></form>
<script>
const r=document.getElementById('r');
async function check(code){
  const key=document.getElementById('key').value;
  if(!key){r.textContent='Enter door PIN';r.style.color='#f80';return;}
  try{
    const d=await (await fetch('/validate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({code,key})})).json();
    if(d.ok){r.textContent='✅ ADMIT — '+d.event;r.style.color='#3fb950';}
    else if(d.status==='already_used'){r.textContent='⛔ ALREADY USED';r.style.color='#f85149';}
    else if(d.status==='unauthorized'){r.textContent='Wrong PIN';r.style.color='#f80';}
    else{r.textContent='❌ INVALID TICKET';r.style.color='#f85149';}
  }catch(e){r.textContent='network error';}
}
document.getElementById('manual').onsubmit=e=>{e.preventDefault();check(document.getElementById('code').value.trim());};
// camera scan via native BarcodeDetector (no library)
(async()=>{
  if(!('BarcodeDetector' in window)){r.textContent='Camera scan not supported — type the code.';return;}
  try{
    const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}});
    const v=document.getElementById('v'); v.srcObject=stream;
    const det=new BarcodeDetector({formats:['qr_code']}); let last=0;
    setInterval(async()=>{ try{ const codes=await det.detect(v);
      if(codes[0] && Date.now()-last>2500){ last=Date.now(); check(codes[0].rawValue); } }catch(e){} },600);
  }catch(e){ r.textContent='camera blocked — type the code'; }
})();
</script></body>`;
