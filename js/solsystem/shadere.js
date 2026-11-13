// Shaderne laves på forhånd, så det ikke hakker første gang noget ses (G1 i docs/plan-grafik.md). Målt med ?maal: Hvert
// nyt shaderprogram (fx Mars' lokale net og kuglen med huller) tog 200-500 ms i testbrowseren, første gang kameraet fløj
// til et sted. renderer.compile laver programmerne til alle materialerne i objektet (også dem, der er skjult), og
// derefter gøres ét program færdigt ad gangen i de næste billeder:
// - Kan browseren oversætte i baggrunden (KHR_parallel_shader_compile, fx Chrome på pc og tablet), ventes der, til et
//   program er klar (isReady), så koster det næsten intet på hovedtråden.
// - Ellers (fx testbrowseren) venter hovedtråden på hvert program, første gang det bruges. Så sker det, ét pr. billede,
//   lige når skærmen er åbnet (mens kortene hentes), og ikke midt i en flyvning.
import { verden, TEST_HURTIG } from '../scene3d.js';

// aktiv(): om skærmen stadig er åben (ellers stoppes der). hovedtråd: false = kun hvis browseren kan oversætte i
// baggrunden (fx landskabet i Stå på Mars, som bygges, mens kameraet flyver ned: Uden baggrund ville hakket flytte fra
// landingen, hvor billedet er tonet ned, til flyvningen).
export function lavShadereFørst(objekt, aktiv = () => true, { hovedtråd = true } = {}) {
  const { renderer, komponist, kamera, scene } = verden;
  const baggrund = renderer.extensions.has('KHR_parallel_shader_compile');
  if (!baggrund && !hovedtråd) return;
  const før = renderer.getRenderTarget();
  let materialer;
  // Samme mål som tegningen: Gløden tegner scenen i et billede uden tonemapping (komponistens buffer), testene direkte
  // på skærmen. Ellers bliver det andre udgaver af shaderne, end dem der bruges.
  renderer.setRenderTarget(TEST_HURTIG ? null : komponist.readBuffer);
  try {
    materialer = [...renderer.compile(objekt, kamera, scene)];
  } catch {
    return;
  } finally {
    renderer.setRenderTarget(før);
  }
  const færdige = new Set();
  const trin = () => {
    if (!aktiv()) return;
    for (const m of materialer) {
      if (færdige.has(m)) continue;
      const p = renderer.properties.get(m).currentProgram;
      if (!p?.program) { færdige.add(m); continue; } // (materialet er fjernet eller har skiftet program)
      if (!p.isReady()) continue; // oversættes stadig i baggrunden
      p.getUniforms(); // gør programmet færdigt (Three.js gør det ellers første gang, det tegnes)
      færdige.add(m);
      if (!baggrund) break; // ét pr. billede, når hovedtråden selv skal vente
    }
    if (færdige.size < materialer.length) requestAnimationFrame(trin);
  };
  requestAnimationFrame(trin);
}
