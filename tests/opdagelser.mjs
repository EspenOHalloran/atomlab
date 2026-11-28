// Opdagelserne (#opdagelser, docs/plan-videnskabsfolk.md, afsnit 7): listen over bøgerne i Node (test 1, også siderne og "Om" fra H4), og i browseren,
// at delen åbner fra menuen og som første skærm uden fejl (test 3), hylden med Huygens og to grå rygge (et tryk stiller bogens spørgsmål),
// forsiden og bladringen (knapper, piletaster, stryg og Esc), og at telefon og tablet på højkant ikke får noget, der
// ligger uden for skærmen (test 8). H1 16. november 2026. H2 (fortællingen som forløb, test 4 og 5) samme dag. Einsteins
// forside (E1, 21. november 2026) i test 1, 3 og 8. Rømers forside (R1, 27. november 2026) i test 1, 3 og 8. Rømers tur (R2, 28. november 2026) i test 4, 5 og 8. Rømers gåde, tidsskriftet og "Om Rømer" (R3, 28. november 2026) i test 6 og 8. Einsteins ligning om tiden (E3, 22. november 2026) i test 1, 7 og 8.
// Energien og tyngden (E4, samme dag) i test 1, 7 og 8. "Om Einstein" og links begge veje (E5, samme dag) i test 1, 6 og 7.
import { chromium, ADRESSE, ARGS } from './hjaelp.mjs';
import { BØGER, bogMed, byggede, påHylden as hyldensBøger, rygLinje, KOMMENDE_PÅ_HYLDEN } from '../js/data/opdagelser.js';
import { SKÆRME } from '../js/skaerme.js';
import { existsSync, readFileSync } from 'node:fs';
import { forløbMed, forløbI } from '../js/data/forloeb/liste.js';
import { ORDBOG } from '../js/data/ordbog.js';
import { CITATER } from '../js/data/citater.js';
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };
const PROJEKT = new URL('../', import.meta.url).pathname;

// ---------- Uden browser: listen (test 1) ----------
const fejlListe = [];
const år = BØGER.map((b) => b.år);
if (BØGER.length !== 10) fejlListe.push(`${BØGER.length} bøger`);
if (år.some((a, i) => i && a < år[i - 1])) fejlListe.push('ikke i årets rækkefølge');
if (new Set(BØGER.map((b) => b.id)).size !== 10) fejlListe.push('to bøger med samme id');
for (const b of BØGER) {
  if (!b.navn || !b.kort || !b.ejefald || !b.om || !(b.år > 1500 && b.år < 2000)) fejlListe.push(`${b.id}: felterne`);
}
// Hylden (E20 fund 6): de byggede og højst to grå rygge, der hver stiller deres spørgsmål
const hylden = hyldensBøger();
if (hylden.filter((b) => !b.bygget).length > KOMMENDE_PÅ_HYLDEN || KOMMENDE_PÅ_HYLDEN > 2) fejlListe.push('for mange grå rygge');
for (const b of hylden.filter((x) => !x.bygget)) if (!b.spørgsmål?.endsWith('?') || /senere/i.test(rygLinje(b))) fejlListe.push(`${b.id}: spørgsmålet`);
for (const b of byggede()) {
  if (!b.titel || !b.stil?.papir || !b.stil?.blæk || !b.stil?.skrift || !b.stil?.ryg) fejlListe.push(`${b.id}: stilen`);
  if (!existsSync(PROJEKT + b.portræt)) fejlListe.push(`${b.id}: portrættet findes ikke`);
  const t = await b.tekster();
  if (t.OPSLAG[0]?.slags !== 'forside' || !t.FORSIDE?.spørgsmål || !t.FORSIDE?.portrætAlt) fejlListe.push(`${b.id}: forsiden`);
  if (!t.OPSLAG.every((o) => ['forside', 'scene', 'sider', 'ligning', 'om'].includes(o.slags) && o.id)) fejlListe.push(`${b.id}: et opslag af ukendt slags`);
  // Opslag med en ligning (E3): siden findes, højst to glødende steder inden for siden og med tysk og dansk, og lagene
  for (const o of t.OPSLAG.filter((x) => x.slags === 'ligning')) {
    const L = t.LIGNINGER?.[o.ligning];
    if (!L?.forord?.tekst || !existsSync(PROJEKT + L.side.fil) || !L.side.alt || !L.side.linjer?.length || !L.ligning?.led?.length || !L.regn?.valg?.some((v) => v.rigtig)
      || !L.linjer?.rækker?.length || !L.nørd?.punkter?.length || !L.ærligt?.punkter?.length || !L.seSelv?.gaa) fejlListe.push(`${b.id}: opslaget ${o.id}`);
    if (!L?.steder?.length || L.steder.length > 2 || L.steder.some((x) => !x.tysk || !x.dansk || !x.kort || !x.felter.length
      || !L.side.linjer.some((l) => l.sted === x.id)
      || x.felter.some(([v, oo, br, h]) => v < 0 || oo < 0 || br <= 0 || h <= 0 || v + br > 100 || oo + h > 100))) fejlListe.push(`${b.id}: de glødende steder i ${o.id}`);
  }
  // "Om …" (H4): budgettet fra planen (højst to tal og fire spørgsmål, "Vil du vide mere?" og "Ærligt talt")
  if (t.OPSLAG.some((o) => o.slags === 'om') && (!t.OM?.navn || !t.OM.tal?.length || t.OM.tal.length > 2 || !t.OM.hvorfor?.length || t.OM.hvorfor.length > 4
    || t.OM.hvorfor.some((h) => !h.spørgsmål || !h.svar) || !t.OM.nørd?.punkter?.length || !t.OM.ærligt?.punkter?.length
    || (t.OM.sætninger.match(/[.!?](\s|$)/g) ?? []).length > 3)) fejlListe.push(`${b.id}: "Om" holder ikke budgettet`);
  if (t.OPSLAG.some((o) => o.slags === 'om') && t.OPSLAG.at(-1)?.slags !== 'om') fejlListe.push(`${b.id}: "Om" er ikke det sidste opslag`);
  // Bogen selv (H4): højst fire sider, der findes, og højst seks glødende steder, der ligger inden for siden
  if (t.OPSLAG.some((o) => o.slags === 'sider')) {
    const sider = t.BOGEN?.sider ?? [];
    const steder = sider.flatMap((s) => s.steder);
    if (!sider.length || sider.length > 4 || sider.some((s) => !existsSync(PROJEKT + s.fil) || !s.alt || !s.b || !s.h)) fejlListe.push(`${b.id}: siderne`);
    if (!steder.length || steder.length > 6 || steder.some((x) => !x.latin || !x.dansk || !x.felter.length
      || x.felter.some(([v, o, br, h]) => v < 0 || o < 0 || br <= 0 || h <= 0 || v + br > 100 || o + h > 100))) fejlListe.push(`${b.id}: de glødende steder`);
  }
}
tjek('listen: ti bøger i årets rækkefølge med navn og år, hylden har højst to grå rygge med et spørgsmål, og en bygget bog har titel, stil, portræt, forside og kun byggede opslag', !fejlListe.length, fejlListe.join('; '));
tjek('Tycho, Huygens, Rømer og Einstein er de byggede bøger, og delen står i Biblioteket efter Gåderne med status prøve',
  byggede().map((b) => b.id).join() === 'tycho,huygens,roemer,einstein' && bogMed('huygens').år === 1656 && bogMed('tycho').år === 1572
  && SKÆRME.findIndex((s) => s.id === 'opdagelser') === SKÆRME.findIndex((s) => s.id === 'gaader') + 1
  && SKÆRME.find((s) => s.id === 'opdagelser')?.status === 'prøve' && SKÆRME.find((s) => s.id === 'opdagelser')?.verden === 'biblioteket');
// Fortællingens forløb (H2, test 4 i planen): tre trin med kapitel, gæt og korte tekster, og fagordene findes i Ordbogen
{
  const fl = forløbMed(bogMed('huygens').forløb);
  const ord = (t) => (t ?? '').split(/\s+/).filter(Boolean).length;
  const fejlFl = [];
  if (!fl || fl.del !== 'opdagelser' || forløbI('opdagelser').length !== 4) fejlFl.push('forløbet findes ikke i listen'); // Huygens, Tycho, Rømer (R2) og Einstein
  else {
    if (fl.trin.map((t) => t.id).join() !== 'linse,naetter,kanten,annulo') fejlFl.push('trinene');
    for (const t of fl.trin) {
      if (!t.kapitel || ord(t.spørg) > 16 || ord(t.så) > 22 || (t.gæt?.valg.length ?? 0) < 2) fejlFl.push(`${t.id}: teksterne`);
      for (const o of t.ord ?? []) if (!ORDBOG.some((x) => x.id === o)) fejlFl.push(`${t.id}: ordet ${o} mangler i Ordbogen`);
    }
    if (!fl.kernesætning.includes('tynd, flad ring')) fejlFl.push('kernesætningen');
  }
  const t = await bogMed('huygens').tekster();
  if (t.OPSLAG.find((o) => o.id === 'fortaelling')?.slags !== 'scene' || !t.FRI?.igen) fejlFl.push('opslaget');
  // Introduktionen før gåden (fund 18. november 2026): højst fem sætninger, årstallet, de 62 bogstaver og ordet anagram,
  // og turens trin 4 siger, hvorfor han ikke bare fortalte det
  {
    const f = t.GÅDE.forord;
    const sætninger = (f?.tekst.match(/[.!?](\s|$)/g) ?? []).length;
    const trin4 = fl?.trin.find((x) => x.id === 'annulo');
    tjek('introduktionen til hemmeligheden: 1656, 62 bogstaver, anagram, højst fem sætninger og ingen alder på 25, og trin 4 siger, at ringen ikke ses lige nu',
      f && /1656/.test(f.sted) && /62/.test(f.tekst) && /anagram/.test(f.tekst) && sætninger <= 5 && !/\b25\b/.test(f.tekst) && /1659/.test(f.lille) && /ses ikke/.test(trin4?.spørg), JSON.stringify({ sætninger, spørg: trin4?.spørg }));
  }
  // Den røde tråd (jeres ønske 18. november 2026): forsiden introducerer ham og mysteriet (alderen står kun dér), og
  // hvert opslag peger videre: "Det så du" til hemmeligheden, gåden til bogen, siderne som en sti og "Om" til Saturn
  {
    const i = t.FORSIDE.intro;
    const sætninger = (i?.tekst.match(/[.!?](\s|$)/g) ?? []).length;
    tjek('den røde tråd: forsiden har introduktionen (Haag 1655, Galilei 1610, 45 år, Huygens på 25, højst fire sætninger), og alderen står kun dér',
      i && /1655/.test(i.sted) && /Galilei/.test(i.tekst) && /1610/.test(i.tekst) && /45 år/.test(i.tekst) && /Huygens/.test(i.tekst) && /\b25\b/.test(i.tekst) && sætninger <= 4
      && !/\b2[56]\b/.test(t.GÅDE.forord.tekst), JSON.stringify({ sætninger }));
    tjek('den røde tråd: hver side peger videre (hemmeligheden, bogen, "Næste side" og "Havde han ret?", og "Om" har Saturn fra kanten som sin knap)',
      /ANNULO/.test(t.VEJE.sætning) && !/1659/.test(t.VEJE.sætning) && t.GÅDE.videre && t.BOGEN.intro && t.BOGEN.næste && t.BOGEN.sidst?.endsWith('?')
      && t.BOGEN.sider.every((s) => s.om) && t.OM.knap?.gaa === 'solsystem:saturn:kanten' && /Huygens havde ret/.test(t.OM.sætninger));
  }
  tjek('fortællingen: forløbet "Saturns ører" har fire trin med kapitel, gæt og korte tekster, og "linse" og "anagram" står i Ordbogen', !fejlFl.length, fejlFl.join('; '));
  // Test 2 (planen afsnit 7): Anagrammets 62 bogstaver passer præcist med sætningen, i 17 bunker, og ordene giver sætningen
  const A = t.ANAGRAM;
  const sorter = (x) => [...x].sort().join('');
  const iBunker = t.bunker(A.række);
  tjek('anagrammet: de 62 bogstaver i 17 bunker passer præcist med sætningen, og de otte ord giver sætningen (og den danske er den samme som citatet ved Saturn)',
    sorter(t.bogstaver(A.række)) === sorter(t.bogstaver(A.sætning)) && t.bogstaver(A.række).length === 62 && iBunker.length === 17
    && iBunker.reduce((n, [, k]) => n + k, 0) === 62 && A.ord.length === 8 && t.bogstaver(A.ord.map((o) => o.latin).join('')).join('') === t.bogstaver(A.sætning).join('')
    && A.ord.every((o) => o.dansk) && A.ord[0].latin === A.nøgle && A.dansk === CITATER.huygensSaturn.tekst, JSON.stringify(iBunker));
}
// Tychos forside (T1, docs/drejebog-tycho.md afsnit 4): introduktionen (Herrevad, november 1572, 25 år, højst fem
// sætninger og et spørgsmål til sidst) og W'et efter de rigtige pladser: Kaph og Segin lige højt, og den nye stjerne over
// hele W'et (ikke en tegning med øjet)
{
  const t = await bogMed('tycho').tekster();
  const i = t.FORSIDE.intro;
  const sætninger = (i?.tekst.match(/[.!?](\s|$)/g) ?? []).length;
  const st = Object.fromEntries(t.FORSIDE.kort.stjerner.map((x) => [x.id, x]));
  const w = ['segin', 'ruchbah', 'gamma', 'schedar', 'kaph'].map((id) => st[id]);
  const erW = w.every(Boolean) && w.every((x, k) => !k || x.x > w[k - 1].x) && w[1].y < w[0].y && w[1].y < w[2].y && w[3].y < w[2].y && w[3].y < w[4].y;
  tjek('Tychos forside: introduktionen (Herrevad 1572, 25 år, højst fem sætninger, slutter med et spørgsmål), og tegningen er et W efter de rigtige pladser med den nye stjerne øverst',
    /Herrevad/.test(i?.sted) && /1572/.test(i?.sted) && /\b25\b/.test(i?.tekst) && /Tycho Brahe/.test(i?.tekst) && sætninger <= 5 && i.tekst.endsWith('?')
    && t.FORSIDE.spørgsmål === bogMed('tycho').spørgsmål && t.OPSLAG[0].slags === 'forside' && erW && Math.abs(st.kaph.y - st.segin.y) < 0.3
    && w.every((x) => st.ny.y > x.y + 2) && t.FORSIDE.kort.stjerner.length === 6 && t.FORSIDE.kort.alt,
    JSON.stringify({ sætninger, w: w.map((x) => x && [x.x.toFixed(1), x.y.toFixed(1)]), ny: st.ny && [st.ny.x.toFixed(1), st.ny.y.toFixed(1)] }));
}
// Tychos tur (T2, drejebogen afsnit 5, test 4): fem trin (trin 2 delt i to 20. november 2026) med kapitel og gæt i de
// tre sidste (svarene alene i rækken i "Jorden og Månen"), højst to sætninger i hver
// Så, ordene i Ordbogen, og himlen over Herrevad: højst ca. 82° og lavest ca. 30°, og spøgelset (lige så tæt på som
// Månen) er næsten en grad anderledes fra højt til lavt (Tycho: 58½′ med 52 jordradier)
{
  const fl = forløbMed(bogMed('tycho').forløb);
  const t = await bogMed('tycho').tekster();
  const sætn = (x) => (x?.match(/[.!?](\s|$)/g) ?? []).length;
  const fejlT = [];
  if (!fl || fl.del !== 'opdagelser' || fl.trin.map((x) => x.id).join() !== 'stjernen,tommel,parallakse,hoejt,falmer') fejlT.push('trinene');
  for (const x of fl?.trin ?? []) {
    if (!x.kapitel || !x.gør || sætn(x.så) > 2 || sætn(x.spørg) > 3) fejlT.push(`${x.id}: teksterne`);
    if (x.id !== 'stjernen' && x.id !== 'tommel' && !(x.gæt?.valg.length === 3 && x.gæt.valg.every((v) => v.svar))) fejlT.push(`${x.id}: gættet`);
    for (const o of x.ord ?? []) if (!ORDBOG.some((y) => y.id === o && y.kunI)) fejlT.push(`${x.id}: ordet ${o}`);
  }
  const trinMed = (id) => fl?.trin.find((x) => x.id === id);
  // Tommelfingeren forklarer parallakse (forskydning) første gang, og Jorden og Månen siger, hvad man skal kigge efter
  if (trinMed('tommel')?.gæt || !/parallakse \(forskydning\)/.test(trinMed('tommel')?.så) || !trinMed('tommel')?.ord.includes('parallakse')
    || !trinMed('parallakse')?.gæt?.alene || !/hopper ikke/.test(trinMed('parallakse')?.gør) || !/Flyt Tycho/.test(trinMed('parallakse')?.gør)) fejlT.push('tommelfingeren og Månen');
  if (!/langt bag Månen/.test(fl?.kernesætning) || !/7° 55′/.test(trinMed('hoejt')?.så) || /samme nat/.test(JSON.stringify(fl))) fejlT.push('kernesætningen eller 7° 55′');
  if (t.OPSLAG.find((o) => o.id === 'fortaelling')?.slags !== 'scene' || t.FRI.kapitler.length !== 4 || !t.VEJE.veje.find((v) => v.igen)) fejlT.push('opslaget');
  const op = t.måling(t.højestVed(t.NY_STJERNE)), ned = t.måling(t.højestVed(t.NY_STJERNE) + 180);
  const forskel = (op.spøgelse - ned.spøgelse) * 60;
  if (Math.abs(op.højde - 82) > 1 || Math.abs(ned.højde - 30.2) > 1 || t.grader(op.afstand) !== '7° 55′' || forskel < 45 || forskel > 65) fejlT.push(`himlen ${op.højde} ${ned.højde} ${forskel}`);
  if (t.MÅNEDER[0].navn !== 'november 1572' || !/1574/.test(t.MÅNEDER[t.MÅNED_MÅL].navn) || t.MÅNEDER.some((m, i) => i && m.mag < t.MÅNEDER[i - 1].mag)) fejlT.push('månederne');
  tjek('Tychos tur: fem trin (stjernen, tommelfingeren, Jorden og Månen, højt og lavt, stjernen falmer) med korte tekster og ordene i Ordbogen, og himlen over Herrevad giver 7° 55′ hele vejen og et spøgelse, der er næsten en grad anderledes',
    !fejlT.length, fejlT.join('; '));
}
// Tychos gåde, bogen og "Om Tycho" (T3, drejebogen afsnit 6-8, test 6): De tre cirkler med Tychos tal mødes inden for
// 10′ af resten af supernovaen, G og D mødes to steder på kortet, og kun det ene ligger på B's cirkel (det, man selv
// finder). Nutidens tal passer med udregningen, og vejene, siderne og "Om" hænger sammen (den røde tråd)
{
  const t = await bogMed('tycho').tekster();
  const st = (id) => t.CASSIOPEIA.find((x) => x.id === id);
  const c = Object.fromEntries(t.TYCHOS_TAL.map((x) => [x.tycho, [st(x.id), t.talGrader(x)]]));
  const møde = (a, b) => t.mødes(c[a][0], c[a][1], c[b][0], c[b][1]);
  const nær = (p) => t.afstand(p, t.NY_STJERNE) * 60;
  const ved = [['B', 'G'], ['B', 'D'], ['G', 'D']].map(([a, b]) => Math.min(...møde(a, b).map(nær)));
  const gd = møde('G', 'D');
  const påB = gd.map((p) => Math.abs(t.afstand(p, c.B[0]) - c.B[1]) * 60);
  const minutter = (txt) => { const [g, m] = txt.match(/\d+/g).map(Number); return g * 60 + m; };
  const iDag = t.TYCHOS_TAL.map((x) => Math.abs(t.afstand(st(x.id), t.NY_STJERNE) * 60 - minutter(x.iDag)));
  const rund = t.cirkel(st('gamma'), 5, 12).every((p) => Math.abs(t.afstand(p, st('gamma')) - 5) < 1e-6);
  const opslag = t.OPSLAG.map((o) => o.id).join();
  const ærligt = t.OM.ærligt.punkter.join(' ');
  tjek('Tychos gåde: de tre cirkler mødes inden for 10′ af supernovaens rest, G og D mødes to steder, og kun det ene ligger på Schedirs cirkel, og nutidens tal passer med udregningen',
    ved.every((m) => m < 10) && gd.length === 2 && påB.filter((m) => m < 10).length === 1 && påB.some((m) => m > 60) && iDag.every((m) => m <= 1) && rund
    && /Knudstrup/.test(t.GÅDE.forord.sted) && /komet/.test(t.GÅDE.forord.tekst),
    JSON.stringify({ ved, påB, iDag }));
  tjek('Tychos bog: forside, tur, gåde, bogen fra 1573 og "Om Tycho" i den rækkefølge, gåden er den vigtige vej, fire sider (aftenen, kortet, brevet og farven) og Gør det selv ved Hvid dværg, og Ærligt talt har turens snyd',
    opslag === 'forside,fortaelling,gaaden,bogen,om' && t.VEJE.veje.find((v) => v.primær)?.opslag === 'gaaden' && t.BOGEN.sider.map((x) => x.id).join() === 'a,b1b,brevet,d2'
    && t.BOGEN.linjer.rækker.every((x) => t.BOGEN.sider.some((y) => y.id === x.side)) && t.OM.knap.gaa === 'kosmos:hviddvaerg' && t.OM.knap.linje
    && t.OM.ekstra?.gaa === 'kosmos:betelgeuse' && /Betelgeuse ?$/.test(t.OM.ekstra.tekst) && /type Ia/.test(t.OM.ekstra.linje) && /kæmpestjerne/.test(t.OM.ekstra.linje) && /ingen ved/.test(t.OM.ekstra.linje) && (t.OM.ekstra.linje.match(/[.!?](\s|$)/g) ?? []).length === 1
    && /passer/.test(ærligt) && /Klostertaget/.test(ærligt) && /60 jordradier/.test(ærligt) && /21\. november/.test(ærligt) && /tredje tal/.test(ærligt)
    && CITATER.tycho?.bog?.id === 'tycho',
    opslag);
}
// "Om Einstein" og links begge veje (E5, drejebogen afsnit 10 og 12): bogens sidste opslag, Gør det selv i Rejsen i tid
// (dér er det "du", der flyver, og tvillingen bliver hjemme), Mileva Marić-linjen og turens snyd i Ærligt talt, og
// citatet og Stjerneovnen linker til opslaget om energien
{
  const t = await bogMed('einstein').tekster();
  const ærligt = t.OM.ærligt.punkter.join(' ');
  const html = readFileSync(PROJEKT + 'index.html', 'utf8');
  tjek('"Om Einstein": sidste opslag efter tyngden, 26 år og 38 milliontedele sekund, Rejsen i tid med dig og tvillingen, Mileva Marić og turens snyd i Ærligt talt, og citatet og Stjerneovnen linker til energien',
    t.OPSLAG.map((o) => o.id).join() === 'forside,fortaelling,tiden,energien,tyngden,om' && t.LIGNINGER.tyngden.videre === 'Havde han ret?'
    && t.OM.tal[0].tal === '26 år' && /^38 /.test(t.OM.tal[1].tal) && t.OM.knap.gaa === 'kosmos:tid' && /dig/.test(t.OM.knap.linje) && /tvilling/.test(t.OM.knap.linje) && /904/.test(t.OM.knap.linje)
    && /Mileva Marić/.test(ærligt) && /målte ikke selv/.test(ærligt) && /10 millioner/.test(ærligt) && /6 millioner km/.test(ærligt) && !/fysikeren Mileva/.test(ærligt)
    && CITATER.einsteinEnergi?.bog?.id === 'einstein:energien' && html.includes('data-gaa="opdagelser:einstein:energien"'));
}
tjek('skriften og licensen ligger i fonts/', existsSync(PROJEKT + 'fonts/atomlab-fell.woff2') && existsSync(PROJEKT + 'fonts/OFL.txt'));

