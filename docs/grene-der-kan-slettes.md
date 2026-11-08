# Grene, der kan slettes

*Tjekket 8. november 2026 (Småting) med hele historien hentet (`git fetch --unshallow`). Sessionerne må ikke selv slette grene (miljøets sikkerhedstjek afviser det), så I sletter dem på GitHub under Branches. Når de er slettet, flyttes filen til `docs/arkiv/`.*

**Pas på:** En kort klon (kun de sidste ca. 50 commits) får de gamle grene til at se ud, som om de har en anden historie end `main`. Hent hele historien først, før grene tjekkes.

## Helt merget (kan slettes uden risiko)
Hver af de her grene er en del af `main`s historie. Der er intet på dem, som ikke allerede er på `main`.

- `ccr-006c40f3-p1x34p`
- `ccr-010adfe1-tkes2t`
- `ccr-15ff42c6-85xcwx`
- `ccr-1dbfe8b3-phtbvs`
- `ccr-2db38c6c-qz3aqf`
- `ccr-3057c406-takjvz`
- `ccr-315af432-fhc5j5`
- `ccr-447e405b-z1u5tn`
- `ccr-462638a8-yln1qr`
- `ccr-7c79ecf8-nwfl8r`
- `ccr-848a5828-adfzv4`
- `ccr-87b00446-y72fnd`
- `ccr-a74cbf60-b27566`
- `ccr-ada7645d-i31vyz`
- `ccr-b08a749d-v9v3q3`
- `ccr-b34b1eef-4srhsu`
- `ccr-d7f4c0ed-klmjlp`
- `ccr-e42a6e29-ekw5go`
- `ccr-e72cb46b-7qd330`
- `ccr-e82dfd42-dhy8xb`
- `ccr-e9ccffdc-0yzwpd`
- `claude/admiring-sagan-inczmm`
- `claude/admiring-sagan-u4mwju`
- `claude/affectionate-brahmagupta-b6ddk5`
- `claude/beautiful-hopper-32175h`
- `claude/beautiful-newton-eqad7c`
- `claude/bold-cori-5wkpda`
- `claude/brave-feynman-gr6vmk`
- `claude/compassionate-mendel-shiwpd`
- `claude/dreamy-galileo-shpn5n`
- `claude/eager-cannon-8izo3t`
- `claude/ecstatic-ramanujan-d88c3v`
- `claude/electron-exchange-molecules-wg8dtn`
- `claude/elegant-feynman-gvzp9e`
- `claude/eloquent-tesla-1hhr3e`
- `claude/epic-newton-5uaa06`
- `claude/exciting-meitner-l14yru`
- `claude/fervent-hypatia-81091h`
- `claude/funny-bohr-iplw10`
- `claude/funny-planck-ct7e0e`
- `claude/gifted-wozniak-8defzg`
- `claude/great-carson-d2yrje`
- `claude/great-lamport-olsrhi`
- `claude/hopeful-gates-81we0x`
- `claude/hopeful-mccarthy-0oq44n`
- `claude/hopeful-planck-rfk0l0`
- `claude/intelligent-hamilton-2qer1e`
- `claude/jolly-hawking-43m7pt`
- `claude/jolly-rubin-1iw8di`
- `claude/magical-cannon-a4xfai`
- `claude/magical-cannon-lpmnhs`
- `claude/magical-hamilton-8quzph`
- `claude/mars-m7a-olympus-mons-yyww2x`
- `claude/nifty-keller-qxeij0`
- `claude/pensive-ptolemy-7abgqh`
- `claude/pensive-ritchie-674gte`
- `claude/practical-wozniak-ke2bhh`
- `claude/sharp-brown-b2jyi5`
- `claude/stoic-goldberg-1pkuer`
- `claude/sweet-bell-c8k84t`
- `claude/tablet-round-fixes-nzakd0`
- `claude/tid-t2`
- `claude/upbeat-feynman-h9o5zk`
- `claude/vibrant-goodall-iuje1y`
- `claude/vibrant-ritchie-c131ju`
- `claude/wizardly-bohr-g6xf7f`
- `claude/youthful-cannon-8j2dot`

## Ikke merget (lad dem være, eller tjek dem først)
- `claude/fervent-goodall-x5a58e` og `claude/gifted-ritchie-wv0hwd` (PR #116 er åben): fra 8. november 2026, sessioner, der måske stadig arbejder.
- `ccr-8c5ddb9a-ts9r17`: 2 commits fra 7. november 2026 (Molekyler M1 Trin 0: tallene med kilder og jeres svar). Tallene står på `main` i en senere udgave (`docs/fakta-molekyler.md`, afsnit 7), så den kan sandsynligvis slettes. Ikke tjekket linje for linje.
- `ccr-3efa96d6-kxmhu1`, `ccr-5c420c09-zzdxp0`, `claude/eloquent-bohr-ka3lia`, `claude/pensive-edison-41cgwd` og `claude/relaxed-cori-h0yxvd`: 1-2 commits hver. Efter tjekket 5. november 2026 er indholdet på `main` (#68), men commits er ikke de samme. PR #45 (`ccr-5c420c09`) er lukket uden merge.
