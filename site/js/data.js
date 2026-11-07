// volta – configurație și date de bază (machetă demo, mărci inventate)

// Pozele de produs (286 px, din macheta de referință). Indexul = al 4-lea câmp din TYPES.
export const IMG = ["telefon", "laptop", "casti", "ceas", "tv", "robot", "espresor", "airfryer", "mixer", "vertical", "controller", "tableta"].map(n => `/img/${n}.webp`);

// [cheie, nume categorie, grup mega-meniu, index poză, [preț min, preț max], denumire produs, variante 1, variante 2]
// ATENȚIE: ordinea și conținutul influențează generatorul – nu modifica (aceleași 480 de produse).
export const TYPES = [
  ["telefon", "Telefoane", "Telefoane & tablete", 0, [899, 5999], "Telefon", ["128 GB", "256 GB", "512 GB"], ["6,1\"", "6,5\"", "6,7\""]],
  ["tableta", "Tablete", "Telefoane & tablete", 11, [699, 4499], "Tabletă", ["64 GB", "128 GB", "256 GB"], ["10,9\"", "11\"", "12,4\""]],
  ["ceas", "Ceasuri smart", "Telefoane & tablete", 3, [299, 2499], "Ceas smart", ["GPS", "GPS + LTE"], ["41 mm", "45 mm"]],
  ["laptop", "Laptopuri", "Laptopuri & IT", 1, [2299, 9999], "Laptop", ["16 GB RAM", "32 GB RAM"], ["SSD 512 GB", "SSD 1 TB"]],
  ["casti", "Căști", "Laptopuri & IT", 2, [149, 1899], "Căști wireless", ["ANC", "Bluetooth 5.3"], ["30 h", "40 h"]],
  ["controller", "Gaming", "Laptopuri & IT", 10, [199, 499], "Controller wireless", ["PC / consolă"], ["20 h", "40 h"]],
  ["tv", "Televizoare", "TV & audio", 4, [1499, 8999], "Televizor", ["4K UHD", "QLED 4K", "OLED 4K"], ["55\"", "65\"", "75\""]],
  ["robot", "Aspiratoare robot", "Electrocasnice", 5, [799, 3999], "Aspirator robot", ["mop", "stație autogolire"], ["LiDAR", "cameră AI"]],
  ["vertical", "Aspiratoare verticale", "Electrocasnice", 9, [499, 2899], "Aspirator vertical", ["fără fir"], ["60 min", "90 min"]],
  ["espresor", "Espressoare", "Electrocasnice mici", 6, [599, 3499], "Espressor", ["15 bar", "20 bar"], ["cu râșniță", "cu spumare"]],
  ["airfryer", "Friteuze cu aer", "Electrocasnice mici", 7, [299, 1199], "Friteuză cu aer cald", ["4,5 l", "6 l", "9 l"], ["1500 W", "2000 W"]],
  ["mixer", "Mixere", "Electrocasnice mici", 8, [399, 2799], "Mixer planetar", ["5 l", "6,9 l"], ["1000 W", "1200 W"]]
];

// Etichete pentru cele două variante, folosite în tabelul de specificații și la comparare.
export const SPEC_LABELS = {
  telefon: ["Stocare", "Diagonală ecran"],
  tableta: ["Stocare", "Diagonală ecran"],
  ceas: ["Conectivitate", "Dimensiune carcasă"],
  laptop: ["Memorie RAM", "Stocare"],
  casti: ["Funcție principală", "Autonomie"],
  controller: ["Compatibilitate", "Autonomie"],
  tv: ["Tehnologie", "Diagonală"],
  robot: ["Funcție", "Navigație"],
  vertical: ["Alimentare", "Autonomie"],
  espresor: ["Presiune", "Dotare"],
  airfryer: ["Capacitate", "Putere"],
  mixer: ["Capacitate bol", "Putere"]
};

export const BRANDS = ["Novio", "Kairo", "Lumex", "Vexa", "Orbit", "Tessa", "Alto"];

export const GRATUIT = 199;        // prag livrare gratuită (lei)
export const LIVRARE = 19.99;      // taxă livrare sub prag (lei)
export const RATE = 12;            // nr. rate afișat pe carduri și în coș
export const RATE_OPTIUNI = [3, 6, 12];
export const ORA_LIMITA = 16;      // comenzi până la 16:00 → livrare mâine (produse cu 24 h)

export const EASYBOX = [
  "easybox Piața Unirii – București, Sector 3",
  "easybox Mall Vitan – București, Sector 3",
  "easybox Iulius Mall – Cluj-Napoca",
  "easybox Palas – Iași",
  "easybox Centru – Timișoara"
];
export const SHOWROOM = "Showroom volta (demo) – Str. Exemplului nr. 1, București, L–V 9–20, S 10–15";
