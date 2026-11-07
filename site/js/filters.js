// volta – filtre, sortare, listare (filtrele sunt sincronizate cu URL-ul)
import { TYPES, BRANDS, RATE } from "./data.js";
import { PR, lei, esc, imgOf, url, norm, COUNT, TYPE, stockText } from "./catalog.js";
import { fav, cmp } from "./cart.js";

const $ = x => document.querySelector(x);
const PAS = 24;

export const st = { t: "", br: new Set(), min: "", max: "", stock: false, f24: false, rs: false, off: false, q: "", qRaw: "", sort: "pop", n: PAS };
const SORT = { pa: (a, b) => a.price - b.price, pd: (a, b) => b.price - a.price, off: (a, b) => b.off - a.off, new: (a, b) => b.nw - a.nw, pop: (a, b) => b.pop - a.pop };

export function filt(skipBr) {
  return PR.filter(p => (!st.t || p.t == st.t) && (skipBr || !st.br.size || st.br.has(p.br)) && (!st.min || p.price >= +st.min) && (!st.max || p.price <= +st.max) && (!st.stock || p.stock > 0) && (!st.f24 || p.f24) && (!st.rs || p.rs) && (!st.off || p.off) && (!st.q || p.sx.includes(st.q)));
}

const HEART = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/></svg>`;
const SCALE = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18M5 7h14M5 7l-3 7a3 3 0 0 0 6 0L5 7Zm14 0-3 7a3 3 0 0 0 6 0l-3-7ZM8 21h8"/></svg>`;

// Card de produs (folosit în listare, favorite și produse similare)
export function card(p) {
  const f = fav.has(p.id), c = cmp.includes(p.id);
  return `<article class="pc"><div class="ph"><a href="${url(p)}" tabindex="-1" aria-hidden="true"><img src="${imgOf(p)}" alt="" width="286" height="286" loading="lazy" decoding="async"></a><div class="bg">${p.off ? `<span class="b-off">−${p.off}%</span>` : ""}${p.f24 ? `<span class="b-24">Livrare 24 h</span>` : ""}${p.rs ? `<span class="b-rs">Resigilat</span>` : ""}</div><button class="fav ${f ? "on" : ""}" data-fav="${p.id}" aria-pressed="${f}" aria-label="Favorit: ${esc(p.model)}">${HEART}</button></div>
 <h3><a href="${url(p)}">${esc(p.name)}</a></h3><span class="st ${p.stock <= 3 ? "lo" : ""}">${stockText(p)}</span><div class="old">${p.old ? lei(p.old) : ""}</div><div class="np ${p.off ? "off" : ""}">${lei(p.price)}</div><span class="rt">sau ${RATE} rate × ${lei(Math.ceil(p.price / RATE))}</span>
 <div class="ac"><button class="btn btn-a" data-add="${p.id}" ${p.stock == 0 ? "disabled style='opacity:.4'" : ""}>Adaugă în coș</button><button class="btn cmpb ${c ? "on" : ""}" data-cmp="${p.id}" aria-pressed="${c}" aria-label="Compară: ${esc(p.model)}" title="Compară">${SCALE}</button></div></article>`;
}

