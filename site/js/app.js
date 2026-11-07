// volta – aplicația: rutare, pagina principală, produs, favorite, comparare
import { TYPES, RATE_OPTIUNI, GRATUIT, LIVRARE, ORA_LIMITA } from "./data.js";
import { PR, lei, esc, imgOf, imgType, url, bySlug, TYPE, COUNT, labels, stockText } from "./catalog.js";
import { cart, fav, cmp, add, drawer, openCart, toggleFav, favCount, toggleCmp, setCmp, cmpBar, toast } from "./cart.js";
import { st, all, grid, side, loadMore, readURL, card, initFilters, reset } from "./filters.js";
import { initSearch, closeSug } from "./search.js";

const $ = x => document.querySelector(x), $$ = x => [...document.querySelectorAll(x)];
const SITE = "volta";

// ---------- antet: bara de categorii, mega-meniu, dale ----------
const groups = [...new Set(TYPES.map(t => t[2]))];
$("#catbar").innerHTML = `<button class="hot" data-offf="1">🔥 Oferte</button>` + TYPES.map(t => `<button data-type="${t[0]}">${t[1]}</button>`).join("");
// Mega-meniul e ascuns la încărcare → îl construim după primul paint (sau la prima deschidere).
let megaOk = false;
function buildMega() {
  if (megaOk) return; megaOk = true;
  $("#megaIn").innerHTML = groups.map(g => `<div><h2 class="mh">${g}</h2>${TYPES.filter(t => t[2] == g).map(t => `<a href="/?cat=${t[0]}" data-type="${t[0]}"><img src="${imgType(t)}" alt="" width="34" height="34" loading="lazy">${t[1]}<em>${COUNT[t[0]]}</em></a>`).join("")}</div>`).join("") + `<div class="pr"><span>Doar săptămâna asta</span><b>−40%</b><span>la espressoare și friteuze cu aer</span><button class="btn btn-y" data-type="espresor">Vezi oferta</button></div>`;
}

// ---------- pagina principală: dale + oferta zilei cu cronometru (construite doar când e afișată) ----------
const DEAL = PR.find(p => p.t == "espresor" && p.off >= 20) || PR.find(p => p.off);
let homeOk = false;
function initHome() {
  if (homeOk) return; homeOk = true;
  $("#tiles").innerHTML = TYPES.map(t => `<button class="tile" data-type="${t[0]}"><img src="${imgType(t)}" alt="" width="64" height="64" loading="lazy">${t[1]}</button>`).join("");
  $("#deal").innerHTML =`<div class="t"><b class="sg">Oferta zilei</b><div class="cd" role="timer" aria-label="Timp rămas din oferta zilei"><span id="cdh">00</span><span id="cdm">00</span><span id="cds">00</span></div></div><a href="${url(DEAL)}" tabindex="-1" aria-hidden="true"><img src="${imgOf(DEAL)}" alt="" width="286" height="150"></a><a class="dn" href="${url(DEAL)}">${esc(DEAL.name)}</a><div><span class="old">${lei(DEAL.old)}</span> <b class="offt">−${DEAL.off}%</b></div><div class="np">${lei(DEAL.price)}</div><div class="bar"><i></i></div><span style="font-size:12.5px;color:var(--mu)">72% vândut · stoc limitat</span><button class="btn btn-a" data-add="${DEAL.id}">Adaugă în coș</button>`;
  tick(); setInterval(tick, 1000);
}
const pad = n => String(n).padStart(2, "0");
function tick() { const e = new Date(); e.setHours(23, 59, 59); const d = Math.max(0, e - new Date()); $("#cdh").textContent = pad(Math.floor(d / 36e5)); $("#cdm").textContent = pad(Math.floor(d / 6e4) % 60); $("#cds").textContent = pad(Math.floor(d / 1e3) % 60) }