// Einsteins forside (E1, docs/drejebog-einstein.md afsnit 3, 4 og 11): spørgsmålet er bogens røde tråd, introduktionen
// (Bern 1905, 26 år, de to regler, højst fem sætninger og et spørgsmål til sidst), vignetten (uret viser 7 som Einsteins
// tog på s. 893, bogstaverne t og V), portrættet og skriften med licensen og kilden
{
  const e = bogMed('einstein');
  const t = await e.tekster();
  const i = t.FORSIDE.intro;
  const sætninger = (i?.tekst.match(/[.!?](\s|$)/g) ?? []).length;
  const læs = (f) => (existsSync(PROJEKT + f) ? readFileSync(PROJEKT + f, 'utf8') : '');
  tjek('Einsteins forside: spørgsmålet "Hvad sker der, når lyset er lige hurtigt for alle?", introduktionen (Bern 1905, 26 år, de to regler, højst fem sætninger, slutter med et spørgsmål) og vignetten med uret på 7, t og V',
    e.spørgsmål === 'Hvad sker der, når lyset er lige hurtigt for alle?' && t.FORSIDE.spørgsmål === e.spørgsmål && /Bern/.test(i?.sted) && /1905/.test(i?.sted)
    && /\b26\b/.test(i?.tekst) && /Albert Einstein/.test(i?.tekst) && /tomme rum/.test(i?.tekst) && /jævnt/.test(i?.tekst) && sætninger <= 5 && i.tekst.endsWith('?')
    && t.FORSIDE.vignet?.klokken === 7 && t.FORSIDE.vignet.tid === 't' && t.FORSIDE.vignet.lys === 'V' && t.FORSIDE.vignet.alt && /omkring 42/.test(t.FORSIDE.portrætTekst)
    && t.OPSLAG[0].slags === 'forside',
    JSON.stringify({ sætninger }));
  tjek('Einsteins bog: ryggen er bordeaux med sølv, skriften er Old Standard (almindelig og kursiv, OFL), og portrættet og skriften står i KILDER.md',
    e.stil.ryg === '#4a1f2a' && e.stil.rygKant === '#b8b8b8' && /AtomLab Old Standard/.test(e.stil.skrift)
    && ['fonts/atomlab-oldstandard.woff2', 'fonts/atomlab-oldstandard-kursiv.woff2'].every((f) => existsSync(PROJEKT + f))
    && /Old Standard Project Authors/.test(læs('fonts/OFL.txt')) && /atomlab-oldstandard\.woff2/.test(læs('fonts/KILDER.md'))
    && /`einstein\.webp`.*Schmutzer/.test(læs('billeder/biblioteket/KILDER.md')));
}

// Einsteins tur (E2, drejebogen afsnit 5, test 4): fire trin med kapitel, gæt i de tre sidste (ét rigtigt hver), højst to
// sætninger i Så, ordene i Ordbogen (kun i forløbets linje), og regnestykkerne bag turen: 9,9 af 20 sekunder ved 87 %,
// 4 milliardtedele gram, over 4 millioner ton i sekundet for Solen, +45 − 7 = 38 ved GPS-højden (bagud ved rumstationen)
// og ca. 10 km fejl om dagen. "Det så du" har ligningerne som den vigtige vej (vises først, når E3 har bygget opslaget)
{
  const e = bogMed('einstein');
  const t = await e.tekster();
  const fl = forløbMed(e.forløb);
  const fejlE = [];
  if (!fl || fl.del !== 'opdagelser' || !forløbI('opdagelser').includes(fl)) fejlE.push('forløbet');
  if (fl?.trin.map((x) => x.id).join() !== 'toget,rundtur,vaegten,gps') fejlE.push('trinene');
  for (const x of fl?.trin ?? []) {
    if (!x.kapitel || !x.spørg || !x.gør || !x.så) fejlE.push(`${x.id}: teksterne`);
    if ((x.så.replace(/\bca\. /g, 'ca ').match(/[.!?](\s|$)/g) ?? []).length > 2) fejlE.push(`${x.id}: Så er over to sætninger`);
    if (x.gæt && (x.gæt.valg.length !== 3 || x.gæt.valg.filter((v) => v.svar === 'Rigtigt gættet!').length !== 1 || x.gæt.valg.some((v) => v.tekst.length > 22))) fejlE.push(`${x.id}: gættet`);
    for (const o of x.ord) {
      const ord = ORDBOG.find((y) => y.id === o);
      if (!ord || ord.kunI !== '.fl-tekst' || ord.tekst.length > 260 || !ord.former.some((f) => `${x.spørg} ${x.så}`.toLowerCase().includes(f))) fejlE.push(`${x.id}: ordet ${o}`);
    }
  }
  if ((fl?.trin.filter((x) => x.gæt).length ?? 0) !== 3 || fl?.trin[0].gæt) fejlE.push('gæt i de tre sidste trin');
  if (!/GPS/.test(fl?.kernesætning) || !/E = mc²/.test(fl?.kernesætning) || /intet kan/i.test(fl?.kernesætning)) fejlE.push('kernesætningen');
  if (/stikkontakt/.test(fl?.trin[2].spørg) || !/Lys og varme/.test(fl?.trin[2].spørg) || !/batteri/i.test(fl?.trin[2].spørg)) fejlE.push('batteriet (fælden med lampen i stikkontakten)');
  const tal = {
    lys: t.dansk(t.LYSETS_FART_KMT / 1e6), ur: t.dansk(t.egentid(t.HJEMME, 0.87), 1), gram: t.småGram(t.massetab() * 1000),
    sol: t.solensTabTon() / 1e6, gps: t.gpsTal(t.GPS_HØJDE), lav: t.gpsTal(t.RUMSTATIONEN).iAlt, km: t.gpsFejlKm(),
    lige: Math.abs(t.gpsUr(3200).iAlt) < 0.5,
  };
  if (tal.lys !== '1.079' || tal.ur !== '9,9' || tal.gram !== '0,000 000 004' || !(tal.sol > 4 && tal.sol < 4.4)) fejlE.push('turens tal');
  if (tal.gps.højde !== 45 || tal.gps.fart !== 7 || tal.gps.iAlt !== 38 || tal.lav >= 0 || !(tal.km > 10 && tal.km < 12) || !tal.lige) fejlE.push('GPS-tallene');
  if (t.OPSLAG.map((o) => o.id).join() !== 'forside,fortaelling,tiden,energien,tyngden,om' || t.OPSLAG[1].slags !== 'scene') fejlE.push('opslagene');
  if (t.VEJE.veje[0].opslag !== 'tiden' || !t.VEJE.veje[0].primær || t.VEJE.veje.length !== 3 || t.VEJE.veje[1].fænomen?.join() !== 'kosmos,tid') fejlE.push('vejene');
  if (t.FRI.kapitler.map((k) => k.id).join() !== 'toget,rundtur,vaegten,gps') fejlE.push('laboratoriet');
  tjek('Einsteins tur: fire trin (toget, rundturen, batteriet og GPS-uret) med kapitel og gæt i de tre sidste, ordene i Ordbogen, og tallene: 9,9 af 20 sekunder, 4 milliardtedele gram, +45 − 7 = 38 og ca. 10 km',
    !fejlE.length, `${fejlE.join('; ')} ${JSON.stringify(tal)}`);
}

// Einsteins ligning om tiden (E3, drejebogen afsnit 7): "Regn selv" giver 4,32 s pr. døgn ved 1 % (den lette udgave, og
// 4,3201 med den rigtige), 0,38 mod 0,51 ved 87 %, og 0,000 000 000 37 s ved 100 km/t. Svaret blandt valgene er det
// regnede. Siden er sat linje for linje (33 linjer og tre formler), stederne er linje 9-12 og 27-33, og "Det så du"
// spørger "Men hvordan skrev han det?"
{
  const t = await bogMed('einstein').tekster();
  const L = t.LIGNINGER.tiden;
  const læs = (f) => (existsSync(PROJEKT + f) ? readFileSync(PROJEKT + f, 'utf8') : '');
  const fejlL = [];
  const døgn = t.bagudPrDøgn(L.regn.β), rigtig = t.bagudPrDøgn(L.regn.β, false);
  if (Math.abs(døgn - 4.32) > 0.0005 || Math.abs(rigtig - 4.3201) > 0.0001) fejlL.push(`døgnet: ${døgn} og ${rigtig}`);
  if (t.dansk(t.bagudLet(0.87), 2) !== '0,38' || t.dansk(t.bagudRigtig(0.87), 2) !== '0,51') fejlL.push('87 %');
  if (t.småGram(t.bagudPrDøgn(100 / 3.6 / t.LYSETS_FART), 11) !== '0,000 000 000 37') fejlL.push('100 km/t');
  if (L.regn.valg.find((v) => v.rigtig)?.tekst !== `${t.dansk(døgn, 1)} sekunder` || !L.regn.nørd.tekst.includes('0,38') || !L.regn.nørd.tekst.includes('0,51')) fejlL.push('svaret og nørd-teksten');
  if (!/9,9\.$/.test(t.ledForLedEksempel())) fejlL.push('led for led: uret fra turen');
  const tekst = L.side.linjer.filter((l) => !l.f);
  const linjeNr = (id) => tekst.map((l, i) => (l.sted === id ? i + 1 : 0)).filter(Boolean);
  if (tekst.length !== 33 || L.side.linjer.filter((l) => l.f).length !== 3) fejlL.push('linjerne på s. 904');
  if (linjeNr('formlen').join() !== '9,10,11,12' || linjeNr('rundturen').join() !== '27,28,29,30,31,32,33') fejlL.push('stedernes linjer');
  if (L.ligning.led.map((x) => x.id).join() !== 't,tau,v,V,brok,kvadrat,enminus,rod' || !L.ligning.led.find((x) => x.id === 'V').idag) fejlL.push('led for led');
  if (t.VEJE.sætning !== 'Men hvordan skrev han det?' || t.VEJE.veje[0].opslag !== 'tiden') fejlL.push('"Det så du"');
  if (!/`einstein-s904\.webp`/.test(læs('billeder/biblioteket/KILDER.md')) || !/`einstein-s641\.webp`/.test(læs('billeder/biblioteket/KILDER.md')) || !existsSync(PROJEKT + 'billeder/biblioteket/einstein-s641.webp')) fejlL.push('KILDER.md og s. 641');
  tjek('Einsteins ligning om tiden: 4,32 s om dagen ved 1 % af lysets fart, 0,38 mod 0,51 ved 87 %, s. 904 sat linje for linje med stederne i linje 9-12 og 27-33, led for led i drejebogens orden, og "Men hvordan skrev han det?"',
    !fejlL.length, fejlL.join('; '));
}
// Einsteins energi og tyngde (E4, drejebogen afsnit 8 og 9): "Regn selv" 2 giver 4,0 · 10⁻¹² kg for lampens time (og 4 · 10⁻⁹ g
// med Einsteins egne tal) og 4,3 · 10⁹ kg/s for Solen, "Regn selv" 3 giver 16, 6 og 10. Siderne er sat linje for linje (s. 641:
// 29 linjer og fire formler, stederne i linje 12-21 og 22-24, s. 845: 21 linjer og ti formler, stederne i linje 1-2 og 9-10),
// led for led i drejebogens orden, s. 845 står i KILDER.md, ordene masse og feltligning er i Ordbogen, og kernesætningen har
// fået sin sidste sætning
{
  const t = await bogMed('einstein').tekster();
  const E = t.LIGNINGER.energien, G = t.LIGNINGER.tyngden;
  const læs = (f) => (existsSync(PROJEKT + f) ? readFileSync(PROJEKT + f, 'utf8') : '');
  const fejl4 = [];
  if (Math.abs(t.massetab() - 4.0e-12) > 0.01e-12) fejl4.push(`lampen: ${t.massetab()}`);
  if (Math.abs(t.einsteinsGram(t.massetab() * t.LYSETS_FART ** 2 * t.ERG_PR_JOULE) - 4.0e-9) > 0.01e-9 || t.einsteinsGram(3.6e12) !== 4e-9) fejl4.push('Einsteins egne tal');
  const sol = t.SOLEN_W / t.LYSETS_FART ** 2;
  if (Math.abs(sol - 4.26e9) > 0.01e9 || !/4,3 milliarder kg/.test(E.regn.efter.res) || !/over 4 millioner ton/.test(E.regn.efter.res)) fejl4.push(`Solen: ${sol}`);
  if (E.regn.valg.find((v) => v.rigtig)?.tekst !== '4 milliardtedele gram' || !E.regn.trin[1].res.endsWith('0,000 000 000 004 kg')) fejl4.push('svaret i "Hvor meget lettere?"');
  if (!/28\.500 år/.test(t.energiEksempel(0.001)) || !/28 millioner år/.test(t.energiEksempel(1)) || !/i en time/.test(t.energiEksempel(t.massetab()))) fejl4.push('E = mc² med de tre masser');
  if (t.felterIAlt() !== 16 || t.dobbelte() !== 6 || t.forskellige() !== 10 || G.regn.valg.find((v) => v.rigtig)?.tekst !== '10' || !/zehn Gleichungen/.test(G.regn.svar) || G.regn.skema?.n !== 4) fejl4.push('16, 6 og 10');
  const nr = (L, id) => L.side.linjer.filter((l) => !l.f).map((l, i) => (l.sted === id ? i + 1 : 0)).filter(Boolean).join();
  if (E.side.linjer.filter((l) => !l.f).length !== 29 || E.side.linjer.filter((l) => l.f).length !== 4 || nr(E, 'massen') !== '12,13,14,15,16,17,18,19,20,21' || nr(E, 'radium') !== '22,23,24') fejl4.push('linjerne på s. 641');
  if (G.side.linjer.filter((l) => !l.f).length !== 21 || G.side.linjer.filter((l) => l.f).length !== 10 || nr(G, 'ti') !== '1,2' || nr(G, 'stof') !== '9,10'
    || G.side.linjer.filter((l) => l.f).map((l) => l.nr).join() !== '(2),(3),(3a),(4),(2a),(5),(6),(3a),(7),(7a)') fejl4.push('linjerne på s. 845');
  if (E.ligning.led.map((x) => x.id).join() !== 'L,V2,brok,masse,tal' || G.ligning.led.map((x) => x.id).join() !== 'g,G,im,kappa,T,halv,lig') fejl4.push('led for led');
  if (!/`einstein-s845\.webp`/.test(læs('billeder/biblioteket/KILDER.md')) || !/SitzungsberichtePreussAkad19152/.test(læs('billeder/biblioteket/KILDER.md'))) fejl4.push('KILDER.md');
  if (!ORDBOG.some((o) => o.id === 'masse' && /træg|sætte i gang/.test(o.tekst)) || !ORDBOG.some((o) => o.id === 'feltligning') || ORDBOG.some((o) => ['masse', 'feltligning'].includes(o.id) && o.tekst.length > 260)) fejl4.push('Ordbogen');
  if (!/egne sider\.$/.test(forløbMed('lige-hurtigt')?.kernesætning ?? '')) fejl4.push('kernesætningen');
  if (/stikkontakt/.test(E.regn.intro) || !/batteri/i.test(E.regn.intro) || !/lys og varme/.test(E.regn.intro)) fejl4.push('fælden med lampen');
  tjek('Einsteins energi og tyngde: 4,0 · 10⁻¹² kg for lampens time (4 · 10⁻⁹ g med Einsteins tal), 4,3 milliarder kg i sekundet for Solen, 16, 6 og 10, s. 641 og s. 845 sat linje for linje med stederne, led for led, KILDER.md, Ordbogen og kernesætningen',
    !fejl4.length, fejl4.join('; '));
}
// Rømers forside (R1, docs/drejebog-roemer.md afsnit 3, 4 og 11): spørgsmålet er bogens røde tråd, introduktionen (Paris
// 1676, Io, 10 minutter, højst fem sætninger og et spørgsmål til sidst, ikke 16. november), vignetten med de fire måner
// (hver tættere på end sin bane, Io er den inderste og har navn), den grønne ryg og portrættet i KILDER.md
{
  const r = bogMed('roemer');
  const t = await r.tekster();
  const i = t.FORSIDE.intro;
  const k = t.FORSIDE.kikkert;
  const sætninger = (i?.tekst.match(/[.!?](\s|$)/g) ?? []).length;
  const læs = (f) => (existsSync(PROJEKT + f) ? readFileSync(PROJEKT + f, 'utf8') : '');
  const inderst = Object.entries(t.BANE_RADIUS).sort((a, c) => a[1] - c[1])[0][0];
  tjek('Rømers forside: spørgsmålet "Hvorfor kom Io for sent?", introduktionen (Paris 1676, Io, 10 minutter, højst fem sætninger, slutter med et spørgsmål) og de fire måner, der kan stå sådan (Io inderst og med navn)',
    r.spørgsmål === 'Hvorfor kom Io for sent?' && t.FORSIDE.spørgsmål === r.spørgsmål && /Paris/.test(i?.sted) && /1676/.test(i?.sted)
    && /Ole Rømer/.test(i?.tekst) && /\bIo\b/.test(i?.tekst) && /10 minutter/.test(i?.tekst) && !/16\. november/.test(i?.tekst) && sætninger <= 5 && i.tekst.endsWith('?')
    && k?.måner?.length === 4 && k.måner.every((m) => Math.abs(m.x) < t.BANE_RADIUS[m.navn]) && inderst === 'Io' && k.navn === 'Io' && k.alt
    && /omkring 56/.test(t.FORSIDE.portrætTekst) && t.FORSIDE.liv === '1644-1710' && t.OPSLAG[0].slags === 'forside',
    JSON.stringify({ sætninger, inderst }));
  tjek('Rømers bog: ryggen er flaskegrøn med guld, skriften er Fell, og Conings portræt står i KILDER.md og lav_portraet.py',
    r.stil.ryg === '#23402f' && r.stil.rygKant === '#c9a24a' && /AtomLab Fell/.test(r.stil.skrift) && r.titel === 'Himlens ur'
    && /`roemer\.webp`.*Coning/.test(læs('billeder/biblioteket/KILDER.md')) && /'roemer':/.test(læs('billeder/biblioteket/lav_portraet.py')));
}
// Rømers tur (R2, drejebogen afsnit 5, test 4): fire trin med kapitel og gæt i de tre sidste (det rigtige ikke samme sted),
// højst to sætninger i hver Så og tre i hvert Spørg, ordet formørkelse i Ordbogen, kernesætning A, og ingen af fælderne
// (16. november, "Rømer så"). Tallene: Lyset er ca. 36 minutter om vejen 14. august og 46 den 9. november (Horizons), Io
// kommer ca. 10 minutter for sent i november og lidt for tidligt ved oppositionen, Jupiter kan ikke ses i januar, og Io går
// ind i skyggen ca. én Jupiter-radius fra kanten
{
  const fl = forløbMed(bogMed('roemer').forløb);
  const t = await bogMed('roemer').tekster();
  // "ca." og "9." (datoen) er ikke slutningen på en sætning
  const sætn = (x) => ((x ?? '').replace(/\b(ca|fx)\. /g, '').replace(/\d\. /g, '').match(/[.!?](\s|$)/g) ?? []).length;
  const fejlR = [];
  if (!fl || fl.del !== 'opdagelser' || fl.trin.map((x) => x.id).join() !== 'skyggen,sent,hvorfor,november') fejlR.push('trinene');
  const rigtige = [];
  for (const x of fl?.trin ?? []) {
    if (!x.kapitel || !x.gør || !x.så || sætn(x.så) > 2 || sætn(x.spørg) > 3) fejlR.push(`${x.id}: teksterne`);
    if (x.id !== 'skyggen') {
      if (!(x.gæt?.valg.length === 3 && x.gæt.valg.every((v) => v.svar) && x.gæt.valg.filter((v) => v.svar === 'Rigtigt gættet!').length === 1)) fejlR.push(`${x.id}: gættet`);
      else rigtige.push(x.gæt.valg.findIndex((v) => v.svar === 'Rigtigt gættet!'));
    }
    for (const o of x.ord ?? []) if (!ORDBOG.some((y) => y.id === o && y.kunI)) fejlR.push(`${x.id}: ordet ${o}`);
  }
  if (new Set(rigtige).size < 2) fejlR.push('det rigtige gæt står samme sted');
  const alt = JSON.stringify(fl);
  if (!/Lyset bruger altså tid/.test(fl?.kernesætning) || !/selv set Io/.test(fl?.kernesætning) || /16\. november/.test(alt) || /Rømer (så|kigger)/.test(alt)
    || !fl.trin[0].ord.includes('formoerkelse') || !/42½ time/.test(fl.trin[0].så) || !/lidt over halv seks/i.test(fl.trin[3].så)) fejlR.push('kernesætningen eller fælderne');
  if (t.OPSLAG.find((o) => o.id === 'fortaelling')?.slags !== 'scene' || t.FRI.kapitler.length !== 4 || !t.VEJE.veje.find((v) => v.igen) || !t.VEJE.veje.find((v) => v.primær)?.opslag) fejlR.push('opslaget');
  const aug = t.lysMinutter(t.AUGUST), nov = t.lysMinutter(t.NOVEMBER), sent = t.forsinkelse(t.NOVEMBER);
  if (Math.round(aug) !== 36 || Math.round(nov) !== 46 || Math.abs(sent - 10) > 0.4 || t.forsinkelse(t.OPPOSITION) >= 0 || !t.kanSes(t.NOVEMBER) || t.kanSes(236)
    || t.datoTekst(t.NOVEMBER) !== '9. november 1676' || t.datoTekst(t.AUGUST) !== '14. august 1676' || t.datoTekst(t.OPPOSITION) !== '9. juli 1676'
    || t.klokken(t.NOV_SET) !== '17.35.45' || t.NOV_SET - t.NOV_TABEL !== 10 || t.minutTekst(sent) !== '10 minutter') fejlR.push(`tallene ${aug} ${nov} ${sent}`);
  const ind = t.skyggeKant(t.SKYGGE_VINKEL, true), før = t.ioSted(ind - 0.01, t.SKYGGE_VINKEL), efter = t.ioSted(ind + 0.01, t.SKYGGE_VINKEL);
  if (!før.synlig || !efter.iSkygge || før.x < 1.5 || før.x > 2.5 || Math.abs(t.IO_OMLØB - 42.5) > 0.1) fejlR.push(`skyggen ${før.x}`);
  const ord = ORDBOG.find((y) => y.id === 'formoerkelse');
  if (!ord || ord.kunI !== '.fl-tekst' || ord.tekst.length > 260 || !ord.former.includes('formørkelse')) fejlR.push('Ordbogen');
  tjek('Rømers tur: fire trin (Io i skyggen, for tidligt og for sent, hvorfor, 9. november) med korte tekster, kernesætning A og ordet formørkelse, og Horizons giver 36 og 46 minutter og 10 minutter for sent',
    !fejlR.length, fejlR.join('; '));
}
// Rømers gåde, tidsskriftet og "Om Rømer" (R3, drejebogen afsnit 6-9, test 6): perlerne er 36 i august og 46 den 9.
// november (Horizons), de nye er 10, og hele Jordens bane fra H til E er 16,6 minutter. Tidsskriftet har fire sider med seks
// steder, og listen er på latin. "Om Rømer" sender til Jupiter → Månerne, og fælderne står ikke i teksterne (16. november,
// "Rømer så", "målte lysets fart", "den første, der tænkte"). Einsteins "1905: Tiden" og Jupiters måner har links til bogen
{
  const t = await bogMed('roemer').tekster();
  const e = await bogMed('einstein').tekster();
  const læs = (f) => (existsSync(PROJEKT + f) ? readFileSync(PROJEKT + f, 'utf8') : '');
  const fejlR = [];
  if (t.OPSLAG.map((o) => o.id).join() !== 'forside,fortaelling,gaaden,tidsskriftet,om') fejlR.push('opslagene');
  if (t.PERLER.august !== 36 || t.PERLER.november !== 46 || t.PERLER.nye !== 10 || Math.abs(t.HELE_BANEN - 16.6) > 0.05 || Math.round(t.FORSKEL_MIO_KM) !== 181
    || Math.abs(t.MINUT_KM / 1e6 - 18) > 0.05 || Math.abs(t.tegnetMinutter(180) - t.tegnetMinutter(0) - t.HELE_BANEN) > 0.01) fejlR.push(`perlerne ${t.PERLER.august} ${t.PERLER.november} ${t.HELE_BANEN}`);
  if (!t.GÅDE.linjer.aug.includes(`${t.PERLER.august} minutter`) || !/^10 minutter, som Rømer sagde/.test(t.GÅDE.linjer.løst1) || !/^16½ minut/.test(t.GÅDE.linjer.løst)
    || !t.GÅDE.linjer.løst1Under.includes('181 millioner km') || !/18 millioner km/.test(t.GÅDE.forord.tekst) || !/22 minutter/.test(t.GÅDE.forord.tekst)
    || t.BOGSTAVER.map((x) => x.navn).join('') !== 'HLKEFG') fejlR.push('gådens tekster');
  const sider = t.BOGEN.sider;
  if (sider.map((x) => x.id).join() !== 's893,fig11,s894,liste' || sider.flatMap((x) => x.steder).length !== 6 || t.BOGEN.sprog !== 'en' || t.BOGEN.sidst !== 'Men troede de ham?'
    || sider.at(-1).steder[0].sprog !== 'la' || !/5\.35\.45/.test(sider.at(-1).steder[0].dansk) || !t.BOGEN.linjer.rækker.every((r) => sider.some((x) => x.id === r.side))) fejlR.push('tidsskriftet');
  const kilder = læs('billeder/biblioteket/KILDER.md');
  if (!sider.every((x) => kilder.includes(x.fil.split('/').pop())) || !/'roemer':/.test(læs('billeder/biblioteket/lav_bogsider.py'))) fejlR.push('KILDER.md eller lav_bogsider.py');
  if (t.OM.knap.gaa !== 'solsystem:jupiter:maaner' || !/Rundetårn/.test(t.OM.hvorfor[3].svar) || !/Uranienborg/.test(t.OM.hvorfor[0].svar) || !/Huygens/.test(t.OM.hvorfor[1].svar)) fejlR.push('"Om Rømer"');
  const alt = JSON.stringify([t.GÅDE, t.BOGEN.intro, t.BOGEN.sider.map((x) => [x.om, x.steder.map((y) => y.dansk)]), t.OM]);
  if (/16\. november/.test(alt) || /Rømer (så|kiggede) selv/.test(alt) || /Rømer målte lysets fart/.test(alt) || /første, der tænkte/.test(alt)) fejlR.push('en fælde');
  const nørd = e.LIGNINGER.tiden.nørd.punkter.find((x) => typeof x === 'object');
  if (nørd?.gaa !== 'opdagelser:roemer' || !/Rømer/.test(nørd.tekst)) fejlR.push('Einsteins link');
  const { SIDER: JUPITER } = await import('../js/data/sider/jupiter.js');
  if (!JUPITER.maaner.emner.some((x) => /lyset bruger tid/.test(x.titel) && /data-gaa="opdagelser:roemer"/.test(x.tekst))) fejlR.push('kortet ved Jupiters måner');
  tjek('Rømers gåde, tidsskriftet og "Om Rømer": 36 og 46 perler (10 nye) og 16,6 minutter for hele banen, fire sider med seks steder, Gør det selv ved Jupiters måner og links fra Einstein og Jupiter',
    !fejlR.length, fejlR.join('; '));
}
// ---------- I browseren ----------
const b = await chromium.launch({ args: ARGS });
const fejl = [];
const nySide = async (opsætning, hash) => {
  const ctx = await b.newContext(opsætning);
  const page = await ctx.newPage();
  page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') fejl.push('error: ' + m.text()); });
  await page.goto(`${ADRESSE}/?test${hash}`);
  await page.waitForFunction(() => window.atomlabTest, null, { timeout: 20000 });
  return { page, ctx };
};
const vent = (page, f, a, ms = 8000) => page.waitForFunction(f, a, { timeout: ms }).then(() => true, () => false);
const påHylden = () => window.atomlabTest?.opdagelser && !document.getElementById('opdHyldeSide').hidden && document.querySelector('#opdagelser:not(.skjult)');

