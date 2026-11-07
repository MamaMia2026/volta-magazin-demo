// volta – finalizare comandă (demo) în 3 pași, trimisă prin Netlify Forms
import { EASYBOX, SHOWROOM, GRATUIT, RATE } from "./data.js";
import { PR, lei, esc, imgOf, url } from "./catalog.js";
import { cart, totals, clearCart } from "./cart.js";
import { go } from "./app.js";

const $ = x => document.querySelector(x);
const JUDETE = ["Alba", "Arad", "Argeș", "Bacău", "Bihor", "Bistrița-Năsăud", "Botoșani", "Brăila", "Brașov", "București", "Buzău", "Călărași", "Caraș-Severin", "Cluj", "Constanța", "Covasna", "Dâmbovița", "Dolj", "Galați", "Giurgiu", "Gorj", "Harghita", "Hunedoara", "Ialomița", "Iași", "Ilfov", "Maramureș", "Mehedinți", "Mureș", "Neamț", "Olt", "Prahova", "Sălaj", "Satu Mare", "Sibiu", "Suceava", "Teleorman", "Timiș", "Tulcea", "Vâlcea", "Vaslui", "Vrancea"];
const METODE = { curier: "Curier la adresă", easybox: "Easybox", ridicare: "Ridicare din showroom" };
const PLATI = { ramburs: "Ramburs (numerar sau card la livrare)", card: "Card online" };
const STEPS = ["Date de livrare", "Metodă de livrare", "Plată și sumar"];

const co = { step: 1, d: { livrare_metoda: "curier", plata: "ramburs" } };

const f = (name, label, attrs = "", type = "text") => `<div class="fld"><label for="f-${name}">${label}</label><input id="f-${name}" name="${name}" type="${type}" value="${esc(co.d[name] || "")}" ${attrs}><small class="em" aria-live="polite"></small></div>`;

function summary() {
  const t = totals(co.d.livrare_metoda);
  return `<h2 class="sg">Sumar comandă</h2><div class="sumi">${cart.map(c => { const p = PR[c.id]; return `<div class="ci"><img src="${imgOf(p)}" alt="" width="56" height="56"><div><a class="n" href="${url(p)}">${esc(p.name)}</a><span class="q">${c.q} × ${lei(p.price)}</span></div><div class="r">${lei(p.price * c.q)}</div></div>` }).join("")}</div>
 <div class="lines"><div><span>Produse (${t.n})</span><span>${lei(t.sub)}</span></div><div><span>Livrare · ${METODE[co.d.livrare_metoda]}</span><span>${t.tr ? lei(t.tr) : "gratuit"}</span></div><div class="t"><span>Total</span><b>${lei(t.tot)}</b></div></div>
 ${co.d.livrare_metoda != "ridicare" && t.sub < GRATUIT ? `<p class="note">Livrare gratuită de la ${GRATUIT} lei.</p>` : ""}<p class="note">sau în ${RATE} rate fără dobândă de ${lei(Math.ceil(t.tot / RATE))}/lună</p>`;
}

