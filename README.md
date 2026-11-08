# volta – machetă demo de magazin online

Magazin static (fără framework) de electronice și electrocasnice, cu mărci, produse și prețuri generate automat (480 de produse, seed fix). Machetă pentru potențiali clienți – Site realizat de CristianWeb.

## Structură

- `site/` – tot ce se publică (Netlify `publish = "site"`)
  - `index.html` – o singură pagină; rutele (`/produs/<slug>`, `/favorite`, `/compara?ids=…`, `/comanda`, `/termeni`, `/confidentialitate`, `/livrare-retur`) sunt randate din JS
  - `js/data.js` – tipuri, mărci, prag livrare (199 lei), taxă (19,99), rate
  - `js/catalog.js` – generatorul (identic cu macheta de referință)
  - `js/search.js`, `js/filters.js`, `js/cart.js`, `js/app.js`
  - `js/checkout.js`, `js/legal.js` – încărcate doar când e nevoie
  - `fonts/` – Inter și Space Grotesk, woff2 locale: latin, latin-ext și un subset mic `-ro` (ă, ș, ț)
- `imagini/` – pozele originale (286 px), doar local (ignorate de git; copiile publicate sunt în `site/img/`)
- `referinta/` – macheta de referință (ignorată de git, nu se publică)

## Rulare locală

```
node dev-server.js
```

Deschide http://localhost:8080. Serverul simulează Netlify: orice rută → `index.html`, iar formularul de comandă e afișat în consolă în loc să fie trimis la Netlify Forms.

## Comenzi (Netlify Forms)

Formularul `comanda` este detectat din formularul ascuns din `index.html` (`data-netlify="true"`, honeypot `bot-field`). Comenzile de test apar în Netlify → Forms.