// Fra menuen: delen hentes først, når den åbnes, og hylden har alle ti
{
  const { page, ctx } = await nySide({ viewport: { width: 1280, height: 800 } }, '');
  const førHentet = await page.evaluate(() => atomlabTest.hentet('opdagelser'));
  await page.evaluate(() => { location.hash = '#opdagelser'; });
  const hylde = await vent(page, påHylden, null, 15000);
  const ryg = await page.evaluate(() => atomlabTest.opdagelser.hylde());
  tjek('fra menuen: hentes først, når delen åbnes, og hylden har Tycho, Huygens, Rømer og Einstein med omslaget frem og kun to grå rygge (Ørsted og Curie)',
    !førHentet && hylde && ryg.map((r) => r.id).join() === 'tycho,huygens,roemer,oersted,curie,einstein' && ryg.filter((r) => r.bygget).map((r) => r.id).join() === 'tycho,huygens,roemer,einstein', JSON.stringify(ryg));
  // Omslagene: titlen og navnet står inden for omslaget (Tychos titel fylder to linjer, T1)
  const omslag = await page.evaluate(() => [...document.querySelectorAll('#opdHylde .opd-omslag')].every((o) => {
    const r = o.getBoundingClientRect();
    return [...o.querySelectorAll('.opd-omslag-titel, .opd-omslag-navn, img')].every((e) => { const x = e.getBoundingClientRect(); return x.top >= r.top - 0.5 && x.bottom <= r.bottom + 0.5 && x.height > 0; });
  }));
  tjek('omslagene: titel, navn og portræt står inden for omslaget', omslag);
  // Tychos omslag åbner forsiden med portrættet, spørgsmålet og W'et. Bogen har kun forsiden, så "Begynd" er der ikke (A9)
  await page.click('#opdHylde [data-bog="tycho"]');
  const tychoÅben = await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'forside' && document.getElementById('opdBog').dataset.bog === 'tycho');
  const tycho = await page.evaluate(() => ({
    titel: document.querySelector('#opdBog .bog-titel')?.textContent,
    portræt: document.querySelector('#opdBog .bog-portræt img')?.getAttribute('src'),
    stjerner: document.querySelectorAll('#opdBog .bog-kort .bog-træsnit polygon').length,
    begynd: !!document.querySelector('#opdBog .bog-begynd'),
    antal: atomlabTest.opdagelser.vist().antal,
    ryg: document.querySelector('#opdHylde [data-bog="tycho"]')?.style.getPropertyValue('--ryg'),
  }));
  tjek('Tychos omslag åbner forsiden med spørgsmålet, de Gheyns portræt og W\'et med seks stjerner, og uden "Begynd", når der kun er forsiden',
    tychoÅben && tycho.titel === 'Hvor kom den nye stjerne fra?' && tycho.portræt?.endsWith('tycho.webp') && tycho.stjerner === 6 && tycho.begynd === (tycho.antal > 1) && tycho.ryg === '#1c2a44', JSON.stringify(tycho));
  await page.keyboard.press('Escape');
  await vent(page, påHylden);
  // Einsteins omslag (E1) åbner forsiden med spørgsmålet, Schmutzers portræt, vignetten (to visere, sekundviseren og
  // lysglimtet) og skriften Old Standard. Bogen har kun forsiden, så "Begynd" er der ikke (A9)
  await page.click('#opdHylde [data-bog="einstein"]');
  const einsteinÅben = await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'forside' && document.getElementById('opdBog').dataset.bog === 'einstein');
  await page.evaluate(() => document.fonts.ready);
  const einstein = await page.evaluate(() => ({
    titel: document.querySelector('#opdBog .bog-titel')?.textContent,
    portræt: document.querySelector('#opdBog .bog-portræt img')?.getAttribute('src'),
    visere: document.querySelectorAll('#opdBog .bog-vignet .bog-vignet-viser').length,
    glimt: !!document.querySelector('#opdBog .bog-vignet .bog-vignet-glimt') && !!document.querySelector('#opdBog .bog-vignet .bog-vignet-sekund'),
    tal: document.querySelectorAll('#opdBog .bog-vignet .bog-vignet-tal text').length,
    begynd: !!document.querySelector('#opdBog .bog-begynd'),
    bevæger: ['glimt', 'sekund', 'flamme'].every((k) => document.querySelector(`#opdBog .bog-vignet-${k}`)?.getAnimations().length === 1),
    antal: atomlabTest.opdagelser.vist().antal,
    skrift: document.fonts.check('40px "AtomLab Old Standard"') && [...document.fonts].some((f) => f.family.includes('AtomLab Old Standard') && f.style === 'italic' && f.status === 'loaded'),
    ryg: document.querySelector('#opdHylde [data-bog="einstein"]')?.style.getPropertyValue('--ryg'),
    titelLinjer: Math.round(document.querySelector('#opdBog .bog-titel').getBoundingClientRect().height / parseFloat(getComputedStyle(document.querySelector('#opdBog .bog-titel')).lineHeight)),
  }));
  tjek('Einsteins omslag åbner forsiden med spørgsmålet (to linjer på pc), Schmutzers portræt, lommeuret med to visere, sekundviseren, 11 romertal og lysglimtet (glimtet, lampen og sekundviseren bevæger sig), skriften Old Standard, og uden "Begynd", når der kun er forsiden',
    einsteinÅben && einstein.titel === 'Hvad sker der, når lyset er lige hurtigt for alle?' && einstein.portræt?.endsWith('einstein.webp') && einstein.visere === 2 && einstein.glimt
    && einstein.tal === 11 && einstein.bevæger && einstein.begynd === (einstein.antal > 1) && einstein.skrift && einstein.ryg === '#4a1f2a' && einstein.titelLinjer <= 2, JSON.stringify(einstein));
  await page.keyboard.press('Escape');
  await vent(page, påHylden);
  // Rømers omslag (R1) åbner forsiden med spørgsmålet, Conings portræt og kikkerten med Jupiter, fire måner og navnet Io.
  // Bogen har kun forsiden, så "Begynd" er der ikke (A9)
  await page.click('#opdHylde [data-bog="roemer"]');
  const roemerÅben = await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'forside' && document.getElementById('opdBog').dataset.bog === 'roemer');
  const roemer = await page.evaluate(() => ({
    titel: document.querySelector('#opdBog .bog-titel')?.textContent,
    portræt: document.querySelector('#opdBog .bog-portræt img')?.getAttribute('src'),
    jupiter: !!document.querySelector('#opdBog .bog-kikkert .bog-kikkert-jupiter'),
    måner: document.querySelectorAll('#opdBog .bog-kikkert .bog-kikkert-måne').length,
    navn: document.querySelector('#opdBog .bog-kikkert .bog-kikkert-navn')?.textContent,
    begynd: !!document.querySelector('#opdBog .bog-begynd'),
    antal: atomlabTest.opdagelser.vist().antal,
    ryg: document.querySelector('#opdHylde [data-bog="roemer"]')?.style.getPropertyValue('--ryg'),
  }));
  tjek('Rømers omslag åbner forsiden med spørgsmålet, Conings portræt og kikkerten med Jupiter, fire måner og navnet Io, og uden "Begynd", når der kun er forsiden',
    roemerÅben && roemer.titel === 'Hvorfor kom Io for sent?' && roemer.portræt?.endsWith('roemer.webp') && roemer.jupiter && roemer.måner === 4 && roemer.navn === 'Io'
    && roemer.begynd === (roemer.antal > 1) && roemer.ryg === '#23402f', JSON.stringify(roemer));
  await page.keyboard.press('Escape');
  await vent(page, påHylden);
  // En grå ryg åbner ingen bog, men stiller bogens spørgsmål
  await page.click('#opdHylde [data-bog="oersted"]');
  const linje = await page.textContent('#opdLinje');
  tjek('en grå ryg stiller sit spørgsmål og åbner ingen bog', linje === rygLinje(bogMed('oersted')) && linje.endsWith('?') && (await page.evaluate(() => atomlabTest.opdagelser.vist())) === null, linje);
  // Huygens' omslag åbner forsiden
  await page.click('#opdHylde [data-bog="huygens"]');
  const åben = await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'forside');
  const forside = await page.evaluate(() => ({
    titel: document.querySelector('#opdBog .bog-titel')?.textContent,
    portræt: document.querySelector('#opdBog .bog-portræt img')?.getAttribute('src'),
    begynd: !!document.querySelector('#opdBog .bog-begynd'),
    hylde: !document.getElementById('opdHyldeSide').hidden,
  }));
  tjek('omslaget åbner forsiden med spørgsmålet, portrættet og "Begynd", og hylden er væk (én ting ad gangen)',
    åben && forside.titel === 'Hvorfor havde Saturn ører?' && forside.portræt?.endsWith('huygens.webp') && forside.begynd && !forside.hylde, JSON.stringify(forside));
  // Bladringen: "Begynd", "›", "‹", piletasterne, grænserne og Esc
  await page.click('#opdBog .bog-begynd');
  const n1 = await page.evaluate(() => atomlabTest.opdagelser.vist().nr);
  await page.keyboard.press('ArrowLeft');
  const n0 = await page.evaluate(() => atomlabTest.opdagelser.vist().nr);
  await page.click('#opdBog .bog-pil[data-bladr="1"]');
  await page.keyboard.press('ArrowRight');
  const n2 = await page.evaluate(() => atomlabTest.opdagelser.vist().nr);
  const antal = await page.evaluate(() => atomlabTest.opdagelser.vist().antal);
  for (let i = 0; i < antal + 2; i++) await page.evaluate(() => atomlabTest.opdagelser.bladr(1));
  const sidst = await page.evaluate(() => ({ nr: atomlabTest.opdagelser.vist().nr, næste: document.querySelector('#opdBog .bog-pil[data-bladr="1"]').disabled, tal: document.querySelector('#opdBog .bog-sidetal').textContent }));
  await page.keyboard.press('Escape');
  const tilbage = await vent(page, påHylden);
  tjek('bladring: "Begynd", "›" og piletasterne går frem og tilbage, den sidste side stopper (› grå), og Esc går til hylden',
    n1 === 1 && n0 === 0 && n2 === Math.min(2, antal - 1) && sidst.nr === antal - 1 && sidst.næste && sidst.tal === `${antal} / ${antal}` && tilbage, JSON.stringify({ n0, n1, n2, sidst, tilbage }));
  await ctx.close();
}

// Fortællingen som forløb (H2): starter efter "Begynd" første gang, bladringen er låst imens, "Spring over" gør opslaget
// til et laboratorium, og næste gang starter det ikke af sig selv (test 4). Handlingerne i de tre trin gennem
// testadgangen: linsen, nætterne og ringen fra kanten med løftet (test 5).
{
  const { page, ctx } = await nySide({ viewport: { width: 1280, height: 800 } }, '&forloebstart#opdagelser');
  const O = (f, a) => page.evaluate(f, a);
  await vent(page, påHylden, null, 15000);
  await O(() => atomlabTest.opdagelser.åbn('huygens'));
  await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'forside');
  await page.click('#opdBog .bog-begynd');
  await vent(page, () => atomlabTest.opdagelser.forløb.kører() === 'saturns-oerer');
  await page.keyboard.press('ArrowRight');
  const første = await O(() => ({
    kører: atomlabTest.opdagelser.forløb.kører(), trin: atomlabTest.opdagelser.forløb.trin(), opslag: atomlabTest.opdagelser.vist().opslag,
    låst: atomlabTest.opdagelser.låst(), bund: [getComputedStyle(document.getElementById('opdTilHylden')).display, getComputedStyle(document.querySelector('#opdBog .bog-pil')).display].join(),
    kapitel: document.querySelector('#opdBog .bog-kapitel')?.textContent, scene: atomlabTest.opdagelser.scene()?.tilstand().trin,
  }));
  // "Spring over": opslaget bliver et laboratorium, og bladringen virker igen
  await page.click('.forløb-linje .fl-spring');
  await vent(page, () => !atomlabTest.opdagelser.forløb.kører());
  const sprunget = await O(() => ({ låst: atomlabTest.opdagelser.låst(), scene: atomlabTest.opdagelser.scene()?.tilstand().trin, igen: !!document.querySelector('#opdBog .hs-igen'), kapitel: document.querySelector('#opdBog .bog-kapitel')?.textContent }));
  // Næste gang bladrer "Begynd" bare til fortællingen
  await O(() => atomlabTest.opdagelser.hylden());
  await O(() => atomlabTest.opdagelser.åbn('huygens'));
  await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'forside');
  await page.click('#opdBog .bog-begynd');
  await page.waitForTimeout(300);
  const anden = await O(() => ({ kører: atomlabTest.opdagelser.forløb.kører(), opslag: atomlabTest.opdagelser.vist().opslag, scene: atomlabTest.opdagelser.scene()?.tilstand().trin }));
  tjek('fortællingen starter efter "Begynd" første gang (låst bladring, "‹ Hylden" fremme, kapitlet "Haag, 1655"), "Udforsk selv" giver laboratoriet, og anden gang starter den ikke',
    første.kører === 'saturns-oerer' && første.trin === 'linse' && første.opslag === 'fortaelling' && første.låst && /^(?!none).*,none$/.test(første.bund) && første.kapitel === 'Haag, 1655' && første.scene === 'linse'
    && !sprunget.låst && sprunget.scene === 'fri' && sprunget.igen && sprunget.kapitel === 'Saturns ører'
    && anden.kører === null && anden.opslag === 'fortaelling' && anden.scene === 'fri', JSON.stringify({ første, sprunget, anden }));

  // "Fortæl det igen" starter forløbet, og handlingerne kan gøres gennem testadgangen
  await page.click('#opdBog .hs-igen');
  await vent(page, () => atomlabTest.opdagelser.forløb.trin() === 'linse');
  const fase = (f) => vent(page, (f) => atomlabTest.opdagelser.forløb.fase() === f, f, 6000);
  const gæt = async () => { await page.click('.forløb-linje .fl-gæt >> nth=0'); return fase('gør'); };
  const S = (f, a) => O(f, a);
  // Trin 1: Glasset virker, mens man gætter (stilguiden B1 og B4): At gnide lader gættet tone væk
  await S(() => atomlabTest.opdagelser.scene().slib(0.5));
  const halv = await S(() => ({ skarp: atomlabTest.opdagelser.scene().tilstand().skarp, fase: atomlabTest.opdagelser.forløb.fase() }));
  await S(() => atomlabTest.opdagelser.scene().slib(1));
  const linse = (await fase('så')) && halv.skarp === 0.5 && halv.fase === 'gør';
  await page.click('.forløb-linje .fl-næste');
  // Trin 2: Hvert gæt får sit eget svar under Så. Forbi målet giver et vink med det samme, og nat 15 falder selv på 16
  await gæt();
  await S(() => atomlabTest.opdagelser.scene().nat(19));
  const forbi = await O(() => document.querySelector('.forløb-linje .fl-vink')?.textContent ?? '');
  await S(() => atomlabTest.opdagelser.scene().nat(14));
  await page.waitForTimeout(600);
  const ikkeEndnu = await S(() => ({ fase: atomlabTest.opdagelser.forløb.fase(), vink: Boolean(document.querySelector('.forløb-linje .fl-vink')) }));
  await S(() => atomlabTest.opdagelser.scene().nat(15));
  const nætter = (await fase('så')) && ikkeEndnu.fase === 'gør' && !ikkeEndnu.vink && /16 nætter/.test(forbi)
    && (await S(() => atomlabTest.opdagelser.scene().tilstand().nat)) === 16 && (await vent(page, () => atomlabTest.opdagelser.scene().tilstand().navn))
    && (await O(() => document.querySelector('#opdBog .hs-nat-tekst')?.textContent.startsWith('10. april 1655')));
  const svar = await O(() => document.querySelector('.forløb-linje .fl-svar')?.textContent ?? '');
  // Under Så virker skyderen stadig (B1)
  await S(() => atomlabTest.opdagelser.scene().nat(5));
  const legVidere = (await S(() => atomlabTest.opdagelser.scene().tilstand().nat)) === 5;
  await page.click('.forløb-linje .fl-næste');
  // Trin 3: helt åben giver et vink, og tæt på kanten (2,5°) tæller. Bagefter kan den skarpe ring drejes under Så
  await gæt();
  await S(() => atomlabTest.opdagelser.scene().drej(8));
  await page.waitForTimeout(400);
  const lyser = await S(() => atomlabTest.opdagelser.scene().tilstand().lyser);
  await S(() => atomlabTest.opdagelser.scene().drej(40));
  const helt = await O(() => document.querySelector('.forløb-linje .fl-vink')?.textContent ?? '');
  await S(() => atomlabTest.opdagelser.scene().drej(2.5));
  const kanten = (await fase('så')) && lyser === 'hevelius' && /Mere åben/.test(helt) && (await S(() => atomlabTest.opdagelser.scene().tilstand().løft)) === 1;
  await vent(page, () => atomlabTest.opdagelser.scene().tilstand().løftet);
  await S(() => atomlabTest.opdagelser.scene().drej(-10));
  const drejet = (await S(() => atomlabTest.opdagelser.scene().tilstand().B)) === -10;
  tjek('stien i fortællingen: scenen virker, mens man gætter, og under Så, forbi målet giver et vink, tæt på tæller, og gættet får sit eget svar',
    linse && halv.fase === 'gør' && /følge med Saturn/.test(svar) && legVidere && drejet, JSON.stringify({ halv, svar, legVidere, drejet, forbi, helt }));
  await page.click('.forløb-linje .fl-næste');
  // Trin 4 (H3): bunkerne virker, mens man gætter. Et forkert bogstav tæller ikke, ANNULO lægges på plads, og resten af
  // sætningen flyver på plads, til alle 62 bogstaver er brugt
  await vent(page, () => atomlabTest.opdagelser.forløb.trin() === 'annulo');
  const forkert = await S(() => atomlabTest.opdagelser.scene().bogstav('c'));
  const efterForkert = await S(() => ({ fase: atomlabTest.opdagelser.forløb.fase(), ag: atomlabTest.opdagelser.scene().tilstand().anagram, kapitel: document.querySelector('#opdBog .bog-kapitel')?.textContent, bunker: document.querySelectorAll('#opdBog .ag-bunke').length, lærred: getComputedStyle(document.querySelector('#opdBog .hs-lærred')).display }));
  for (const b of 'annulo') await S((b) => atomlabTest.opdagelser.scene().bogstav(b), b);
  const annulo = await fase('så');
  const ag = await S(() => ({ ...atomlabTest.opdagelser.scene().tilstand().anagram, ord: [...document.querySelectorAll('#opdBog .ag-ord')].map((o) => o.querySelector('.ag-latin').textContent).join(' '), så: document.querySelector('.forløb-linje .fl-så')?.textContent }));
  tjek('trin 4: 17 bunker i stedet for lærredet, et forkert bogstav ryster bare, og efter ANNULO flyver resten på plads, til alle 62 er brugt',
    !forkert && efterForkert.fase === 'gør' && efterForkert.ag.tal === 62 && efterForkert.bunker === 17 && efterForkert.lærred === 'none' && efterForkert.kapitel === 'Hemmeligheden'
    && annulo && ag.hel && ag.tal === 0 && ag.fundet === 6 && ag.ord.startsWith('Annulo cingitur') && /anagram/i.test(ag.så), JSON.stringify({ forkert, efterForkert, ag }));
  await page.click('.forløb-linje .fl-næste');
  await fase('slut');
  const slut = await O(() => ({ tekst: document.querySelector('.forløb-linje .fl-så')?.textContent, lille: document.querySelector('.forløb-linje .fl-lille')?.textContent, veje: [...document.querySelectorAll('.forløb-linje .fl-vej')].map((v) => v.textContent), vej: [...document.querySelectorAll('.forløb-linje .fl-vej')].pop()?.textContent }));
  // Den tredje vej bladrer til "Bogen fra 1659" (H4), og tilbage i fortællingen står laboratoriet med ringen
  await page.click('.forløb-linje .fl-vej >> text=Bladr i bogen fra 1659');
  await page.waitForTimeout(300);
  const tilBogen = await O(() => ({ opslag: atomlabTest.opdagelser.vist().opslag, låst: atomlabTest.opdagelser.låst(), kører: atomlabTest.opdagelser.forløb.kører() }));
  await O(() => { const v = atomlabTest.opdagelser; while (v.vist().opslag !== 'fortaelling' && v.bladr(-1)); });
  await page.waitForTimeout(200);
  const videre = { ...tilBogen, lab: await O(() => atomlabTest.opdagelser.scene()?.tilstand().lab) };
  // Laboratoriet har de tre kapitler: "Den lille prik" giver nætterne, og nat 16 viser navnet Titan
  const kapitler = await O(() => [...document.querySelectorAll('#opdBog .hs-kapitel')].map((k) => k.textContent));
  await page.click('#opdBog .hs-kapitel >> text=Den lille prik');
  await S(() => atomlabTest.opdagelser.scene().nat(16));
  const lab = await S(() => atomlabTest.opdagelser.scene().tilstand());
  tjek('laboratoriet: tre kapitler (Linsen, Den lille prik og Ringen), og "Den lille prik" giver nætterne med Titan',
    kapitler.join('|') === 'Linsen|Den lille prik|Ringen' && lab.trin === 'naetter' && lab.lab === 'naetter' && lab.navn, JSON.stringify({ kapitler, lab }));
  tjek('trinene: linsen bliver skarp, Titan er tilbage efter 16 nætter (10. april 1655), og ringen løfter sig ved kanten efter tavlens tegninger',
    linse && nætter && kanten, JSON.stringify({ linse, halv, nætter, ikkeEndnu, kanten, lyser }));
  tjek('"Det så du" viser kernesætningen, linjen om ANNULO og tre veje (hemmeligheden først), og "Bladr i bogen fra 1659" åbner bogen selv med bladringen låst op (tilbage i fortællingen står ringen)',
    slut.tekst?.includes('tynd, flad ring') && slut.lille?.startsWith('Men ANNULO') && slut.veje.length === 3 && slut.veje[0].startsWith('Hele hemmeligheden') && slut.vej?.startsWith('Se ringen forsvinde ved Saturn') && videre.opslag === 'bogen' && videre.lab === 'ringen' && !videre.låst && videre.kører === null, JSON.stringify({ slut, videre }));
  // Esc midt i forløbet går til hylden og stopper det
  await page.click('#opdBog .hs-igen');
  await vent(page, () => atomlabTest.opdagelser.forløb.kører());
  await page.keyboard.press('Escape');
  tjek('Esc midt i fortællingen går til hylden og stopper forløbet', (await vent(page, påHylden)) && (await O(() => atomlabTest.opdagelser.forløb.kører())) === null);
  await ctx.close();
}

