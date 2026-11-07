// volta – căutare cu sugestii (fără diacritice, cu debounce)
import { TYPES } from "./data.js";
import { PR, lei, esc, norm, imgOf, imgType, url, COUNT } from "./catalog.js";
import { st, filt } from "./filters.js";

const $ = x => document.querySelector(x);
const TN = TYPES.map(t => norm(t[1]));
let timer, active = -1;

function close() { $("#sug").classList.remove("open"); $("#q").setAttribute("aria-expanded", "false"); active = -1 }

function sug() {
  const v = st.q; if (!v) { close(); return }
  const T = TYPES.filter((t, i) => TN[i].includes(v)).slice(0, 3), L = filt().slice(0, 4);
  $("#sug").innerHTML = (T.length ? `<div class="t">Categorii</div>` + T.map(t => `<a class="s" href="/?cat=${t[0]}" data-type="${t[0]}" role="option"><img src="${imgType(t)}" alt="" width="40" height="40">${t[1]}<b style="color:var(--mu);font-weight:500">${COUNT[t[0]]} produse</b></a>`).join("") : "")
    + (L.length ? `<div class="t">Produse</div>` + L.map(p => `<a class="s" href="${url(p)}" role="option"><img src="${imgOf(p)}" alt="" width="40" height="40">${esc(p.name)}<b>${lei(p.price)}</b></a>`).join("") : `<div class="t">Niciun rezultat</div>`);
  $("#sug").classList.add("open"); $("#q").setAttribute("aria-expanded", "true"); active = -1;
}

export function setQuery(raw) { st.qRaw = raw.trim(); st.q = norm(st.qRaw) }

// onSubmit: apelat la Enter / „Caută” (aplică filtrul în listare)
export function initSearch({ onSubmit }) {
  const q = $("#q");
  q.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(() => { setQuery(q.value); sug() }, 150) });
  q.addEventListener("focus", () => { if (st.q && q.value) sug() });
  q.addEventListener("keydown", e => {
    const items = [...$("#sug").querySelectorAll(".s")]; if (!items.length || !$("#sug").classList.contains("open")) return;
    if (e.key == "ArrowDown" || e.key == "ArrowUp") { e.preventDefault(); active = (active + (e.key == "ArrowDown" ? 1 : -1) + items.length) % items.length; items.forEach((x, i) => x.classList.toggle("act", i == active)); items[active].scrollIntoView({ block: "nearest" }) }
    else if (e.key == "Enter" && active >= 0) { e.preventDefault(); items[active].click() }
  });
  $("#sf").addEventListener("submit", e => { e.preventDefault(); clearTimeout(timer); setQuery(q.value); close(); q.blur(); onSubmit() });
  document.addEventListener("click", e => { if (!e.target.closest(".sb")) close() });
  document.addEventListener("keydown", e => { if (e.key == "Escape") close() });
}
export const closeSug = close;
