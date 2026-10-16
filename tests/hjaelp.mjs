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
export const chromium = {
  async launch({ fuldGrafik = process.env.FULD_GRAFIK === '1', ...valg } = {}) {
    const browser = await playwright.chromium.launch(valg);
    if (fuldGrafik) return browser;
    const nyKontekst = browser.newContext.bind(browser);
    browser.newContext = async (...a) => {
      const ctx = await nyKontekst(...a);
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
