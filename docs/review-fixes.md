# Popravke nakon pregleda repozitorija

- Chin strap i beardstache više se ne prevode u sidro i Verdi.
- Zajednički katalog identiteta ima 20 stilova. Postojeći bosanski ID-evi ostaju podržani; engleski slugovi i aliasi koriste isti identitet u galeriji, mock modu, konfiguraciji i edit promptovima.
- Backend kopija kataloga služi zasebnom Docker build kontekstu. `node scripts/sync-style-identity.cjs --check` i CI otkrivaju odstupanja.
- Mock Replicate i DALL-E rezultati koriste postojeće javne assete. `localPath` je null jer mock rezultat nema lokalnu upload datoteku.
- Svaki stil ima eksplicitan edit prompt. Postojeće podešene inpainting konfiguracije podržavaju oba naziva; ostalih pet stilova koriste zajedničke parametre uz vlastiti prompt. Ti parametri nisu podešavani pozivima plaćenog AI servisa.
- Neispravan stil vraća grešku 400 umjesto proizvoljnog generičkog prompta.
- OpenAI klijent inicijalizira se tek pri stvarnom DALL-E pozivu.
- HTTP server zatvara se kroz `server.close`, zatim se zatvara PostgreSQL pool. SIGTERM i SIGINT podržani su, uz ograničenje od 10 sekundi i zaštitu od ponovljenog gašenja.
- Greška na neaktivnom pool klijentu zapisuje se bez trenutnog rušenja procesa. `/health` provjerava PostgreSQL i vraća 503 kada baza nije dostupna.
- GitHub Actions pokreće provjeru kataloga, backend i frontend testove i frontend build.
- `AGENTS.md` i README opisuju stvarni stack i stanje ilustracija. Postojeći auth test usklađen je s postojećim ponašanjem 401 za nevažeći token.

## Preostale razlike i granice

Verdi, Bandholz, extended goatee i French fork nemaju vlastite raster ilustracije; umjesto pogrešnih crteža koriste jasne SVG oznake „Ilustracija u pripremi“. Ovo nije generacija nedostajućih crteža. Postojeći rasteri ostaju 800×800; thumbnail i 3:4 migracija nisu urađeni. Hook za slike koristi postojeću sliku i za thumbnail umjesto nepostojećeg fajla.

Veća kolekcija `database/beard-profiles` ostaje istraživačka/seed kolekcija. PostgreSQL 14, CRA i postojeće API rute ostaju stvarna arhitektura; nisu migrirani na drugu specifikaciju. Postavke custom instructions izvan ovog repozitorija nisu dostupne za izmjenu.

Repozitorij nije prebačen na Private, a izmjene nisu objavljene ili pushane. Nije pokrenut kompletan Docker stack niti stvarni poziv AI servisa; health i shutdown provjereni su uz mock pool/server.