function step1() {
  return `<fieldset data-step="1"><legend class="sg">1. Date de livrare</legend><div class="fg">
 ${f("nume", "Nume și prenume", `required minlength="3" autocomplete="name" data-err="Scrie numele complet."`)}
 ${f("telefon", "Telefon", `required inputmode="tel" pattern="^(\\+40|0040|0)7[0-9 ]{8,10}$" autocomplete="tel" placeholder="07xx xxx xxx" data-err="Scrie un număr de mobil valid (07xx xxx xxx)."`, "tel")}
 ${f("email", "E-mail", `required autocomplete="email" data-err="Scrie o adresă de e-mail validă."`, "email")}
 <div class="fld"><label for="f-judet">Județ</label><select id="f-judet" name="judet" required data-err="Alege județul." autocomplete="address-level1"><option value="">Alege județul</option>${JUDETE.map(j => `<option ${co.d.judet == j ? "selected" : ""}>${j}</option>`).join("")}</select><small class="em" aria-live="polite"></small></div>
 ${f("localitate", "Localitate", `required autocomplete="address-level2" data-err="Scrie localitatea."`)}
 ${f("cod_postal", "Cod poștal (opțional)", `inputmode="numeric" pattern="^[0-9]{6}$" autocomplete="postal-code" data-err="Codul poștal are 6 cifre."`)}
 <div class="fld full">${`<label for="f-adresa">Adresă (stradă, număr, bloc, apartament)</label><input id="f-adresa" name="adresa" value="${esc(co.d.adresa || "")}" required minlength="5" autocomplete="street-address" data-err="Scrie adresa completă."><small class="em" aria-live="polite"></small>`}</div>
 </div><div class="nav"><a href="/" class="lnk">← Continuă cumpărăturile</a><button type="button" class="btn btn-a" data-next="2">Continuă</button></div></fieldset>`;
}
function step2() {
  const t = totals("curier"), cost = t.tr ? lei(t.tr) : "gratuit", m = co.d.livrare_metoda;
  return `<fieldset data-step="2"><legend class="sg">2. Metodă de livrare</legend><div class="opts">
 <label class="opt"><input type="radio" name="livrare_metoda" value="curier" ${m == "curier" ? "checked" : ""}><span><b>Curier la adresă</b><small>${esc(co.d.adresa || "")}${co.d.localitate ? ", " + esc(co.d.localitate) : ""} · 1–3 zile lucrătoare</small></span><em>${cost}</em></label>
 <label class="opt"><input type="radio" name="livrare_metoda" value="easybox" ${m == "easybox" ? "checked" : ""}><span><b>Easybox</b><small>Ridici oricând din locker, cu codul primit prin SMS</small></span><em>${cost}</em></label>
 <div class="fld sub" ${m == "easybox" ? "" : "hidden"}><label for="f-easybox">Alege lockerul</label><select id="f-easybox" name="easybox" ${m == "easybox" ? "required" : ""} data-err="Alege un locker easybox."><option value="">Alege lockerul</option>${EASYBOX.map(x => `<option ${co.d.easybox == x ? "selected" : ""}>${x}</option>`).join("")}</select><small class="em" aria-live="polite"></small></div>
 <label class="opt"><input type="radio" name="livrare_metoda" value="ridicare" ${m == "ridicare" ? "checked" : ""}><span><b>Ridicare din showroom</b><small>${SHOWROOM}</small></span><em>gratuit</em></label>
 </div><div class="nav"><button type="button" class="lnk" data-next="1">← Înapoi</button><button type="button" class="btn btn-a" data-next="3">Continuă</button></div></fieldset>`;
}
function step3() {
  const d = co.d, p = d.plata;
  const dest = d.livrare_metoda == "curier" ? `${esc(d.adresa)}, ${esc(d.localitate)}, jud. ${esc(d.judet)}` : d.livrare_metoda == "easybox" ? esc(d.easybox) : SHOWROOM;
  return `<fieldset data-step="3"><legend class="sg">3. Plată și sumar</legend><div class="opts">
 <label class="opt"><input type="radio" name="plata" value="ramburs" ${p == "ramburs" ? "checked" : ""}><span><b>Ramburs</b><small>Plătești la livrare, numerar sau cu cardul la curier</small></span></label>
 <label class="opt"><input type="radio" name="plata" value="card" ${p == "card" ? "checked" : ""}><span><b>Card online</b><small>Într-un magazin real ai fi redirecționat către pagina securizată a procesatorului de plăți. În machetă nu se cer și nu se procesează date de card.</small></span></label>
 </div>
 <div class="recap"><div><h3>Livrare către</h3><p>${esc(d.nume)} · ${esc(d.telefon)} · ${esc(d.email)}</p><p>${METODE[d.livrare_metoda]}: ${dest}</p><button type="button" class="lnk" data-next="1">Modifică datele</button></div></div>
 <div class="fld full"><label for="f-observatii">Observații pentru comandă (opțional)</label><textarea id="f-observatii" name="observatii" rows="3" maxlength="500">${esc(d.observatii || "")}</textarea></div>
 <p class="hp" aria-hidden="true"><label>Nu completa acest câmp: <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
 <div class="fld full"><label class="chk"><input type="checkbox" name="termeni" value="da" required data-err="Trebuie să accepți termenii pentru a trimite comanda." ${d.termeni ? "checked" : ""}> Am citit și accept <a href="/termeni" target="_blank" rel="noopener">Termenii și condițiile</a> și <a href="/confidentialitate" target="_blank" rel="noopener">Politica de confidențialitate</a>.</label><small class="em" aria-live="polite"></small></div>
 <p class="note demo-n">Comandă de test: nu se livrează nimic și nu se plătește nimic.</p>
 <div class="nav"><button type="button" class="lnk" data-next="2">← Înapoi</button><button type="submit" class="btn btn-a" id="send">Trimite comanda</button></div></fieldset>`;
}

