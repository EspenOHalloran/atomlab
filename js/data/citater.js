// Citater fra kendte forskere. Kun citater med en sikker kilde.
// (Mange citater på nettet er forkert tilskrevet, så tilføj kun nye, hvis kilden er kendt.)
// tekst: dansk oversættelse, original: den oprindelige ordlyd (eller en engelsk oversættelse, se oversat),
// oversat: hvilket sprog citatet oprindeligt var på, hvis original er en oversættelse, kommentar: kort forklaring (valgfri)

export const CITATER = {
  feynman: {
    tekst: 'Hvis al videnskabelig viden blev ødelagt, og kun én sætning måtte gives videre, ville det være denne: Alting er lavet af atomer – små partikler, der hele tiden bevæger sig, tiltrækker hinanden, når de er lidt fra hinanden, men frastøder hinanden, når de bliver presset sammen.',
    person: 'Richard Feynman',
    kilde: 'Feynmans forelæsninger i fysik, 1963 (forkortet)',
    original: 'If, in some cataclysm, all of scientific knowledge were to be destroyed, and only one sentence passed on to the next generations of creatures, what statement would contain the most information in the fewest words? I believe it is the atomic hypothesis (or the atomic fact, or whatever you wish to call it) that all things are made of atoms—little particles that move around in perpetual motion, attracting each other when they are a little distance apart, but repelling upon being squeezed into one another.',
  },
  rutherford: {
    tekst: 'Det var den mest utrolige begivenhed i mit liv. Det var næsten lige så utroligt, som hvis man skød en 15-tommers granat mod et stykke silkepapir, og den kom tilbage og ramte en.',
    person: 'Ernest Rutherford',
    kilde: 'Forelæsning, 1936',
    original: 'It was quite the most incredible event that has ever happened to me in my life. It was almost as incredible as if you fired a 15-inch shell at a piece of tissue paper and it came back and hit you.',
    kommentar: 'Om forsøget, som Hans Geiger og Ernest Marsden lavede i Rutherfords laboratorium i 1909. I 1911 forklarede Rutherford det: Atomet har en lille, tung kerne.',
  },
  bohr: {
    tekst: 'Vi må gøre os klart, at når det gælder atomer, kan sproget kun bruges som i poesi.',
    person: 'Niels Bohr',
    kilde: 'Som Werner Heisenberg genfortalte det i "Der Teil und das Ganze", 1969',
    original: 'We must be clear that when it comes to atoms, language can be used only as in poetry.',
    oversat: 'tysk',
    kommentar: 'Bohr lavede selv modellen med elektroner i ringe, men vidste, at virkeligheden er mærkeligere.',
  },
  saganStjernestof: {
    tekst: 'Nitrogenet i vores DNA, calciummet i vores tænder, jernet i vores blod og carbonatomerne i vores æbletærter blev lavet inde i stjerner, der styrtede sammen. Vi er lavet af stjernestof.',
    person: 'Carl Sagan',
    kilde: 'Cosmos, 1980',
    original: 'The nitrogen in our DNA, the calcium in our teeth, the iron in our blood, the carbon in our apple pies were made in the interiors of collapsing stars. We are made of star-stuff.',
  },
  saganÆbletærte: {
    tekst: 'Hvis du vil bage en æbletærte helt fra bunden, må du først opfinde universet.',
    person: 'Carl Sagan',
    kilde: 'Cosmos, 1980',
    original: 'If you wish to make an apple pie from scratch, you must first invent the universe.',
  },
  einsteinNysgerrighed: {
    tekst: 'Det vigtige er, at man aldrig holder op med at stille spørgsmål. Nysgerrighed har sin egen grund til at findes.',
    person: 'Albert Einstein',
    kilde: 'LIFE, 1955',
    original: 'The important thing is not to stop questioning. Curiosity has its own reason for existence.',
  },
  einsteinTerninger: {
    tekst: 'Jeg er i hvert fald overbevist om, at Han ikke kaster med terninger.',
    person: 'Albert Einstein',
    kilde: 'Brev til Max Born, 1926',
    original: 'Jedenfalls bin ich überzeugt, daß der nicht würfelt.',
    kommentar: 'Einstein kunne ikke lide, at naturen skulle være tilfældig. Men i dag tyder alle forsøg på, at det faktisk er tilfældigt, hvornår en bestemt kerne henfalder.',
  },
  einsteinEnergi: {
    tekst: 'Det fulgte af den specielle relativitetsteori, at masse og energi blot er forskellige udtryk for den samme ting.',
    person: 'Albert Einstein',
    kilde: 'Filmen "Atomic Physics", 1948',
    original: 'It followed from the special theory of relativity that mass and energy are both but different manifestations of the same thing.',
    kommentar: 'Det er det, E = mc² betyder. Når en kerne henfalder, bliver en lille smule masse til energi.',
  },
  feynmanKvante: {
    tekst: 'Jeg tror, jeg roligt kan sige, at ingen forstår kvantemekanik.',
    person: 'Richard Feynman',
    kilde: 'The Character of Physical Law, 1965',
    original: 'I think I can safely say that nobody understands quantum mechanics.',
    kommentar: 'Kvantemekanik er den del af fysikken, der beskriver elektronskyen. Selv nobelprisvindere synes, den er mærkelig.',
  },
  eddington: {
    tekst: 'Det, der er muligt i Cavendish-laboratoriet, er måske ikke så svært i Solen.',
    person: 'Arthur Eddington',
    kilde: 'Foredrag, 1920',
    original: 'What is possible in the Cavendish Laboratory may not be too difficult in the sun.',
    kommentar: 'Eddington gættede allerede i 1920, at Solen får sin energi ved at lave helium af hydrogen. Han fik ret.',
  },
  faraday: {
    tekst: 'Intet er for vidunderligt til at være sandt, hvis det stemmer med naturens love.',
    person: 'Michael Faraday',
    kilde: 'Laboratoriedagbog, 1849',
    original: 'Nothing is too wonderful to be true, if it be consistent with the laws of nature.',
    kommentar: 'Faraday indførte ordene ion, elektrode, anode, katode og elektrolyt, som vi stadig bruger om batterier. Nogle af dem fandt han på sammen med William Whewell.',
  },
  hawkingStjerner: {
    tekst: 'Kig op på stjernerne og ikke ned på dine fødder. Prøv at forstå det, du ser, og undr dig over, hvad der får universet til at eksistere. Vær nysgerrig.',
    person: 'Stephen Hawking',
    kilde: 'Åbningen af De Paralympiske Lege i London, 2012',
    original: 'Look up at the stars and not down at your feet. Try to make sense of what you see, and wonder about what makes the universe exist. Be curious.',
  },
  hawkingSorteHuller: {
    tekst: 'Sorte huller er ikke så sorte, som de bliver malet. De er ikke de evige fængsler, man engang troede.',
    person: 'Stephen Hawking',
    kilde: 'Reith-forelæsningerne, BBC, 2016',
    original: 'Black holes ain\'t as black as they are painted. They are not the eternal prisons they were once thought.',
    kommentar: 'Hawking regnede ud, at sorte huller langsomt sender stråling ud (Hawking-stråling). Den er så svag, at ingen endnu har målt den.',
  },
  wheeler: {
    tekst: 'Rumtiden fortæller stoffet, hvordan det skal bevæge sig. Stoffet fortæller rumtiden, hvordan den skal krumme.',
    person: 'John Archibald Wheeler',
    kilde: 'Geons, Black Holes, and Quantum Foam, 1998',
    original: 'Spacetime tells matter how to move; matter tells spacetime how to curve.',
    kommentar: 'Wheeler var også den, der gjorde navnet "sort hul" kendt.',
  },
  saganKosmos: {
    tekst: 'Kosmos er også i os. Vi er lavet af stjernestof. Vi er en måde, kosmos kan lære sig selv at kende på.',
    person: 'Carl Sagan',
    kilde: 'Cosmos, 1980',
    original: 'The cosmos is also within us. We\'re made of star-stuff. We are a way for the cosmos to know itself.',
  },
  saganScene: {
    tekst: 'Jorden er en meget lille scene i en enorm kosmisk arena.',
    person: 'Carl Sagan',
    kilde: 'Pale Blue Dot, 1994',
    original: 'The Earth is a very small stage in a vast cosmic arena.',
    kommentar: 'Sagan skrev det om et billede, som rumsonden Voyager 1 tog af Jorden fra 6 milliarder km væk. Jorden er en lille prik i et solstrejf.',
  },
  feynmanVæv: {
    tekst: 'Naturen bruger kun de længste tråde til at væve sine mønstre, så hvert lille stykke af hendes stof viser, hvordan hele tæppet er bygget op.',
    person: 'Richard Feynman',
    kilde: 'The Character of Physical Law, 1965',
    original: 'Nature uses only the longest threads to weave her patterns, so that each small piece of her fabric reveals the organization of the entire tapestry.',
    kommentar: 'De samme naturlove gælder overalt. Tyngdekraften, der får et æble til at falde, styrer også planeter, stjerner og sorte huller.',
  },
  curie: {
    tekst: 'Man lægger aldrig mærke til det, der er gjort. Man kan kun se det, der mangler at blive gjort.',
    person: 'Marie Curie',
    kilde: 'Brev til sin bror, 1894',
    original: 'One never notices what has been done; one can only see what remains to be done.',
    oversat: 'fransk',
  },
  carrington: {
    tekst: 'Inde i den store nordlige gruppe af solpletter brød to pletter af meget stærkt, hvidt lys pludselig frem.',
    person: 'Richard Carrington',
    kilde: 'Monthly Notices of the Royal Astronomical Society, 1859',
    original: '… within the area of the great north group (the size of which had previously excited general remark), two patches of intensely bright and white light broke out …',
    kommentar: 'Det var det første solglimt, nogen har beskrevet (1. september 1859). Dagen efter ramte solstormen Jorden: Der var nordlys helt ned til Caribien, og telegraflinjer slog gnister.',
  },
  tycho: {
    tekst: 'Sandelig et mirakel, enten det største af alle dem, der er sket i hele naturen siden verdens begyndelse …',
    person: 'Tycho Brahe',
    kilde: 'De nova stella, 1573',
    original: 'A miracle indeed, either the greatest of all that have occurred in the whole range of nature since the beginning of the world, …',
    oversat: 'latin',
    kommentar: 'Tycho Brahe så en ny stjerne i stjernebilledet Cassiopeia i november 1572. Han målte, at den var meget længere væk end Månen, så himlen var ikke uforanderlig, som man troede. I dag ved vi, at det var en supernova.',
  },
  // Kilden er læst i bogen selv (Systema Saturnium, 1659, McGill-eksemplaret på archive.org). Anagrammet har 7 a'er,
  // så der står "cohaerente" (Wikipedias "coherente" er en slåfejl). "Ekliptika" er oversat til "Jordens baneplan".
  huygensSaturn: {
    tekst: 'Den er omgivet af en tynd, flad ring, der ingen steder hænger fast i den og hælder i forhold til Jordens baneplan.',
    person: 'Christiaan Huygens',
    kilde: 'Systema Saturnium, 1659',
    original: 'Annulo cingitur, tenui, plano, nusquam cohaerente, ad eclipticam inclinato.',
    kommentar: 'Huygens offentliggjorde først sætningen i 1656 som et anagram, hvor alle bogstaverne var blandet (aaaaaaa ccccc d eeeee …). Sådan kunne forskere dengang gøre krav på en opdagelse, før de var klar til at udgive den. I 1659 afslørede han, hvad der stod. Galilei havde set ringen i 1610, men hans kikkert var for svag: Han troede, at Saturn bestod af tre kloder.',
  },
  bellBurnell: {
    tekst: 'Jeg gik hjem den aften og var meget sur. Her prøvede jeg at tage en ph.d. med en ny teknik, og så skulle en flok fjollede små grønne mænd vælge netop min antenne og min frekvens for at tale med os.',
    person: 'Jocelyn Bell Burnell',
    kilde: 'Tale i 1976, trykt i Cosmic Search, 1979',
    original: '… I went home that evening very cross—here was I trying to get a Ph.D. out of a new technique, and some silly lot of little green men had to choose my aerial and my frequency to communicate with us.',
    kommentar: 'Hun opdagede den første pulsar i 1967, mens hun var ph.d.-studerende. Signalet var så regelmæssigt, at det for sjov blev kaldt LGM-1 (Little Green Men). Det var en neutronstjerne, der snurrede rundt.',
  },
  reitze: {
    tekst: 'Mine damer og herrer, vi har målt tyngdebølger. Vi gjorde det!',
    person: 'David Reitze, leder af LIGO',
    kilde: 'Pressemøde, 11. februar 2016',
    original: 'Ladies and gentlemen, we have detected gravitational waves. We did it.',
    kommentar: 'Bølgerne kom fra to sorte huller, der smeltede sammen ca. 1,3 milliarder lysår væk. De blev målt den 14. september 2015.',
  },
  einsteinForstå: {
    tekst: 'Det evigt ubegribelige ved verden er, at den kan begribes.',
    person: 'Albert Einstein',
    kilde: 'Physik und Realität, 1936',
    original: 'The eternal mystery of the world is its comprehensibility.',
    oversat: 'tysk',
    kommentar: 'Lyset fra kvasaren 3C 273 har været ca. 2 milliarder år undervejs. Alligevel kan vi regne ud, hvad der sendte det af sted.',
  },
  haldane: {
    tekst: 'Jeg har selv en mistanke om, at universet ikke bare er mærkeligere, end vi tror, men mærkeligere, end vi kan forestille os.',
    person: 'J.B.S. Haldane',
    kilde: 'Possible Worlds and Other Essays, 1927',
    original: 'Now my own suspicion is that the universe is not only queerer than we suppose, but queerer than we can suppose.',
    kommentar: 'Ormehuller er en mulighed i Einsteins ligninger, men ingen ved, om de findes.',
  },
  meitnerFrisch: {
    tekst: 'Det ser derfor ud til, at urankernen kun er lidt stabil i formen og efter at have fanget en neutron kan dele sig i to kerner af nogenlunde samme størrelse.',
    person: 'Lise Meitner og Otto Frisch',
    kilde: 'Nature, 1939',
    original: 'It seems therefore possible that the uranium nucleus has only small stability of form, and may, after neutron capture, divide itself into two nuclei of roughly equal size.',
    kommentar: 'Meitner og hendes nevø Otto Frisch forklarede i 1939, hvad Otto Hahn og Fritz Strassmann havde set: Urankernen var blevet delt. Frisch kaldte det fission efter et ord fra biologien. Hahn fik Nobelprisen, men Meitner fik den aldrig.',
  },
};

// Citater, der passer godt i menuen
export const MENU_CITATER = [
  'feynman', 'saganÆbletærte', 'einsteinNysgerrighed', 'rutherford', 'saganStjernestof', 'einsteinEnergi',
  'hawkingStjerner', 'faraday', 'saganKosmos', 'eddington', 'tycho', 'einsteinForstå', 'haldane',
];

// Laver HTML til et citat (teksten er vores egen, så den kan sættes direkte ind)
export function citatHTML(nøgle) {
  const c = CITATER[nøgle];
  if (!c) return '';
  const original = ((c.oversat ? `Engelsk oversættelse (originalen er på ${c.oversat}): ` : '') + c.original).replace(/"/g, '&quot;');
  return `<p class="citat-tekst" title="${original}">“${c.tekst}”</p>`
    + `<footer>– ${c.person}, <span>${c.kilde}</span></footer>`
    + (c.kommentar ? `<p class="citat-kommentar">${c.kommentar}</p>` : '');
}
