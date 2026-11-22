// Fuld grafik (glød og fuld opløsning): De andre tests tegner hurtigt uden glød (se tests/hjaelp.mjs).
// Denne test afprøver gløden på pc og tablet, også når skærmen skifter størrelse, og at der ikke kommer fejl i konsollen.
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
const UD = billedmappe('grafik');
const b = await chromium.launch({ args: ARGS, fuldGrafik: true });
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };
for (const [navn, opts] of [['pc', { viewport: { width: 1280, height: 800 } }], ['tablet', { viewport: { width: 1024, height: 768 }, hasTouch: true, isMobile: true }]]) {
  const fejl = [];
  const page = await (await b.newContext(opts)).newPage();
  // Shaderen til Det sorte hul tegner langsomt i testbrowseren (ca. 1,5 billeder i sekundet på pc, langsommere, når to
  // tests kører samtidig), så et skærmbillede kan tage over 30 sekunder
  page.setDefaultTimeout(120000);
  page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
  await page.goto(`${ADRESSE}/?test#kosmos`);
  await page.waitForFunction(() => window.atomlabTest && document.querySelector('#kosmos:not(.skjult)'), null, { timeout: 20000 });
  tjek(`${navn}: hurtig tegning er slået fra`, await page.evaluate(() => !globalThis.atomlabTestHurtig));
  // Kantudglatning og den bløde glød (G2): SMAA på pc, FXAA på touch, sidst i efterbehandlingen (efter tonemappingen)
  const kant = await page.evaluate(async () => {
    const s = await import('/js/scene3d.js');
    const k = s.verden.komponist;
    const r = { slags: s.kanterSlags(), sidst: k.passes.at(-1) === s.verden.kanter, vægte: s.verden.glød.compositeMaterial.uniforms.bloomFactors.value.join(), radius: s.verden.glød.radius };
    r.otteBit = s.verden.kanter._edgesRT ? s.verden.kanter._edgesRT.texture.type === 1009 : null; // UnsignedByteType
    // Gåderne (MSAA) holder pause i den fælles udglatning og slår den til igen bagefter
    const g = await import('/js/gaader/kanter.js');
    g.udglat(true); r.pauseIGåderne = !s.verden.kanter.enabled; g.udglat(false); r.igenEfter = s.verden.kanter.enabled;
    // Skiftet (værnet) til FXAA og tilbage: samme antal trin og stadig sidst
    const n = k.passes.length, før = s.kanterSlags();
    s.skiftKanter('FXAA'); r.fxaa = s.kanterSlags() === 'FXAA' && k.passes.length === n && k.passes.at(-1) === s.verden.kanter;
    s.skiftKanter(før); r.tilbage = s.kanterSlags() === før && k.passes.length === n;
    return r;
  });
  tjek(`${navn}: kantudglatningen er ${navn === 'pc' ? 'SMAA' : 'FXAA'}, sidst i efterbehandlingen`, kant.slags === (navn === 'pc' ? 'SMAA' : 'FXAA') && kant.sidst, JSON.stringify(kant));
  if (navn === 'pc') tjek('pc: SMAA-lagene er i 8 bit', kant.otteBit === true);
  tjek(`${navn}: gløden har de bløde vægte (radius 0)`, kant.vægte === '0.8,0.55,0.5,0.55,0.65' && kant.radius === 0, kant.vægte);
  tjek(`${navn}: Gådernes MSAA holder pause i udglatningen og slår den til igen`, kant.pauseIGåderne && kant.igenEfter);
  tjek(`${navn}: skiftet til FXAA og tilbage beholder trinnene`, kant.fxaa && kant.tilbage);
  if (navn === 'pc') {
    // Rettelser efter målingen på Tab A11 (22. november 2026): skærmens loft, nye shadere og Gådernes værn
    const loft = await page.evaluate(async () => {
      const s = await import('/js/scene3d.js');
      const række = (n, ...ms) => Array.from({ length: n }, (_, i) => ms[i % ms.length]);
      const g = (tung, l) => { const x = s.trinGrænser(tung, l); return [Math.round(x.op), Math.round(x.ned)]; };
      return {
        lofter: [række(60, 11.1), række(60, 16.7), række(60, 16.7, 33.3), række(60, 33.3), række(60, 8.33), række(60, 11.1, 22.2), række(60, 16.7, 16.6, 16.8, 5)].map(s.loftAf),
        tung90: g(true, 90), tung60: g(true, 60), tung120: g(true, 120), let60: g(false, 60), let120: g(false, 120),
      };
    });
    tjek('pc: skærmens loft skønnes ud fra tiden mellem billederne (90, 60, 60 ved 40 billeder/s, 60 ved 30, 120, 90, 60)', loft.lofter.join() === '90,60,60,60,120,90,60', loft.lofter.join());
    tjek('pc: grænserne for Høj følger loftet (tung skærm ved 90: op 83, ned 68, så Kosmos med 88 får Høj på Tab A11)', loft.tung90.join() === '83,68' && loft.tung60.join() === '55,45' && loft.tung120.join() === '110,90', JSON.stringify(loft));
    tjek('pc: de lette skærme går op ved højst 58 og ned under 45 som før', loft.let60.join() === '55,45' && loft.let120.join() === '58,45', JSON.stringify(loft));
    // nyeShadere: sand lige efter, at en ny shader er lavet (i samme kald, for testbrowseren er langsom og SHADER_RO kort)
    const nyEfterShader = await page.evaluate(async () => {
      const s = await import('/js/scene3d.js');
      const THREE = await import('three');
      globalThis.atomlabShaderNr = (globalThis.atomlabShaderNr ?? 0) + 1;
      s.verden.renderer.compile(new THREE.Mesh(new THREE.PlaneGeometry(), new THREE.ShaderMaterial({ defines: { NR: globalThis.atomlabShaderNr }, fragmentShader: 'void main() { gl_FragColor = vec4(float(NR)); }' })), s.verden.kamera);
      return s.nyeShadere();
    });
    tjek('pc: nyeShadere() er sand lige efter en ny shader', nyEfterShader);
    // Gådernes værn: Testen giver selv tiderne mellem billederne (målBillede), for testbrowseren er langsom og ujævn.
    // 125 billeder/s → tændt. En ny shader og så 25 billeder/s i 2,8 s → stadig tændt (måler ikke). 25 billeder/s videre →
    // slukket. 125 billeder/s i 6 s (over 90 % af loftet) → tændt igen én gang. 25 igen → slukket for resten.
    const værnForløb = await page.evaluate(async () => {
      const s = await import('/js/scene3d.js');
      const THREE = await import('three');
      const g = await import('/js/gaader/kanter.js');
      Object.assign(g.VÆRN, { til: false, ro: 0 }); // (til: false = ingen måling af de rigtige billeder)
      g.udglat(true);
      let t = performance.now() + 1000;
      const billeder = (ms, sek) => { for (let i = 0; i < sek * 1000 / ms; i++) g.målBillede(t += ms); };
      const tilstand = () => { const v = g.værnTilstand(); return `${v.til ? 'til' : 'fra'}${v.prøvetIgen ? ' (igen)' : ''}`; };
      const r = [];
      billeder(8, 4); r.push(tilstand());
      globalThis.atomlabShaderNr = (globalThis.atomlabShaderNr ?? 0) + 1;
      s.verden.renderer.compile(new THREE.Mesh(new THREE.PlaneGeometry(), new THREE.ShaderMaterial({ defines: { NR: globalThis.atomlabShaderNr }, fragmentShader: 'void main() { gl_FragColor = vec4(float(NR)); }' })), s.verden.kamera);
      s.nyeShadere(t); // (som billedløkken: den nye shader ses på tiden t)
      billeder(40, 2.8); r.push(tilstand());
      billeder(40, 4); r.push(tilstand());
      billeder(8, 6); r.push(tilstand());
      billeder(40, 7); r.push(tilstand()); // (målingen kan begynde i de hurtige billeder lige efter, at den er slået til igen)
      billeder(8, 8); r.push(tilstand());
      r.push(g.prøver());
      g.udglat(false);
      Object.assign(g.VÆRN, { til: false, ro: 3 });
      return r.join(', ');
    });
    tjek('pc: Gådernes værn måler ikke lige efter nye shadere, slår fra under 45 billeder/s, prøver igen én gang og lader den så være slukket', værnForløb === 'til, til, fra, til (igen), fra (igen), fra (igen), 0', værnForløb);
  }
  // Supernovaen lyser meget, så gløden har noget at arbejde med
  await page.evaluate(() => { const k = atomlabTest.kosmos; k.vælg('supernova'); k.trykPå('eksplodere'); k.spol(3); k.kameraFrem(); });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${UD}/${navn}-supernova.png` });
  // Sort hul: skyggen skal være sort, også med glød (gløden bredte før lyset fra gassen ind over den, og gør det stadig,
  // når skiven lyser op)
  const trin = await page.evaluate(() => atomlabTest.kosmos.efterbehandling());
  await page.evaluate(() => { const k = atomlabTest.kosmos; k.vælg('sorthul'); k.trykPå('Vis navne'); k.kameraFrem(); }); // uden navne
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${UD}/${navn}-sorthul.png` });
  const r = await page.evaluate(() => { const b = document.getElementById('kosmosVindue').getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
  // Lidt over midten, så gassen foran skyggen ikke er med
  // Lysstyrken i et lille felt lidt over midten (så gassen foran skyggen ikke er med). Billedet læses i siden.
  const felt = await page.screenshot({ clip: { x: r.x - 8, y: r.y - 38, width: 16, height: 16 } });
  const lys = await page.evaluate(async (b64) => {
    const img = new Image();
    img.src = 'data:image/png;base64,' + b64;
    await img.decode();
    const g = new OffscreenCanvas(img.width, img.height).getContext('2d');
    g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 0, img.width, img.height).data;
    let sum = 0;
    for (let i = 0; i < d.length; i += 4) sum += (d[i] + d[i + 1] + d[i + 2]) / 3;
    return sum / (d.length / 4);
  }, felt.toString('base64'));
  tjek(`${navn}: det sorte hul er sort i midten med glød`, lys < 20, `lysstyrke ${lys.toFixed(1)}`);
  // Lysbøjningen (js/kosmos/linse.js): skyggens kant sidder ved √27 M, og den side af skiven, der kommer mod os, er lysere.
  // Kameraet står fast 31 enheder væk og 11,3° over skiven. Skiven drejer mod uret set ovenfra, så venstre side kommer mod os.
  await page.evaluate(() => atomlabTest.kosmos.fænomen().kamera(31, 11.3, 0));
  await page.waitForTimeout(2500);
  const sk = await page.evaluate(() => atomlabTest.kosmos.fænomen().skygge());
  const hel = await page.screenshot();
  const måling = await page.evaluate(async ([b64, sk]) => {
    const img = new Image();
    img.src = 'data:image/png;base64,' + b64;
    await img.decode();
    const g = new OffscreenCanvas(img.width, img.height).getContext('2d');
    g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 0, img.width, img.height).data;
    const lys = (x, y) => { const i = (Math.round(y) * img.width + Math.round(x)) * 4; return (d[i] + d[i + 1] + d[i + 2]) / 3; };
    // Den første lyse pixel ud fra midten: op, op til venstre og op til højre (nedad går skiven hen foran skyggen)
    const kant = [90, 135, 45].map((v) => {
      const a = (v * Math.PI) / 180;
      for (let r = 0; r < sk.r * 1.5; r += 0.5) if (lys(sk.x + Math.cos(a) * r, sk.y - Math.sin(a) * r) > 12) return r / sk.r;
      return null;
    });
    const felt = (cx, cy) => { let s = 0, n = 0; for (let y = cy - 10; y <= cy + 10; y++) for (let x = cx - 10; x <= cx + 10; x++) { s += lys(x, y); n++; } return s / n; };
    return { kant, venstre: felt(sk.x - 1.7 * sk.r, sk.y), højre: felt(sk.x + 1.7 * sk.r, sk.y) };
  }, [hel.toString('base64'), sk]);
  tjek(`${navn}: skyggens kant sidder ved √27 M (± 5 %) op og skråt op`, måling.kant.every((k) => k !== null && Math.abs(k - 1) < 0.05), `${JSON.stringify(måling.kant)} radius ${sk.r.toFixed(1)}`);
  tjek(`${navn}: den side af skiven, der kommer mod os, er mindst 2 gange lysere`, måling.venstre > 2 * måling.højre, `${måling.venstre.toFixed(1)} mod ${måling.højre.toFixed(1)}`);
  // Dynamisk opløsning: testbrowseren er langsom, så opløsningen skal gå ned, når den er slået til
  const skala = await page.evaluate(() => atomlabTest.kosmos.fænomen().linseSkala());
  await page.evaluate(() => atomlabTest.kosmos.fænomen().dynamisk(true));
  await page.waitForFunction((s) => atomlabTest.kosmos.fænomen().linseSkala() < s, skala, { timeout: 60000, polling: 500 }).catch(() => {});
  tjek(`${navn}: den dynamiske opløsning går ned, når det går langsomt`, (await page.evaluate(() => atomlabTest.kosmos.fænomen().linseSkala())) < skala);
  tjek(`${navn}: sort hul lægger to trin til efterbehandlingen`, (await page.evaluate(() => atomlabTest.kosmos.efterbehandling())) === trin + 2);
  await page.evaluate(() => atomlabTest.kosmos.vælg('supernova'));
  tjek(`${navn}: trinnene fjernes igen, når man skifter fænomen`, (await page.evaluate(() => atomlabTest.kosmos.efterbehandling())) === trin);
  // Ny størrelse: lærredet og gløden skal følge med
  const [w, h] = [opts.viewport.height, opts.viewport.width];
  await page.setViewportSize({ width: w, height: h });
  // Vent på den nye størrelse i stedet for en fast tid (under belastning kan et billede tage over 1,5 s)
  await page.waitForFunction(([w, h]) => { const c = document.getElementById('lærred'); return c.clientWidth === w && c.clientHeight === h; }, [w, h], { timeout: 30000 }).catch(() => {});
  const lærred = await page.evaluate(() => { const c = document.getElementById('lærred'); return { w: c.clientWidth, h: c.clientHeight }; });
  tjek(`${navn}: lærredet følger med en ny størrelse`, lærred.w === w && lærred.h === h, JSON.stringify(lærred));
  await page.evaluate(() => { location.hash = '#vaerksted'; });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${UD}/${navn}-vaerksted.png` });
  if (navn === 'pc') {
    // Kvalitetstrinnet findes kun på touch: På pc ændrer sætTrin intet
    const pc = await page.evaluate(async () => { const s = await import('/js/scene3d.js'); const før = s.verden.renderer.getPixelRatio(); s.sætTrin('høj'); return { trin: s.kvalitetstrin(), ens: s.verden.renderer.getPixelRatio() === før, kanter: s.kanterSlags() }; });
    tjek('pc: kvalitetstrinnet ændrer intet på pc', pc.trin === 'basis' && pc.ens && pc.kanter === 'SMAA', JSON.stringify(pc));
    // Skygge i krogene (G4): lige efter tegningen af scenen, i halv opløsning, og kun på de skærme, der vælger den
    const ao = () => page.evaluate(async () => { const k = await import('/js/krogskygge.js'); const s = await import('/js/scene3d.js'); return { ...k.krogskygge(), lærred: s.verden.renderer.domElement.width, kanterSidst: s.verden.komponist.passes.at(-1) === s.verden.kanter }; });
    const iVærksted = await ao();
    tjek('pc: skygge i krogene i Værkstedet, lige efter scenen, i halv opløsning, og kantudglatningen er stadig sidst', iVærksted.til && iVærksted.plads === 1 && Math.abs(iVærksted.bredde - iVærksted.lærred / 2) <= 1 && iVærksted.kanterSidst, JSON.stringify(iVærksted));
    await page.evaluate(() => { location.hash = '#kosmos'; });
    await page.waitForFunction(() => atomlabTest.klar(), null, { timeout: 30000 });
    tjek('pc: ingen skygge i krogene i Kosmos', (await ao()).plads === -1);
    await page.evaluate(() => { location.hash = '#reaktor'; });
    await page.waitForFunction(() => atomlabTest.klar(), null, { timeout: 30000 });
    await page.evaluate(() => atomlabTest.reaktor.tilstand('kerne'));
    const kerne = await ao();
    await page.evaluate(() => atomlabTest.reaktor.tilstand('kæde'));
    tjek('pc: Reaktoren har skyggen på urankernen, ikke i kædereaktionen', kerne.til && (await ao()).plads === -1, JSON.stringify(kerne));
    await page.evaluate(() => { location.hash = '#molekyler'; });
    await page.waitForFunction(() => atomlabTest.klar(), null, { timeout: 30000 });
    await page.waitForTimeout(500);
    const mol = await ao();
    tjek('pc: Molekyler har skyggen valgt, men tegner den kun, mens saltkrystallen vises', mol.valgt && !mol.til, JSON.stringify(mol));
  }
  tjek(`${navn}: ingen fejl i konsollen`, fejl.length === 0, fejl.join('\n'));
  await page.context().close();
}

// Kvalitetstrinnet på touch (G1 del 2, docs/plan-kvalitetstrin.md): en tablet med devicePixelRatio 2 i Værkstedet
{
  const fejl = [];
  const page = await (await b.newContext({ viewport: { width: 1024, height: 768 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 })).newPage();
  page.setDefaultTimeout(120000);
  page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
  await page.goto(`${ADRESSE}/?test#vaerksted`);
  await page.waitForFunction(() => window.atomlabTest?.klar(), null, { timeout: 30000 });
  const tilstand = () => page.evaluate(async () => {
    const s = await import('/js/scene3d.js');
    const c = s.verden.renderer.domElement;
    return { trin: s.kvalitetstrin(), pr: s.verden.renderer.getPixelRatio(), kanter: s.kanterSlags(), lærred: c.width, glød: s.verden.glød.renderTargetsHorizontal[0].width, sidst: s.verden.komponist.passes.at(-1) === s.verden.kanter };
  });
  // SMAA's shadere laves på forhånd (forvarmSMAA, 2,5 s efter start), så skiftet til Høj ikke laver nye
  await page.waitForTimeout(5000);
  const programmer = () => page.evaluate(async () => (await import('/js/scene3d.js')).verden.renderer.info.programs.length);
  const programmerFør = await programmer();
  const basis = await tilstand();
  tjek('tablet: starter i Basis (pixelRatio 1,5, FXAA, gløden i en fjerdedel)', basis.trin === 'basis' && basis.pr === 1.5 && basis.kanter === 'FXAA' && Math.abs(basis.glød - basis.lærred / 4) <= 1, JSON.stringify(basis));
  await page.evaluate(async () => (await import('/js/scene3d.js')).sætTrin('høj'));
  const høj = await tilstand();
  tjek('tablet: Høj giver pixelRatio 2, SMAA sidst og gløden i halv opløsning', høj.trin === 'høj' && høj.pr === 2 && høj.lærred === 2048 && høj.kanter === 'SMAA' && høj.sidst && Math.abs(høj.glød - høj.lærred / 2) <= 1, JSON.stringify(høj));
  await page.screenshot({ path: `${UD}/tablet-hoej-vaerksted.png` });
  tjek('tablet: skiftet til Høj laver ingen nye shadere (SMAA er lavet på forhånd)', (await programmer()) === programmerFør, `${programmerFør} → ${await programmer()}`);
  // Skygge i krogene (G4): på touch kun i Høj
  await page.evaluate(() => new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok))));
  const aoHøj = await page.evaluate(async () => (await import('/js/krogskygge.js')).krogskygge().til);
  await page.evaluate(async () => (await import('/js/scene3d.js')).sætTrin('basis'));
  await page.evaluate(() => new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok))));
  const aoBasis = await page.evaluate(async () => (await import('/js/krogskygge.js')).krogskygge().til);
  await page.evaluate(async () => (await import('/js/scene3d.js')).sætTrin('høj'));
  // Efter målingen på Tab A11 (22. november 2026): ingen skygge i krogene på touch, heller ikke i Høj (PÅ_TOUCH)
  const aoValgt = await page.evaluate(async () => { const k = (await import('/js/krogskygge.js')).krogskygge(); return k.valgt || k.plads >= 0; });
  tjek('tablet: ingen skygge i krogene i Værkstedet på touch, heller ikke i Høj', !aoHøj && !aoBasis && !aoValgt, JSON.stringify({ aoHøj, aoBasis, aoValgt }));
  // En tung skærm (Kosmos) går til Basis, når Høj er nået på en let skærm (Tab A11 må ikke tage Høj med til Kosmos)
  await page.evaluate(() => { location.hash = '#kosmos'; });
  await page.waitForFunction(() => atomlabTest.klar(), null, { timeout: 30000 });
  const kosmos = await tilstand();
  const tung = await page.evaluate(async () => (await import('/js/scene3d.js')).trinTilstand().tung);
  tjek('tablet: Kosmos er en tung skærm og går til Basis med Høj fra Værkstedet', tung && kosmos.trin === 'basis' && kosmos.pr === 1.5 && kosmos.kanter === 'FXAA' && Math.abs(kosmos.glød - kosmos.lærred / 4) <= 1, JSON.stringify(kosmos));
  // Høj nået på en tung skærm beholdes på en let og tilbage på den tunge
  await page.evaluate(async () => (await import('/js/scene3d.js')).sætTrin('høj'));
  await page.evaluate(() => { location.hash = '#vaerksted'; });
  await page.waitForFunction(() => atomlabTest.klar(), null, { timeout: 30000 });
  await page.evaluate(() => { location.hash = '#kosmos'; });
  await page.waitForFunction(() => atomlabTest.klar(), null, { timeout: 30000 });
  tjek('tablet: Høj nået i Kosmos beholdes til Værkstedet og tilbage', (await tilstand()).trin === 'høj');
  // Supernova: shaderne til eksplosionen er lavet, når fænomenet åbnes (før et ryk på 176 ms på telefonen A56)
  await page.evaluate(() => atomlabTest.kosmos.vælg('supernova'));
  let n = -1;
  for (let i = 0; i < 30 && n !== (n = await programmer()); i++) await page.waitForTimeout(2000); // til der ikke kommer flere
  await page.evaluate(() => { const k = atomlabTest.kosmos; k.trykPå('eksplodere'); k.spol(4); });
  await page.waitForTimeout(3000);
  tjek('tablet: "Lad stjernen eksplodere" laver ingen nye shadere', (await programmer()) === n, `${n} → ${await programmer()}`);
  // Den automatiske måling: Testbrowseren er langsom (under 45 billeder/s), så Høj falder tilbage til Basis og bliver der
  await page.evaluate(() => { location.hash = '#vaerksted'; });
  await page.waitForFunction(() => atomlabTest.klar(), null, { timeout: 30000 });
  await page.evaluate(async () => { const s = await import('/js/scene3d.js'); s.TRIN_GRÆNSER.ryk = 30; s.TRIN_GRÆNSER.ro = 0; s.sætTrin('høj'); s.autoTrin(true); });
  await page.waitForFunction(async () => (await import('/js/scene3d.js')).kvalitetstrin() === 'basis', null, { timeout: 60000, polling: 500 }).catch(() => {});
  await page.waitForTimeout(5000); // låst: går ikke op igen, selvom målingen fortsætter
  const auto = await tilstand();
  tjek('tablet: under 45 billeder/s falder Høj tilbage til Basis og bliver der', auto.trin === 'basis' && auto.kanter === 'FXAA', JSON.stringify(auto));
  // Kommer man tilbage til skærmen, prøver den ikke igen (ingen vippen mellem skærmene)
  await page.evaluate(() => { location.hash = '#system'; });
  await page.waitForFunction(() => atomlabTest.klar(), null, { timeout: 30000 });
  await page.evaluate(() => { location.hash = '#vaerksted'; });
  await page.waitForFunction(() => atomlabTest.klar(), null, { timeout: 30000 });
  const igen = await page.evaluate(async () => (await import('/js/scene3d.js')).trinTilstand());
  tjek('tablet: efter et fald prøver Værkstedet ikke igen, når man kommer tilbage', igen.navn === 'basis' && igen.låst, JSON.stringify(igen));
  tjek('tablet: ingen fejl i konsollen med kvalitetstrinnet', fejl.length === 0, fejl.join('\n'));
  await page.context().close();
}
await b.close();
console.log(`\n${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig ? 1 : 0);