// ---------- utilitare pagini ----------
const HEART = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/></svg>`;
const crumbs = (...c) => `<nav class="crumbs" aria-label="Navigare"><a href="/">Acasă</a>${c.map(x => `<span aria-hidden="true">/</span>${x}`).join("")}</nav>`;
export function livrare(p) {
  if (!p.stock) return "Stoc epuizat – produsul nu poate fi comandat acum";
  if (!p.f24) return "Livrare în 2–3 zile lucrătoare";
  return new Date().getHours() < ORA_LIMITA ? "Comanzi azi până la 16:00, primești mâine" : "Comanzi până mâine la 16:00, primești poimâine";
}
const stare = p => p.rs ? "Resigilat – verificat, cu garanție completă" : "Nou";

function specRows(p) {
  const l = labels(p), t = TYPE[p.t];
  return [["Tip produs", t[5]], ["Marcă", p.br], ["Model", p.model], [l[0], p.v1], [l[1], p.v2], ["Stare", stare(p)], ["Garanție", "24 de luni"], ["Livrare", p.f24 ? "24 h" : "2–3 zile lucrătoare"], ["Cod produs", p.code]];
}

// ---------- pagini ----------
function pageProduct(slug) {
  const p = bySlug(slug); if (!p) return page404();
  const t = TYPE[p.t], f = fav.has(p.id), c = cmp.includes(p.id);
  const sim = PR.filter(x => x.t == p.t && x.id != p.id).sort((a, b) => Math.abs(a.price - p.price) - Math.abs(b.price - p.price) || a.id - b.id).slice(0, 4);
  return {
    title: p.model, html: `${crumbs(`<a href="/?cat=${t[0]}" data-type="${t[0]}">${t[1]}</a>`, `<span>${esc(p.model)}</span>`)}
<div class="pp">
 <div class="pgal"><div class="bg">${p.off ? `<span class="b-off">−${p.off}%</span>` : ""}${p.f24 ? `<span class="b-24">Livrare 24 h</span>` : ""}${p.rs ? `<span class="b-rs">Resigilat</span>` : ""}</div><img src="${imgOf(p)}" alt="${esc(p.name)}" width="286" height="286" fetchpriority="high"></div>
 <div class="pinfo">
  <span class="pbr">${p.br}</span>
  <h1 class="sg" tabindex="-1">${esc(p.name)}</h1>
  <div class="pmeta">Cod produs: ${p.code} · ${p.rs ? "Resigilat" : "Nou"}</div>
  <span class="st ${p.stock <= 3 ? "lo" : ""}">${stockText(p)}</span>
  <div class="pprice">${p.old ? `<div><span class="old">${lei(p.old)}</span> <b class="offt">−${p.off}%</b></div>` : ""}<div class="np ${p.off ? "off" : ""}">${lei(p.price)}</div><span class="pvat">TVA inclus</span></div>
  <div class="prate"><b>Rate fără dobândă</b><div class="rg">${RATE_OPTIUNI.map(n => `<div><b>${n} rate</b><span>${lei(Math.ceil(p.price / n))}/lună</span></div>`).join("")}</div><small>Exemplu demonstrativ, fără ofertă de creditare reală.</small></div>
  <div class="pdel"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h11v9H3zM14 9h4l3 3v3h-7"/><circle cx="7" cy="17" r="1.8"/><circle cx="17" cy="17" r="1.8"/></svg><div><b>${livrare(p)}</b><span>Livrare gratuită peste ${GRATUIT} lei, altfel ${lei(LIVRARE)} · easybox sau ridicare din showroom</span></div></div>
  <div class="pact"><button class="btn btn-a" data-add="${p.id}" ${p.stock == 0 ? "disabled style='opacity:.4'" : ""}>Adaugă în coș</button><button class="btn pfav ${f ? "on" : ""}" data-fav="${p.id}" aria-pressed="${f}" aria-label="Favorit">${HEART}</button><button class="btn cmpb2 ${c ? "on" : ""}" data-cmp="${p.id}" aria-pressed="${c}">Compară</button></div>
 </div>
