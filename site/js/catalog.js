// volta – catalogul generat (același seed ca în macheta de referință → aceleași 480 de produse)
import { TYPES, BRANDS, IMG, SPEC_LABELS } from "./data.js";

// --- generator (identic cu referința) ---
let s = 7; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
export const PR = []; TYPES.forEach((t, ti) => { for (let k = 0; k < 40; k++) { const br = BRANDS[Math.floor(rnd() * BRANDS.length)], v1 = t[6][Math.floor(rnd() * t[6].length)], v2 = t[7][Math.floor(rnd() * t[7].length)];
  let price = Math.round((t[4][0] + rnd() * (t[4][1] - t[4][0])) / 10) * 10 - 1, off = rnd() < .35 ? [10, 15, 20, 25, 30, 40][Math.floor(rnd() * 6)] : 0, old = off ? Math.round(price / (1 - off / 100) / 10) * 10 - 1 : 0;
  PR.push({ id: PR.length, t: t[0], ti, br, name: `${t[5]} ${br} ${["X", "S", "Pro", "Air", "Max", "Lite", "One"][Math.floor(rnd() * 7)]}${Math.floor(rnd() * 9) + 1}, ${v1}, ${v2}`, spec: v1 + " · " + v2, price, old, off: old ? Math.round((1 - price / old) * 100) : 0, stock: Math.floor(rnd() * 30), f24: rnd() < .6, rs: rnd() < .08, pop: rnd(), nw: rnd() }) } });

// --- utilitare ---
export const norm = x => String(x).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
export const slugify = x => norm(x).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
// Format românesc (2.999 lei · 19,99 lei), fără Intl – inițializarea ICU ro-RO costă ~40 ms la pornire.
const grp = s => s.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
export const lei = n => { const v = Math.round(n * 100) / 100, [i, d] = Math.abs(v).toFixed(2).split("."); return (v < 0 ? "-" : "") + grp(i) + (n % 1 ? "," + d : "") + (v == 1 ? " leu" : " lei") };
export const esc = x => String(x).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c]));

// --- îmbogățire (nu atinge datele generate) ---
const BY_SLUG = new Map();
for (const p of PR) {
  const parts = p.name.split(", ");
  p.model = parts[0];                       // ex. „Espressor Lumex S8”
  p.v1 = parts[1]; p.v2 = parts.slice(2).join(", ");
  p.sx = norm(p.name + " " + TYPES[p.ti][1]);   // text normalizat pentru căutare
  let base = slugify(p.model), slug = base, i = 2;
  while (BY_SLUG.has(slug)) slug = `${base}-${i++}`;
  p.slug = slug; BY_SLUG.set(slug, p);
  p.code = "VLT-" + String(p.id + 1).padStart(5, "0");
}

export const TYPE = Object.fromEntries(TYPES.map(t => [t[0], t]));
export const COUNT = Object.fromEntries(TYPES.map(t => [t[0], PR.filter(p => p.t == t[0]).length]));
export const typeOf = p => TYPES[p.ti];
export const imgOf = p => IMG[TYPES[p.ti][3]];
export const imgType = t => IMG[t[3]];
export const bySlug = slug => BY_SLUG.get(slug);
export const url = p => "/produs/" + p.slug;
export const labels = p => SPEC_LABELS[p.t];
export const stockText = p => p.stock == 0 ? "Stoc epuizat" : p.stock <= 3 ? "Ultimele " + p.stock + " bucăți" : "În stoc";
