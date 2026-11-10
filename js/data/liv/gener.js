// Liv L2: genet, der bliver læst. Kun tekst, kan testes i Node.

// HBB: genet for β-kæden i hæmoglobin, det protein, der bærer ilt rundt i blodet. Den kodende del (CDS, base 51-494)
// af NCBI RefSeq NM_000518.5 (Homo sapiens hemoglobin subunit beta, mRNA), hentet 9. og 10. november 2026 fra
// https://www.ncbi.nlm.nih.gov/sviewer/viewer.fcgi?id=NM_000518.5&db=nuccore&report=gbwithparts&retmode=text
// Skrevet som DNA (streng I, 5' → 3'). 444 baser = 148 kodoner: 147 aminosyrer og stopkodonet TAA.
export const HBB = {
  navn: 'HBB',
  kilde: 'NCBI RefSeq NM_000518.5, base 51-494',
  dna: 'ATGGTGCATCTGACTCCTGAGGAGAAGTCTGCCGTTACTGCCCTGTGGGGCAAGGTGAACGTGGATGAAGTTGGTGGTGAGGCCCTGGGCAGGCTGCTGGTGGTCTACCCTTGGACCCAGAGGTTCTTTGAGTCCTTTGGGGATCTGTCCACTCCTGATGCTGTTATGGGCAACCCTAAGGTGAAGGCTCATGGCAAGAAAGTGCTCGGTGCCTTTAGTGATGGCCTGGCTCACCTGGACAACCTCAAGGGCACCTTTGCCACACTGAGTGAGCTGCACTGTGACAAGCTGCACGTGGATCCTGAGAACTTCAGGCTCCTGGGCAACGTGCTGGTCTGTGTGCTGGCCCATCACTTTGGCAAAGAATTCACCCCACCAGTGCAGGCTGCCTATCAGAAAGTGGTGGCTGGTGTGGCTAATGCCCTGGCCCACAAGTATCACTAA',
  // NCBI's egen oversættelse (/translation i samme post), til testen
  protein: 'MVHLTPEEKSAVTALWGKVNVDEVGGEALGRLLVVYPWTQRFFESFGDLSTPDAVMGNPKVKAHGKKVLGAFSDGLAHLDNLKGTFATLSELHCDKLHVDPENFRLLGNVLVCVLAHHFGKEFTPPVQAAYQKVVAGVANALAHKYH',
};

// Så mange kodoner fra starten kan man læse selv og skifte bogstaver i ("Læs selv" og "Skift et bogstav")
export const LÆS_KODONER = 10;
// Kodonet, hvor seglcelle-mutationen sidder (nr. 7 fra starten, 0-baseret 6). Det kaldes traditionelt nr. 6, fordi den
// første methionin bliver fjernet i det færdige protein (docs/fakta-liv.md).
export const SEGL_KODON = 6;