// Tychos tur (T2, test 5): starter efter "Begynd", og handlingerne i de fire trin gennem testadgangen. Et tryk ved siden af
// stjernen giver et vink, højt alene giver et vink om lavt, og "Det så du" har kun de veje, der er bygget
{
  const { page, ctx } = await nySide({ viewport: { width: 1280, height: 800 } }, '&forloebstart#opdagelser');
  const O = (f, a) => page.evaluate(f, a);
  const S = (f, a) => O(f, a);
  const fase = (f) => vent(page, (f) => atomlabTest.opdagelser.forløb.fase() === f, f, 12000);
  await vent(page, påHylden, null, 15000);
  await O(() => atomlabTest.opdagelser.åbn('tycho'));
  await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'forside');
  await page.click('#opdBog .bog-begynd');
  const startet = await vent(page, () => atomlabTest.opdagelser.forløb.kører() === 'den-nye-stjerne' && atomlabTest.opdagelser.scene()?.tilstand().trin === 'stjernen');
  const kapitel = await O(() => document.querySelector('#opdBog .bog-kapitel')?.textContent);
  // Trin 1: stjernen lyser op af sig selv, et tryk ved siden af giver et vink, et tryk på den tæller
  const lyser = await vent(page, () => atomlabTest.opdagelser.scene().tilstand().lys > 0.3, null, 8000);
  await S(() => atomlabTest.opdagelser.scene().tryk(false));
  const forkert = await O(() => ({ fundet: atomlabTest.opdagelser.scene().tilstand().fundet, vink: document.querySelector('.forløb-linje .fl-vink')?.textContent ?? '' }));
  await S(() => atomlabTest.opdagelser.scene().tryk(true));
  const trin1 = (await fase('så')) && !forkert.fundet && /tegning i hjørnet/.test(forkert.vink);
  await page.click('.forløb-linje .fl-næste');
  // Trin 2: kun tommelfingeren og én knap "Skift øje" (ingen gæt), og ét skift giver Så med ordet parallakse
  await vent(page, () => atomlabTest.opdagelser.forløb.trin() === 'tommel');
  const tommel = await O(() => ({ fase: atomlabTest.opdagelser.forløb.fase(), knapper: [...document.querySelectorAll('.forløb-linje .fl-handling')].map((b) => b.textContent), gæt: document.querySelectorAll('.forløb-linje .fl-gæt').length, sted: !!document.querySelector('#opdBog .ts-par-sted') }));
  await page.click('.forløb-linje .fl-handling >> text=Skift øje');
  const trin2 = (await fase('så')) && tommel.fase === 'gør' && tommel.knapper.join() === 'Skift øje' && !tommel.gæt && !tommel.sted
    && (await O(() => /parallakse/.test(document.querySelector('.forløb-linje .fl-så')?.textContent)));
  await page.click('.forløb-linje .fl-næste');
  // Trin 3: Jorden og Månen. Først spørgsmålet med de tre svar alene i rækken, så "Flyt Tycho" efter gættet
  await vent(page, () => atomlabTest.opdagelser.forløb.trin() === 'parallakse');
  const måneGæt = await O(() => ({ fase: atomlabTest.opdagelser.forløb.fase(), gæt: [...document.querySelectorAll('.forløb-linje .fl-gæt')].map((b) => b.textContent), knapper: document.querySelectorAll('.forløb-linje .fl-handling').length, øje: !!document.querySelector('#opdBog .ts-par-øje') }));
  await page.click('.forløb-linje .fl-gæt >> nth=2');
  const måneKnapper = await O(() => [...document.querySelectorAll('.forløb-linje .fl-handling')].map((b) => b.textContent));
  await page.click('.forløb-linje .fl-handling >> text=Flyt Tycho');
  const trin3a = (await fase('så')) && måneGæt.fase === 'gæt' && måneGæt.gæt.length === 3 && !måneGæt.knapper && !måneGæt.øje && måneKnapper.join() === 'Flyt Tycho'
    && (await O(() => /1°/.test(document.querySelector('#opdBog .ts-par-måne')?.textContent) && /ikke/.test(document.querySelector('.forløb-linje .fl-så')?.textContent)
      && document.querySelector('.forløb-linje .fl-svar')?.textContent === 'Rigtigt gættet!'));
  await page.click('.forløb-linje .fl-næste');
  // Trin 3: højt giver et vink om lavt, og lavt giver Så. Afstanden er 7° 55′ begge steder, spøgelset er ikke
  await vent(page, () => atomlabTest.opdagelser.forløb.trin() === 'hoejt');
  await page.click('.forløb-linje .fl-gæt >> nth=1');
  await S(() => atomlabTest.opdagelser.scene().drejTil(0));
  await vent(page, () => atomlabTest.opdagelser.scene().tilstand().højt);
  await page.waitForTimeout(300);
  const høj = await O(() => ({ ...atomlabTest.opdagelser.scene().tilstand(), vink: document.querySelector('.forløb-linje .fl-vink')?.textContent ?? '', fase: atomlabTest.opdagelser.forløb.fase() }));
  await S(() => atomlabTest.opdagelser.scene().drejTil(180));
  const trin3 = await fase('så');
  const lav = await O(() => ({ ...atomlabTest.opdagelser.scene().tilstand(), tal: document.querySelector('#opdBog .ts-spøgelse')?.textContent, svar: document.querySelector('.forløb-linje .fl-svar')?.textContent }));
  await page.click('.forløb-linje .fl-næste');
  // Trin 4: midt i 1573 er det ikke nok, begyndelsen af 1574 er, og prikkerne lyser ved det, Tycho sammenlignede med
  await vent(page, () => atomlabTest.opdagelser.forløb.trin() === 'falmer');
  await S(() => atomlabTest.opdagelser.scene().måned(6));
  await page.waitForTimeout(900);
  const maj = await O(() => ({ ...atomlabTest.opdagelser.scene().tilstand(), fase: atomlabTest.opdagelser.forløb.fase() }));
  await S(() => atomlabTest.opdagelser.scene().måned(14));
  const trin4 = (await fase('så')) && maj.fase !== 'så' && maj.månedNavn === 'maj 1573' && maj.lyser.join() === 'anden,saturn';
  await page.click('.forløb-linje .fl-næste');
  await fase('slut');
  const slut = await O(() => ({ tekst: document.querySelector('.forløb-linje .fl-så')?.textContent, lille: document.querySelector('.forløb-linje .fl-lille')?.textContent, veje: [...document.querySelectorAll('.forløb-linje .fl-vej')].map((v) => v.textContent) }));
  tjek('Tychos tur starter efter "Begynd" med kapitlet "Herrevad, 11. november 1572", og den nye stjerne lyser op af sig selv og tæller kun, når man rammer den (ellers et vink)',
    startet && kapitel === 'Herrevad, 11. november 1572' && lyser && trin1, JSON.stringify({ kapitel, forkert }));
  tjek('Tychos tur: tommelfingeren for sig med "Skift øje", så Jorden og Månen med de tre svar alene og "Flyt Tycho" efter gættet',
    trin2 && trin3a, JSON.stringify({ tommel, måneGæt, måneKnapper }));
  tjek('Tychos tur: højt alene giver et vink om lavt, og højt og lavt er begge 7° 55′, mens spøgelset bliver 7° 07′',
    trin3 && høj.højde > 80 && høj.fase !== 'så' && /ned, så den står lavt/.test(høj.vink) && høj.afstand === '7° 55′' && lav.højde < 31 && lav.afstand === '7° 55′' && lav.spøgelse === '7° 07′' && /7°\s07′/.test(lav.tal) && lav.svar === 'Rigtigt gættet!',
    JSON.stringify({ høj, lav }));
  tjek('Tychos tur: stjernen falmer til begyndelsen af 1574 (maj lyser ved anden størrelse og Saturn), og "Det så du" har kernesætningen, linjen om de tre stjerner og tre veje med gåden først (T3)',
    trin4 && /langt bag Månen/.test(slut.tekst) && /tre stjerner/.test(slut.lille) && slut.veje.join('|') === 'Find stjernen med Tychos tal ›|Bladr i bogen fra 1573 ›|Tag turen igen ›', JSON.stringify({ maj, slut }));
  // "Tag turen igen" starter forfra, og "Udforsk selv" giver laboratoriet med de fire kapitler (standard "Højt og lavt")
  await page.click('.forløb-linje .fl-vej >> text=Tag turen igen');
  const igen = await vent(page, () => atomlabTest.opdagelser.forløb.trin() === 'stjernen');
  await page.click('.forløb-linje .fl-spring');
  await vent(page, () => !atomlabTest.opdagelser.forløb.kører());
  const lab = await O(() => ({ kapitler: [...document.querySelectorAll('#opdBog .hs-kapitel')].map((k) => k.textContent), t: atomlabTest.opdagelser.scene().tilstand(), låst: atomlabTest.opdagelser.låst() }));
  await page.click('#opdBog .hs-kapitel >> text=Stjernen falmer');
  await S(() => atomlabTest.opdagelser.scene().måned(0));
  const labFalmer = await O(() => atomlabTest.opdagelser.scene().tilstand());
  tjek('Tychos tur: "Tag turen igen" starter forfra, og laboratoriet har fire kapitler med "Højt og lavt" som standard og "Stjernen falmer" med Venus og Jupiter i november 1572',
    igen && lab.kapitler.join('|') === 'Den nye stjerne|Tommelfingeren|Højt og lavt|Stjernen falmer' && lab.t.lab === 'hoejt' && !lab.låst && labFalmer.lab === 'falmer' && labFalmer.lyser.join() === 'venus,jupiter',
    JSON.stringify({ lab, labFalmer }));
  await ctx.close();
}

// Rømers tur (R2, test 5): starter efter "Begynd" med "Paris, 1676: Himlens ur". Io glider af sig selv ind i skyggen,
// juli giver et vink om november, og november giver 10 minutter for sent. Lysglimtet i august og november giver 36 og 46
// minutter. Uret den 9. november starter først efter gættet, et tryk før Io siger "Ikke endnu", og Io kommer 17.35.45.
// "Det så du" har kun de veje, der er bygget, og laboratoriet har fire kapitler med "For sent" som standard
{
  const { page, ctx } = await nySide({ viewport: { width: 1280, height: 800 } }, '&forloebstart#opdagelser');
  const O = (f, a) => page.evaluate(f, a);
  const T = () => O(() => atomlabTest.opdagelser.scene().tilstand());
  const fase = (f) => vent(page, (f) => atomlabTest.opdagelser.forløb.fase() === f, f, 15000);
  const linje = () => O(() => ({ vink: document.querySelector('.forløb-linje .fl-vink')?.textContent ?? '', så: document.querySelector('.forløb-linje .fl-så')?.textContent ?? '', svar: document.querySelector('.forløb-linje .fl-svar')?.textContent ?? '', fase: atomlabTest.opdagelser.forløb.fase() }));
  await vent(page, påHylden, null, 15000);
  await O(() => atomlabTest.opdagelser.åbn('roemer'));
  await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'forside');
  const begynd = await O(() => !!document.querySelector('#opdBog .bog-begynd'));
  await page.click('#opdBog .bog-begynd');
  const startet = await vent(page, () => atomlabTest.opdagelser.forløb.kører() === 'himlens-ur' && atomlabTest.opdagelser.scene()?.tilstand().trin === 'skyggen');
  const kapitel = await O(() => document.querySelector('#opdBog .bog-kapitel')?.textContent);
  // Trin 1: Io er synlig først og glider af sig selv ind i skyggen
  const før1 = await T();
  const trin1 = (await fase('så')) && (await T()).formørket && !(await T()).io.synlig && /formørkelse/.test((await linje()).så);
  await page.click('.forløb-linje .fl-næste');
  // Trin 2: juli giver et vink, november giver Så
  await vent(page, () => atomlabTest.opdagelser.forløb.trin() === 'sent');
  const gæt2 = await O(() => [...document.querySelectorAll('.forløb-linje .fl-gæt')].map((b) => b.textContent));
  await page.click('.forløb-linje .fl-gæt >> nth=1');
  await O(() => atomlabTest.opdagelser.scene().dag(40));
  await page.waitForTimeout(300);
  const juli = { ...(await T()), ...(await linje()) };
  await O(() => atomlabTest.opdagelser.scene().dag(161));
  const trin2 = await fase('så');
  const nov = { ...(await T()), ...(await linje()) };
  await page.click('.forløb-linje .fl-næste');
  // Trin 3: august, så november
  await vent(page, () => atomlabTest.opdagelser.forløb.trin() === 'hvorfor');
  await page.click('.forløb-linje .fl-gæt >> nth=2');
  const knapper3 = await O(() => [...document.querySelectorAll('.forløb-linje .fl-handling')].map((b) => b.textContent));
  await page.click('.forløb-linje .fl-handling >> text=Io kommer ud');
  await vent(page, () => atomlabTest.opdagelser.scene().tilstand().målt.aug, null, 10000);
  await page.waitForTimeout(200);
  const aug = { ...(await T()), ...(await linje()) };
  await page.click('.forløb-linje .fl-handling >> text=November');
  await page.click('.forløb-linje .fl-handling >> text=Io kommer ud');
  const trin3 = await fase('så');
  const lys = { ...(await T()), ...(await linje()), mærker: await O(() => [...document.querySelectorAll('#opdBog .rs-mærker .ja')].map((m) => m.textContent)) };
  await page.click('.forløb-linje .fl-næste');
  // Trin 4: uret venter på gættet, tabellens tid giver "Nu skulle den komme", et tryk for tidligt giver "Ikke endnu"
  await vent(page, () => atomlabTest.opdagelser.forløb.trin() === 'november');
  await page.waitForTimeout(900);
  const venter = await T();
  await page.click('.forløb-linje .fl-gæt >> nth=0');
  await vent(page, () => atomlabTest.opdagelser.scene().tilstand().kører, null, 4000);
  await O(() => atomlabTest.opdagelser.scene().spol('tabel'));
  await vent(page, () => atomlabTest.opdagelser.scene().tilstand().nuVist, null, 4000);
  const nu = await linje();
  await O(() => atomlabTest.opdagelser.scene().tryk());
  const forTidligt = { ...(await T()), ...(await linje()) };
  await O(() => atomlabTest.opdagelser.scene().spol('io'));
  await vent(page, () => atomlabTest.opdagelser.scene().tilstand().ioLys > 0.3, null, 6000);
  await page.click('.forløb-linje .fl-handling >> text=Der er Io!');
  const trin4 = await fase('så');
  const io = { ...(await T()), ...(await linje()) };
  await page.click('.forløb-linje .fl-næste');
  await fase('slut');
  const slut = await O(() => ({ tekst: document.querySelector('.forløb-linje .fl-så')?.textContent, lille: document.querySelector('.forløb-linje .fl-lille')?.textContent, veje: [...document.querySelectorAll('.forløb-linje .fl-vej')].map((v) => v.textContent) }));
  tjek('Rømers tur starter efter "Begynd" med "Paris, 1676: Himlens ur", og Io glider af sig selv ind i Jupiters skygge (formørkelse)',
    begynd && startet && kapitel === 'Paris, 1676: Himlens ur' && før1.io.synlig && trin1, JSON.stringify({ kapitel, før1 }));
  tjek('Rømers tur: juli giver Io lidt før tabellen og et vink om november, og november giver 10 minutter for sent',
    trin2 && gæt2.length === 3 && juli.forsinkelse < 0 && juli.fase !== 'så' && /november/.test(juli.vink) && nov.dato === '9. november 1676' && nov.linje === 'Io kommer 10 minutter for sent.' && nov.svar === 'Rigtigt gættet!',
    JSON.stringify({ gæt2, juli, nov }));
  tjek('Rømers tur: lysglimtet er ca. 36 minutter om vejen i august (vink om november) og 46 i november, og begge mærker får ✓',
    trin3 && knapper3.join('|') === 'Io kommer ud|August|November' && aug.målt.aug && !aug.målt.nov && aug.fase !== 'så' && /november/.test(aug.vink)
    && Math.round(lys.stopur) === 46 && lys.mærker.length === 2 && /36/.test(lys.mærker[0]) && lys.svar === 'Rigtigt gættet!', JSON.stringify({ knapper3, aug, lys }));
  tjek('Rømers tur: uret den 9. november venter på gættet, står stille ved tabellens tid ("Nu skulle den komme"), et tryk før Io siger "Ikke endnu", og Io kommer 17.35.45',
    trin4 && !venter.kører && venter.ur === '17.20.00' && /Nu skulle den komme/.test(nu.vink) && forTidligt.forTidligt === 1 && !forTidligt.set && /Ikke endnu/.test(forTidligt.vink)
    && io.set && io.ur === '17.35.45' && io.svar === 'Rigtigt gættet!' && /halv seks/.test(io.så), JSON.stringify({ venter, nu, forTidligt, io }));
  tjek('Rømers tur: "Det så du" har kernesætningen, linjen om Rømers tegning og vejene til gåden og tidsskriftet (R3)',
    /Lyset bruger altså tid/.test(slut.tekst) && /Rømer tegnede det/.test(slut.lille) && slut.veje.join('|') === 'Tæl lysets minutter ›|Bladr i tidsskriftet fra 1677 ›|Tag turen igen ›', JSON.stringify(slut));
  // "Tag turen igen" starter forfra, og "Udforsk selv" giver laboratoriet med de fire kapitler
  await page.click('.forløb-linje .fl-vej >> text=Tag turen igen');
  const igen = await vent(page, () => atomlabTest.opdagelser.forløb.trin() === 'skyggen');
  await page.click('.forløb-linje .fl-spring');
  await vent(page, () => !atomlabTest.opdagelser.forløb.kører());
  const lab = await O(() => ({ kapitler: [...document.querySelectorAll('#opdBog .hs-kapitler .hs-kapitel')].map((k) => k.textContent), t: atomlabTest.opdagelser.scene().tilstand(), låst: atomlabTest.opdagelser.låst() }));
  await page.click('#opdBog .hs-kapitler .hs-kapitel >> text=Lysglimtet');
  const labLys = await O(() => ({ t: atomlabTest.opdagelser.scene().tilstand(), knapper: [...document.querySelectorAll('#opdBog .ts-knapper .hs-kapitel')].map((k) => k.textContent) }));
  await page.click('#opdBog .hs-kapitler .hs-kapitel >> text=9. november');
  const labUr = await vent(page, () => atomlabTest.opdagelser.scene().tilstand().kører, null, 4000);
  tjek('Rømers tur: "Tag turen igen" starter forfra, og laboratoriet har fire kapitler med "For sent" som standard, "Lysglimtet" med knapperne og "9. november", hvor uret starter af sig selv',
    igen && lab.kapitler.join('|') === 'Io i skyggen|For sent|Lysglimtet|9. november' && lab.t.lab === 'sent' && !lab.låst
    && labLys.t.lab === 'hvorfor' && labLys.knapper.join('|') === 'Io kommer ud|August|November' && labUr, JSON.stringify({ lab, labLys }));
  await ctx.close();
}

