// En kontakt (til/fra), der ligner kontakterne i Styr-boksen: tændt er fyldt med ✓, slukket er en tynd kant (U4 i
// docs/plan-ux.md). Gør en knap, der allerede står i index.html, til en kontakt. Navnet står altid det samme, og
// kun mærket viser, om den er tændt. Giver { knap, til, sæt(til) } tilbage.
export function lavKontakt(knap, navn = knap.textContent.trim()) {
  knap.classList.add('kontakt', 'løs');
  knap.setAttribute('role', 'switch');
  knap.innerHTML = '<span class="kontakt-boks" aria-hidden="true"></span><span class="kontakt-navn"></span>';
  knap.querySelector('.kontakt-navn').textContent = navn;
  const k = {
    knap,
    til: false,
    sæt(til) {
      k.til = Boolean(til);
      knap.classList.toggle('til', k.til);
      knap.setAttribute('aria-checked', String(k.til));
    },
  };
  k.sæt(false);
  return k;
}