</div>
<section class="psec"><h2 class="sg">Specificații</h2><table class="spec"><tbody>${specRows(p).map(r => `<tr><th scope="row">${r[0]}</th><td>${esc(r[1])}</td></tr>`).join("")}</tbody></table><p class="note">Specificațiile sunt generate automat pentru machetă.</p></section>
<section class="psec"><h2 class="sg">Produse similare</h2><div class="grid">${sim.map(card).join("")}</div></section>`
  };
}

function pageFav() {
  const L = [...fav].map(i => PR[i]);
  return {
    title: "Favorite", html: `${crumbs("<span>Favorite</span>")}<h1 class="sg pt" tabindex="-1">Favorite <small>${L.length} produse</small></h1>
${L.length ? `<div class="grid g5">${L.map(card).join("")}</div>` : `<div class="blank"><p>Nu ai încă produse favorite. Apasă pe inimioara de pe orice produs ca să-l salvezi aici.</p><a class="btn btn-a" href="/">Vezi produsele</a></div>`}`
  };
}

function cmpIds() {
  const raw = (new URLSearchParams(location.search).get("ids") || "").split(",").map(Number).filter(i => Number.isInteger(i) && PR[i]);
  const ids = [...new Set(raw)]; return ids.filter(i => PR[i].t == PR[ids[0]].t).slice(0, 3);
}
function pageCmp() {
  const ids = cmpIds(); if (ids.join() != cmp.join()) setCmp(ids);
  if (!ids.length) return { title: "Comparare", html: `${crumbs("<span>Comparare</span>")}<h1 class="sg pt" tabindex="-1">Comparare produse</h1><div class="blank"><p>Nu ai ales produse de comparat. Apasă butonul de comparare de pe până la 3 produse de același tip.</p><a class="btn btn-a" href="/">Vezi produsele</a></div>` };
  const P = ids.map(i => PR[i]), l = labels(P[0]);
  const rows = [["Preț", p => lei(p.price)], ["Preț vechi", p => p.old ? `${lei(p.old)} (−${p.off}%)` : "—"], ["Marcă", p => p.br], [l[0], p => esc(p.v1)], [l[1], p => esc(p.v2)], ["Stoc", p => stockText(p)], ["Livrare", p => p.f24 ? "24 h" : "2–3 zile"], ["Stare", p => p.rs ? "Resigilat" : "Nou"], [`${RATE_OPTIUNI.at(-1)} rate`, p => lei(Math.ceil(p.price / RATE_OPTIUNI.at(-1))) + "/lună"], ["Garanție", () => "24 de luni"], ["Cod produs", p => p.code]];
  return {
    title: "Comparare " + TYPE[P[0].t][1].toLowerCase(), html: `${crumbs(`<a href="/?cat=${P[0].t}" data-type="${P[0].t}">${TYPE[P[0].t][1]}</a>`, "<span>Comparare</span>")}<h1 class="sg pt" tabindex="-1">Comparare ${TYPE[P[0].t][1].toLowerCase()} <small>${P.length} din 3</small></h1>
