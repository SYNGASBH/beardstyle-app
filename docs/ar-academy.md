# AR try-on i Akademija

## AR try-on — `/ar-tryon`

Kamera se pokreće na dugme, bez automatskog zahtjeva za pristup pri otvaranju stranice. Odaberi jedan od 20 stilova, namjesti jačinu prikaza i gledaj ravno u kameru. Kada lice bude prepoznato, „Snimi prikaz“ sprema dva snimka istog trenutka: original i kompoziciju s AR bradom. Snimak ne uključuje tehničku liniju vilice. Klizač pokazuje stvarno poređenje prije/poslije. Rezultat se može preuzeti kao JPEG ili podijeliti preko podržanog preglednika; ostali preglednici preuzimaju sliku.

Snimanje i odlazak sa stranice zaustavljaju kameru. „Ponovi snimak“ otvara novi stream. Neuspjela dozvola i učitavanje trackera imaju jasne poruke i ponovno pokretanje. Nema nasumičnih „AI match“ rezultata.

Prikaz koristi transparentne proceduralne oblike na Canvas 2D i postojeći MediaPipe tracker. Galerijski crteži s bijelom pozadinom više se ne lijepe na lice. Ovo je ilustrativni prikaz, ne fotorealistično generisanje; ne uklanja postojeću bradu. Za kameru je potreban HTTPS ili localhost, dozvola kamere i WebGL za MediaPipe. Tracker učitava biblioteku/model s jsDelivr CDN-a; fotografije i snimci ne šalju se serveru.

## Akademija — `/akademija`

Po korisničkom zahtjevu svi kursevi i svih devet lekcija trenutno su otvoreni, bez pretplate. Otvoreni su i svi koraci animiranih vodiča. Kursevi i lekcije dostupni su klikom i tipkama Enter/Space; završena lekcija prikazuje se u napretku kursa.

Gostima se napredak čuva na uređaju. Prijavljeni korisnici učitavaju i sinhronizuju napredak preko postojećih `/api/user/lessons/progress` i `/api/user/lessons/complete` ruta. Svaki korisnik ima zaseban lokalni ključ. Greška servera ne blokira sadržaj; napredak ostaje lokalno i sinhronizacija se može ponoviti. Gostov napredak ne pripisuje se automatski drugom računu. Salon račun koristi lokalni napredak jer API zahtijeva korisnički račun.

Sadržaj kurseva je u `frontend/src/data/academyCourses.json`. Nakon promjene kurseva/lekcija pokrenuti `node scripts/sync-academy-catalog.cjs`; CI provjerava backend listu dozvoljenih lekcija. Ponovljeno završavanje iste lekcije je idempotentno.

Za starije baze potrebno je primijeniti postojeće migracije `007_user_lesson_progress.sql` i `008_user_subscription.sql`; novo Docker kreiranje baze već ih uključuje. Migracije nisu automatski pokrenute nad postojećom bazom.

## Lokalni pregled

Animirani vodiči sada koriste velike grafitne ilustracije umjesto malih geometrijskih lica. Puna brada koristi korisnikov referentni crtež, Van Dyke postojeću ilustraciju, a chin-only goatee novu generisanu ilustraciju bez brkova. SVG oznake su odvojen sloj, mogu se isključiti i prilagođene su pojedinom koraku. Dugme za uvećanje otvara veliku sliku u dijalogu; autoplay prikazuje korak osam sekundi. Orijentacione linije nisu individualna mjerenja korisnikovog lica.

U `frontend` pokrenuti `npm run build`, zatim `npm run preview`. Pregled je na `http://localhost:3002`. Za sinhronizaciju računa backend treba raditi na portu 5000; gostima je Akademija dostupna i bez njega. API sada podrazumijeva `/api`, pa radi kroz postojeći CRA/nginx proxy i na HTTPS instalaciji.

Provjere pokrivaju kamernu dozvolu, zaustavljanje i ponovno otvaranje streama, kompoziciju snimka, oporavak trackera, dostupnost vodiča, lokalni napredak, sinhronizaciju, promjenu korisnika i validaciju lekcija. Stvarna kamera, GPU i CDN trebaju završnu provjeru na korisnikovom uređaju.
# Parametric Academy plates

The three shaping guides use a shared 800 × 800 frontal plate defined by `frontend/src/components/academy/guideGeometry.js`. Beard clipping masks and instructional paths come from the same geometry. Run `node scripts/export-academy-plates.cjs` after geometry changes to export SVG plates and corresponding `.zones.json` coordinate maps into `frontend/public/assets/academy/parametric`. Tests verify export consistency. These are deterministic technical illustrations; the earlier raster references are preserved separately. Annotation strokes use 1.6 units, 7/5 dashes and 7% oxide-colored fill. No generated product labels are included.