// Einsteins tur (E2, test 5): starter efter "Begynd" med "Bern, 1905". Lygterne tænder, når de står ud for hinanden, og
// glimtene når målet samtidig. Fartknapperne kommer først bagefter. Rundturen ved 87 % giver 9,9 af 20 sekunder, timen
// giver 0,000 000 004 g, og GPS-uret er bagud ved rumstationen og 38 foran ved GPS-højden. "Det så du" har kun de veje, der
// findes, og laboratoriet har fire kapitler med "Uret flyver en tur" som standard
{
  const { page, ctx } = await nySide({ viewport: { width: 1280, height: 800 } }, '&forloebstart#opdagelser');
  const O = (f, a) => page.evaluate(f, a);
  const fase = (f) => vent(page, (f) => atomlabTest.opdagelser.forløb.fase() === f, f, 15000);
  const T = () => O(() => atomlabTest.opdagelser.scene().tilstand());
  await vent(page, påHylden, null, 15000);
  await O(() => atomlabTest.opdagelser.åbn('einstein'));
  await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'forside');
  const begynd = await O(() => !!document.querySelector('#opdBog .bog-begynd'));
  await page.click('#opdBog .bog-begynd');
  const startet = await vent(page, () => atomlabTest.opdagelser.forløb.kører() === 'lige-hurtigt' && atomlabTest.opdagelser.scene()?.tilstand().trin === 'toget');
  const kapitel = await O(() => document.querySelector('#opdBog .bog-kapitel')?.textContent);
  // Trin 1: ingen gæt, "Tænd begge", og farterne først bagefter
  const før = { ...(await T()), knapper: await O(() => [...document.querySelectorAll('.forløb-linje .fl-handling')].map((x) => x.textContent)), gæt: await O(() => document.querySelectorAll('.forløb-linje .fl-gæt').length) };
  await page.click('.forløb-linje .fl-handling >> text=Tænd begge');
  const trin1 = (await fase('så')) && (await T()).mål;
  const efter = await T();
  await page.click('.forløb-linje .fl-næste');
  // Trin 2: tre gæt, "Mindre tid" er rigtigt, 87 % giver 9,9 af 20 sekunder
  await vent(page, () => atomlabTest.opdagelser.forløb.trin() === 'rundtur');
  const gæt2 = await O(() => [...document.querySelectorAll('.forløb-linje .fl-gæt')].map((x) => x.textContent));
  await page.click('.forløb-linje .fl-gæt >> text=Mindre tid');
  await O(() => atomlabTest.opdagelser.scene().urFart(0.87));
  await page.click('.forløb-linje .fl-handling >> text=Send af sted');
  const rejser = (await T()).rejser;
  const trin2 = (await fase('så')) && rejser;
  const rund = { ...(await T()), svar: await O(() => document.querySelector('.forløb-linje .fl-svar')?.textContent), så: await O(() => document.querySelector('.forløb-linje .fl-så')?.textContent) };
  await page.click('.forløb-linje .fl-næste');
  // Trin 3: en time giver 4 milliardtedele gram
  await vent(page, () => atomlabTest.opdagelser.forløb.trin() === 'vaegten');
  await page.click('.forløb-linje .fl-gæt >> nth=0');
  await page.click('.forløb-linje .fl-handling >> text=Spol en time');
  const trin3 = await fase('så');
  const vægt = await T();
  await page.click('.forløb-linje .fl-næste');
  // Trin 4: bagud ved rumstationen, et vink halvvejs, og 38 foran ved GPS-højden. "Uden rettelse" kommer først øverst
  await vent(page, () => atomlabTest.opdagelser.forløb.trin() === 'gps');
  const lav = await T();
  await page.click('.forløb-linje .fl-gæt >> nth=1');
  await O(() => atomlabTest.opdagelser.scene().højde(5000));
  await O(() => document.querySelector('#opdBog .es-hoejde input').dispatchEvent(new Event('change')));
  await page.waitForTimeout(700);
  const midt = { ...(await T()), fase: await O(() => atomlabTest.opdagelser.forløb.fase()), vink: await O(() => document.querySelector('.forløb-linje .fl-vink')?.textContent ?? ''), uden: await O(() => !document.querySelector('#opdBog .es-uden')?.hidden) };
  await O(() => atomlabTest.opdagelser.scene().højde(20200));
  const trin4 = await fase('så');
  const høj = await T();
  await page.click('#opdBog .es-uden');
  const uden = (await T()).uden;
  await page.click('.forløb-linje .fl-næste');
  await fase('slut');
  const slut = await O(() => ({ tekst: document.querySelector('.forløb-linje .fl-så')?.textContent, lille: document.querySelector('.forløb-linje .fl-lille')?.textContent, veje: [...document.querySelectorAll('.forløb-linje .fl-vej')].map((v) => v.textContent) }));
  tjek('Einsteins tur starter efter "Begynd" med "Bern, 1905: Toget og lyset", "Tænd begge" uden gæt, og glimtene når målet samtidig, før farterne kommer frem',
    begynd && startet && kapitel === 'Bern, 1905: Toget og lyset' && før.knapper.join() === 'Tænd begge' && !før.gæt && !før.valg.length && trin1 && efter.valg.join('|') === '100 km/t|Halvdelen af lysets fart',
    JSON.stringify({ kapitel, før, efter }));
  tjek('Einsteins tur: uret, der fløj med 87 %, viser 9,9 af 20 sekunder, "Mindre tid" er rigtigt, og Så nævner relativitetsteorien',
    trin2 && gæt2.join('|') === 'Det samme|Mere tid|Mindre tid' && Math.abs(rund.hjemme - 20) < 0.01 && Math.abs(rund.fløjet - 9.86) < 0.02 && rund.svar === 'Rigtigt gættet!' && /relativitetsteori/.test(rund.så),
    JSON.stringify(rund));
  tjek('Einsteins tur: en time med lampen gør batteriet og lampen 0,000 000 004 g lettere, og GPS-uret er bagud ved rumstationen, et vink halvvejs, og 38 foran ved GPS-højden (+45 − 7)',
    trin3 && Math.abs(vægt.lettere - 4.0e-9) < 1e-10 && /0,000 000 004 g/.test(vægt.tekst) && lav.gps.iAlt < 0 && /bagud/.test(lav.tekst)
    && midt.fase !== 'så' && /helt op/.test(midt.vink) && !midt.uden && trin4 && høj.gps.iAlt === 38 && /38 milliontedele sekund foran/.test(høj.tekst) && uden,
    JSON.stringify({ vægt: vægt.lettere, lav: lav.gps, midt: { fase: midt.fase, vink: midt.vink, uden: midt.uden }, høj: høj.gps, uden }));
  tjek('Einsteins tur: "Det så du" har kernesætningen med GPS, "Men hvordan skrev han det?" og ligningerne som den første vej (E3), Rejsen i tid og turen igen',
    /GPS/.test(slut.tekst) && /hvordan skrev han det/.test(slut.lille) && slut.veje.join('|') === 'Læs ligningerne på hans egne sider ›|Send et ur på rejse ›|Tag turen igen ›', JSON.stringify(slut));
  // "Tag turen igen" starter forfra, og "Udforsk selv" giver laboratoriet med de fire kapitler
  await page.click('.forløb-linje .fl-vej >> text=Tag turen igen');
  const igen = await vent(page, () => atomlabTest.opdagelser.forløb.trin() === 'toget');
  await page.click('.forløb-linje .fl-spring');
  await vent(page, () => !atomlabTest.opdagelser.forløb.kører());
  const lab = await O(() => ({ kapitler: [...document.querySelectorAll('#opdBog .hs-kapitler .hs-kapitel')].map((k) => k.textContent), t: atomlabTest.opdagelser.scene().tilstand(), låst: atomlabTest.opdagelser.låst(), send: !!document.querySelector('#opdBog .es-send') }));
  await page.click('#opdBog .hs-kapitler .hs-kapitel >> text=Toget og lyset');
  const labTog = await O(() => ({ t: atomlabTest.opdagelser.scene().tilstand(), tænd: !!document.querySelector('#opdBog .es-taend') }));
  tjek('Einsteins tur: "Tag turen igen" starter forfra, og laboratoriet har fire kapitler med "Uret flyver en tur" som standard (med "Send af sted") og "Toget og lyset" med farterne og "Tænd begge"',
    igen && lab.kapitler.join('|') === 'Toget og lyset|Uret flyver en tur|Batteriet på vægten|Uret højt oppe' && lab.t.lab === 'rundtur' && lab.send && !lab.låst
    && labTog.t.lab === 'toget' && labTog.tænd && labTog.t.valg.length === 2, JSON.stringify({ lab, labTog }));
  await ctx.close();
}

// Telefon på højkant og på langs i fortællingen: lærredet har plads, skyderen og tavlens tegninger er inden for skærmen,
// og siden bliver ikke bredere end skærmen
for (const [navn, opsætning] of [
  ['telefon', { viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 }],
  ['telefon på langs', { viewport: { width: 812, height: 375 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 }],
]) {
  const { page, ctx } = await nySide(opsætning, '&forloebstart#opdagelser');
  const O = (f, a) => page.evaluate(f, a);
  await vent(page, påHylden, null, 15000);
  await O(() => atomlabTest.opdagelser.åbn('huygens'));
  await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'forside');
  await page.click('#opdBog .bog-begynd');
  const mål = [];
  for (const trin of ['linse', 'naetter', 'kanten']) {
    await vent(page, (t) => atomlabTest.opdagelser.forløb.trin() === t, trin);
    await page.click('.forløb-linje .fl-gæt >> nth=0');
    await page.waitForTimeout(250);
    mål.push(await O(() => {
      const inde = (x) => x.left >= -0.5 && x.right <= innerWidth + 0.5 && x.top >= -0.5 && x.bottom <= innerHeight + 0.5;
      const c = document.querySelector('#opdBog canvas').getBoundingClientRect();
      const ting = [...document.querySelectorAll('#opdBog .hs-nat input, #opdBog .hs-tavle figure, .forløb-linje button')].map((e) => e.getBoundingClientRect());
      return { lærred: Math.round(Math.min(c.width, c.height)), inde: inde(c) && ting.every(inde), bred: document.documentElement.scrollWidth > innerWidth + 1 };
    }));
    if (trin !== 'kanten') { await O(() => atomlabTest.opdagelser.forløb.visMigNu()); await vent(page, () => atomlabTest.opdagelser.forløb.fase() === 'så', null, 8000); await page.click('.forløb-linje .fl-næste'); }
  }
  tjek(`${navn}: i fortællingen har lærredet plads (mindst 140 px), og lærredet, skyderen, tavlens tegninger og knapperne er inden for skærmen`,
    mål.length === 3 && mål.every((m) => m.lærred >= 140 && m.inde && !m.bred), JSON.stringify(mål));
  // Tychos tur (T2): i alle fem trin har lærredet plads, alt er inden for skærmen, og "‹ Hylden" dækker ikke kapitlets titel
  await O(() => atomlabTest.opdagelser.hylden());
  await O(() => atomlabTest.opdagelser.åbn('tycho'));
  await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'forside');
  await page.click('#opdBog .bog-begynd');
  const målT = [];
  for (const trin of ['stjernen', 'tommel', 'parallakse', 'hoejt', 'falmer']) {
    await vent(page, (t) => atomlabTest.opdagelser.forløb.trin() === t, trin);
    if (trin !== 'stjernen' && trin !== 'tommel') await page.click('.forløb-linje .fl-gæt >> nth=0');
    await page.waitForTimeout(250);
    målT.push(await O(() => {
      const inde = (x) => x.left >= -0.5 && x.right <= innerWidth + 0.5 && x.top >= -0.5 && x.bottom <= innerHeight + 0.5;
      const c = document.querySelector('#opdBog canvas').getBoundingClientRect();
      const ting = [...document.querySelectorAll('#opdBog .hs-nat input, #opdBog .ts-sammen, #opdBog .ts-maal, .forløb-linje button')].map((e) => e.getBoundingClientRect());
      const kap = document.querySelector('#opdBog .bog-kapitel'), hylde = document.getElementById('opdTilHylden').getBoundingClientRect();
      const r = document.createRange();
      r.selectNodeContents(kap);
      const tk = r.getBoundingClientRect();
      const dækker = tk.left < hylde.right && tk.right > hylde.left && tk.top < hylde.bottom && tk.bottom > hylde.top;
      return { trin: atomlabTest.opdagelser.forløb.trin(), lærred: Math.round(Math.min(c.width, c.height)), inde: inde(c) && ting.every(inde), bred: document.documentElement.scrollWidth > innerWidth + 1, dækker };
    }));
    if (trin !== 'falmer') { await O(() => atomlabTest.opdagelser.forløb.visMigNu()); await vent(page, () => atomlabTest.opdagelser.forløb.fase() === 'så', null, 12000); await page.click('.forløb-linje .fl-næste'); }
  }
  tjek(`${navn}: i Tychos tur har lærredet plads (mindst 140 px) i alle fem trin, alt er inden for skærmen, og "‹ Hylden" dækker ikke kapitlets titel`,
    målT.length === 5 && målT.every((m) => m.lærred >= 140 && m.inde && !m.bred && !m.dækker), JSON.stringify(målT));
  // Rømers tur (R2): i alle fire trin har lærredet plads, alt er inden for skærmen, og "‹ Hylden" dækker ikke kapitlets titel
  await O(() => atomlabTest.opdagelser.hylden());
  await O(() => atomlabTest.opdagelser.åbn('roemer'));
  await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'forside');
  await page.click('#opdBog .bog-begynd');
  const målR = [];
  for (const trin of ['skyggen', 'sent', 'hvorfor', 'november']) {
    await vent(page, (t) => atomlabTest.opdagelser.forløb.trin() === t, trin);
    if (trin !== 'skyggen') await page.click('.forløb-linje .fl-gæt >> nth=0');
    await O(() => atomlabTest.opdagelser.forløb.visMigNu());
    await vent(page, () => atomlabTest.opdagelser.forløb.fase() === 'så', null, 20000);
    await page.waitForTimeout(250);
    målR.push(await O(() => {
      const inde = (x) => x.left >= -0.5 && x.right <= innerWidth + 0.5 && x.top >= -0.5 && x.bottom <= innerHeight + 0.5;
      const c = document.querySelector('#opdBog canvas').getBoundingClientRect();
      const ting = [...document.querySelectorAll('#opdBog .hs-under input, #opdBog .hs-under .ts-maal, .forløb-linje button')].filter((e) => e.offsetWidth).map((e) => e.getBoundingClientRect());
      const kap = document.querySelector('#opdBog .bog-kapitel'), hylde = document.getElementById('opdTilHylden').getBoundingClientRect();
      const r = document.createRange();
      r.selectNodeContents(kap);
      const tk = r.getBoundingClientRect();
      const dækker = tk.left < hylde.right && tk.right > hylde.left && tk.top < hylde.bottom && tk.bottom > hylde.top;
      return { trin: atomlabTest.opdagelser.forløb.trin(), lærred: Math.round(Math.min(c.width, c.height)), inde: inde(c) && ting.every(inde), bred: document.documentElement.scrollWidth > innerWidth + 1, dækker };
    }));
    if (trin !== 'november') await page.click('.forløb-linje .fl-næste');
  }
  tjek(`${navn}: i Rømers tur har lærredet plads (mindst 140 px) i alle fire trin, alt er inden for skærmen, og "‹ Hylden" dækker ikke kapitlets titel`,
    målR.length === 4 && målR.every((m) => m.lærred >= 140 && m.inde && !m.bred && !m.dækker), JSON.stringify(målR));
  // Rømers gåde (R3): tegningen har plads, Jorden (mindst 44 px) er inden for skærmen, og efter november kan "Svar" nås
  await O(() => atomlabTest.opdagelser.hylden());
  await O(() => atomlabTest.opdagelser.åbn('roemer'));
  await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'forside');
  await O(() => { while (atomlabTest.opdagelser.vist().opslag !== 'gaaden' && atomlabTest.opdagelser.bladr(1)); });
  await vent(page, () => atomlabTest.opdagelser.scene()?.visGåden);
  await O(() => atomlabTest.opdagelser.scene().visGåden());
  await page.waitForTimeout(300);
  const gådeMål = await O(() => {
    const inde = (x) => x.left >= -0.5 && x.right <= innerWidth + 0.5 && x.top >= -0.5 && x.bottom <= innerHeight + 0.5;
    const k = document.querySelector('#opdBog .rg-kort').getBoundingClientRect(), j = document.querySelector('#opdBog .rg-jord').getBoundingClientRect();
    return { kort: Math.round(Math.min(k.width, k.height)), jord: Math.round(Math.min(j.width, j.height)), inde: inde(j), bred: document.documentElement.scrollWidth > innerWidth + 1, vB: innerWidth, vH: innerHeight };
  });
  await O(() => atomlabTest.opdagelser.scene().flyt());
  await vent(page, () => atomlabTest.opdagelser.scene().tilstand().fase === 'tæl', null, 4000);
  await O(() => document.querySelector('#opdBog .rg-svar').scrollIntoView({ block: 'nearest' }));
  await page.waitForTimeout(400); // gåden toner ind på 0,32 s
  gådeMål.svarRet = await O(() => { const x = document.querySelector('#opdBog .rg-svar').getBoundingClientRect(); return [x.left, x.top, x.right, x.bottom, x.height].map(Math.round); });
  const [sv, so, sh, sn, sH] = gådeMål.svarRet;
  gådeMål.svar = sH >= 44 && sv >= 0 && sh <= gådeMål.vB && so >= 0 && sn <= gådeMål.vH;
  // En lav telefon på langs er ca. 390 px høj, så tegningen får ca. 190 px ved siden af linjen
  tjek(`${navn}: i Rømers gåde har tegningen plads (mindst 180 px), Jorden er en knap på mindst 44 px inden for skærmen, og "Svar" kan nås`,
    gådeMål.kort >= 180 && gådeMål.jord >= 44 && gådeMål.inde && !gådeMål.bred && gådeMål.svar, JSON.stringify(gådeMål));
  // Einsteins tur (E2): i alle fire trin har lærredet plads, og knapperne, skyderen og tallene er inden for skærmen
  await O(() => atomlabTest.opdagelser.hylden());
  await O(() => atomlabTest.opdagelser.åbn('einstein'));
  await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'forside');
  await page.click('#opdBog .bog-begynd');
  const målE = [];
  for (const trin of ['toget', 'rundtur', 'vaegten', 'gps']) {
    await vent(page, (t) => atomlabTest.opdagelser.forløb.trin() === t, trin);
    if (trin !== 'toget') await page.click('.forløb-linje .fl-gæt >> nth=0');
    await O(() => atomlabTest.opdagelser.forløb.visMigNu());
    await vent(page, () => atomlabTest.opdagelser.forløb.fase() === 'så', null, 15000);
    await page.waitForTimeout(300);
    målE.push(await O(() => {
      const inde = (x) => x.left >= -0.5 && x.right <= innerWidth + 0.5 && x.top >= -0.5 && x.bottom <= innerHeight + 0.5;
      const c = document.querySelector('#opdBog canvas').getBoundingClientRect();
      const ting = [...document.querySelectorAll('#opdBog .hs-under button, #opdBog .hs-under input, #opdBog .es-maal, .forløb-linje button')].filter((e) => e.offsetWidth).map((e) => e.getBoundingClientRect());
      const kap = document.querySelector('#opdBog .bog-kapitel'), hylde = document.getElementById('opdTilHylden').getBoundingClientRect();
      const r = document.createRange();
      r.selectNodeContents(kap);
      const tk = r.getBoundingClientRect();
      const dækker = tk.left < hylde.right && tk.right > hylde.left && tk.top < hylde.bottom && tk.bottom > hylde.top;
      return { trin: atomlabTest.opdagelser.forløb.trin(), lærred: Math.round(Math.min(c.width, c.height)), inde: inde(c) && ting.every(inde), bred: document.documentElement.scrollWidth > innerWidth + 1, dækker };
    }));
    if (trin !== 'gps') await page.click('.forløb-linje .fl-næste');
  }
  tjek(`${navn}: i Einsteins tur har lærredet plads (mindst 140 px) i alle fire trin, knapperne, skyderen og tallene er inden for skærmen, og "‹ Hylden" dækker ikke kapitlets titel`,
    målE.length === 4 && målE.every((m) => m.lærred >= 140 && m.inde && !m.bred && !m.dækker), JSON.stringify(målE));
  await ctx.close();
}

