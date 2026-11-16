# Kendte UI/UX-fund (forberedelse til E20)

*Lavet 16. november 2026 af en hjælpeagent som forberedelse til Fables UI/UX-eftersyn E20, ud fra F1, E14 (med noter), Espens og sønnens noter, tabletlisten, planlagt.md, plan-ux.md, "Ikke afprøvet", Småting, prompt-fable-ux-nyt.md og erfaringerne. Formålet er, at Fable ikke bruger tid på at finde det samme igen. Status er tjekket mod `git log` og `git grep`; står den ikke klart, står der "Ved ikke". Fakta er ikke med.*

Forkortelser: F1 = fable/F1-overblik, E14 = fable/E14-forloeb-eftersyn, E14n = fable/E14-noter, ikke-afpr. = ikke-afproevet.md, smaa = lige-nu/smaating.md, prompt = prompt-fable-ux-nyt.md, erf = erfaringer/skaerme-og-ui.md.

## Navigation og at finde rundt
| Fund | Hvor | Status | Kilde |
|---|---|---|---|
| Solsystemet var bygget efter koden, ikke efter rejsen: steder og måner lå som knapper under "Prøv selv", teksten stod i den forkerte boks | Solsystemet | Rettet (træ, Styr-boks, side i lag, U1-U4) | plan-ux.md "Problemerne i dag", erf "Eftersyn af UX" |
| "Næste" i flybyen stod langt fra det, man kigger på; ingen "et stop tilbage" | Solsystemet, flyby | Rettet (U2). Tilbage-stop: Ved ikke | plan-ux.md pkt. 5 |
| "For nørder" lå nederst på højkant (en CSS-regel ment for Reaktoren ramte Kosmos) | Kosmos | Ved ikke (kun erfaringen om samme rodårsag er skrevet) | F1 pkt. 9 |
| Ringen: er det tydeligt, at man skal trykke på den lille knap, ikke på verdenen? Giver rækkefølgen "‹ mindre … større ›" mening? | Menuen | Åben (ikke prøvet på tablet) | ikke-afpr. "Verdenerne i ringen", "Ringen efter størrelse" |
| Finder han Molekyler (egen del) og savner fanen i Værkstedet? | Menuen, Molekyler | Åben (ikke prøvet) | ikke-afpr. "Molekyler som egen del" |
| Finder han fænomenerne i fire grupper, eller savner han den lange liste? Tomt, at Universet kun har Big Bang? | Kosmos | Åben | ikke-afpr. "Kosmos i fire grupper" |
| Skinnens "‹ mindre · større ›" kan læses som zoom; "Fra mindre til større" er ikke tydeligt (er skala, ikke størrelse) | Gåderne | Åben | prompt fund 2, E14 "Skinnen" |
| Man "tvinges" ind i Antistof først; lås eller undren? | Gåderne | Åben (er med vilje) | prompt fund 3, smaa |

