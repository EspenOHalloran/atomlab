// Menuen som en karrusel (standard siden K3, js/karrusel.js, docs/plan-menu.md og docs/plan-verdener.md):
// verdenerne i ringen (K4) med delene som knapper i kortet, ringen (kortet forrest i midten, atomet over det), træk og kast,
// docken med verdenerne, tryk på en verden til siden, tastatur, musehjul og at ringen går rundt, en verden med én del,
// start på verdenen for den del, man sidst var i (med delen fremhævet), ✓ på en del og en verden, "Din fremgang"
// samlet under verdenerne, og at det gamle gitter, de gule piller, tallene, citatet og "Næste eventyr" er væk (K3).
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
const UD = billedmappe('karrusel');
const b = await chromium.launch({ args: ARGS });
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };
const VERDENER = ['atomer', 'kerner', 'ildogliv', 'elektricitet', 'rummet', 'biblioteket'];
const DELE = { atomer: ['vaerksted', 'system'], kerner: ['fusion', 'reaktor'], ildogliv: ['liv'], elektricitet: ['batteri'], rummet: ['solsystem', 'kosmos'], biblioteket: ['ordbog', 'gaader'] };
const størrelser = [
  ['pc', { viewport: { width: 1280, height: 800 } }],
  ['tablet', { viewport: { width: 820, height: 1180 }, hasTouch: true, isMobile: true }],
  ['tlf', { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true }],
];
for (const [navn, opts] of størrelser) {
  const fejl = [];
  const ctx = await b.newContext(opts);
  const p = await ctx.newPage();
  p.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  p.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
  const midt = () => p.evaluate(() => document.getElementById('menu').dataset.midt);
  const venMidt = async (id) => {
    try { await p.waitForFunction((i) => document.getElementById('menu').dataset.midt === i, id, { timeout: 6000 }); } catch { /* tjekket nedenfor */ }
    return midt();
  };

  // Ny bruger
  await p.goto(`${ADRESSE}/?test#`);
  await p.waitForFunction(() => document.getElementById('menu').dataset.midt);
  const start = await p.evaluate(() => {
    const menu = document.getElementById('menu');
    const vist = (el) => el && getComputedStyle(el).display !== 'none' && el.getClientRects().length > 0;
    return {
      tilstand: menu.classList.contains('karrusel-tilstand'),
      orden: [...menu.querySelectorAll('.menukort > .verden')].map((k) => k.dataset.verden),
      dele: Object.fromEntries([...menu.querySelectorAll('.menukort > .verden')].map((k) => [k.dataset.verden, [...k.querySelectorAll('a.verden-knap')].map((a) => a.getAttribute('href').slice(1))])),
      løse: menu.querySelectorAll('.menukort > a').length,
      startHer: menu.querySelector('a[href="#vaerksted"]').classList.contains('start-her'),
      sidst: menu.querySelectorAll('.verden-knap.sidst').length,
      knapper: [...menu.querySelectorAll('.verden[data-verden="atomer"] .verden-knap')].map((a) => ({ hel: a.classList.contains('verden-hel'), h: a.getBoundingClientRect().height, tab: a.tabIndex })),
      bagved: [...menu.querySelectorAll('.verden[data-verden="kerner"] .verden-knap')].map((a) => a.tabIndex),
      // En verden med én del: delens link dækker hele kortet
      hel: (() => {
        const v = menu.querySelector('.verden[data-verden="elektricitet"]');
        const a = v.querySelector('a.verden-knap');
        const [r, s] = [v.getBoundingClientRect(), a.getBoundingClientRect()];
        return a.classList.contains('verden-hel') && Math.abs(r.width - s.width) <= 3 && Math.abs(r.height - s.height) <= 3 && v.querySelector('.verden-del').textContent.includes('Batteriet');
      })(),
      højder: [...menu.querySelectorAll('.menukort > .verden')].map((k) => k.offsetHeight),
      gammelt: [...menu.querySelectorAll('.kort-fremgang, .kort, .næste-eventyr, #menuStatus, #menuCitat')].length,
      ikoner: menu.querySelectorAll('.menu-ikon').length,
      sideBredde: document.documentElement.scrollWidth - innerWidth,
      rul: menu.scrollHeight - menu.clientHeight,
    };
  });
  tjek(`${navn}: karrusellen er slået til`, start.tilstand);
  tjek(`${navn}: ringen har de 6 verdener i rækkefølge`, start.orden.join() === VERDENER.join(), start.orden.join());
  tjek(`${navn}: hver verden har sine dele som knapper, og ingen kort står løst`, JSON.stringify(start.dele) === JSON.stringify(DELE) && start.løse === 0, JSON.stringify(start.dele));
  tjek(`${navn}: en ny bruger starter på Atomer og molekyler med "Start her" på Atomværkstedet og ingen sidste del`, (await midt()) === 'atomer' && start.startHer && start.sidst === 0);
  tjek(`${navn}: knapperne i verdenen forrest er store nok til en finger og kan nås med tabulatortasten`, start.knapper.length === 2 && start.knapper.every((k) => !k.hel && k.h >= 40 && k.tab === 0), JSON.stringify(start.knapper));
  tjek(`${navn}: knapperne i en verden til siden kan ikke nås med tabulatortasten`, start.bagved.length === 2 && start.bagved.every((t) => t === -1), JSON.stringify(start.bagved));
  tjek(`${navn}: i Elektricitet (én del) dækker Batteriets link hele kortet`, start.hel);
  tjek(`${navn}: alle verdenerne er lige høje`, new Set(start.højder).size === 1, start.højder.join());
  tjek(`${navn}: ingen gule piller, linje med tal, citat, "Næste eventyr" eller gamle kort (K3)`, start.gammelt === 0, JSON.stringify(start));
  tjek(`${navn}: docken har 6 ikoner`, start.ikoner === 6, start.ikoner);
  tjek(`${navn}: siden er ikke bredere end skærmen`, start.sideBredde <= 0, start.sideBredde);
  tjek(`${navn}: menuen skal ikke rulles`, start.rul <= 1, start.rul);
  // Ringen: kortet forrest står i midten over docken, atomet står over kortet forrest, og kun 5 kort er synlige
  const ring = await p.evaluate(() => {
    const r = (el) => el.getBoundingClientRect();
    const forrest = r(document.querySelector('#menu .verden[data-verden="atomer"]'));
    const dok = r(document.querySelector('.menu-ikoner'));
    const atom = r(document.getElementById('menuVindue'));
    return {
      midtX: forrest.left + forrest.width / 2 - innerWidth / 2,
      overDok: forrest.bottom <= dok.top + 1,
      inde: forrest.top >= 0 && forrest.left >= 0 && forrest.right <= innerWidth,
      atomOver: atom.top + atom.height / 2 < forrest.top,
      skjulte: [...document.querySelectorAll('#menu .menukort > .verden')].filter((k) => k.style.visibility === 'hidden').length,
      // Afstanden fra undertitlen til toppen af elektronbanen (højkant: ingen tom plads øverst)
      luft: (() => { const g = window.atomlabTest.karrusel.geo(); return r(document.querySelector('.karrusel')).top + g.cy - g.ry - r(document.querySelector('#menu .undertitel')).bottom; })(),
      højkant: innerHeight > innerWidth * 1.05,
    };
  });
  tjek(`${navn}: kortet forrest står i midten, over docken og helt på skærmen`, Math.abs(ring.midtX) < 6 && ring.overDok && ring.inde, JSON.stringify(ring));
  tjek(`${navn}: atomet står over kortet forrest`, ring.atomOver, JSON.stringify(ring));
  tjek(`${navn}: de 3 verdener bagerst (bag atomet) er skjult`, ring.skjulte === 3, ring.skjulte);
  if (ring.højkant) tjek(`${navn}: på højkant går banen op under titlen (under 100 px luft, før ca. 210 px)`, ring.luft < 100, ring.luft);
  // Baggrunden (K2, K4): motivet for verdenen forrest toner ind, og de andre er skjult (Atomer og molekyler: elektronskyerne)
  const vægte = () => p.evaluate(() => window.atomlabTest.karrusel.baggrund());
  await p.waitForFunction(() => window.atomlabTest.karrusel.baggrund().vægte.vaerksted > 0.999, null, { timeout: 10000 }).catch(() => {});
  let bg = await vægte();
  const andre = (v, id) => Object.entries(v).filter(([k]) => k !== id).reduce((s, [, x]) => s + x, 0);
  tjek(`${navn}: baggrunden har ét motiv pr. verden og viser elektronskyerne og kun dem`, bg.synlig && bg.vægte.vaerksted > 0.999 && andre(bg.vægte, 'vaerksted') === 0 && Object.keys(bg.vægte).sort().join() === 'batteri,fusion,liv,ordbog,solsystem,vaerksted', JSON.stringify(bg));
  await p.screenshot({ path: `${UD}/${navn}-start.png` });

  // Træk: et roligt træk (holdt stille før man slipper) drejer ét kort, og et kast drejer flere.
  // Trækket starter på en af knapperne i kortet og må ikke åbne delen.
  const træk = async (andel) => {
    const { rx } = await p.evaluate(() => window.atomlabTest.karrusel.geo());
    const kort = await p.locator('#menu a[href="#vaerksted"]').boundingBox();
    const x = kort.x + kort.width / 2, y = kort.y + kort.height / 2;
    await p.mouse.move(x, y);
    await p.mouse.down();
    await p.mouse.move(x - andel * rx * 0.75, y, { steps: 12 });
    await p.waitForTimeout(250);
    await p.mouse.up();
  };
  const ro = () => p.waitForFunction(() => window.atomlabTest.karrusel.stille(), null, { timeout: 8000 }).catch(() => {});
  await træk(1);
  tjek(`${navn}: et roligt træk mod venstre drejer Kernerne frem`, (await venMidt('kerner')) === 'kerner', await midt());
  tjek(`${navn}: … og åbner ingenting`, (await p.evaluate(() => location.hash)) === '');
  await ro();
  await p.click('.menu-ikon[data-verden="atomer"]');
  await venMidt('atomer');
  await ro();
  const før = await p.evaluate(() => window.atomlabTest.karrusel.pos());
  // Kastet sendes inde på siden: testbrowseren sender kun en musebevægelse hvert halve sekund
  await p.evaluate(async () => {
    const { rx } = window.atomlabTest.karrusel.geo();
    const k = document.querySelector('#menu .verden[data-verden="atomer"] .verden-ikon');
    const r = k.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const send = (type, cx) => k.dispatchEvent(new PointerEvent(type, { pointerId: 7, isPrimary: true, button: 0, clientX: cx, clientY: y, bubbles: true }));
    const vent = () => new Promise((ok) => setTimeout(ok, 12));
    send('pointerdown', x);
    for (let i = 1; i <= 4; i++) { await vent(); send('pointermove', x - (i / 4) * 0.6 * rx * 0.75); }
    send('pointerup', x - 0.6 * rx * 0.75);
  });
  await ro();
  const efter = await p.evaluate(() => window.atomlabTest.karrusel.pos());
  tjek(`${navn}: et hurtigt kast drejer mere end ét kort`, efter - før >= 2, `${før} → ${efter}`);
  tjek(`${navn}: ringen falder på plads på et helt kort`, Number.isInteger(efter), efter);

  await p.click('.menu-ikon[data-verden="rummet"]');
  tjek(`${navn}: ikonet for Rummet drejer Rummet frem`, (await venMidt('rummet')) === 'rummet', await midt());
  await p.click('.menu-ikon[data-verden="atomer"]');
  tjek(`${navn}: ikonet for Atomer og molekyler drejer den frem`, (await venMidt('atomer')) === 'atomer', await midt());
  await ro();
  // En verden til siden åbner ikke en del, men drejer frem, også når man rammer en af dens knapper (kortene svæver, så klikket tvinges)
  await p.click('#menu a[href="#reaktor"]', { force: true });
  tjek(`${navn}: tryk på Reaktorens knap i Kernerne til siden drejer Kernerne frem`, (await venMidt('kerner')) === 'kerner', await midt());
  tjek(`${navn}: … og åbner ikke Reaktoren`, (await p.evaluate(() => location.hash)) === '');
  await ro();
  await p.click('#menu a[href="#reaktor"]', { force: true });
  let åbnet = true;
  try { await p.waitForFunction(() => location.hash === '#reaktor' && !document.getElementById('reaktor').classList.contains('skjult'), null, { timeout: 8000 }); } catch { åbnet = false; }
  tjek(`${navn}: tryk på Reaktorens knap i verdenen forrest åbner Reaktoren`, åbnet);
  tjek(`${navn}: baggrunden er skjult inde i Reaktoren`, !(await vægte()).synlig);
  await p.evaluate(() => { location.hash = ''; });
  await p.waitForFunction(() => !document.getElementById('menu').classList.contains('skjult'));
  tjek(`${navn}: tilbage i menuen står Kernerne forrest`, (await venMidt('kerner')) === 'kerner', await midt());
  tjek(`${navn}: den sidste del er gemt`, (await p.evaluate(() => localStorage.getItem('atomlabSidsteDel'))) === 'reaktor');
  tjek(`${navn}: Reaktorens knap er fremhævet (glød og prik) og kun den`, await p.evaluate(() => [...document.querySelectorAll('#menu .verden-knap.sidst')].map((a) => a.getAttribute('href')).join() === '#reaktor'));
  await p.waitForFunction(() => window.atomlabTest.karrusel.baggrund().vægte.fusion > 0.999, null, { timeout: 10000 }).catch(() => {});
  bg = await vægte();
  tjek(`${navn}: tilbage i menuen viser baggrunden Kernernes motiv (stjernen)`, bg.synlig && bg.vægte.fusion > 0.999 && andre(bg.vægte, 'fusion') === 0, JSON.stringify(bg));

  if (navn === 'pc') {
    await p.keyboard.press('ArrowRight');
    tjek('pc: piletasten → drejer Ild og liv frem', (await venMidt('ildogliv')) === 'ildogliv', await midt());
    const boks = await p.locator('#menu .karrusel').boundingBox();
    await p.mouse.move(boks.x + boks.width / 2, boks.y + 40);
    await p.mouse.wheel(0, 120);
    tjek('pc: musehjulet drejer ét kort (Elektricitet)', (await venMidt('elektricitet')) === 'elektricitet', await midt());
    await p.click('.menu-ikon[data-verden="atomer"]');
    await venMidt('atomer');
    await p.keyboard.press('ArrowLeft');
    tjek('pc: ringen går rundt: ← fra Atomer og molekyler giver Biblioteket', (await venMidt('biblioteket')) === 'biblioteket', await midt());
    // En verden med kun én del: et tryk midt på kortet åbner delen
    await p.click('.menu-ikon[data-verden="elektricitet"]');
    await venMidt('elektricitet');
    await ro();
    await p.click('#menu .verden[data-verden="elektricitet"] .verden-navn', { force: true });
    let batteri = true;
    try { await p.waitForFunction(() => location.hash === '#batteri', null, { timeout: 8000 }); } catch { batteri = false; }
    tjek('pc: et tryk på Elektricitet (én del) åbner Batteriet', batteri);
    await p.evaluate(() => { location.hash = ''; });
    await p.waitForFunction(() => !document.getElementById('menu').classList.contains('skjult'));
    tjek('pc: tilbage i menuen står Elektricitet forrest', (await venMidt('elektricitet')) === 'elektricitet', await midt());
  }

  // En klaret del får ✓, og "Din fremgang" viser tallene
  await p.evaluate(async () => {
    const { OPGAVER_BATTERI, OPGAVER_FUSION } = await import('./js/data/opgaver.js'); // opgaverne ligger i js/data/ siden 10a
    const opgaver = Object.fromEntries([...OPGAVER_BATTERI, ...OPGAVER_FUSION].map((o) => [o.id, 1]));
    localStorage.setItem('atomlabFremgang', JSON.stringify({ opgaver, opdaget: [1, 2] }));
  });
  await p.reload();
  await p.waitForFunction(() => document.getElementById('menu').dataset.midt && !document.getElementById('henter'));
  const klaret = await p.evaluate(() => {
    const efter = (el) => getComputedStyle(el, '::after').content;
    const knap = (id) => document.querySelector(`#menu a[href="#${id}"]`);
    const verden = (id) => document.querySelector(`#menu .verden[data-verden="${id}"]`);
    const ikon = (id) => document.querySelector(`.menu-ikon[data-verden="${id}"]`);
    return {
      fusion: knap('fusion').classList.contains('klaret') && efter(knap('fusion').querySelector('.kort-tekst strong')).includes('✓'),
      reaktor: knap('reaktor').classList.contains('klaret'),
      elektricitet: verden('elektricitet').classList.contains('klaret') && efter(verden('elektricitet').querySelector('.verden-navn')).includes('✓') && ikon('elektricitet').classList.contains('klaret'),
      kerner: verden('kerner').classList.contains('klaret') || ikon('kerner').classList.contains('klaret'),
      kernerTegn: efter(verden('kerner').querySelector('.verden-navn')),
    };
  });
  tjek(`${navn}: Stjerneovnen er klaret og har ✓ på sin knap`, klaret.fusion, JSON.stringify(klaret));
  tjek(`${navn}: Elektricitet (alle dele klaret) har ✓ på kortet og i docken`, klaret.elektricitet, JSON.stringify(klaret));
  tjek(`${navn}: Kernerne har intet ✓, fordi Reaktoren ikke er klaret`, !klaret.reaktor && !klaret.kerner && !klaret.kernerTegn.includes('✓'), JSON.stringify(klaret));
  await p.click('.menu-fremgang-knap');
  const dialog = await p.evaluate(() => {
    const linje = (id) => document.querySelector(`#fremgangListe [data-del="${id}"]`);
    return {
      vist: !document.getElementById('dinFremgang').classList.contains('skjult'),
      linjer: [...document.querySelectorAll('#fremgangListe li[data-del]')].map((l) => l.dataset.del),
      grupper: [...document.querySelectorAll('#fremgangListe li[data-verden]')].map((l) => l.dataset.verden + (l.classList.contains('færdig') ? '✓' : '')),
      først: document.querySelector('#fremgangListe li').dataset.verden,
      batteri: linje('batteri').textContent,
      batteriFærdig: linje('batteri').classList.contains('færdig'),
      system: linje('system').textContent,
      kosmos: linje('kosmos').textContent,
      ialt: document.getElementById('fremgangIalt').textContent,
    };
  });
  tjek(`${navn}: "Din fremgang" åbner`, dialog.vist);
  tjek(`${navn}: … med alle dele undtagen Ordbogen i verdenernes rækkefølge`, dialog.linjer.join() === Object.values(DELE).flat().slice(0, 8).join(), dialog.linjer.join());
  tjek(`${navn}: … samlet under verdenerne (uden Biblioteket), og Elektricitet er færdig`, dialog.grupper.join() === 'atomer,kerner,ildogliv,elektricitet✓,rummet' && dialog.først === 'atomer', dialog.grupper.join());
  tjek(`${navn}: … Batteriet er færdigt`, dialog.batteriFærdig && /✓ (\d+) af \1 opgaver/.test(dialog.batteri), dialog.batteri);
  tjek(`${navn}: … grundstofferne og Kosmos`, dialog.system.includes('2 af 118 opdaget') && /0 af \d+ besøgt/.test(dialog.kosmos), `${dialog.system} | ${dialog.kosmos}`);
  tjek(`${navn}: … og opgaverne i alt`, /^I alt \d+ af \d+ opgaver klaret/.test(dialog.ialt), dialog.ialt);
  await p.screenshot({ path: `${UD}/${navn}-fremgang.png` });
  await p.keyboard.press('Escape');
  tjek(`${navn}: Esc lukker "Din fremgang"`, await p.evaluate(() => document.getElementById('dinFremgang').classList.contains('skjult')));

  tjek(`${navn}: ingen konsolfejl`, fejl.length === 0, fejl.join('\n'));
  await ctx.close();
}
await b.close();
console.log(`\n${ok} OK, ${dårlig} fejl`);
process.exit(dårlig ? 1 : 0);