// "Hemmeligheden" (H3 trin C): Hele anagrammet som otte brikker. En forkert brik tæller ikke, de rigtige tæller bunkerne
// ned til 0, løsningen huskes (✓), og "Lav dit eget anagram" sorterer bogstaverne som Huygens
{
  const { page, ctx } = await nySide({ viewport: { width: 1280, height: 800 } }, '#opdagelser');
  const O = (f, a) => page.evaluate(f, a);
  await vent(page, påHylden, null, 15000);
  const åbnGåden = async () => {
    await O(() => atomlabTest.opdagelser.åbn('huygens'));
    await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'forside');
    await O(() => { atomlabTest.opdagelser.bladr(1); atomlabTest.opdagelser.bladr(1); });
    return vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'gaaden' && atomlabTest.opdagelser.scene()?.tilstand);
  };
  await åbnGåden();
  const t = await bogMed('huygens').tekster();
  // Introduktionen før gåden (fund 18. november 2026): først bogteksten med "Prøv gåden ›", så gåden
  const forord = await O(() => ({ forord: atomlabTest.opdagelser.scene().tilstand().forord, skjult: document.querySelector('#opdBog .ag-udfordring').hidden, tekst: document.querySelector('#opdBog .ag-forord-tekst')?.textContent ?? '' }));
  await page.click('#opdBog .ag-forord-knap');
  const efterForord = await O(() => ({ forord: atomlabTest.opdagelser.scene().tilstand().forord, ses: getComputedStyle(document.querySelector('#opdBog .ag-udfordring')).display !== 'none' }));
  const start = await O(() => ({ ...atomlabTest.opdagelser.scene().tilstand(), brikker: document.querySelectorAll('#opdBog .ag-brik').length, bunker: document.querySelectorAll('#opdBog .ag-bunke').length, knapper: document.querySelectorAll('#opdBog button.ag-bunke').length }));
  await O(() => atomlabTest.opdagelser.scene().læg('tenui', 0));
  const forkert = await O(() => atomlabTest.opdagelser.scene().tilstand());
  for (const [i, o] of t.ANAGRAM.ord.entries()) await O(([l, n]) => atomlabTest.opdagelser.scene().læg(l, n), [o.latin, i]);
  const slut = await O(() => ({ ...atomlabTest.opdagelser.scene().tilstand(), status: document.querySelector('#opdBog .ag-status')?.textContent, gemt: localStorage.getItem('atomlabOpdagelserGaader'), eget: !!document.querySelector('#opdBog .ag-eget-knap') }));
  const eget = await O(() => atomlabTest.opdagelser.scene().eget('Saturn har en ring!'));
  await O(() => atomlabTest.opdagelser.hylden());
  await åbnGåden();
  const igen = await O(() => ({ ...atomlabTest.opdagelser.scene().tilstand(), status: document.querySelector('#opdBog .ag-status')?.textContent, eget: !!document.querySelector('#opdBog .ag-eget-knap') }));
  // Den røde tråd: "Se den i bogen fra 1659 ›" bladrer videre til bogen
  if (await O(() => !!document.querySelector('#opdBog .ag-forord-knap'))) await page.click('#opdBog .ag-forord-knap');
  const tilBogen = await O(() => !!document.querySelector('#opdBog .ag-videre'));
  await page.click('#opdBog .ag-videre');
  const iBogen = await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'bogen');
  tjek('en løst gåde har også næste gang "Se den i bogen fra 1659 ›", som bladrer til bogen', tilBogen && iBogen);
  tjek('"Hemmeligheden": otte brikker og 17 bunker, der ikke er knapper, en forkert brik tæller ikke, og alle otte giver "Alle 62 er brugt"',
    start.brikker === 8 && start.bunker === 17 && start.knapper === 0 && start.tal === 62 && forkert.lagt === 0 && forkert.tal === 62
    && slut.lagt === 8 && slut.tal === 0 && slut.hel && slut.status === 'Alle 62 er brugt. Det passer.', JSON.stringify({ start, forkert, slut }));
  tjek('"Hemmeligheden" starter med introduktionen (Haag 1656, anagrammet og grunden), og "Prøv gåden" viser gåden',
    forord.forord && forord.skjult && /anagram/.test(forord.tekst) && /først/.test(forord.tekst) && !efterForord.forord && efterForord.ses, JSON.stringify({ forord, efterForord }));
  tjek('løsningen huskes (✓ næste gang), og "Lav dit eget anagram" sorterer bogstaverne som Huygens uden at gemme noget',
    /huygens/.test(slut.gemt ?? '') && slut.eget && eget === 'aa e g h i nnn rrr s t u (15)' && /✓/.test(igen.status) && igen.eget && igen.lagt === 0, JSON.stringify({ gemt: slut.gemt, eget, igen }));
  await ctx.close();
}

// Gør det selv (test 6, H3 trin D): "Se ringen forsvinde ved Saturn" fra "Det så du" åbner Solsystemet ved Saturn fra
// kanten med linjen og ringenes side (med "Hvordan ved vi det?"), og citatets knap "Læs Huygens' bog" fører tilbage
{
  const { page, ctx } = await nySide({ viewport: { width: 1280, height: 800 } }, '&forloebstart#opdagelser');
  const O = (f, a) => page.evaluate(f, a);
  await vent(page, påHylden, null, 15000);
  await O(() => atomlabTest.opdagelser.åbn('huygens'));
  await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'forside');
  await page.click('#opdBog .bog-begynd');
  await vent(page, () => atomlabTest.opdagelser.forløb.kører() === 'saturns-oerer');
  for (let i = 0; i < 4; i++) {
    await O(() => atomlabTest.opdagelser.forløb.visMigNu());
    await vent(page, () => atomlabTest.opdagelser.forløb.fase() === 'så', null, 10000);
    await page.click('.forløb-linje .fl-næste');
  }
  await vent(page, () => atomlabTest.opdagelser.forløb.fase() === 'slut');
  await page.click('.forløb-linje .fl-vej >> text=Se ringen forsvinde ved Saturn');
  const fremme = await vent(page, () => location.hash === '#solsystem' && atomlabTest.solsystem?.sted?.() === 'kanten' && atomlabTest.solsystem.fase()?.titel, null, 40000);
  const ved = await O(() => ({ sted: atomlabTest.solsystem.sted(), fase: atomlabTest.solsystem.fase(), emner: atomlabTest.solsystem.side()?.emner.map((e) => e.titel), hvorfor: [...document.querySelectorAll('#solsystem button.hvorfor')].map((b) => b.dataset.hvorfor), bog: !!document.querySelector('#solsystem [data-gaa="opdagelser:huygens"]') }));
  tjek('Gør det selv: "Se ringen forsvinde ved Saturn" åbner Saturn fra kanten med linjen, ringenes side og "Hvordan ved vi, at det er en ring?"',
    fremme && ved.sted === 'kanten' && /kanten/.test(ved.fase?.tekst ?? '') && ved.emner?.includes('Hvor tynde er ringene?') && ved.hvorfor.includes('saturnRing') && ved.bog, JSON.stringify(ved));
  await page.click('#solsystem [data-gaa="opdagelser:huygens"]');
  const tilbage = await vent(page, () => location.hash === '#opdagelser' && atomlabTest.opdagelser?.vist()?.bog === 'huygens', null, 15000);
  tjek('citatets knap "Læs Huygens\' bog" åbner bogen i Opdagelserne', tilbage);
  await ctx.close();
}

// Bogen selv (test 7, H4): siderne hentes først, når opslaget "Bogen fra 1659" åbnes, et glødende sted på s. 47 viser
// latin og dansk, og "Om Huygens" er det sidste opslag med fire "Hvorfor?" og "Vil du vide mere?" og "Ærligt talt" lukkede
{
  const { page, ctx } = await nySide({ viewport: { width: 1280, height: 800 } }, '#opdagelser');
  const O = (f, a) => page.evaluate(f, a);
  const sider = [];
  page.on('request', (r) => { const m = r.url().match(/huygens-(tavle|s\d+)\.webp/); if (m) sider.push(m[1]); });
  await vent(page, påHylden, null, 15000);
  await O(() => atomlabTest.opdagelser.åbn('huygens'));
  await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'forside');
  for (let i = 0; i < 2; i++) await page.click('#opdBog .bog-pil[data-bladr="1"]');
  const førBogen = { opslag: await O(() => atomlabTest.opdagelser.vist().opslag), sider: sider.length };
  await page.click('#opdBog .bog-pil[data-bladr="1"]');
  const hentet = await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'bogen' && atomlabTest.opdagelser.scene()?.hentet(), null, 15000);
  const faner = await O(() => [...document.querySelectorAll('#opdBog .bs-fane')].map((f) => f.textContent));
  await page.click('#opdBog .bs-fane >> text=s. 47');
  await vent(page, () => atomlabTest.opdagelser.scene()?.side() === 's47' && atomlabTest.opdagelser.scene().hentet(), null, 15000);
  const glød = await O(() => [...document.querySelectorAll('#opdBog .bs-glød')].map((g) => g.dataset.sted));
  await page.click('#opdBog .bs-glød[data-sted="saetningen"] >> nth=1');
  const forklaring = await O(() => ({
    sted: atomlabTest.opdagelser.scene().sted(),
    latin: document.querySelector('#opdBog .bs-forklaring .bs-latin')?.textContent,
    dansk: document.querySelector('#opdBog .bs-forklaring .bs-dansk')?.textContent,
    lyser: [...document.querySelectorAll('#opdBog [data-sted="saetningen"]')].every((k) => k.getAttribute('aria-pressed') === 'true'),
    linjer: document.querySelectorAll('#opdBog .bs-linjer .bs-række').length,
    linjerÅben: document.querySelector('#opdBog .bs-linjer')?.open,
    knapper: [...document.querySelectorAll('#opdBog .bs-sted-knap')].every((k) => k.getBoundingClientRect().height >= 44),
  }));
  tjek('bogen selv: siderne hentes først ved opslaget "Bogen fra 1659" (fire faner), og et glødende sted på s. 47 viser latin og dansk med "Linje for linje" lukket',
    førBogen.opslag === 'gaaden' && førBogen.sider === 0 && hentet && faner.join('|') === 'Tavlen|s. 16|s. 47|s. 48' && glød.filter((g, i, a) => a.indexOf(g) === i).join() === 'dato,raekken,saetningen'
    && forklaring.sted === 'saetningen' && forklaring.latin?.includes('Annulo cingitur') && forklaring.dansk?.includes('tynd, flad ring') && forklaring.lyser
    && forklaring.linjer === 8 && forklaring.linjerÅben === false && forklaring.knapper, JSON.stringify({ førBogen, sider, faner, glød, forklaring }));
  // Bladrer man væk og tilbage, står s. 47 og stedet der stadig, og siden hentes ikke igen
  const antal = sider.length;
  await page.click('#opdBog .bog-pil[data-bladr="1"]');
  const om = await O(() => ({
    opslag: atomlabTest.opdagelser.vist().opslag, nr: atomlabTest.opdagelser.vist().nr, ialt: atomlabTest.opdagelser.vist().antal,
    næste: document.querySelector('#opdBog .bog-pil[data-bladr="1"]').disabled,
    tal: document.querySelectorAll('#opdBog .bo-tal b').length, hvorfor: document.querySelectorAll('#opdBog [data-bo-hvorfor]').length,
    lag: atomlabTest.opdagelser.scene().lag(),
  }));
  await page.click('#opdBog [data-bo-hvorfor="1"]');
  const kort = await O(() => document.querySelector('.hvorfor-kort:not(.skjult) .hk-titel')?.textContent);
  await page.click('#opdBog .bog-pil[data-bladr="-1"]');
  const tilbage = await O(() => ({ side: atomlabTest.opdagelser.scene()?.side(), sted: atomlabTest.opdagelser.scene()?.sted(), kort: !!document.querySelector('.hvorfor-kort:not(.skjult)') }));
  await page.waitForTimeout(300);
  tjek('"Om Huygens" er det sidste opslag: to tal, fire "Hvorfor?" (et kort åbner og lukker ved bladring), "Vil du vide mere?" og "Ærligt talt" lukkede, og bogen husker s. 47',
    om.opslag === 'om' && om.nr === om.ialt - 1 && om.næste && om.tal === 2 && om.hvorfor === 4 && om.lag.map((l) => l.titel).join() === 'Vil du vide mere?,Ærligt talt' && om.lag.every((l) => !l.åben)
    && kort === 'Hvorfor et anagram?' && tilbage.side === 's47' && tilbage.sted === 'saetningen' && !tilbage.kort && sider.length === antal, JSON.stringify({ om, kort, tilbage, antal, sider: sider.length }));
  // Den røde tråd: "Næste side ›" går fra tavlen til s. 48, og "Havde han ret? ›" bladrer til "Om Huygens" med Saturn som knap
  await page.click('#opdBog .bs-fane >> text=Tavlen');
  const sti = [];
  for (let i = 0; i < 4; i++) {
    sti.push(await O(() => `${atomlabTest.opdagelser.scene()?.side?.()}:${document.querySelector('#opdBog .bs-videre')?.textContent}`));
    await page.click('#opdBog .bs-videre');
  }
  const slutOm = await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'om' && document.querySelector('#opdBog .bo-knap[data-gaa="solsystem:saturn:kanten"]'));
  tjek('"Næste side ›" går gennem de fire sider, og "Havde han ret? ›" bladrer til "Om Huygens" med "Se ringen forsvinde ved Saturn ›"',
    sti.join() === 'tavle:Næste side ›,s16:Næste side ›,s47:Næste side ›,s48:Havde han ret? ›' && slutOm, JSON.stringify(sti));
  await ctx.close();
}

// Tychos gåde, bogen fra 1573 og "Om Tycho" (T3, test 7): forordet, cirklerne (to mødes to steder, et tryk dér siger
// "begge", det tredje tal giver ét rigtigt sted, et forkert sted ryster), løsningen gemmes, "Og i dag?" og videre til
// bogen, et glødende sted i brevet, stien til "Om Tycho", og Gør det selv åbner Hvid dværg, hvor citatet og "Hvem har
// set en?" fører tilbage til bogen
{
  const { page, ctx } = await nySide({ viewport: { width: 1280, height: 800 } }, '#opdagelser');
  const O = (f, a) => page.evaluate(f, a);
  await vent(page, påHylden, null, 15000);
  await O(() => atomlabTest.opdagelser.åbn('tycho'));
  await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'forside');
  await O(() => { while (atomlabTest.opdagelser.vist().opslag !== 'gaaden' && atomlabTest.opdagelser.bladr(1)); });
  await vent(page, () => atomlabTest.opdagelser.scene()?.tilstand);
  const g = () => O(() => atomlabTest.opdagelser.scene().tilstand());
  const forord = { ...(await g()), tekst: await O(() => document.querySelector('#opdBog .ag-forord-tekst')?.textContent ?? '') };
  await page.click('#opdBog .ag-forord-knap');
  const start = await g();
  await page.click('#opdBog .tg-tal-knap[data-tycho="G"]');
  const én = await g();
  await page.click('#opdBog .tg-stjerne-knap[data-tycho="D"]');
  const to = await g();
  await page.click('#opdBog .tg-møde-knap >> nth=0');
  const begge = await g();
  // Schedir på kortet kan trykkes, selv om det andet mødested for G og D ligger lige ved den
  await page.click('#opdBog .tg-stjerne-knap[data-tycho="B"]', { timeout: 3000 });
  const tre = await g();
  await page.click('#opdBog .tg-møde-knap[data-rigtig="nej"] >> nth=0');
  const forkert = await g();
  await page.click('#opdBog .tg-møde-knap[data-rigtig="ja"]');
  const løst = { ...(await g()), gemt: await O(() => localStorage.getItem('atomlabOpdagelserGaader')), idag: await O(() => document.querySelector('#opdBog .tg-idag')?.textContent ?? ''), ny: await O(() => document.querySelectorAll('#opdBog .tg-ny polygon').length) };
  tjek('Tychos gåde: forordet (Knudstrup 1573, kometen) og så tre tal, to cirkler mødes to steder ("begge"), det tredje giver ét rigtigt sted, et forkert sted ryster bare, og "Alle tre passer" med "Og i dag?" og et ✓',
    forord.forord && /komet/.test(forord.tekst) && !start.forord && start.tegnet.length === 0 && én.tegnet.join() === 'G' && /Tag et tal mere/.test(én.linje)
    && to.møder.length === 2 && to.møder.every((x) => !x) && /To steder passer/.test(to.linje) && /begge steder/.test(begge.linje) && !begge.fundet
    && tre.møder.filter(Boolean).length === 1 && /alle tre cirkler/.test(tre.linje) && !forkert.fundet && /kun to/.test(forkert.linje)
    && løst.fundet && løst.linje === 'Alle tre passer.' && /tycho/.test(løst.gemt ?? '') && /7°\s50′/.test(løst.idag) && løst.ny === 1,
    JSON.stringify({ forord, start, én, to, begge, tre, forkert, løst }));
  // "Se tallene i bogen fra 1573 ›" bladrer til bogen, og brevet har "O crassa ingenia"
  await page.click('#opdBog .tg-videre');
  const hentet = await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'bogen' && atomlabTest.opdagelser.scene()?.hentet(), null, 15000);
  const faner = await O(() => [...document.querySelectorAll('#opdBog .bs-fane')].map((f) => f.textContent));
  await page.click('#opdBog .bs-fane >> text=Brevet');
  await vent(page, () => atomlabTest.opdagelser.scene()?.side() === 'brevet' && atomlabTest.opdagelser.scene().hentet(), null, 15000);
  await page.click('#opdBog .bs-glød[data-sted="tykhoveder"] >> nth=0');
  const brev = await O(() => ({ sted: atomlabTest.opdagelser.scene().sted(), latin: document.querySelector('#opdBog .bs-forklaring .bs-latin')?.textContent ?? '', dansk: document.querySelector('#opdBog .bs-forklaring .bs-dansk')?.textContent ?? '' }));
  await page.click('#opdBog .bs-fane >> text=Aftenen');
  const sti = [];
  for (let i = 0; i < 4; i++) {
    sti.push(await O(() => `${atomlabTest.opdagelser.scene()?.side?.()}:${document.querySelector('#opdBog .bs-videre')?.textContent}`));
    await page.click('#opdBog .bs-videre');
  }
  const om = await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'om' && document.querySelector('#opdBog .bo-knap[data-gaa="kosmos:hviddvaerg"]') && document.querySelector('#opdBog .bo-knap-linje'));
  tjek('Tychos bog fra 1573: fire faner, brevet viser "O crassa ingenia" med dansk, og "Næste side ›" går til "Havde han ret? ›" og "Om Tycho" med "Se en stjerne eksplodere ›"',
    hentet && faner.join('|') === 'Aftenen|Kortet|Brevet|Farven' && brev.sted === 'tykhoveder' && /O crassa ingenia/.test(brev.latin) && /tykke hoveder/.test(brev.dansk)
    && sti.join() === 'a:Næste side ›,b1b:Næste side ›,brevet:Næste side ›,d2:Havde han ret? ›' && om, JSON.stringify({ faner, brev, sti }));
  // Gør det selv: Hvid dværg i Kosmos med Tychos citat og "Læs Tychos bog ›" (begge veje)
  await page.click('#opdBog .bo-knap');
  const iKosmos = await vent(page, () => location.hash === '#kosmos' && atomlabTest.kosmos?.valgt?.() === 'hviddvaerg', null, 30000);
  // Citatets knap og knappen i emnet "Hvem har set en?" (det emne er lukket, til man åbner det)
  const knapper = await O(() => document.querySelectorAll('#kosmos [data-gaa="opdagelser:tycho"]').length);
  await O(() => document.querySelector('#kosmos #kosmosCitat [data-gaa="opdagelser:tycho"], #kosmos [data-gaa="opdagelser:tycho"]').click());
  const tilbage = await vent(page, () => location.hash === '#opdagelser' && atomlabTest.opdagelser?.vist()?.bog === 'tycho', null, 15000);
  tjek('Gør det selv: "Se en stjerne eksplodere" åbner Hvid dværg i Kosmos, og "Læs Tychos bog" (citatet og "Hvem har set en?") åbner bogen igen',
    iKosmos && knapper >= 2 && tilbage, JSON.stringify({ iKosmos, knapper }));
  await ctx.close();
}