## Næste skridt og forløb
| Fund | Hvor | Status | Kilde |
|---|---|---|---|
| Mange tekster på én gang, samme tekst to-tre steder (undertekst og panel) | Alle, især Stjerneovnen og Reaktoren | Rettet i hovedtræk (lag, Hvorfor?-kort, tekst kun ét sted testet). Rest: Ved ikke | F1 pkt. 1, plan-ux.md U3, erf "Siden i lag" |
| Antistof: scenen siger "Tryk i mørket" og gættets knapper står klar samtidig; svarer han først, springer han det bedste over | Gåderne | Åben | E14 "Antistof og skinnen" |
| Antistof trin 3 er tungt (DUNE, Hyper-K, 1.300 km, 30 km, 258.000 tons ...) | Gåderne | Åben | E14, ikke-afpr. G4a |
| "Dit første atom" trin 2, 3, 4, 5: elektronen er ikke sagt at være minus, "kan ikke holde sammen" mod billedet, to slags handling, anden halvdel af kernesætningen sagt for sent | Værkstedet, forløb | Rettet (trin 2, 3, 5 og vink i 4) | E14, E14n, git 7bbab62 |
| Rejsen trin 3: fire aldre i én sætning, tvillingen er yngre efter den hurtige tur; indbyder til forkert slutning; resultatet af tur 1 er væk | Rejsen i tid | Åben (venter på prøven) | E14, E14n |
| Liv 1 trin 3: ingen bogstaver på stigen, nøglen 12 px; trin 4 viser en ⚠-boks som ligner en fejl | Liv, forløb 1 | Rettet (nøgle i linjen og vink). Trin 1-2-tekster og "Det så du" flyttet: Ved ikke | E14, E14n, git 29e1a34 |
| Liv 2: to bokse siger det samme i trin 4 (⚠), "alle tre gæt" i trin 5, tungt af tal (64, 61, 147) | Liv, forløb 2 | Åben | E14 "Liv 2" |
| "Hvordan kan det ske?": fem gange "tryk og se", panelet viser µs og γ, mærkat skåret af, byge 11-15 giver "ca. halvdelen" | Kosmos, Tid forløb 2 | Åben (myonernes fakta rettet, resten venter) | E14, E14n |
| Overblik trin 1: de fire inderste var prikker på 3-10 px; trin 2's tekst efter gættet kun "Prøv det!"; laboratoriets mærkater i vejen | Solsystemets overblik | Rettet (git 817aee4), ikke prøvet på tablet | E14, ikke-afpr. "Rundt om Solen efter E14" |
| Gættet og handlingen hænger ikke sammen (man gætter, gør noget andet, får svaret fortalt) | Liv 1-2, Overblik | Åben (hører til byggeklodserne) | E14 mønster C |
| To handlinger i ét trin, men `gør` vises aldrig i linjen | Forløbene | Åben | E14 mønster D |
| Byggeklodsernes otte punkter (kontakt "i forløb", "Prøv det: <handling>", mindste størrelse, tegnede ikoner m.fl.) | Forløb-klodsen | Åben (Serie 2 nr. 5) | E14 afsnit 3, E14n |
| Ønske: guidede forløb, der tager i hånden og viser, hvor man starter | Hele programmet | Delvist bygget (7 forløb). Åben som ønske | soen-og-espens-noter pkt. 6 |

## Knapper og touch på tablet
| Fund | Hvor | Status | Kilde |
|---|---|---|---|
| Det, teksten peger på, er for småt: atomer 20 px, stigens trin 10 px, planeter 3-10 px, aldre 12,5 px, felterne H og He 30 x 24 px | Molekyler, Liv, Overblik, Tid, Værksted | Rettet i Molekyler, Liv 1 (nøgle) og Overblik trin 1. Resten Ved ikke | E14 mønster B, git 29e1a34 / 817aee4 |
| Er punkterne i træet, Styr-boksen, prikkerne i underteksten og tidsknappens små knapper lette at ramme med en finger? | Solsystemet, Stjerneovnen | Åben (aldrig prøvet på tablet) | plan-ux.md "Ikke afprøvet", ikke-afpr. U1-U4 |
| Er knapperne i Gåderne store nok (44 px), og står "Næste ›" hvor han finder den? | Gåderne | Åben | prompt, ikke-afpr. G1 |
| Kan han ramme partiklerne i Antistof og lysene på skinnen med fingeren? | Gåderne | Åben | ikke-afpr. G4a, G4b |
| Tabletten på langs: panelerne fylder knap halvdelen og skjuler ting i 3D | Alle | Rettet (skjul paneler, `skjul-venstre`) | F1 pkt. 2, `git grep` |

## Mængden af tekst og sprog
| Fund | Hvor | Status | Kilde |
|---|---|---|---|
| Programmet er for komplekst i UI/UX; Tid, Molekyler og Liv er svære at forstå selv for Espen. Målet er en blid indføring | Tid, Molekyler, Liv | Åben (Espens største bekymring) | soen-og-espens-noter pkt. 2 (eftersyn/noter.md) |
| Efter gættet i Antistof trin 1 står ca. 70 ord | Gåderne | Åben (Fable: "det er meget") | E14 |
| "Det så du" er for langt eller bringer nye idéer (Liv 1: 247 px, en tredjedel af skærmen) | Liv 1, Værksted | Ved ikke | E14 |
| Efterspurgt: ét "hvorfor" mere (magnetisme, radioaktivitet) | Hele programmet | Rettet i hovedtræk (Hvorfor?-kort). Om magnetisme findes: Ved ikke | soen-og-espens-noter, F1 pkt. 3 |
| Navnet "LiPo" som hovedord i titel og menu er mindre kendt end "lithium-ion" | Batteriet | Rettet (titel og menu siger lithium-ion) | F1 pkt. 5, `git grep` index.html |

