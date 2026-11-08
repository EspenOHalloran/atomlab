# Gemte data (localStorage)

- `atomlabFremgang`: `{ opgaver: { id: tidspunkt }, opdaget: [atomnumre] }`. Byttebørsens par har id'erne `bytte-nacl`, `bytte-lif`, `bytte-mgo`, `bytte-cacl2` og `bytte-nana` (M1b, `OPGAVER_BYTTE` i `js/data/molekyler.js`). De tæller med i Værkstedet og nulstilles med Værkstedets "Opgaver forfra".
- `atomlabLyd`: `'til'` eller `'fra'`
- `atomlabFane`: den valgte fane i infopanelet (`atom`, `kerne`, `fakta` eller `nørd`)
- `atomlabOpgaveFoldet`: `'ja'` hvis opgavepillen i toplinjen er foldet sammen
- `atomlabPaneler`: `{ skærm: { venstre, højre, kunGrafik } }`, hvilke paneler der er vist på hver skærm
- `atomlabLag`: `{ id: true/false }` for de foldebokse, man selv har åbnet eller lukket (i Kosmos og Solsystemet `side-nørd`, `side-billeder` og `side-ærligt`, ét valg for alle sider)
- `atomlabVisning`: `'ringe'` eller `'sky'`, elektronerne i Værkstedet og på grundstofkortet i Det periodiske system
- `atomlabUdgave`: den valgte udgave af atomet (`nu`, `prikker` eller `former`). Bruges kun, når `?udgaver` står i adressen (ellers er det `former`).
- `atomlabKosmos`: id på det sidst valgte fænomen i Kosmos (fx `'sorthul'`)
- `atomlabKosmosSet`: liste med id på de fænomener i Kosmos, man har kigget på (de andre har en lille prik)
- `atomlabNavne`: `'til'` eller `'fra'`, knappen "Navne" ved planeterne i Solsystemet (navnene på Mars og Saturns måner). Til fra start.
- `atomlabSolsystem` og `atomlabSolsystemSet`: det samme for Solsystemet. De flyttede fænomener flyttes fra Kosmos' nøgler første gang (`flytGemt`).
- `atomlabGuide`: `{ id: tidspunkt }` for de guider, man har set eller sprunget over (`fusion`, `reaktor-kerne`, `reaktor-kæde`, `batteri`) og `fusion-rejse` (rejsen ind i Solen)
- `atomlabSidsteDel`: id på den del, man sidst var i (fx `'kosmos'`). Ringen i menuen starter på verdenen for den del.
- `atomlabLog`: `{ sidstSet, beskeder: [{ t, titel, tekst, type, skærm, vigtig, gange }] }`, de sidste 40 beskeder til loggen (🔔). Tallet på klokken er de vigtige (piller og store advarsler), der er kommet siden `sidstSet`.