// Rømers gåde, tidsskriftet og "Om Rømer" (R3, test 6): forordet, Jorden trækkes fra august til 9. november (de nye perler er
// gyldne), et forkert tal ryster, et tryk på snoren tæller, 10 er rigtigt, så fra H til E giver 16½, og løsningen gemmes med
// "Og i dag?". Videre til tidsskriftet: fire faner, listen er latin og s. 894 har 9. november, og stien ender i "Om Rømer",
// hvor Gør det selv åbner Jupiter → Månerne med kameraet ude ved månerne, og kortet dér fører tilbage til bogen
{
  const { page, ctx } = await nySide({ viewport: { width: 1280, height: 800 } }, '#opdagelser');
  const O = (f, a) => page.evaluate(f, a);
  await vent(page, påHylden, null, 15000);
  await O(() => atomlabTest.opdagelser.åbn('roemer'));
  await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'forside');
  await O(() => { while (atomlabTest.opdagelser.vist().opslag !== 'gaaden' && atomlabTest.opdagelser.bladr(1)); });
  await vent(page, () => atomlabTest.opdagelser.scene()?.tilstand);
  const g = () => O(() => atomlabTest.opdagelser.scene().tilstand());
  const forord = await g();
  await page.click('#opdBog .ag-forord-knap');
  const start = await g();
  // Jorden trækkes med musen et stykke langs banen (mod uret), og et tryk sender den resten af vejen
  const jord = await page.locator('#opdBog .rg-jord').boundingBox();
  const sol = await O(() => { const r = document.querySelector('#opdBog .rg-kort').getBoundingClientRect(); const c = document.querySelector('#opdBog .rg-sol'); return { x: r.left + Number(c.getAttribute('cx')), y: r.top + Number(c.getAttribute('cy')) }; });
  await page.mouse.move(jord.x + jord.width / 2, jord.y + jord.height / 2);
  await page.mouse.down();
  const r = Math.hypot(jord.x + jord.width / 2 - sol.x, jord.y + jord.height / 2 - sol.y);
  for (const v of [40, 55, 70]) await page.mouse.move(sol.x + r * Math.cos(v * Math.PI / 180), sol.y - r * Math.sin(v * Math.PI / 180), { steps: 3 });
  await page.mouse.up();
  const trukket = await g();
  await page.click('#opdBog .rg-jord');
  await vent(page, () => atomlabTest.opdagelser.scene().tilstand().fase === 'tæl', null, 6000);
  const nov = await g();
  await O(() => atomlabTest.opdagelser.scene().tæl(9));
  await page.click('#opdBog .rg-svar');
  const forkert = await g();
  await O(() => atomlabTest.opdagelser.scene().tæl(0));
  for (let i = 0; i < 10; i++) await O(() => atomlabTest.opdagelser.scene().tryk());
  const talt = await g();
  await page.click('#opdBog .rg-svar');
  const løst1 = await g();
  await page.click('#opdBog .rg-del-to');
  const h = await g();
  await page.click('#opdBog .rg-jord');
  await vent(page, () => atomlabTest.opdagelser.scene().tilstand().fase === 'løst', null, 15000);
  const e = await g();
  const efter = { gemt: await O(() => localStorage.getItem('atomlabOpdagelserGaader')), idag: await O(() => document.querySelector('#opdBog .tg-idag')?.textContent ?? '') };
  tjek('Rømers gåde: forordet, Jorden trækkes fra august (36 perler) til 9. november (46, de 10 nye er gyldne), et forkert tal ryster, 10 tryk på snoren er rigtigt, og fra H til E kommer 16½ til',
    forord.forord && !start.forord && start.fase === 'aug' && start.perler === 36 && start.gyldne === 0 && trukket.fase === 'aug' && trukket.dag > 74 && trukket.gyldne > 0 && trukket.gyldne < 10
    && nov.perler === 46 && nov.gyldne === 10 && forkert.fase === 'tæl' && /Tæl igen/.test(forkert.linje) && talt.talt === 10 && løst1.fase === 'løst1' && /^10 minutter, som Rømer sagde/.test(løst1.linje)
    && h.fase === 'he' && h.perler === 35 && e.gyldne === 16 && e.halv && /^16½ minut/.test(e.linje) && e.løst && /roemer/.test(efter.gemt ?? '') && /16 min 38 s/.test(efter.idag),
    JSON.stringify({ forord, start, trukket, nov, forkert, talt, løst1, h, e, efter }));
  // "Se det hele i tidsskriftet fra 1677 ›" bladrer til tidsskriftet
  await page.click('#opdBog .tg-videre');
  const hentet = await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'tidsskriftet' && atomlabTest.opdagelser.scene()?.hentet(), null, 15000);
  const faner = await O(() => [...document.querySelectorAll('#opdBog .bs-fane')].map((f) => f.textContent));
  await page.click('#opdBog .bs-fane >> text=Beviset');
  await vent(page, () => atomlabTest.opdagelser.scene()?.side() === 's894' && atomlabTest.opdagelser.scene().hentet(), null, 15000);
  await page.click('#opdBog .bs-sted-knap[data-sted="november"]');
  const bevis = await O(() => ({ engelsk: document.querySelector('#opdBog .bs-forklaring .bs-latin')?.textContent ?? '', lang: document.querySelector('#opdBog .bs-forklaring .bs-latin')?.lang, dansk: document.querySelector('#opdBog .bs-forklaring .bs-dansk')?.textContent ?? '' }));
  await page.click('#opdBog .bs-fane >> text=Listen');
  await vent(page, () => atomlabTest.opdagelser.scene()?.side() === 'liste' && atomlabTest.opdagelser.scene().hentet(), null, 15000);
  await page.click('#opdBog .bs-sted-knap[data-sted="nov9"]');
  const liste = await O(() => ({ mærke: document.querySelector('#opdBog .bs-forklaring .bs-mærke')?.textContent, lang: document.querySelector('#opdBog .bs-forklaring .bs-latin')?.lang, videre: document.querySelector('#opdBog .bs-videre')?.textContent }));
  await page.click('#opdBog .bs-videre');
  const om = await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'om' && document.querySelector('#opdBog .bo-knap[data-gaa="solsystem:jupiter:maaner"]') && document.querySelector('#opdBog .bo-knap-linje'));
  tjek('Rømers tidsskrift fra 1677: fire faner, s. 894 viser 9. november på engelsk med dansk, listen er latin, og "Men troede de ham? ›" går til "Om Rømer" med "Se Io forsvinde i Jupiters skygge ›"',
    hentet && faner.join('|') === 'Spørgsmålet|Tegningen|Beviset|Listen' && /9th of November/.test(bevis.engelsk) && bevis.lang === 'en' && /10 minutter senere/.test(bevis.dansk)
    && liste.mærke === 'Latin' && liste.lang === 'la' && liste.videre === 'Men troede de ham? ›' && om, JSON.stringify({ faner, bevis, liste }));
  // Gør det selv: Jupiter → Månerne, hvor kameraet står ude ved månerne (ikke tæt på Jupiter), og kortet fører tilbage
  await page.click('#opdBog .bo-knap');
  const iSolsystem = await vent(page, () => location.hash === '#solsystem' && atomlabTest.solsystem?.valgt?.() === 'jupiter' && atomlabTest.solsystem.sted?.() === 'maaner', null, 30000);
  const ude = await vent(page, () => Math.hypot(...atomlabTest.solsystem.kamera()) > 300, null, 15000);
  const kort = await O(() => atomlabTest.solsystem.side().emner.map((x) => x.titel));
  await O(() => document.querySelector('#solsystem [data-gaa="opdagelser:roemer"]').click());
  const tilbage = await vent(page, () => location.hash === '#opdagelser' && atomlabTest.opdagelser?.vist()?.bog === 'roemer', null, 15000);
  tjek('Gør det selv: "Se Io forsvinde i Jupiters skygge" åbner Jupiter → Månerne med kameraet ude ved månerne, og kortet "Hvordan ved man, at lyset bruger tid?" åbner Rømers bog igen',
    iSolsystem && ude && kort.includes('Hvordan ved man, at lyset bruger tid?') && tilbage, JSON.stringify({ iSolsystem, ude, kort }));
  await ctx.close();
}

// Betelgeuse (20. november 2026): "Om Tycho" har et stille link under Gør det selv, der åbner fænomenet Betelgeuse
// eksploderer i Kosmos, og adressen #kosmos:betelgeuse åbner det direkte som første skærm
{
  const { page, ctx } = await nySide({ viewport: { width: 1280, height: 800 } }, '#opdagelser');
  const O = (f, a) => page.evaluate(f, a);
  await vent(page, påHylden, null, 15000);
  await O(() => atomlabTest.opdagelser.åbn('tycho'));
  await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'forside');
  await O(() => { for (let i = 0; i < 4; i++) atomlabTest.opdagelser.bladr(1); });
  const ekstra = await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'om' && document.querySelector('#opdBog .bo-ekstra[data-gaa="kosmos:betelgeuse"]'), null, 8000);
  const stille = await O(() => { const b = document.querySelector('#opdBog .bo-ekstra'), v = document.querySelector('#opdBog .bo-knap'); return b && v && getComputedStyle(b).backgroundColor !== getComputedStyle(v).backgroundColor && b.getBoundingClientRect().height >= 44; });
  await page.click('#opdBog .bo-ekstra');
  const iKosmos = await vent(page, () => location.hash === '#kosmos' && atomlabTest.kosmos?.valgt?.() === 'betelgeuse' && atomlabTest.kosmos.fænomen()?.set?.(), null, 30000);
  await ctx.close();
  const anden = await nySide({ viewport: { width: 1280, height: 800 } }, '#kosmos:betelgeuse');
  const direkte = await vent(anden.page, () => location.hash === '#kosmos' && atomlabTest.kosmos?.valgt?.() === 'betelgeuse' && atomlabTest.kosmos.fænomen()?.set?.(), null, 30000);
  await anden.ctx.close();
  tjek('"Om Tycho": "Sådan ville en ny stjerne se ud i dag: Betelgeuse ›" er et stille link, der åbner Betelgeuse eksploderer i Kosmos, og #kosmos:betelgeuse virker som første adresse',
    ekstra && stille && iKosmos && direkte, JSON.stringify({ ekstra: !!ekstra, stille, iKosmos, direkte }));
}

// Einsteins ligning om tiden (E3, test 7): Skanningen af s. 904 hentes først dér, et glødende sted viser tysk og dansk, kontakten "Sat tekst" viser de samme linjer
// med de samme steder og huskes, når bogen åbnes igen, "Led for led" går gennem de otte led til uret fra turen (9,9), et tryk
// på V i ligningen vælger lysets fart, og "Regn selv" ryster ved et forkert svar og giver 4,3 sekunder ved det rigtige
{
  const { page, ctx } = await nySide({ viewport: { width: 1280, height: 800 } }, '#opdagelser');
  const O = (f, a) => page.evaluate(f, a);
  const sider = [];
  page.on('request', (r) => { const m = r.url().match(/einstein-(s\d+)\.webp/); if (m) sider.push(m[1]); });
  await vent(page, påHylden, null, 15000);
  await O(() => atomlabTest.opdagelser.åbn('einstein'));
  await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'forside');
  const førSiden = sider.length;
  await O(() => { const v = atomlabTest.opdagelser; while (v.vist().opslag !== 'tiden' && v.bladr(1)); });
  const hentet = await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'tiden' && atomlabTest.opdagelser.scene()?.hentet?.(), null, 15000);
  const glød = await O(() => [...document.querySelectorAll('#opdBog .bs-glød')].map((g) => g.dataset.sted));
  await page.click('#opdBog .bs-glød[data-sted="rundturen"] >> nth=1');
  const forklaring = await O(() => ({
    sted: atomlabTest.opdagelser.scene().sted(),
    tysk: document.querySelector('#opdBog .bs-forklaring .bs-latin')?.textContent,
    dansk: document.querySelector('#opdBog .bs-forklaring .bs-dansk')?.textContent,
    lukket: [...document.querySelectorAll('#opdBog .bog-ligning-opslag details')].every((d) => !d.open),
    forord: document.querySelector('#opdBog .lg-forord-tekst')?.textContent,
  }));
  tjek('Einsteins ligning: s. 904 hentes først ved opslaget "1905: Tiden", og et glødende sted viser tysk og dansk med lagene lukkede',
    hentet && førSiden === 0 && sider[0] === 's904' && glød.filter((g, i, a) => a.indexOf(g) === i).join() === 'formlen,rundturen' && forklaring.sted === 'rundturen'
    && forklaring.tysk?.includes('zurückkommt') && forklaring.dansk?.includes('bagud') && forklaring.lukket && /side 904/.test(forklaring.forord), JSON.stringify({ førSiden, sider, glød, forklaring }));
  // Kontakten: den sætte tekst har de samme linjer og steder, og valget huskes for bogen
  await page.click('#opdBog .lg-valg[data-visning="sat"]');
  const sat = await O(() => ({
    vist: getComputedStyle(document.querySelector('#opdBog .lg-sat')).display !== 'none' && getComputedStyle(document.querySelector('#opdBog .lg-skanning')).display === 'none',
    linjer: document.querySelectorAll('#opdBog .lg-sat .lg-linje').length,
    formler: document.querySelectorAll('#opdBog .lg-sat .lg-formel').length,
    steder: [...document.querySelectorAll('#opdBog .lg-sat-sted')].map((k) => k.dataset.sted),
    valgt: document.querySelector('#opdBog .lg-sat-sted[data-sted="rundturen"]')?.getAttribute('aria-pressed'),
    gemt: localStorage.getItem('atomlabBogSide'),
  }));
  await page.click('#opdBog .lg-sat-sted[data-sted="formlen"]');
  const satSted = await O(() => atomlabTest.opdagelser.scene().sted());
  await O(() => atomlabTest.opdagelser.hylden());
  await O(() => atomlabTest.opdagelser.åbn('einstein'));
  await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'forside');
  await O(() => { const v = atomlabTest.opdagelser; while (v.vist().opslag !== 'tiden' && v.bladr(1)); });
  const igen = await O(() => atomlabTest.opdagelser.scene()?.visning());
  tjek('Einsteins ligning: "Sat tekst" viser s. 904 med 33 linjer, tre formler og de samme to steder (et tryk vælger stedet), og valget huskes, når bogen åbnes igen',
    sat.vist && sat.linjer === 33 && sat.formler === 3 && sat.steder.join() === 'formlen,rundturen' && sat.valgt === 'true' && satSted === 'formlen'
    && JSON.parse(sat.gemt ?? '{}').einstein === 'sat' && igen === 'sat', JSON.stringify({ sat, satSted, igen }));
  // Led for led og et tryk på V i ligningen
  const led = [];
  for (let i = 0; i < 9; i++) { await page.click('#opdBog .lg-led-næste'); led.push(await O(() => atomlabTest.opdagelser.scene().led())); }
  const slutTekst = await O(() => document.querySelector('#opdBog .lg-led')?.textContent);
  await page.click('#opdBog .lg-fart[data-fart="0.5"]');
  const halv = await O(() => document.querySelector('#opdBog .lg-led')?.textContent);
  await page.click('#opdBog .lg-stor [data-led="V"]');
  const v = await O(() => ({ led: atomlabTest.opdagelser.scene().led(), lyser: [...document.querySelectorAll('#opdBog .lg-stor .lg-lyser')].map((e) => e.dataset.led), tekst: document.querySelector('#opdBog .lg-led')?.textContent }));
  tjek('Einsteins ligning: "Led for led" går gennem t, τ, v, V, v/V, (v/V)², 1 − (v/V)² og √ til uret fra turen (9,9 sekunder), en anden fart (50 %: 17,3) kan sættes ind, og et tryk på V lyser V op med "I dag skriver man c"',
    led.join() === 't,tau,v,V,brok,kvadrat,enminus,rod,slut' && /9,9/.test(slutTekst) && /0,5 · 0,5 = 0,25/.test(halv) && /17,3/.test(halv) && v.led === 'V' && v.lyser.join() === 'V' && /Lysets fart/.test(v.tekst) && /skriver man c/.test(v.tekst), JSON.stringify({ led, slutTekst, halv, v }));
  // Regn selv
  await page.click('#opdBog .lg-regn > summary');
  await page.click('#opdBog .lg-regn-knap');
  await page.click('#opdBog .lg-regn-knap');
  await page.click('#opdBog .lg-svar >> text=43 sekunder');
  const forkert = await O(() => ({ vink: document.querySelector('#opdBog .lg-regn-svar')?.textContent, trin: document.querySelectorAll('#opdBog .lg-regn-res').length }));
  await page.click('#opdBog .lg-svar >> text=4,3 sekunder');
  const rigtigt = await O(() => ({ svar: document.querySelector('#opdBog .lg-regn-svar')?.textContent, låst: [...document.querySelectorAll('#opdBog .lg-svar')].every((k) => k.disabled) }));
  tjek('Einsteins ligning: "Regn selv" går trin for trin (0,0001 og 0,00005), "43 sekunder" giver "For meget" og et vink, og "4,3 sekunder" giver svaret med 100 km/t',
    forkert.trin === 2 && /For meget/.test(forkert.vink) && /86\.400/.test(forkert.vink) && /4,3 sekunder om dagen/.test(rigtigt.svar) && /0,000 000 000 37/.test(rigtigt.svar) && rigtigt.låst,
    JSON.stringify({ forkert, rigtigt }));
  await ctx.close();
}

// Einsteins energi og tyngde (E4, test 7): Knappen videre i "1905: Tiden" fører til "1905: Energien", hvor s. 641 hentes først.
// Radium-stedet viser tysk og dansk, Led for led ender med E = mc² og tre masser, og "Regn selv" ryster ved "4 gram", giver
// 4 milliardtedele gram og Solen som del to. I "1915: Tyngden" (sidste opslag, ingen knap videre endnu) har den sætte s. 845
// 21 linjer og ti formler, skemaet har 16 felter, et felt på den skrå linje giver et vink, de seks dobbelte foldes, "16"
// ryster, og "10" giver "zehn Gleichungen". Linjen om, hvad man ikke kan, står fremme
{
  const { page, ctx } = await nySide({ viewport: { width: 1280, height: 800 } }, '#opdagelser');
  const O = (f, a) => page.evaluate(f, a);
  const sider = [];
  page.on('request', (r) => { const m = r.url().match(/einstein-(s\d+)\.webp/); if (m) sider.push(m[1]); });
  await vent(page, påHylden, null, 15000);
  await O(() => atomlabTest.opdagelser.åbn('einstein'));
  await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'forside');
  await O(() => { const v = atomlabTest.opdagelser; while (v.vist().opslag !== 'tiden' && v.bladr(1)); });
  await vent(page, () => atomlabTest.opdagelser.scene()?.hentet?.(), null, 15000);
  const videreTekst = await O(() => document.querySelector('#opdBog .lg-videre')?.textContent);
  await page.click('#opdBog .lg-videre');
  const energi = await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'energien' && atomlabTest.opdagelser.scene()?.hentet?.() && !document.querySelector('#opdBog .bog-blad'), null, 15000);
  await page.click('#opdBog .bs-glød[data-sted="radium"]');
  const radium = await O(() => ({ tysk: document.querySelector('#opdBog .bs-forklaring .bs-latin')?.textContent, dansk: document.querySelector('#opdBog .bs-forklaring .bs-dansk')?.textContent, fagord: [...document.querySelectorAll('#opdBog .lg-forord-tekst .fagord')].map((f) => f.dataset.ord) }));
  tjek('Einsteins energi: "Tre måneder senere … Hvad med massen? ›" i "1905: Tiden" fører til "1905: Energien", hvor s. 641 hentes, radium-stedet viser tysk og dansk, og forordet forklarer ordet masse',
    /Hvad med massen\?/.test(videreTekst) && energi && sider.includes('s641') && sider.indexOf('s641') > sider.indexOf('s904') && /Radiumsalzen/.test(radium.tysk) && /radiumsalte/.test(radium.dansk) && radium.fagord.join() === 'masse',
    JSON.stringify({ videreTekst, sider, radium }));
  const led = [];
  for (let i = 0; i < 6; i++) { await page.click('#opdBog .lg-led-næste'); led.push(await O(() => atomlabTest.opdagelser.scene().led())); }
  const slut1 = await O(() => document.querySelector('#opdBog .lg-led')?.textContent);
  await page.click('#opdBog .lg-fart[data-valg="2"]');
  const slutKg = await O(() => document.querySelector('#opdBog .lg-led')?.textContent);
  await page.click('#opdBog .lg-stor [data-led="L"]');
  const l = await O(() => ({ led: atomlabTest.opdagelser.scene().led(), lyser: [...document.querySelectorAll('#opdBog .lg-stor .lg-lyser')].map((e) => e.dataset.led) }));
  tjek('Einsteins energi: "Led for led" går gennem L, V², L/V², Masse og 9 · 10²⁰ til E = mc² med 1 gram (ca. 28.500 år for lampen), 1 kg giver 28 millioner år, og et tryk på L lyser L op',
    led.join() === 'L,V2,brok,masse,tal,slut' && /E = mc/.test(slut1) && /28\.500 år/.test(slut1) && /28 millioner år/.test(slutKg) && l.led === 'L' && l.lyser.join() === 'L', JSON.stringify({ led, slut1, slutKg, l }));
  await page.click('#opdBog .lg-regn > summary');
  await page.click('#opdBog .lg-regn-knap');
  await page.click('#opdBog .lg-regn-knap');
  await page.click('#opdBog .lg-svar >> text=4 gram');
  const forkert = await O(() => ({ vink: document.querySelector('#opdBog .lg-regn-svar')?.textContent, res: [...document.querySelectorAll('#opdBog .lg-regn-res')].map((e) => e.textContent) }));
  await page.click('#opdBog .lg-svar >> text=4 milliardtedele gram');
  const rigtigt = await O(() => document.querySelector('#opdBog .lg-regn-svar')?.textContent);
  await page.click('#opdBog .lg-regn-del2');
  const sol = await O(() => document.querySelector('#opdBog .lg-regn-svar')?.textContent);
  tjek('Einsteins energi: "Regn selv" giver 360.000 joule og 0,000 000 000 004 kg, "4 gram" er for meget, "4 milliardtedele gram" giver radium, og del to giver Solens 4,3 milliarder kg i sekundet',
    /360\.000 joule/.test(forkert.res[0]) && /0,000 000 000 004 kg/.test(forkert.res[1]) && /For meget/.test(forkert.vink) && /4 milliardtedele gram/.test(rigtigt) && /radium/.test(rigtigt) && /4,3 milliarder kg/.test(sol),
    JSON.stringify({ forkert, rigtigt, sol }));
  // Tyngden: den sætte side, skemaet og svaret
  await page.click('#opdBog .lg-videre');
  await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'tyngden' && atomlabTest.opdagelser.scene()?.sætVisning && !document.querySelector('#opdBog .bog-blad'), null, 5000);
  await O(() => atomlabTest.opdagelser.scene().sætVisning('sat'));
  const sat = await O(() => ({
    linjer: document.querySelectorAll('#opdBog .lg-sat .lg-linje').length,
    formler: document.querySelectorAll('#opdBog .lg-sat .lg-formel').length,
    numre: [...document.querySelectorAll('#opdBog .lg-sat .lg-fnr')].map((e) => e.textContent).join(),
    steder: [...document.querySelectorAll('#opdBog .lg-sat-sted')].map((k) => k.dataset.sted).join(),
    videre: document.querySelector('#opdBog .lg-videre')?.textContent ?? '',
    ikke: getComputedStyle(document.querySelector('#opdBog .lg-ikke')).display !== 'none' && /universitetet/.test(document.querySelector('#opdBog .lg-ikke').textContent),
    fagord: [...document.querySelectorAll('#opdBog .lg-forord-tekst .fagord')].map((f) => f.dataset.ord).join(),
  }));
  tjek('Einsteins tyngde: "Sat tekst" viser s. 845 med 21 linjer, ti formler med Einsteins numre og stederne "ti" og "stof", knappen videre er "Havde han ret? ›" (E5), linjen om universitetsmatematikken står fremme, og forordet forklarer feltligningen',
    sat.linjer === 21 && sat.formler === 10 && sat.numre === '(2),(3),(3a),(4),(2a),(5),(6),(3a),(7),(7a)' && sat.steder === 'ti,stof' && sat.videre === 'Havde han ret? ›' && sat.ikke && sat.fagord === 'feltligning', JSON.stringify(sat));
  await page.click('#opdBog .lg-regn > summary');
  const felter = await O(() => document.querySelectorAll('#opdBog .lg-felt').length);
  await page.click('#opdBog .lg-regn-knap');
  await page.click('#opdBog .lg-felt[data-i="3"][data-m="3"]');
  const skrå = await O(() => document.querySelector('#opdBog .lg-regn-svar')?.textContent);
  await page.click('#opdBog .lg-felt[data-i="1"][data-m="2"]');
  await page.click('#opdBog .lg-felt[data-i="4"][data-m="1"]'); // makkeren under den skrå linje virker også
  for (const [i, m] of [[1, 3], [2, 3], [2, 4], [3, 4]]) await page.click(`#opdBog .lg-felt[data-i="${i}"][data-m="${m}"]`);
  const foldet = await O(() => ({ regn: atomlabTest.opdagelser.scene().regn(), væk: document.querySelectorAll('#opdBog .lg-felt.lg-foldet').length, dobbelt: document.querySelectorAll('#opdBog .lg-felt.lg-dobbelt').length }));
  await page.click('#opdBog .lg-svar >> text=16');
  const for16 = await O(() => document.querySelector('#opdBog .lg-regn-svar')?.textContent);
  await page.click('#opdBog .lg-svar >> text=10');
  const svar = await O(() => document.querySelector('#opdBog .lg-regn-svar')?.textContent);
  tjek('Einsteins tyngde: skemaet har 16 felter, G₃₃ på den skrå linje giver et vink, de seks dobbelte foldes oven på deres makker, "16" er for mange, og "10" giver "zehn Gleichungen"',
    felter === 16 && /skrå linje/.test(skrå) && foldet.regn.foldet === 6 && foldet.regn.trin === 2 && foldet.væk === 6 && foldet.dobbelt === 6 && /For mange/.test(for16) && /zehn Gleichungen/.test(svar),
    JSON.stringify({ felter, skrå, foldet, for16, svar }));
  // "Om Einstein" (E5, test 7): "Havde han ret? ›" fører til bogens sidste opslag med to tal, de fire spørgsmål, Gør det
  // selv (Rejsen i tid) og det stille link til Sort hul. Et "Hvorfor?" åbner sit kort, og den vigtige knap åbner Rejsen i tid
  await page.click('#opdBog .lg-videre');
  await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'om' && !document.querySelector('#opdBog .bog-blad'), null, 5000);
  const om = await O(() => ({
    nr: atomlabTest.opdagelser.vist().nr, antal: atomlabTest.opdagelser.vist().antal, sidste: document.querySelector('#opdBog .bog-pil[data-bladr="1"]').disabled,
    navn: document.querySelector('#opdBog .bo-navn')?.textContent, tal: document.querySelectorAll('#opdBog .bo-tal p').length,
    knap: document.querySelector('#opdBog .bo-knap')?.dataset.gaa, ekstra: document.querySelector('#opdBog .bo-ekstra')?.dataset.gaa,
    hvorfor: document.querySelectorAll('#opdBog button[data-bo-hvorfor]').length, lag: atomlabTest.opdagelser.scene()?.lag?.() ?? [],
  }));
  await page.click('#opdBog button[data-bo-hvorfor="2"]');
  const kort = await vent(page, () => /uendelig meget/.test(document.querySelector('.hvorfor-kort:not(.skjult)')?.textContent ?? ''), null, 3000);
  tjek('"Om Einstein": "Havde han ret? ›" fører til det sidste opslag med navnet, to tal, fire spørgsmål (lysets fart åbner sit kort), Rejsen i tid og Sort hul, og de to lag er lukkede',
    om.nr === om.antal - 1 && om.sidste && /1879-1955/.test(om.navn) && om.tal === 2 && om.knap === 'kosmos:tid' && om.ekstra === 'kosmos:sorthul' && om.hvorfor === 4
    && om.lag.length === 2 && om.lag.every((l) => !l.åben) && kort, JSON.stringify({ om, kort }));
  await page.click('#opdBog .bo-knap');
  const tid = await vent(page, () => location.hash === '#kosmos' && /Flyv/.test(document.querySelector('#kosmos')?.textContent ?? '') && /Tvillingen/.test(document.querySelector('#kosmos')?.textContent ?? ''), null, 20000);
  tjek('Gør det selv: "Send et ur på rejse ›" åbner Rejsen i tid med "Flyv" og tvillingen, som linjen siger', tid);
  await ctx.close();
}