## Ens på tværs af delene
| Fund | Hvor | Status | Kilde |
|---|---|---|---|
| Laboratoriet lækker ind i forløbet: δ+/δ−, ⚠-bokse, µs og γ, "8 yderst" | Molekyler, Liv, Tid | Delvist rettet (δ og Liv 1 trin 4). Liv 2 og Tid trin 5 åbne | E14 mønster A, git 29e1a34 |
| Teksten efter gættet er en handling i nogle forløb, kun "Prøv det!" i andre | Forløbene | Delvist rettet (Overblik trin 2). Resten Ved ikke | E14 afsnit 3 |
| "Det så du" varierer: kernesætning alene, eller med ny idé eller brugsanvisning | Forløbene | Åben | E14 afsnit 3 |
| Emoji i forløbets knapper (kun Tid) og i Kosmos' fire grupper og Solsystemets faner, selvom Retningen siger tegnede ikoner | Tid, Kosmos, Solsystemet | Åben (venter bevidst) | E14, E14n, docs/retning.md pkt. 5 |
| "Se også" mellem delene og forslag til næste eventyr | Alle | Delvist rettet (knapper "Gåden: ..." og "Se det selv"). Generelt: Ved ikke | F1 pkt. 7, ikke-afpr. G1-G3 |
| Ser de nye dele ud, som om de hører til samme program? | Gåderne, Opdagelserne, Overblik | Åben (Fable skal vurdere) | prompt "Se også efter" |

## Det visuelle (flot, elegant)
| Fund | Hvor | Status | Kilde |
|---|---|---|---|
| Sort hul ligner en lysende kugle, ikke et hul (gløden) | Kosmos | Rettet (glød holdt ude af skyggen) | F1 pkt. 8, erf kamera-og-layout |
| Atomet (kerne som plastkugler, tynd blå elektronsky) | Værksted, menu | Delvist rettet (orbitaler findes; "Atomet B" ikke prøvet). Ved ikke for menuens atom | F1 pkt. 4, ikke-afpr. "Hele programmet" |
| Batteriet er grafisk det svageste (kasser forfra, flade plader, låst drejning) | Batteriet | Ved ikke | F1 pkt. 5 |
| Skinnen/cirklen ser hakket ud på tablet (stien trappetrinner) | Gåderne | Rettet (30 % bredere, blød kant), mangler jeres øjne | smaa, prompt fund 4 |
| Kantudglatning er slået fra i hele renderen (`antialias: false`) | Alle | Åben (G2 i plan-grafik, intet bygget) | prompt fund 4, planlagt.md "Mere grafik" |

## Glæde og undring
| Fund | Hvor | Status | Kilde |
|---|---|---|---|
| Kernesætningen kan siges uden hjælp efter Antistof | Gåderne | Rettet (virker) | smaa, prompt fund 1 |
| Svagest: "Hvordan kan det ske?" er fem gange "tryk og se"; kernesætningens "derfor" bæres af én sætning | Tid forløb 2 | Åben | E14 |
| Overblikket: den bedste kernesætning (én sætning, hvert led har sit trin) | Overblik | Virker (se nedenfor) | E14 |
| Hvad gør ham "wow" og hvad keder ham, i frit brug? | Alle | Ved ikke (runden med sønnen er ikke holdt) | runde-med-soennen.md, eftersyn/noter.md |
| Lyd: er den tændt, skal der være musik? | Alle | Ved ikke | F1 spørgsmål 4, ikke-afpr. "Hele programmet" |