function render() {
  $("#cosum").innerHTML = summary();
  $("#steps").innerHTML = STEPS.map((s, i) => `<li class="${i + 1 == co.step ? "on" : i + 1 < co.step ? "ok" : ""}" ${i + 1 == co.step ? `aria-current="step"` : ""}><i>${i + 1 < co.step ? "✓" : i + 1}</i>${s}</li>`).join("");
  $("#cof").innerHTML = [step1, step2, step3][co.step - 1]();
}

function collect() { new FormData($("#cof")).forEach((v, k) => { co.d[k] = typeof v == "string" ? v.trim() : v }); if (co.step == 3) co.d.termeni = !!$("#cof [name=termeni]")?.checked }

function validate() {
  let first = null;
  $("#cof").querySelectorAll("input,select,textarea").forEach(el => {
    if (el.closest("[hidden]")) return;
    const ok = el.checkValidity(), em = el.closest(".fld")?.querySelector(".em");
    el.classList.toggle("bad", !ok); el.setAttribute("aria-invalid", !ok);
    if (em) em.textContent = ok ? "" : (el.dataset.err || el.validationMessage);
    if (!ok && !first) first = el;
  });
  first?.focus(); return !first;
}

function clearErr(t) {
  if (!t.classList?.contains("bad") || !t.checkValidity()) return;
  t.classList.remove("bad"); t.removeAttribute("aria-invalid"); const em = t.closest(".fld")?.querySelector(".em"); if (em) em.textContent = "";
}

function orderNo() { const d = new Date(); return `VLT-${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}` }

async function submit() {
  collect(); if (!validate()) return;
  const btn = $("#send"); btn.disabled = true; btn.textContent = "Se trimite…";
  const t = totals(co.d.livrare_metoda), nr = orderNo(), d = co.d;
  const fields = {
    "form-name": "comanda", "bot-field": d["bot-field"] || "",
    nr_comanda: nr, nume: d.nume, telefon: d.telefon, email: d.email, judet: d.judet, localitate: d.localitate, adresa: d.adresa, cod_postal: d.cod_postal || "",
    livrare_metoda: METODE[d.livrare_metoda], easybox: d.livrare_metoda == "easybox" ? d.easybox : "", plata: PLATI[d.plata], observatii: d.observatii || "", termeni: "da",
    produse: cart.map(c => { const p = PR[c.id]; return `${c.q} × ${p.name} [${p.code}] – ${lei(p.price)} = ${lei(p.price * c.q)}` }).join("\n"),
    nr_produse: String(t.n), subtotal: lei(t.sub), cost_livrare: t.tr ? lei(t.tr) : "gratuit", total: lei(t.tot)
  };
  let ok = !!fields["bot-field"];   // dacă honeypot-ul e completat, nu trimitem nimic
  if (!ok) {
    try { const r = await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(fields).toString() }); ok = r.ok } catch (e) { ok = false }
  }
  if (!ok) { btn.disabled = false; btn.textContent = "Trimite comanda"; $("#coerr").hidden = false; $("#coerr").focus(); return }
  try { sessionStorage.setItem("volta.comanda", JSON.stringify({ nr, total: fields.total, metoda: fields.livrare_metoda, plata: fields.plata, email: d.email, n: t.n })) } catch (e) { }
  clearCart(); co.step = 1; co.d = { livrare_metoda: "curier", plata: "ramburs" };
  go("/comanda/multumim");
}