// Links begge veje til Einsteins bog (E5, test 6): "Se Einsteins egen side fra 1905 ›" i Stjerneovnens foldeboks og
// citatet einsteinEnergi i Reaktoren åbner bogen ved opslaget "1905: Energien" (data-gaa="opdagelser:einstein:energien")
{
  const { page, ctx } = await nySide({ viewport: { width: 1280, height: 800 } }, '#fusion');
  const O = (f, a) => page.evaluate(f, a);
  await vent(page, () => !!document.querySelector('#fusion [data-gaa="opdagelser:einstein:energien"]'), null, 15000);
  await O(() => { document.querySelector('[data-lag="fus-energi"]').open = true; });
  await page.click('#fusion [data-gaa="opdagelser:einstein:energien"]');
  const fraOvnen = await vent(page, () => location.hash === '#opdagelser' && atomlabTest.opdagelser?.vist()?.bog === 'einstein' && atomlabTest.opdagelser.vist().opslag === 'energien', null, 15000);
  tjek('Stjerneovnen: "Se Einsteins egen side fra 1905 ›" åbner Einsteins bog ved "1905: Energien"', fraOvnen);
  // Bogen er åben: Et link med et andet opslag bladrer i den åbne bog
  await O(() => { const k = document.createElement('button'); k.dataset.gaa = 'opdagelser:einstein:tiden'; k.id = 'tmpLink'; document.body.append(k); });
  await O(() => document.getElementById('tmpLink').click()); // knappen ligger under lærredet, så klikket sendes direkte
  const iBogen = await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'tiden', null, 5000);
  tjek('et link med et opslag åbner også det opslag, når Opdagelserne allerede er fremme', iBogen);
  // Rumtid i Kosmos: "Einsteins egen side fra 1915 ›" under "Gå videre" åbner "1915: Tyngden"
  await O(() => { location.hash = '#kosmos:rumtid'; });
  const rumtid = await vent(page, () => !!document.querySelector('#kosmos [data-gaa="opdagelser:einstein:tyngden"]'), null, 15000);
  if (rumtid) await O(() => document.querySelector('#kosmos [data-gaa="opdagelser:einstein:tyngden"]').click());
  const fraRumtid = rumtid && await vent(page, () => location.hash === '#opdagelser' && atomlabTest.opdagelser.vist()?.opslag === 'tyngden', null, 15000);
  tjek('Rumtid: "Einsteins egen side fra 1915 ›" åbner Einsteins bog ved "1915: Tyngden"', fraRumtid);
  await ctx.close();
}

// Telefon og tablet på højkant som første skærm: forsiden kan ses uden at rulle (også "Begynd"), et stryg bladrer, og
// intet ligger uden for skærmen
for (const [navn, opsætning] of [
  ['telefon', { viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 }],
  ['tablet på højkant', { viewport: { width: 768, height: 1024 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 }],
  ['telefon på langs', { viewport: { width: 812, height: 375 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 }],
]) {
  const { page, ctx } = await nySide(opsætning, '#opdagelser');
  await vent(page, påHylden, null, 15000);
  const hylde = await page.evaluate(() => {
    const r = [...document.querySelectorAll('#opdHylde [data-bog], #opdLinje')].map((e) => e.getBoundingClientRect());
    // Navnet på omslaget står over årstallet (fundet på en telefon med "TYCHO BRAHE" på to linjer, T3)
    const navneOverÅret = [...document.querySelectorAll('#opdHylde .opd-plads')].every((p) => {
      const n = p.querySelector('.opd-omslag-navn, .opd-ryg-navn')?.getBoundingClientRect(), å = p.querySelector('.opd-år').getBoundingClientRect();
      return !n || n.bottom <= å.top + 0.5;
    });
    return navneOverÅret && r.every((x) => x.left >= 0 && x.right <= innerWidth + 0.5 && x.top >= 0 && x.bottom <= innerHeight + 0.5)
      && [...document.querySelectorAll('#opdHylde [data-bog]')].every((e) => e.getBoundingClientRect().width >= 44);
  });
  await page.evaluate(() => atomlabTest.opdagelser.åbn('huygens'));
  await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'forside');
  await page.waitForFunction(() => document.querySelector('#opdBog .bog-portræt img')?.complete, null, { timeout: 8000 }).catch(() => {});
  const bog = await page.evaluate(() => {
    const ramme = document.querySelector('#opdBog .bog-ramme').getBoundingClientRect();
    const knap = document.querySelector('#opdBog .bog-begynd').getBoundingClientRect();
    const knapper = [...document.querySelectorAll('#opdBog .bog-bund button')].map((e) => e.getBoundingClientRect());
    const inde = (x) => x.left >= 0 && x.right <= innerWidth + 0.5 && x.bottom <= innerHeight + 0.5;
    return {
      begyndSes: knap.top >= ramme.top && knap.bottom <= ramme.bottom + 0.5,
      knapper: knapper.length === 3 && knapper.every((k) => inde(k) && k.height >= 44),
      overlap: knapper.some((a, i) => knapper.some((c, j) => i < j && a.right > c.left + 0.5 && c.right > a.left + 0.5 && a.bottom > c.top && c.bottom > a.top)),
      bred: document.documentElement.scrollWidth > innerWidth + 1,
    };
  });
  // Et vandret stryg med fingeren bladrer frem
  const r = await page.evaluate(() => { const b = document.querySelector('#opdBog .bog-ramme').getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; });
  const cdp = await ctx.newCDPSession(page);
  const rør = (type, x) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y: r.y }] });
  await rør('touchStart', r.x + 100);
  for (let i = 1; i <= 5; i++) await rør('touchMove', r.x + 100 - i * 40);
  await rør('touchEnd');
  const strøget = await vent(page, () => atomlabTest.opdagelser.vist()?.nr === 1, null, 3000);
  tjek(`${navn}: hylden og bogens knapper er inden for skærmen (mindst 44 px), "Begynd" ses uden at rulle, og et stryg bladrer`,
    hylde && bog.begyndSes && bog.knapper && !bog.overlap && !bog.bred && strøget, JSON.stringify({ hylde, ...bog, strøget }));
  // Tychos forside (T1): portrættet og spørgsmålet ses uden at rulle, og intet går ud til siden
  await page.keyboard.press('Escape');
  await vent(page, påHylden);
  await page.evaluate(() => atomlabTest.opdagelser.åbn('tycho'));
  await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'forside' && document.getElementById('opdBog').dataset.bog === 'tycho');
  const tf = await page.evaluate(() => {
    const ramme = document.querySelector('#opdBog .bog-ramme').getBoundingClientRect();
    const ses = (s) => { const x = document.querySelector(s)?.getBoundingClientRect(); return !!x && x.top >= ramme.top - 0.5 && x.top < ramme.bottom && x.left >= 0 && x.right <= innerWidth + 0.5; };
    const kort = document.querySelector('#opdBog .bog-kort');
    return { portræt: ses('#opdBog .bog-portræt img'), titel: ses('#opdBog .bog-titel'), kort: !kort?.offsetWidth || kort.getBoundingClientRect().right <= innerWidth + 0.5, bred: document.documentElement.scrollWidth > innerWidth + 1 };
  });
  tjek(`${navn}: Tychos forside har portrættet og spørgsmålet fremme, W'et er inden for skærmen, og intet går ud til siden`, tf.portræt && tf.titel && tf.kort && !tf.bred, JSON.stringify(tf));
  // Rømers forside (R1): portrættet, spørgsmålet og introduktionen ses uden at rulle, kikkerten er inden for skærmen (eller
  // skjult på en lille telefon), og intet går ud til siden
  await page.evaluate(() => atomlabTest.opdagelser.åbn('roemer'));
  await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'forside' && document.getElementById('opdBog').dataset.bog === 'roemer');
  const rf = await page.evaluate(() => {
    const ramme = document.querySelector('#opdBog .bog-ramme').getBoundingClientRect();
    const ses = (s) => { const x = document.querySelector(s)?.getBoundingClientRect(); return !!x && x.top >= ramme.top - 0.5 && x.top < ramme.bottom && x.left >= 0 && x.right <= innerWidth + 0.5; };
    const k = document.querySelector('#opdBog .bog-kikkert');
    return { portræt: ses('#opdBog .bog-portræt img'), titel: ses('#opdBog .bog-titel'), intro: ses('#opdBog .bog-intro-tekst'), kikkert: !k?.offsetWidth || (k.getBoundingClientRect().right <= innerWidth + 0.5 && k.getBoundingClientRect().left >= 0), bred: document.documentElement.scrollWidth > innerWidth + 1 };
  });
  tjek(`${navn}: Rømers forside har portrættet, spørgsmålet og introduktionen fremme uden at rulle, kikkerten er inden for skærmen, og intet går ud til siden`, rf.portræt && rf.titel && rf.intro && rf.kikkert && !rf.bred, JSON.stringify(rf));
  // Einsteins forside (E1): portrættet, spørgsmålet og introduktionens første linje ses uden at rulle, vignetten er inden for
  // skærmen (eller skjult på en lille telefon), og intet går ud til siden
  await page.evaluate(() => atomlabTest.opdagelser.åbn('einstein'));
  await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'forside' && document.getElementById('opdBog').dataset.bog === 'einstein');
  const ef = await page.evaluate(() => {
    const ramme = document.querySelector('#opdBog .bog-ramme').getBoundingClientRect();
    const ses = (s) => { const x = document.querySelector(s)?.getBoundingClientRect(); return !!x && x.top >= ramme.top - 0.5 && x.top < ramme.bottom && x.left >= 0 && x.right <= innerWidth + 0.5; };
    const v = document.querySelector('#opdBog .bog-vignet');
    // "Begynd" (E2) ses uden at rulle: helt inden for bogens ramme og skærmen
    const k = document.querySelector('#opdBog .bog-begynd')?.getBoundingClientRect();
    const begynd = !!k && k.top >= ramme.top - 0.5 && k.bottom <= Math.min(ramme.bottom, innerHeight) + 0.5 && k.height >= 44;
    return { portræt: ses('#opdBog .bog-portræt img'), titel: ses('#opdBog .bog-titel'), intro: ses('#opdBog .bog-intro-tekst'), vignet: !v?.offsetWidth || (v.getBoundingClientRect().right <= innerWidth + 0.5 && v.getBoundingClientRect().left >= 0), bred: document.documentElement.scrollWidth > innerWidth + 1, begynd };
  });
  tjek(`${navn}: Einsteins forside har portrættet, spørgsmålet, introduktionen og "Begynd" fremme uden at rulle, vignetten er inden for skærmen, og intet går ud til siden`, ef.portræt && ef.titel && ef.intro && ef.vignet && !ef.bred && ef.begynd, JSON.stringify(ef));
  // Einsteins ligning (E3): forordet, siden og ligningen er inden for skærmen, kontakten og stederne er mindst 44 px, og
  // intet går ud til siden, både med skanningen og den sætte tekst
  for (const [opslag, visning] of ['tiden', 'energien', 'tyngden'].flatMap((o) => [[o, 'skanning'], [o, 'sat']])) {
    await page.evaluate((o) => { const v = atomlabTest.opdagelser; while (v.vist().opslag !== o && v.bladr(1)); }, opslag);
    await vent(page, () => atomlabTest.opdagelser.scene()?.sætVisning);
    await page.evaluate((x) => atomlabTest.opdagelser.scene().sætVisning(x), visning);
    await page.waitForTimeout(700);
    const lg = await page.evaluate(() => {
      const inde = (x) => x.left >= -0.5 && x.right <= innerWidth + 0.5;
      const side = document.querySelector(`#opdBog ${document.querySelector('#opdBog .bog-ligning-opslag').dataset.visning === 'sat' ? '.lg-sat' : '.lg-skanning'}`).getBoundingClientRect();
      const storEl = document.querySelector('#opdBog .lg-stor');
      const stor = storEl.getBoundingClientRect();
      const storPasser = storEl.scrollWidth <= storEl.clientWidth + 1; // ligningen går ikke ud over sin kasse (tyngden er den bredeste)
      const knapper = [...document.querySelectorAll('#opdBog :is(.lg-valg, .bs-sted-knap, .lg-led-næste)')].map((e) => e.getBoundingClientRect());
      return { side: inde(side) && side.width >= 120, stor: inde(stor) && stor.width >= 150 && storPasser, knapper: knapper.length === 5 && knapper.every((k) => inde(k) && k.height >= 40), bred: document.documentElement.scrollWidth > innerWidth + 1, mål: [side.width, stor.width].map(Math.round) };
    });
    tjek(`${navn}: Einsteins ligning om ${opslag} (${visning}) har siden og ligningen inden for skærmen, kontakten og knapperne er mindst 40 px, og intet går ud til siden`, lg.side && lg.stor && lg.knapper && !lg.bred, JSON.stringify(lg));
  }
  await page.evaluate(() => atomlabTest.opdagelser.scene().sætVisning('skanning'));
  await page.evaluate(() => atomlabTest.opdagelser.åbn('tycho')); // tilbage til Tycho til gåden nedenfor
  await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'forside' && document.getElementById('opdBog').dataset.bog === 'tycho');
  // Tychos gåde (T3): kortet og de tre tal ses uden at rulle, knapperne er mindst 44 px, og intet går ud til siden
  await page.evaluate(() => { const v = atomlabTest.opdagelser; while (v.vist().opslag !== 'gaaden' && v.bladr(1)); });
  await vent(page, () => atomlabTest.opdagelser.scene()?.visGåden);
  await page.evaluate(() => atomlabTest.opdagelser.scene().visGåden());
  await page.waitForTimeout(900); // bladet (0,3-0,45 s) og gådens toning skal være færdige
  const gåde = await page.evaluate(() => {
    const ramme = document.querySelector('#opdBog .bog-ramme').getBoundingClientRect();
    const inde = (x) => x.left >= ramme.left - 0.5 && x.right <= ramme.right + 0.5 && x.top >= ramme.top - 0.5 && x.bottom <= ramme.bottom + 0.5;
    const kort = document.querySelector('#opdBog .tg-kort').getBoundingClientRect();
    const tal = [...document.querySelectorAll('#opdBog :is(.tg-tal-knap, .tg-punkt)')].map((e) => e.getBoundingClientRect());
    return { kort: inde(kort) && kort.width >= 240, tal: tal.length === 6 && tal.every((x) => inde(x) && x.height >= 44), bred: document.documentElement.scrollWidth > innerWidth + 1, ramme: [ramme.top, ramme.bottom].map(Math.round), ud: tal.filter((x) => !inde(x) || x.height < 44).map((x) => [x.top, x.bottom, x.left, x.right, x.height].map(Math.round)) };
  });
  tjek(`${navn}: i Tychos gåde ses kortet (mindst 240 px) og de tre tal uden at rulle, knapperne er mindst 44 px, og intet går ud til siden`, gåde.kort && gåde.tal && !gåde.bred, JSON.stringify(gåde));
  await page.evaluate(() => atomlabTest.opdagelser.åbn('huygens'));
  await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'forside' && document.getElementById('opdBog').dataset.bog === 'huygens');
  // "Bogen fra 1659": fanerne og stederne er knapper på mindst 44 px inden for skærmen, og intet går ud til siden
  await page.evaluate(() => { const v = atomlabTest.opdagelser; while (v.vist().opslag !== 'bogen' && v.bladr(1)); atomlabTest.opdagelser.scene().visSide(2); });
  await vent(page, () => atomlabTest.opdagelser.scene()?.hentet(), null, 15000);
  const sider = await page.evaluate(() => {
    const k = [...document.querySelectorAll('#opdBog :is(.bs-fane, .bs-sted-knap)')].map((e) => e.getBoundingClientRect());
    const b = document.querySelector('#opdBog .bs-billede').getBoundingClientRect();
    return { knapper: k.length === 7 && k.every((x) => x.height >= 44 && x.left >= 0 && x.right <= innerWidth + 0.5), billede: b.width >= 120 && b.right <= innerWidth + 0.5, bred: document.documentElement.scrollWidth > innerWidth + 1 };
  });
  tjek(`${navn}: i "Bogen fra 1659" er fanerne og stederne mindst 44 px og inden for skærmen, og siden går ikke ud til siden`, sider.knapper && sider.billede && !sider.bred, JSON.stringify(sider));
  await ctx.close();
}

// Brede og høje pc-skærme (fund 18. november 2026, ultrabred skærm): På tavlen fik panelet til højre 0 px, fordi siden
// fyldte bogens højde og kun var begrænset af skærmens bredde. Nu har panelet plads på alle fire sider, og intet går ud
// over bogens kant
for (const [w, h] of [[3440, 1440], [2560, 1080], [1920, 1080], [1280, 720]]) {
  const { page, ctx } = await nySide({ viewport: { width: w, height: h } }, '#opdagelser');
  await vent(page, påHylden, null, 15000);
  await page.evaluate(() => atomlabTest.opdagelser.åbn('huygens'));
  await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'forside');
  await page.evaluate(() => { const v = atomlabTest.opdagelser; while (v.vist().opslag !== 'bogen' && v.bladr(1)); });
  const mål = [];
  for (let i = 0; i < 4; i++) {
    await page.evaluate((i) => atomlabTest.opdagelser.scene().visSide(i), i);
    await vent(page, () => atomlabTest.opdagelser.scene()?.hentet(), null, 15000);
    mål.push(await page.evaluate(() => {
      const r = (q) => document.querySelector(`#opdBog ${q}`).getBoundingClientRect();
      const ramme = r('.bog-ramme'), billede = r('.bs-billede'), tekst = r('.bs-tekst');
      return { side: atomlabTest.opdagelser.scene().side(), tekst: Math.round(tekst.width), inde: billede.right <= ramme.right && tekst.right <= ramme.right + 0.5 && billede.left >= ramme.left, forhold: +(billede.width / billede.height).toFixed(2) };
    }));
  }
  tjek(`${w}×${h}: i "Bogen fra 1659" har panelet ved siden af siden mindst 260 px på alle fire sider (også tavlen), og siden går ikke ud over bogen`,
    mål.every((m) => m.tekst >= 260 && m.inde) && Math.abs(mål[0].forhold - 1000 / 1069) < 0.02, JSON.stringify(mål));
  await ctx.close();
}

// Siden vendes om ryggen (18. november 2026): Et blad med det gamle opslag drejer væk og forsvinder igen, det nye opslag
// er der med det samme, og med reduceret bevægelse kommer der intet blad
for (const [navn, opsætning] of [['bladet', { viewport: { width: 1280, height: 800 } }], ['bladet med reduceret bevægelse', { viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' }]]) {
  const { page, ctx } = await nySide(opsætning, '#opdagelser');
  await vent(page, påHylden, null, 15000);
  await page.evaluate(() => atomlabTest.opdagelser.åbn('huygens'));
  await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'forside');
  const under = await page.evaluate(() => {
    document.querySelector('#opdBog .bog-pil[data-bladr="1"]').click();
    const blad = document.querySelector('#opdBog .bog-blad');
    return { blad: Boolean(blad), portræt: Boolean(blad?.querySelector('.bog-portræt')), nyt: atomlabTest.opdagelser.vist().opslag, skjult: blad?.getAttribute('aria-hidden') === 'true' && blad.inert };
  });
  const væk = await vent(page, () => !document.querySelector('#opdBog .bog-blad'), null, 3000);
  const rolig = navn.includes('reduceret');
  tjek(`${navn}: ${rolig ? 'ingen side vendes, og det nye opslag står der med det samme' : 'et blad med forsiden vendes væk og forsvinder, og det nye opslag står der med det samme'}`,
    under.nyt === 'fortaelling' && væk && (rolig ? !under.blad : under.blad && under.portræt && under.skjult), JSON.stringify(under));
  await ctx.close();
}

tjek('ingen fejl i konsollen', fejl.length === 0, fejl.join('\n'));
await b.close();
console.log(`\n${ok} OK, ${dårlig} fejl`);
process.exit(dårlig ? 1 : 0);
