// Fælles for testene: Playwright, adressen på den lokale server og mappen til skærmbilleder.
import { mkdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Playwright findes ikke i projektet (ingen npm). Vi prøver: stien i PLAYWRIGHT, en installeret "playwright"
// og til sidst stien i Claudes udviklingsmiljø.
async function hentPlaywright() {
  const forsøg = [process.env.PLAYWRIGHT, 'playwright', '/opt/node22/lib/node_modules/playwright/index.mjs'].filter(Boolean);
  for (const navn of forsøg) {
    try {
      return await import(/[\\/]/.test(navn) ? pathToFileURL(navn).href : navn);
    } catch {
      // prøv den næste
    }
  }
  throw new Error('Playwright blev ikke fundet. Se tests/README.md.');
}

const playwright = await hentPlaywright();

// Testbrowseren tegner uden grafikkort og når kun 3-6 billeder i sekundet. Spillet regner højst 0,05 sekund frem pr.
// billede, så animationerne kører i slowmotion. Derfor tegner testene som standard hurtigt (uden glød og i lav opløsning,
// se TEST_HURTIG i js/scene3d.js). Det giver 3-8 gange flere billeder i sekundet.
// Fuld grafik: chromium.launch({ args: ARGS, fuldGrafik: true }) eller FULD_GRAFIK=1 (fx til skærmbilleder).
// Chromium på Windows skriver "GL Driver Message (… GPU stall due to ReadPixels)" som en advarsel i konsollen, når der
// tages skærmbilleder. Det er grafikdriverens støj, ikke en fejl i AtomLab, så testene får den aldrig at se
// (ellers fejler alle tests med billeder på Windows, Tid T2 7. november 2026).
const STØJ = /GL Driver Message/;
function udenStøj(side) {
  const på = side.on.bind(side);
  side.on = (hvad, f) => på(hvad, hvad === 'console' ? (m) => { if (!STØJ.test(m.text())) f(m); } : f);
  return side;
}
function stilleKontekst(ctx) {
  const nySide = ctx.newPage.bind(ctx);
  ctx.newPage = async (...a) => udenStøj(await nySide(...a));
  return ctx;
}

// Skærmene hentes først, når de åbnes (10a, docs/arkiv/plan-skaermliste.md). En test, der sætter location.hash eller trykker
// på en del i menuen, venter derfor her, til skærmen er hentet og vist (atomlabTest.klar()), ligesom man selv venter på
// "Henter …". Det sker efter goto, reload, evaluate og click. Uden ?test (ingen atomlabTest) ventes der ikke.
// En test, der selv vil se hentningen undervejs, starter browseren med ventPåSkærme: false (tests/skaermliste.mjs).
function ventendeSide(side) {
  const org = { goto: side.goto.bind(side), reload: side.reload.bind(side), evaluate: side.evaluate.bind(side), click: side.click.bind(side), vent: side.waitForFunction.bind(side) };
  const vent = (f) => org.vent(f, null, { timeout: 120000, polling: 50 });
  const efter = async (svar) => {
    try {
      await vent(() => !window.atomlabTest?.klar || window.atomlabTest.klar());
    } catch {
      // siden er lukket eller skiftet undervejs
    }
    return svar;
  };
  const efterNavigering = async (svar, valg) => {
    if (valg?.waitUntil === 'commit' || !/[?&]test\b/.test(side.url())) return svar;
    try {
      await vent(() => window.atomlabTest);
    } catch {
      // ingen testadgang (fx ingen 3D)
    }
    return efter(svar);
  };
  side.goto = async (url, valg) => efterNavigering(await org.goto(url, valg), valg);
  side.reload = async (valg) => efterNavigering(await org.reload(valg), valg);
  side.evaluate = async (...a) => efter(await org.evaluate(...a));
  side.click = async (...a) => efter(await org.click(...a));
  return side;
}

export const chromium = {
  async launch({ fuldGrafik = process.env.FULD_GRAFIK === '1', ventPåSkærme = true, ...valg } = {}) {
    const browser = await playwright.chromium.launch(valg);
    const forbered = ventPåSkærme ? ventendeSide : (side) => side;
    const nySideI = (ctx) => {
      const ny = ctx.newPage.bind(ctx);
      ctx.newPage = async (...a) => forbered(await ny(...a));
      return ctx;
    };
    const nyKontekst = browser.newContext.bind(browser);
    if (fuldGrafik) {
      browser.newContext = async (...a) => nySideI(stilleKontekst(await nyKontekst(...a)));
      const nySide = browser.newPage.bind(browser);
      browser.newPage = async (...a) => forbered(udenStøj(await nySide(...a)));
      return browser;
    }
    browser.newContext = async (...a) => {
      const ctx = nySideI(stilleKontekst(await nyKontekst(...a)));
      await ctx.addInitScript(() => { globalThis.atomlabTestHurtig = true; });
      return ctx;
    };
    browser.newPage = async (...a) => {
      const ctx = await browser.newContext(...a);
      const side = await ctx.newPage();
      side.on('close', () => ctx.close().catch(() => {}));
      return side;
    };
    return browser;
  },
};

// Den lokale server (python -m http.server 8765 i projektmappen)
export const ADRESSE = process.env.ADRESSE ?? 'http://localhost:8765';

// Grafik uden grafikkort, så testene kører ens alle steder
export const ARGS = ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];

// Mappe til skærmbilleder: tests/billeder/<navn> (gemmes ikke i git)
export function billedmappe(navn) {
  const mappe = fileURLToPath(new URL(`./billeder/${navn}`, import.meta.url));
  mkdirSync(mappe, { recursive: true });
  return mappe;
}
