# Netsider, certifikater og arbejdsgang

## Certifikater: "unable to get local issuer certificate" (30. oktober 2026)
- `www.dlr.de`, `www.jsg.utexas.edu` og `marsed.asu.edu` var ikke blokeret af proxyen (tunnelen svarede 200). Containeren manglede rodcertifikatet "emSign Root CA - G1" (utexas og asu), og dlr.de sender ikke sit mellemcertifikat (GEANT TLS RSA 1).
- **Løsning uden at slå tjekket fra:** Mozillas rodliste fra `certifi` (`pip download certifi`, pypi er åben) og mellemcertifikatet fra `http://crt.harica.gr/HARICA-GEANT-TLS-R1.cer` (kun http: hent det gennem proxyens tunnel med `curl -p --proxy "$HTTPS_PROXY"`, og tjek det med `openssl verify` mod containerens rødder). Læg dem sammen med `/etc/ssl/certs/ca-certificates.crt` i én fil, og brug `curl --cacert`. Brugeren åbnede `crt.harica.gr`.
- **emSign mangler i certifi 2026.10.18 (7. november 2026):** `archive.stsci.edu` (OPAL) kæder op til "emSign Root CA - G1", som ikke står i den nyeste `certifi`. Løsning: `pip download --no-deps certifi==2025.8.3`, tag kun den ene rod ud (SHA-256 `40:F6:AF:03:…:D0:03:67`, tjek med `openssl x509 -fingerprint`), og læg den sammen med `/etc/ssl/certs/ca-certificates.crt` og `/root/.ccr/ca-bundle.crt` til `curl --cacert`. Den automatiske sikkerhedskontrol stoppede det, til brugeren gav lov. Spørg derfor brugeren først.

## Fire små opgaver i træk (29. oktober 2026)
- **Et link skal pege på et sted, hvor ordet står.** Ordbogens links blev tjekket i kildeteksterne med et lille script, før de kom med. Fire "Hvorfor?"-kort, der virkede passende ("radioaktiv" → "Hvorfor er nogle kerner ustabile?"), nævnte slet ikke ordet og blev fjernet. Tjekket er nu en del af testen `ordbog`.
- **Dansk sortering med `Intl.Collator('da')`** sætter æ, ø og å efter z, også inde i ordet ("Stjerne" før "stærke"). Min egen forventning i testen var forkert, ikke sorteringen.
- **Moduler med Three.js kan ikke testes i Node** (igen): Ordbogens liste, søgning og links ligger derfor i `js/data/ordbogliste.js`.
- **Et citat kan bekræftes med en uafhængig kontrol:** Huygens' anagram har 7 a'er, og det passer kun med "cohaerente". Wikipedia skriver "coherente". OCR'en af den gamle bog læste ordet forkert ("cobarente"), så tælling af bogstaver var det, der afgjorde det.
- **Dataservere skifter navn:** archive.org sender filerne videre til `ia….us.archive.org` eller `dn….eu.archive.org`. Bed om `*.archive.org` på én gang.
- **Søg efter faste tal i testene, når noget fælles ændres:** Testen `kosmos` tjekkede "7 kort i menuen", så det ottende kort fik den til at fejle. Søg efter tallet (`grep`) i `tests/`, før hele samlingen køres.
- **Giv en lang testkørsel tid nok:** `koer-alle.mjs` med alle tests tog 26-27 minutter i denne session. En baggrundskørsel med 10 minutters grænse blev stoppet midt i og skulle køres forfra.
