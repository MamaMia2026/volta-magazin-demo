// volta – pagini legale (ȘABLOANE DEMO – trebuie completate și verificate juridic înainte de folosire reală)
import { GRATUIT, LIVRARE, SHOWROOM } from "./data.js";
import { lei } from "./catalog.js";

const FIRMA = `<b>[Denumire firmă SRL]</b>, CUI [—], Nr. Reg. Com. [—], sediu: [adresa sediului], e-mail: comenzi@exemplu.ro, telefon: 0700 000 000`;
const DEMO = `<div class="lgdemo" role="note"><b>Șablon demo.</b> Textul de mai jos este un model pentru macheta „volta”. Datele dintre paranteze drepte trebuie completate, iar conținutul trebuie verificat de un specialist juridic înainte de publicarea unui magazin real.</div>`;
const wrap = (title, upd, body) => `<nav class="crumbs" aria-label="Navigare"><a href="/">Acasă</a><span aria-hidden="true">/</span><span>${title}</span></nav><article class="legal"><h1 class="sg pt" tabindex="-1">${title}</h1><p class="note">Ultima actualizare: ${upd} (șablon)</p>${DEMO}${body}</article>`;

const PAGES = {
  termeni: () => ({
    title: "Termeni și condiții", html: wrap("Termeni și condiții", "[data]", `
<h2 id="comerciant">1. Date despre comerciant</h2><p>Site-ul este operat de ${FIRMA}.</p>
<h2 id="comenzi">2. Comenzi</h2><p>Comanda plasată pe site reprezintă o ofertă de cumpărare. Contractul se încheie în momentul în care confirmăm comanda prin e-mail. Ne rezervăm dreptul de a anula comenzi în cazul unor erori evidente de preț sau al lipsei stocului, cu informarea clientului și restituirea oricăror sume achitate.</p>
<h2 id="preturi">3. Prețuri și plată</h2><p>Prețurile sunt exprimate în lei și includ TVA. Plata se poate face ramburs, la livrare, sau online cu cardul, prin procesatorul de plăți [nume procesator]. Datele cardului nu sunt stocate de [Denumire firmă SRL].</p>
<h2 id="livrare">4. Livrare</h2><p>Condițiile de livrare sunt descrise în pagina <a href="/livrare-retur">Livrare și retur</a>.</p>
<h2 id="retragere">5. Dreptul de retragere</h2><p>Consumatorii au dreptul de a se retrage din contract în termen de 14 zile calendaristice, fără a invoca vreun motiv, conform OUG nr. 34/2014. Detalii și formularul model se găsesc în pagina <a href="/livrare-retur#retragere">Livrare și retur</a>.</p>
<h2 id="garantie">6. Garanție</h2><p>Produsele noi beneficiază de garanția legală de conformitate de 2 ani, conform OUG nr. 140/2021, la care se poate adăuga garanția comercială oferită de producător. Produsele resigilate sunt verificate și beneficiază de aceeași garanție legală.</p>
<h2 id="rate">7. Rate fără dobândă</h2><p>Plata în rate se face prin partenerii financiari [nume bancă/IFN], în condițiile acestora. Valorile afișate pe site sunt orientative; aprobarea finanțării aparține exclusiv partenerului.</p>
<h2 id="litigii">8. Soluționarea litigiilor</h2><p>Pentru orice nemulțumire ne poți scrie la comenzi@exemplu.ro. Consumatorii se pot adresa și Autorității Naționale pentru Protecția Consumatorilor (<a href="https://anpc.ro/" target="_blank" rel="noopener">anpc.ro</a>), inclusiv prin procedura de soluționare alternativă a litigiilor (<a href="https://anpc.ro/ce-este-sal/" target="_blank" rel="noopener">SAL</a>), sau pot accesa platforma europeană de soluționare online a litigiilor (<a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener">SOL</a>).</p>
<h2 id="final">9. Dispoziții finale</h2><p>Acești termeni sunt guvernați de legea română. [Denumire firmă SRL] poate actualiza termenii; versiunea aplicabilă este cea în vigoare la data plasării comenzii.</p>`)
  }),

  confidentialitate: () => ({
    title: "Politica de confidențialitate", html: wrap("Politica de confidențialitate", "[data]", `
<h2 id="operator">1. Operatorul datelor</h2><p>Operatorul datelor cu caracter personal este ${FIRMA}. Pentru orice solicitare privind datele tale, ne poți scrie la [e-mail protecția datelor].</p>
<h2 id="date">2. Ce date prelucrăm</h2><ul><li>date de identificare și contact: nume, telefon, e-mail;</li><li>date de livrare: adresă, localitate, județ, cod poștal sau lockerul easybox ales;</li><li>datele comenzii: produse, valoare, metodă de plată și livrare;</li><li>mesajele trimise prin formulare sau e-mail.</li></ul>
<h2 id="scop">3. Scopuri și temei legal</h2><ul><li>procesarea și livrarea comenzii, pe temeiul executării contractului (art. 6 alin. 1 lit. b GDPR);</li><li>emiterea facturilor și păstrarea documentelor contabile, pe temeiul unei obligații legale (art. 6 alin. 1 lit. c);</li><li>gestionarea retururilor, garanțiilor și reclamațiilor, pe temeiul executării contractului și al obligațiilor legale;</li><li>comunicări comerciale, doar cu consimțământul tău (art. 6 alin. 1 lit. a), pe care îl poți retrage oricând.</li></ul>
<h2 id="destinatari">4. Cui transmitem datele</h2><p>Firmelor de curierat și easybox (pentru livrare), procesatorului de plăți (pentru plata online), furnizorilor de găzduire și de servicii IT, contabilității, precum și autorităților, când legea o cere. [Lista furnizorilor de completat.]</p>
<h2 id="durata">5. Cât timp păstrăm datele</h2><p>Datele comenzii se păstrează pe durata necesară executării contractului și apoi pe perioada impusă de legislația financiar-contabilă. [Termene de completat.]</p>
<h2 id="drepturi">6. Drepturile tale</h2><p>Ai dreptul de acces, rectificare, ștergere, restricționare, portabilitate și opoziție, precum și dreptul de a-ți retrage consimțământul. Poți depune plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (<a href="https://www.dataprotection.ro/" target="_blank" rel="noopener">dataprotection.ro</a>).</p>
<h2 id="cookie">7. Cookie-uri și stocare locală</h2><p>Această machetă nu folosește cookie-uri de marketing sau de analiză. Coșul, favoritele și lista de comparare sunt salvate doar în browserul tău (localStorage), ca site-ul să funcționeze, și nu sunt trimise nicăieri până nu plasezi o comandă. Le poți șterge oricând din setările browserului.</p>`)
  }),

  "livrare-retur": () => ({
    title: "Livrare și retur", html: wrap("Livrare și retur", "[data]", `
<h2 id="livrare">1. Livrare</h2><ul><li><b>Curier la adresă:</b> ${lei(LIVRARE)} pentru comenzile sub ${GRATUIT} lei; gratuit de la ${GRATUIT} lei.</li><li><b>Easybox:</b> aceleași costuri ca livrarea prin curier. Primești codul de ridicare prin SMS.</li><li><b>Ridicare din showroom:</b> gratuit. ${SHOWROOM}.</li></ul>
<p>Produsele marcate „Livrare 24 h” și comandate în zilele lucrătoare până la ora 16:00 se livrează în ziua lucrătoare următoare. Pentru celelalte produse, termenul estimat este de 2–3 zile lucrătoare. Termenele sunt orientative și pot varia în perioadele aglomerate.</p>
<h2 id="retragere">2. Dreptul de retragere (14 zile)</h2><p>Conform OUG nr. 34/2014, ai dreptul să te retragi din contract în termen de <b>14 zile calendaristice</b>, fără să indici un motiv. Termenul curge de la data la care tu, sau o persoană indicată de tine (alta decât curierul), intri în posesia fizică a produsului.</p>
<p>Pentru a-ți exercita dreptul, trebuie să ne informezi printr-o declarație neechivocă, de exemplu un e-mail la comenzi@exemplu.ro sau formularul de mai jos, înainte de expirarea termenului.</p>
<p><b>Rambursarea.</b> Îți returnăm toate sumele primite, inclusiv costul livrării standard, în cel mult 14 zile de la data la care am fost informați despre retragere. Folosim aceeași metodă de plată ca la comandă, cu excepția cazului în care convenim altfel. Putem amâna rambursarea până primim produsele înapoi sau până ne trimiți dovada expedierii lor, oricare dintre acestea are loc prima.</p>
<p><b>Returnarea produselor.</b> Trimite produsele în cel mult 14 zile de la comunicarea retragerii. Costul direct al returnării este suportat de [client / magazin – de completat]. Răspunzi doar pentru diminuarea valorii produselor cauzată de manipulări care depășesc ce este necesar pentru a le verifica natura, caracteristicile și funcționarea.</p>
<p><b>Excepții</b> (art. 16 din OUG nr. 34/2014), de exemplu: produsele sigilate desigilate după livrare, care nu pot fi returnate din motive de igienă sau de protecție a sănătății, și produsele personalizate.</p>
<h3 id="formular">Formular model de retragere</h3><div class="form-model"><p>Către [Denumire firmă SRL], [adresa], comenzi@exemplu.ro:</p><p>Prin prezenta vă notific cu privire la retragerea mea din contractul referitor la vânzarea următoarelor produse: [—]<br>Comandate la data: [—] / primite la data: [—]<br>Numărul comenzii: [—]<br>Numele consumatorului: [—]<br>Adresa consumatorului: [—]<br>Semnătura (doar pentru formularul pe hârtie) · Data: [—]</p></div>
<h2 id="retur30">3. Retur extins 30 de zile</h2><p>Ca politică comercială, în plus față de termenul legal, acceptăm returul produselor în termen de 30 de zile de la primire, în aceleași condiții. [De confirmat de comerciant.]</p>
<h2 id="garantie">4. Garanție și service</h2><p>Pentru produsele defecte, scrie-ne la comenzi@exemplu.ro cu numărul comenzii și o descriere a problemei. Garanția legală de conformitate este de 2 ani (OUG nr. 140/2021).</p>
<h2 id="anpc">5. Protecția consumatorului</h2><p>ANPC: <a href="https://anpc.ro/" target="_blank" rel="noopener">anpc.ro</a> · <a href="https://anpc.ro/ce-este-sal/" target="_blank" rel="noopener">Soluționarea alternativă a litigiilor (SAL)</a> · <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener">Soluționarea online a litigiilor (SOL)</a></p>`)
  })
};

export function pageLegal(key) { return PAGES[key]() }
