// volta – coș, favorite și comparare (salvate în localStorage)
import { GRATUIT, LIVRARE, RATE } from "./data.js";
import { PR, lei, imgOf, url, esc } from "./catalog.js";

const $ = x => document.querySelector(x), $$ = x => [...document.querySelectorAll(x)];
const K = { cart: "volta.cos", fav: "volta.favorite", cmp: "volta.compara" };

function load(k, fb) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? fb } catch (e) { return fb } }
function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch (e) { /* stocare indisponibilă – ignorăm */ } }
const valid = id => Number.isInteger(id) && id >= 0 && id < PR.length;

export let cart = (Array.isArray(load(K.cart, [])) ? load(K.cart, []) : [])
  .filter(c => c && valid(c.id) && c.q > 0).map(c => ({ id: c.id, q: Math.min(Math.floor(c.q), PR[c.id].stock || 1) }));
export const fav = new Set((Array.isArray(load(K.fav, [])) ? load(K.fav, []) : []).filter(valid));
export let cmp = (Array.isArray(load(K.cmp, [])) ? load(K.cmp, []) : []).filter(valid).slice(0, 3);
if (cmp.length && cmp.some(i => PR[i].t != PR[cmp[0]].t)) cmp = [];

// --- toast ---
let tt; export function toast(m) { const t = $("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 1800) }

// --- coș ---
// metoda: "curier" | "easybox" | "ridicare" (ridicarea din showroom e gratuită)
export function totals(metoda) {
  const sub = cart.reduce((a, c) => a + PR[c.id].price * c.q, 0);
  const tr = metoda == "ridicare" ? 0 : (sub && sub < GRATUIT ? LIVRARE : 0);
  return { sub, tr, tot: sub + tr, n: cart.reduce((a, c) => a + c.q, 0) };
}

export function drawer() {
  const t = totals(), left = GRATUIT - t.sub;
  $("#drw").innerHTML = `<div class="h"><b>Coșul meu (${t.n})</b><button class="x" data-close="1" aria-label="Închide">×</button></div><div class="cl">${cart.length ? cart.map(c => { const p = PR[c.id]; return `<div class="ci"><img src="${imgOf(p)}" alt="" width="56" height="56"><div><a class="n" href="${url(p)}">${esc(p.name)}</a><span style="font-size:12px;color:var(--gnt);font-weight:600;display:block">${p.f24 ? "Livrare mâine" : "Livrare în 2–3 zile"}</span></div><div class="r">${lei(p.price * c.q)}<span class="mini"><button data-dec="${p.id}" aria-label="Scade cantitatea">−</button><span>${c.q}</span><button data-add="${p.id}" aria-label="Crește cantitatea">+</button></span></div></div>` }).join("") : `<p class="empty">Coșul e gol.</p>`}</div>
 <div class="cf"><div class="free">${t.sub ? (left > 0 ? `Mai adaugă <b>${lei(left)}</b> pentru livrare gratuită` : "✓ Ai livrare gratuită") : ""}<div class="prog"><i style="width:${Math.min(100, t.sub / GRATUIT * 100)}%"></i></div></div><div class="lines"><div><span>Produse</span><span>${lei(t.sub)}</span></div><div><span>Livrare</span><span>${t.sub ? (t.tr ? lei(t.tr) : "gratuit") : "—"}</span></div><div class="t"><span>Total</span><b>${lei(t.tot)}</b></div></div>${cart.length ? `<a class="btn btn-a" id="co" href="/comanda">Finalizează comanda</a>` : `<button class="btn btn-a" disabled style="opacity:.5">Finalizează comanda</button>`}<span style="font-size:12px;color:var(--mu);text-align:center">sau în ${RATE} rate fără dobândă de ${lei(Math.ceil(t.tot / RATE))}/lună</span></div>`;
  $$(".cnt").forEach(x => { x.textContent = t.n; x.hidden = !t.n });
}

export function add(id, d, quiet) {
  const p = PR[id]; if (!p) return; let x = cart.find(c => c.id == id);
  if (d > 0 && p.stock == 0) { toast("Produsul nu mai este în stoc"); return }
  if (!x && d > 0) { x = { id, q: 0 }; cart.push(x) } if (!x) return;
  const before = x.q; x.q = Math.min(p.stock || 1, x.q + d);
  if (x.q <= 0) cart = cart.filter(c => c !== x);
  save(K.cart, cart);
  if (d > 0 && !quiet) toast(x.q == before ? `Stoc maxim: ${p.stock} buc.` : "✓ Adăugat în coș");
  drawer(); document.dispatchEvent(new CustomEvent("volta:cart"));
}
export function clearCart() { cart = []; save(K.cart, cart); drawer() }

export function openCart() { drawer(); $("#drw").classList.add("open"); $("#ov").classList.add("open"); $("#drw").querySelector(".x")?.focus() }

// --- favorite ---
export function toggleFav(id) {
  fav.has(id) ? fav.delete(id) : fav.add(id); save(K.fav, [...fav]);
  $$(`[data-fav="${id}"]`).forEach(b => { b.classList.toggle("on", fav.has(id)); b.setAttribute("aria-pressed", fav.has(id)) });
  favCount(); toast(fav.has(id) ? "♥ Adăugat la favorite" : "Scos de la favorite");
  document.dispatchEvent(new CustomEvent("volta:fav"));
}
export function favCount() { $$(".favN").forEach(x => { x.textContent = fav.size; x.hidden = !fav.size }) }

// --- comparare (max. 3, același tip) ---
export function toggleCmp(id) {
  const p = PR[id];
  if (cmp.includes(id)) cmp = cmp.filter(i => i != id);
  else if (cmp.length && PR[cmp[0]].t != p.t) { cmp = [id]; toast("Poți compara doar produse de același tip – am început o listă nouă") }
  else if (cmp.length >= 3) { toast("Poți compara maximum 3 produse"); return }
  else cmp.push(id);
  setCmp(cmp);
}
export function setCmp(ids) {
  cmp = ids; save(K.cmp, cmp);
  $$("[data-cmp]").forEach(b => { const on = cmp.includes(+b.dataset.cmp); b.classList.toggle("on", on); b.setAttribute("aria-pressed", on) });
  cmpBar();
}
export function cmpBar() {
  const el = $("#cmpbar"), hide = !cmp.length || location.pathname.startsWith("/compara") || location.pathname.startsWith("/comanda");
  el.hidden = hide; document.body.classList.toggle("has-cmp", !hide); if (hide) return;
  el.innerHTML = `<div class="wrap"><span class="cmpl">Compară <b>${cmp.length}/3</b></span><div class="cmpth">${cmp.map(i => `<button data-cmp="${i}" class="on" aria-label="Scoate ${esc(PR[i].model)} din comparare"><img src="${imgOf(PR[i])}" alt="" width="40" height="40"><i>×</i></button>`).join("")}</div><a class="btn btn-a" href="/compara?ids=${cmp.join(",")}" ${cmp.length < 2 ? `aria-disabled="true" data-need="1"` : ""}>Compară${cmp.length < 2 ? " (min. 2)" : ""}</a><button class="btn cmpclr" data-cmpclr="1">Golește</button></div>`;
}