export function pageCheckout() {
  if (!cart.length) return { title: "Finalizare comandă", html: `<div class="blank" style="margin-top:40px"><h1 class="sg pt" tabindex="-1">Coșul e gol</h1><p>Adaugă produse în coș ca să poți finaliza o comandă.</p><a class="btn btn-a" href="/">Vezi produsele</a></div>` };
  return {
    title: "Finalizare comandă", html: `<nav class="crumbs" aria-label="Navigare"><a href="/">Acasă</a><span aria-hidden="true">/</span><span>Finalizare comandă</span></nav>
<h1 class="sg pt" tabindex="-1">Finalizare comandă <small>machetă demo</small></h1><ol class="steps" id="steps"></ol>
<div class="co"><div><form id="cof" name="comanda-ui" novalidate></form><p class="coerr" id="coerr" tabindex="-1" hidden>Nu am putut trimite comanda. Verifică conexiunea și încearcă din nou.</p></div><aside class="cosum" id="cosum"></aside></div>`,
    after() {
      render();
      const form = $("#cof");
      form.addEventListener("click", e => { const b = e.target.closest("[data-next]"); if (!b) return; const n = +b.dataset.next; collect(); if (n > co.step && !validate()) return; co.step = n; render(); $("#steps").scrollIntoView({ block: "nearest" }); form.querySelector("legend")?.setAttribute("tabindex", "-1"); form.querySelector("legend")?.focus({ preventScroll: true }) });
      form.addEventListener("change", e => {
        const t = e.target;
        if (t.name == "livrare_metoda") { co.d.livrare_metoda = t.value; const s = form.querySelector(".fld.sub"); s.hidden = t.value != "easybox"; s.querySelector("select").required = t.value == "easybox"; $("#cosum").innerHTML = summary() }
        if (t.name == "plata") co.d.plata = t.value;
        if (t.tagName == "SELECT" || t.type == "checkbox") clearErr(t);
      });
      // erorile dispar în timp ce scrii (nu la blur – altfel layout-ul se mută sub cursor și click-ul pe „Continuă” se pierde)
      form.addEventListener("input", e => clearErr(e.target));
      form.addEventListener("submit", e => { e.preventDefault(); if (co.step < 3) { form.querySelector(".nav .btn-a[data-next]")?.click(); return } submit() });
    }
  };
}

export function pageThanks() {
  let o = null; try { o = JSON.parse(sessionStorage.getItem("volta.comanda")) } catch (e) { }
  if (!o) return { title: "Comandă", html: `<div class="blank" style="margin-top:40px"><h1 class="sg pt" tabindex="-1">Nicio comandă recentă</h1><p>Nu am găsit o comandă trimisă în această sesiune.</p><a class="btn btn-a" href="/">Înapoi la magazin</a></div>` };
  return {
    title: "Mulțumim pentru comandă", html: `<div class="thx"><div class="ok" aria-hidden="true">✓</div><h1 class="sg pt" tabindex="-1">Mulțumim! Comanda a fost trimisă.</h1>
<p class="nr">Număr comandă: <b>${esc(o.nr)}</b></p>
<dl><div><dt>Total</dt><dd>${esc(o.total)}</dd></div><div><dt>Livrare</dt><dd>${esc(o.metoda)}</dd></div><div><dt>Plată</dt><dd>${esc(o.plata)}</dd></div><div><dt>Produse</dt><dd>${o.n}</dd></div></dl>
<p>Într-un magazin real ai primi confirmarea pe <b>${esc(o.email)}</b>. Aceasta este o comandă de test într-o machetă demo: nu se livrează nimic și nu se percepe nicio plată.</p>
<a class="btn btn-a" href="/">Înapoi la magazin</a></div>`
  };
}
