# Prompt: Slet gamle grene (lokal session på jeres pc)

*Skrevet 14. november 2026 af sessionen "Småting · Overblik og de næste fem sessioner". Sessionerne i skyen må ikke slette grene (miljøets sikkerhedstjek afviser det), så det gøres i en lokal session i VS Code med jeres egen adgang til GitHub. Model: Opus eller Sonnet, effort medium. Listen fra 8. november står i [grene-der-kan-slettes.md](grene-der-kan-slettes.md), men den er forældet, så grenene tjekkes forfra.*

## Prompten (kopiér til en lokal session i VS Code)

> Spor: Småting. Ryd op i de gamle grene på GitHub i AtomLab (`origin`). Der er ca. 160 fjerngrene, og de fleste er helt merget. Læs `docs/grene-der-kan-slettes.md` (kun som baggrund, den er fra 8. november).
>
> 1. **Hent hele historien først:** `git fetch origin --prune`, og hvis klonen er kort (`git rev-parse --is-shallow-repository` siger true), så `git fetch --unshallow`. En kort klon får gamle grene til at se umergede ud.
> 2. **Rør aldrig:** `main`, `gh-pages` (hvis den findes), grene med en åben pull request, grene med commits fra de sidste 24 timer og de grene, der lige nu bruges af sessioner, der kører: `ccr-585825ed-vzqqhd` (Gåderne G4a), `ccr-c965c907-8euk2w` (Molekyler-forløbet) og `ccr-7ccb06ed-3dqb45` (overblikket). Spørg mig, hvis du er i tvivl om en gren.
> 3. **Del resten i to lister:**
>    - **A, helt merget:** `git branch -r --merged origin/main`. Alt på dem findes allerede på `main`.
>    - **B, ikke merget:** For hver gren: dato for sidste commit, emnet, hvor mange commits den er foran `main`, og om indholdet alligevel findes på `main` (`git cherry origin/main origin/<gren>` og `git diff origin/main...origin/<gren> --stat`). Skriv din anbefaling (slet eller behold) med en kort grund.
> 4. **Vis mig begge lister**, og vent på mit go. Slet ingenting før.
> 5. **Efter mit go:** Slet liste A med `git push origin --delete <gren> <gren> …` i hold på ca. 20, og kun de grene fra liste B, jeg siger ja til. Kør `git fetch origin --prune` bagefter, og tjek med `git branch -r`, at kun de rigtige er tilbage.
> 6. **Dokumenterne:** Flyt `docs/grene-der-kan-slettes.md` til `docs/arkiv/` med en linje øverst om, hvad der blev slettet og hvornår. Ret linjen "Grene, der kan slettes" i `docs/lige-nu/aabne-punkter.md`, og skriv de grene, der blev beholdt, og grunden. Lav det på en ny gren, så push, PR og merge med det samme (som CLAUDE.md siger).
>
> Slet ikke lokale grene eller filer på min computer, kun grene på GitHub.
