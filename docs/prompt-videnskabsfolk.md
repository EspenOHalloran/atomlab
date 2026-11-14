# Prompt: Opdagelserne i Biblioteket, planen og drejebogen til Huygens

*Skrevet 14. november 2026 efter jeres svar (se "Jeres svar" nederst). Kun dokumenter i denne session, ingen kode i programmet. Model: Opus, effort høj. Fable tjekker drejebogen bagefter.*

## Prompten (kopiér til en ny session)

> Du hører til et nyt spor, **Opdagelserne** (videnskabsfolkene i Biblioteket). Opret `docs/lige-nu/opdagelserne.md`, og sæt en linje i tabellen i `docs/lige-nu.md` (til sidst, som de andre fælles dokumenter). Navngiv chatten "Opdagelserne · Plan og drejebog til Huygens".
>
> **Læs:** `docs/prompt-videnskabsfolk.md` (hele), `docs/fakta-videnskabsfolk.md` (øverst, afsnit 3 Huygens, Myterne, Fælder, Forslag og Jeres svar), `docs/fakta-bogsider-rettigheder.md`, `docs/retning.md` (punkt 9 og budgettet for lagene), Biblioteket i `docs/plan-verdener.md` og `docs/erfaringer/fakta-faelder-liv-og-videnskabsfolk.md` (linjerne om Huygens og Rømer). Se, hvordan en drejebog er bygget op i `docs/drejebog-lys.md` (kun formen).
>
> **Lav to ting, kun dokumenter:**
> 1. **`docs/plan-videnskabsfolk.md`:** formen for alle otte: en bog i 2D, man bladrer i (ikke 3D), i fem lag (forsiden, fortællingen, gåden fra bogen, "Gør det selv" og bogen selv for nørderne), stilen fra personens tid inden for én fælles ramme, portrætterne (rigtige portrætter fra tiden med et ens kobberstik-filter lavet i Python, som `billeder/solsystem/lav_*.py`), hvor delen ligger i menuen og koden (`js/skaerme.js`), filerne, testene og trinene (H1, H2 …, et go pr. trin). Skriftsnit: kun frie skrifter (OFL), som kopieres ind i repoet, så det virker uden net. Spørg, før en ny skrifttype eller et nyt domæne tages i brug.
> 2. **`docs/drejebog-huygens.md`:** kapitlet om Huygens som prøven, før de andre syv laves. Kernesætningen, de 4-5 billeder i fortællingen (fortalt af en fortæller, ingen opdigtede citater), anagrammet som en gåde man selv løser (bogstaverne fra 1656), knappen "Gør det selv" til Saturn (ringen fra kanten), siden 47 i *Systema Saturnium* med de glødende nøglesteder og vores egen danske oversættelse linje for linje, "Ærligt talt" og "For nørder" (fx Titan 1655 og lysets fart fra Rømers tal).
>
> **Faktatjek:** Nye fakta til fortællingen (Huygens' liv, linserne, kikkerten, Titan) og licensen for portrættet (Caspar Netscher 1671 eller et kobberstik på Wikimedia Commons) slås op og skrives i en ny fil `docs/fakta-videnskabsfolk/huygens.md` (`fakta-videnskabsfolk.md` er fuld, ca. 30 KB). Brug `/faktatjek`, og læs fælderne først. Mærk alt **Sikker**, **Ret sikker** eller **Usikker**.
>
> **Prøv filteret:** Lav et udkast af portrættet med kobberstik-filteret (et Python-værktøj, `billeder/biblioteket/lav_portraet.py`) og vis det, så I kan sige ja eller nej til stilen, før resten bygges.
>
> Slut med spørgsmål til os, og skriv vores svar ind i planen. Ret fælles dokumenter til sidst (merge `main` først), og lav PR og merge med det samme.

## Jeres svar (14. november 2026)
Fra chatten, hvor Opus foreslog formen:
1. **Portrætterne:** rigtige portrætter fra deres egen tid (malerier, kobberstik og gamle fotos) med et ens kobberstik-filter. **Ja.**
2. **Formen:** en bog i 2D, man bladrer i, ikke et 3D-rum. **Ja.**
3. **Huygens alene som prøve** først, så de andre syv. **Ja.**
4. **Personerne:** De otte fra faktagrundlaget først. **Newton og Galilei må ikke glemmes** (og da Vinci), se `docs/ideer.md` under Biblioteket.

## Jeres ønske (14. november 2026)
Flot visuelt med et tegnet portræt af hver, en indpakning i stil med personens egen tid (Huygens som en fortælling fra 1600-tallet), uddrag af værkerne og nøglesteder vist i de originale bøger. Engagerende for 12-13-årige og indholdsrigt nok til nørderne.
