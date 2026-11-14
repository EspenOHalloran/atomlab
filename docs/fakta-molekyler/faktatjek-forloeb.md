# Faktatjek: forløbet "Når atomer mødes" og rettelserne i laboratoriet (14. november 2026)

*Lavet af Opus i byggesessionen (under 15 påstande, `/faktatjek`). Forløbets egne tekster er tjekket i [drejebogen](../drejebog-molekyler.md), afsnit 6. Rettelserne kommer fra [Fable E6-noterne](../fable/E6-molekyler-noter.md), afsnit 5.*

| Påstand (hvor) | Vurdering | Kilde og udregning |
|---|---|---|
| Trin 3, Så: "Tæt på hoppede elektronen over til chlor." (kortet fra drejebogens tekst, så Så holder ca. 20 ord) | OK | Drejebogen, afsnit 6 (harpunen, Wikipedia "Harpoon reaction") |
| "kan elektronen hoppe, når atomerne er tættere end ca. 9 Å (ca. fire gange afstanden i parret)" (Giv elektroner, harpunen) | OK | 14,4 / 1,53 = 9,4 Å. 9,4 / 2,36 = 4,0. Fælden om 9,4 Å i fakta-faelder.md |
| "Chlor giver kun godt to tredjedele tilbage af det, det kostede" (`bytteKoster`) | OK | 3,61 / 5,14 = 0,70 (NIST: ioniseringsenergien 5,139 eV, elektronaffiniteten 3,613 eV) |
| "har tiltrækningen givet næsten fire gange så meget, som der manglede" (`bytteBetaler`) | OK | Ved 2,36 Å: 4,26 + 1,53 = 5,79 eV, 5,79 / 1,53 = 3,8 (spillets model, `par.D` og `par.r0`) |
| "Parret kan kun blive sammen, hvis det kommer af med energien, fx ved at støde ind i et tredje atom." (For nørder) | OK | Energien er bevaret: To ioner, der falder ind mod hinanden, flyver fra hinanden igen, hvis intet tager energien (Fable E6, afsnit 5) |
| "Ingen binding er helt delt eller helt givet. I salt er det næsten givet." (Ærligt talt) | OK | Drejebogen, afsnit 3 (NaCl-parret er groft 80 % givet) |
| "Tit hopper elektronen slet ikke, og atomerne flyver forbi hinanden." (Ærligt talt) | OK | E6-noterne, afsnit 2a |
| "Derfor er kornene i fint salt små terninger." (opgaven `bytte-nacl`) | OK | Wikipedia "Sodium chloride": "Colorless cubic crystals", hver ion har seks naboer med modsat ladning. Fælden om flagesalt |
| Ordbogen, Ion: "Natrium holder ret løst på sin yderste elektron. Byttet koster lidt energi, men når plus og minus mødes, får de mere igen." | OK | Fables ordlyd (E6-noterne, afsnit 5). "chlor trækker hårdt" er fjernet (fælden "Natrium holder løst …") |
| Ordbogen, Krystal: "… Salt, sukker, is og diamant er krystaller." | OK | Alle fire er krystallinske faste stoffer (Fable E6, afsnit 4) |
| `bygBinder` (nørd): "To H-atomer binder kun, når deres elektroner har modsat spin. I ca. tre ud af fire møder skubber de hinanden væk." | OK med "ca." | Heitler-London: singletten binder, tripletten er frastødende. 3 af de 4 spin-kombinationer er tripletter. Kilden giver statistikken, ikke en målt andel af møder, derfor "ca." |

Ny fælde: ingen. "tre ud af fire" står nu med "ca." (statistisk vægt, ikke målt).