export function side() {
  const base = filt(true);
  $("#side").innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center"><h2 class="sg" style="font-size:20px">Filtre</h2><button class="x" id="sx" style="display:none" aria-label="Închide filtrele">×</button></div>
 <fieldset><legend class="h">Categorie</legend><label><input type="radio" name="tp" data-type="" ${!st.t ? "checked" : ""}> Toate<em>${PR.length}</em></label>${TYPES.map(t => `<label><input type="radio" name="tp" data-type="${t[0]}" ${st.t == t[0] ? "checked" : ""}> ${t[1]}<em>${COUNT[t[0]]}</em></label>`).join("")}</fieldset>
 <fieldset><legend class="h">Preț (lei)</legend><div class="pr2"><input id="mn" type="number" inputmode="numeric" min="0" placeholder="de la" aria-label="Preț minim" value="${esc(st.min)}"><span>–</span><input id="mx" type="number" inputmode="numeric" min="0" placeholder="până la" aria-label="Preț maxim" value="${esc(st.max)}"></div></fieldset>
 <fieldset><legend class="h">Marcă</legend>${BRANDS.map(b => `<label><input type="checkbox" data-br="${b}" ${st.br.has(b) ? "checked" : ""}> ${b}<em>${base.filter(p => p.br == b).length}</em></label>`).join("")}</fieldset>
 <fieldset><legend class="h">Disponibilitate</legend><label><input type="checkbox" data-k="stock" ${st.stock ? "checked" : ""}> Doar în stoc</label><label><input type="checkbox" data-k="f24" ${st.f24 ? "checked" : ""}> Livrare în 24 h</label><label><input type="checkbox" data-k="off" ${st.off ? "checked" : ""}> Cu reducere</label><label><input type="checkbox" data-k="rs" ${st.rs ? "checked" : ""}> Resigilate</label></fieldset>
 <button class="btn btn-a" id="sapply" style="display:none">Vezi produsele</button>`;
  if (matchMedia("(max-width:760px)").matches) { $("#sx").style.display = ""; $("#sapply").style.display = "" }
}

let L = [], shown = 0, lastQS = null;

// Randează doar ce se vede: primele `st.n` produse; „Încarcă încă 24” adaugă doar cardurile noi.
export function grid() {
  L = filt(); L.sort(SORT[st.sort] || SORT.pop);
  $("#lTitle").firstChild.textContent = st.t ? TYPE[st.t][1] : st.q ? `Rezultate pentru „${st.qRaw}”` : "Toate produsele"; $("#lCount").textContent = L.length + " produse";
  const ch = []; if (st.t) ch.push(["t", TYPE[st.t][1]]); st.br.forEach(b => ch.push(["br:" + b, b])); if (st.min || st.max) ch.push(["pr", `${st.min || 0}–${st.max || "∞"} lei`]);[["stock", "În stoc"], ["f24", "Livrare 24 h"], ["off", "Cu reducere"], ["rs", "Resigilate"]].forEach(k => st[k[0]] && ch.push([k[0], k[1]])); if (st.q) ch.push(["q", "„" + st.qRaw + "”"]);
  $("#chips").innerHTML = ch.map(c => `<button data-chip="${esc(c[0])}" aria-label="Elimină filtrul ${esc(c[1])}">${esc(c[1])} ✕</button>`).join("") + (ch.length ? `<button class="clr" data-chip="all">Șterge tot</button>` : "");
  const V = L.slice(0, st.n); shown = V.length;
  $("#grid").innerHTML = V.length ? V.map(card).join("") : `<p class="empty" style="grid-column:1/-1">Niciun produs. Încearcă alte filtre.</p>`;
  more(); writeURL();
}
function more() {
  $("#more").innerHTML = L.length > shown ? `<span>Ai văzut ${shown} din ${L.length} produse</span><div class="bar"><i style="width:${shown / L.length * 100}%"></i></div><button class="btn" id="loadm">Încarcă încă ${PAS}</button>` : L.length ? `<span>Ai văzut toate cele ${L.length} produse</span>` : "";
}
export function loadMore() {
  const next = L.slice(shown, shown + PAS); st.n = shown + next.length;
  $("#grid").insertAdjacentHTML("beforeend", next.map(card).join("")); shown = st.n; more();
  $("#grid").children[shown - next.length]?.querySelector("h3 a")?.focus({ preventScroll: true });
}
export function all() { st.n = PAS; side(); grid() }

export function reset() { Object.assign(st, { t: "", br: new Set(), min: "", max: "", stock: false, f24: false, rs: false, off: false, q: "", qRaw: "", sort: "pop", n: PAS }) }

export function writeURL() {
  if (location.pathname != "/") return;
  const u = new URLSearchParams(); if (st.t) u.set("cat", st.t); if (st.br.size) u.set("brand", [...st.br].join(",")); if (st.qRaw) u.set("q", st.qRaw); if (st.sort != "pop") u.set("sort", st.sort);["stock", "f24", "off", "rs"].forEach(k => st[k] && u.set(k, 1)); if (st.min) u.set("min", st.min); if (st.max) u.set("max", st.max);
  const qs = u.toString() ? "?" + u : "";
  try { if (location.search != qs) history.replaceState(history.state, "", "/" + qs) } catch (e) { }
  lastQS = qs;
}
// Citește filtrele din URL. Întoarce false dacă URL-ul corespunde deja listării afișate.
export function readURL() {
  if (location.search == lastQS) return false;
  reset(); const U = new URLSearchParams(location.search);
  if (TYPE[U.get("cat")]) st.t = U.get("cat");
  (U.get("brand") || "").split(",").forEach(b => BRANDS.includes(b) && st.br.add(b));
  if (U.get("q")) { st.qRaw = U.get("q").trim(); st.q = norm(st.qRaw) }
  if (SORT[U.get("sort")]) st.sort = U.get("sort");
  ["stock", "f24", "off", "rs"].forEach(k => { if (U.get(k)) st[k] = true });
  if (/^\d+$/.test(U.get("min") || "")) st.min = U.get("min"); if (/^\d+$/.test(U.get("max") || "")) st.max = U.get("max");
  $("#sort").value = st.sort; $("#q").value = st.qRaw;
  return true;
}

// Evenimente specifice filtrelor
export function initFilters() {
  document.addEventListener("change", e => {
    const t = e.target, D = t.dataset; if (!t.closest("#side, .lt")) return;
    if (D.type !== undefined && t.name == "tp") { st.t = D.type; all(); $(`input[name=tp][data-type="${D.type}"]`)?.focus(); return }
    if (D.br) { t.checked ? st.br.add(D.br) : st.br.delete(D.br); st.n = PAS; grid(); side(); $(`[data-br="${D.br}"]`)?.focus(); return }
    if (D.k) { st[D.k] = t.checked; all(); $(`[data-k="${D.k}"]`)?.focus(); return }
    if (t.id == "mn" || t.id == "mx") { st.min = $("#mn").value.replace(/\D/g, ""); st.max = $("#mx").value.replace(/\D/g, ""); st.n = PAS; grid(); return }
    if (t.id == "sort") { st.sort = t.value; grid() }
  });
}
