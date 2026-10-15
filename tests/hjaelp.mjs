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

export const { chromium } = await hentPlaywright();

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