## Ydelse og ventetid
| Fund | Hvor | Status | Kilde |
|---|---|---|---|
| 4-5 sekunder uden noget ved skift af klode (JS låste browseren, ikke hentning) | Solsystemet | Rettet (rejseskilt, kortkø, kameraet først) | erf "Ventetid ved skift af klode", git 147b9fc |
| Kører skinnen glat (900 prikker i galaksen), og kører Hyper-K med 700 lysfølere glat? | Gåderne | Åben (skal måles med `?maal`) | ikke-afpr. G4a, G4b |

## Det virker, og må ikke ændres
- **Ordforklaringerne** (tryk på et ord, kort forklaring) er jeres princip i lille format og modellen for resten (F1 afsnit 2).
- **Kosmos på tabletten** (Jorden, supernova, kvasar, gummidugen) ser ud som et godt spil og kører flydende (F1, tablet/LISTE.md).
- **Spilmekanikken:** rejsen ind i Solen, "Vis mig", pause, "Næste", opgaver med stjerner og 3D-væggen i Det periodiske system (F1 afsnit 2).
- **Den ærlige faglighed** ("Ærligt talt", faktatjek, tests) (F1 afsnit 2).
- **"Rejsen i tid"** er det stærkeste forløb: historien er klar, tvillingen med stok sidder (E14 afsnit 1). "Rundt om Solen" er nummer to, og dykket ned til Jorden virker.
- **"Dit første atom"** er det reneste forløb, og kernesætningen kan siges (E14).
- **Overblikkets kernesætning** er den bedste: én sætning, hvert led har sit trin (E14).
- **Molekyler trin 3 (salt)** er forløbets bedste billede, og **"Opskriften i dig" trin 1-2** er smukke (E14).
- **Forløb-klodsen** er ens nok: samme linje, prikker, "Spring over", "‹", "Næste ›", 16 px tekst og 44 px knapper; på højkant dækker linjen intet (E14 afsnit 3).
- **Kosmos i fire grupper** og **skinnen** (ren og let at læse) skal ikke rettes før prøven (E14).
- **Gåderne:** kernesætningen kan siges efter Antistof (smaa). Det er med vilje, at man først ser det sorte hul og først bagefter lysene (E8 "Oversigten").
- **Princippet "dybde i lag":** let at nå for den nysgerrige, man bestemmer selv, hvor dybt man borer (F1, soen-og-espens-noter). Står som grundregel i DESIGN.md.

## Gentagne mønstre
1. **For meget tekst og for mange bokse på én gang** (F1 pkt. 1, plan-ux.md, E14 Antistof 70 ord, Liv 2, "Det så du", Gåderne trin 3). Kom i oktober, igen i Solsystemet og igen i forløbene.
2. **Det, teksten peger på, er for småt eller for tæt** (E14 mønster B, tablet-prøverne, Liv forløb 2 på højkant, felter på højkant). Hænger sammen med 44 px-reglen og at 3D-vinduet ikke er testet med fingre.
3. **Laboratoriets ting lækker ind i det enkle forløb** (δ, ⚠, µs, γ, "8 yderst", mærkater i Overblikket): en scene ved ikke, at den er i et forløb.
4. **To opfordringer på én gang, eller gæt og handling hænger ikke sammen** (Antistof "Tryk i mørket" mod gættet; E14 C og D; "Hurtigere" i et fartforløb).
5. **En fælles klods eller regel fixes ét sted, men rammer andre** (CSS-regel til Reaktoren ramte Kosmos; knapper i foldeboks; `.næste-skridt` mod `.mission`): ret rodårsagen i klodsen, ikke pr. skærm.
6. **Det, der ikke er prøvet på tablet med fingre, står åbent for næsten alt nyt**: ikke-afproevet.md har over 60 punkter, og sønnens egen runde er ikke holdt.

## Filer, der ikke fandtes eller kun er skimmet
Alle de nævnte filer fandtes. Disse er kun skimmet, ikke læst helt: plan-ux.md (kun begyndelse, "Afgøres" og "Ikke afprøvet"), ikke-afproevet.md (overskrifter og de UX-nære punkter), ideer.md (grep: næsten ingen UX-fund, derfor ingen rækker), E9-overblik.md og E8-gaader-3d.md (grep). Rettelser efter 16. november er ikke tjekket.