<div class="cmpw"><table class="cmpt"><thead><tr><td></td>${P.map(p => `<th scope="col"><button class="x" data-cmprm="${p.id}" aria-label="Scoate ${esc(p.model)} din comparare">×</button><a href="${url(p)}"><img src="${imgOf(p)}" alt="" width="120" height="120"><span>${esc(p.name)}</span></a></th>`).join("")}${P.length < 3 ? `<td class="cadd"><a href="/?cat=${P[0].t}" data-type="${P[0].t}">+ Adaugă un produs</a></td>` : ""}</tr></thead>
<tbody>${rows.map(r => { const v = P.map(r[1]); return `<tr class="${new Set(v).size > 1 ? "dif" : ""}"><th scope="row">${r[0]}</th>${v.map(x => `<td>${x}</td>`).join("")}${P.length < 3 ? "<td></td>" : ""}</tr>` }).join("")}
<tr><th scope="row"><span class="vh">Acțiuni</span></th>${P.map(p => `<td><button class="btn btn-a" data-add="${p.id}" ${p.stock == 0 ? "disabled style='opacity:.4'" : ""}>Adaugă în coș</button></td>`).join("")}${P.length < 3 ? "<td></td>" : ""}</tr></tbody></table></div>
<p class="note">Rândurile marcate diferă între produse. Link-ul acestei pagini poate fi trimis: <code>${esc(location.pathname + location.search)}</code></p>`
  };
}

function page404() { return { title: "Pagina nu există", html: `<div class="blank" style="margin-top:40px"><h1 class="sg pt" tabindex="-1">Pagina nu există</h1><p>Link-ul poate fi greșit sau produsul nu mai este în catalog.</p><a class="btn btn-a" href="/">Înapoi la magazin</a></div>` } }

// ---------- rutare ----------
let current = "";
async function view(path) {
  let m;
  if ((m = path.match(/^\/produs\/([a-z0-9-]+)$/))) return pageProduct(m[1]);
  if (path == "/favorite") return pageFav();
  if (path == "/compara") return pageCmp();
  if (path == "/comanda" || path == "/comanda/multumim") { const c = await import("./checkout.js"); return path == "/comanda" ? c.pageCheckout() : c.pageThanks() }
  if (["/termeni", "/confidentialitate", "/livrare-retur"].includes(path)) { const l = await import("./legal.js"); return l.pageLegal(path.slice(1)) }
  return page404();
}

function closeAll() { $("#drw").classList.remove("open"); $("#ov").classList.remove("open"); $("#mega").classList.remove("open"); $("#side").classList.remove("open"); document.body.classList.remove("lock"); closeSug(); setExp(false) }
function setExp(v) { $("#allc").setAttribute("aria-expanded", v); $("#mcat").setAttribute("aria-expanded", v) }

function chrome(path) {
  document.documentElement.classList.remove("sub");
  const home = path == "/"; if (home) initHome(); $("#home").hidden = !home; $("#view").hidden = home;
  $$(".mnav [data-nav]").forEach(b => b.classList.toggle("on", b.dataset.nav == (home ? "/" : path)));
  cmpBar();
}

async function route(o = {}) {
  closeAll();
  const path = location.pathname.replace(/\/+$/, "") || "/"; current = path; chrome(path);
  if (path == "/") { if (readURL() || !$("#grid").children.length) { if (o.boot) setTimeout(all, 0); else all() } document.title = `${SITE} – electronice și electrocasnice`; }
  else {
    const r = await view(path); if (current != path) return;
    $("#view").innerHTML = r.html; document.title = `${r.title} – ${SITE}`; r.after?.();
    if (!o.pop) $("#view h1")?.focus({ preventScroll: true });
  }
  const y = history.state?.y, anchor = location.hash && document.getElementById(location.hash.slice(1));
  if (o.pop && y != null) requestAnimationFrame(() => scrollTo(0, y)); else if (anchor) anchor.scrollIntoView(); else if (!o.keep) scrollTo(0, 0);
}

export function go(href, o = {}) {
  try { history.replaceState({ ...(history.state || {}), y: scrollY }, "") } catch (e) { }
  history.pushState({}, "", href); route(o);
}
addEventListener("popstate", () => route({ pop: true }));
if ("scrollRestoration" in history) history.scrollRestoration = "manual";

// Asigură că suntem pe pagina principală (fără a reciti URL-ul), apoi derulează la listă.
function toListing() {
  if (location.pathname != "/") { try { history.replaceState({ ...(history.state || {}), y: scrollY }, "") } catch (e) { } history.pushState({}, "", "/"); current = "/"; chrome("/"); document.title = `${SITE} – electronice și electrocasnice` }
  closeAll(); all(); $(".ls").scrollIntoView({ behavior: "smooth" });
}

// ---------- evenimente globale ----------
document.addEventListener("click", e => {
  const t = e.target, b = t.closest("[data-type],[data-add],[data-dec],[data-fav],[data-cmp],[data-cmprm],[data-cmpclr],[data-need],[data-open],[data-close],[data-chip],[data-offf],[data-acc],#loadm,#allc,#co,#mf,#ms,#sx,#sapply,#mcat");
  if (!b) {
    if (t.id == "ov") { closeAll(); return }
    if (!t.closest(".mega")) { $("#mega").classList.remove("open"); setExp(false) }
    const a = t.closest("a[href]");
    if (a && a.origin == location.origin && !a.target && !a.hasAttribute("download") && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && e.button == 0 && !/\.\w+$/.test(a.pathname)) {
      const same = a.pathname + a.search == location.pathname + location.search;
      if (same && a.hash) { closeAll(); return }            // ancoră pe aceeași pagină – comportament implicit
      e.preventDefault(); if (!same) go(a.pathname + a.search + a.hash); else closeAll();
    }
    return;
  }
  const D = b.dataset;
  if (b.id == "allc" || b.id == "mcat") { buildMega(); const o = $("#mega").classList.toggle("open"); setExp(o); return }
  if (D.type !== undefined && b.tagName != "INPUT") { e.preventDefault(); st.t = D.type; st.q = ""; st.qRaw = ""; $("#q").value = ""; toListing(); return }
  if (D.add !== undefined) { add(+D.add, 1); return } if (D.dec !== undefined) { add(+D.dec, -1); return }
  if (D.fav !== undefined) { toggleFav(+D.fav); return }
  if (D.cmp !== undefined) { toggleCmp(+D.cmp); return }
  if (D.cmprm !== undefined) { const ids = cmp.filter(i => i != +D.cmprm); setCmp(ids); history.replaceState(history.state, "", ids.length ? "/compara?ids=" + ids.join(",") : "/compara"); route({ keep: true }); return }
  if (D.cmpclr) { setCmp([]); return }
  if (D.need) { e.preventDefault(); toast("Alege cel puțin 2 produse de același tip"); return }
  if (D.open) { openCart(); document.body.classList.add("lock"); return } if (D.close || b.id == "sx" || b.id == "sapply") { closeAll(); return }
  if (D.offf) { st.off = true; toListing(); return }
  if (D.acc) { toast("Contul de client nu este inclus în machetă"); return }
  if (D.chip) { const c = D.chip; if (c == "all") { reset(); $("#q").value = ""; $("#sort").value = "pop" } else if (c == "t") st.t = ""; else if (c.startsWith("br:")) st.br.delete(c.slice(3)); else if (c == "pr") { st.min = ""; st.max = "" } else if (c == "q") { st.q = ""; st.qRaw = ""; $("#q").value = "" } else st[c] = false; all(); return }
  if (b.id == "loadm") { loadMore(); return }
  if (b.id == "co") { e.preventDefault(); go("/comanda"); return }
  if (b.id == "mf") { side(); $("#side").classList.add("open"); document.body.classList.add("lock"); $("#sx")?.focus(); return }
  if (b.id == "ms") { const o = ["pop", "pa", "pd", "off", "new"]; st.sort = o[(o.indexOf(st.sort) + 1) % o.length]; $("#sort").value = st.sort; toast("Sortare: " + $("#sort").selectedOptions[0].text); grid(); return }
});
addEventListener("keydown", e => { if (e.key == "Escape") closeAll() });
document.addEventListener("volta:fav", () => { if (current == "/favorite") route({ keep: true }) });

// înălțimea antetului sticky → scroll-margin pentru listă și ancore
// (ResizeObserver: fără citiri sincrone de layout la pornire)
new ResizeObserver(e => document.documentElement.style.setProperty("--hh", Math.round(e[0].borderBoxSize?.[0]?.blockSize ?? e[0].target.offsetHeight) + "px")).observe($("header.hd"));

// ---------- pornire ----------
initFilters();
initSearch({ onSubmit: toListing });
drawer(); favCount();
route({ boot: true });
setTimeout(buildMega, 0);
