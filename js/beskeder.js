// Små beskeder, der dukker op øverst på skærmen og forsvinder igen

const MAKS = 3;

export function visBesked({ titel = '', tekst = '', type = 'info', varighed = 4500 }) {
  const holder = document.getElementById('beskeder');
  const boks = document.createElement('div');
  boks.className = `besked ${type}`;
  if (titel) {
    const t = document.createElement('strong');
    t.textContent = titel;
    boks.append(t);
  }
  if (tekst) {
    const p = document.createElement('span');
    p.textContent = tekst;
    boks.append(p);
  }
  holder.append(boks);
  while (holder.children.length > MAKS) holder.firstElementChild.remove();
  requestAnimationFrame(() => boks.classList.add('vist'));
  const fjern = () => {
    boks.classList.remove('vist');
    setTimeout(() => boks.remove(), 400);
  };
  setTimeout(fjern, varighed);
  boks.addEventListener('click', fjern);
}
