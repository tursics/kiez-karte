kiez-karte.berlin - row data
============================

All this data sources are used in this project. Listed data sets can be displayed on a map. Each entry have an postal address - but no GPS location. How to geocode?

Geocoding basics
----------------

    HKO_Lichtenberg_Geographisch_140416.txt
    2013-07-01_Datenformatbeschreibung-HK-Version 3.1-1.pdf

Import data from daten.berlin.de
--------------------------------

1. Open the data set page in the open data portal
2. Download the foodata.json file
3. Correct postal addresses if needed and save the modified file to foodata.mod.json
4. Drag'n'drop the file on to the map
5. Wait (it download and geocode the data)
6. Save the geolocated result in foodata.geo.json
7. Remove data outside destination region and ungeolocatable addresses and save the result in foodata.show.json
8. Move foodata.show.json to path /www/data/
9. Contact the data holder and send your corrections!

Import data from FIS-Broker
---------------------------

Thanks to https://github.com/MagdaN/BuergerbautStadt for sharing results of freeing the data: http://pad.okfn.org/p/bbs

1. Start the FIS-Broker http://fbinter.stadt-berlin.de/fb/index.jsp
2. Switch to the HTML version
3. Open [Icon:Karten] "Spielplatzbestand Berlin"
4. Open "zum Downloaddienst (WFS)"
5. Create a link file of the page on your desktop, e.g., http://fbinter.stadt-berlin.de/fb/berlin/service.jsp?id=re_spielplatz@senstadt&type=WFS&themeType=spatial
6. Drag'n'drop the link file on to the map
7. Wait (it download and geocode the data)
8. Save the geolocated result in foodata.geo.json
9. Remove data outside destination region and ungeolocatable addresses and save the result in foodata.show.json
10. Move foodata.show.json to path /www/data/

Uses data sets
--------------

 |Angebote der schulbezogenen Jugendarbeit und Jugendsozialarbeit
-------|-------
Url    |http://daten.berlin.de/datensaetze/angebote-der-schulbezogenen-jugendarbeit-und-jugendsozialarbeit
License|CC BY 3.0 DE

    freizeit-sport-ja-jsa.json
    freizeit-sport-ja-jsa.mod.json
    freizeit-sport-ja-jsa.geo.json
    freizeit-sport-ja-jsa.show.json

 |Ärzte im Bezirk Lichtenberg
-------|-------
Url    |http://daten.berlin.de/datensaetze/%C3%A4rzte-im-bezirk-lichtenberg
License|CC BY 3.0 DE

    buergerservice-aerzte.json
    buergerservice-aerzte.mod.json
    buergerservice-aerzte.geo.json
    buergerservice-aerzte-allgemeinmedizin.show.json
    buergerservice-aerzte-anaesthesiologie.show.json
    buergerservice-aerzte-augenheilkunde.show.json
    buergerservice-aerzte-chirurgie.show.json
    buergerservice-aerzte-diagnostischeradiologieradiologieradiologischediagnostik.show.json
    buergerservice-aerzte-durchgangsarzt.show.json
    buergerservice-aerzte-ergotherapeuten.show.json
    buergerservice-aerzte-frauenheilkundeundgeburtshilfe.show.json
    buergerservice-aerzte-halsnasenohrenheilkunde.show.json
    buergerservice-aerzte-hautundgeschlechtskrankheiten.show.json
    buergerservice-aerzte-hebammen.show.json
    buergerservice-aerzte-heilpraktiker.show.json
    buergerservice-aerzte-humangenetik.show.json
    buergerservice-aerzte-inneremedizin.show.json
    buergerservice-aerzte-kieferorthopaeden.show.json
    buergerservice-aerzte-kinderchirurgie.show.json
    buergerservice-aerzte-kinderundjugendmedizinkinderheilkunde.show.json
    buergerservice-aerzte-kinderundjugendpsychiatrieundpsychotherapie.show.json
    buergerservice-aerzte-kinderundjugendpsychotherapeuten.show.json
    buergerservice-aerzte-logopaeden.show.json
    buergerservice-aerzte-lungenundbronchialheilkunde.show.json
    buergerservice-aerzte-manuellemedizinchirotherapie.show.json
    buergerservice-aerzte-mundkiefergesichtschirurgie.show.json
    buergerservice-aerzte-nervenheilkundeneurologieundpsychiatrie.show.json
    buergerservice-aerzte-orthopaedie.show.json
    buergerservice-aerzte-pathologie.show.json
    buergerservice-aerzte-physikalischeundrehabilitativemedizin.show.json
    buergerservice-aerzte-physiotherapie.show.json
    buergerservice-aerzte-praktischerarzt.show.json
    buergerservice-aerzte-psychiatrie.show.json
    buergerservice-aerzte-psychiatrieundpsychotherapie.show.json
    buergerservice-aerzte-psychologischepsychotherapeuten.show.json
    buergerservice-aerzte-sportmedizin.show.json
    buergerservice-aerzte-transfusionsmedizin.show.json
    buergerservice-aerzte-unfallchirurgie.show.json
    buergerservice-aerzte-urologie.show.json
    buergerservice-aerzte-zahnaerzte.show.json

 |Berliner und Brandenburger Volks- und Straßenfeste 2013 
-------|-------
Url    |http://daten.berlin.de/datensaetze/berliner-und-brandenburger-volks-und-stra%C3%9Fenfeste-2013
License|CC BY 3.0 DE

    maerkte-strassenfeste.json
    maerkte-strassenfeste.mod.json
    maerkte-strassenfeste.geo.json
    maerkte-strassenfeste.show.json

 |Berliner Weihnachtsmärkte 2013
-------|-------
Url    |http://daten.berlin.de/datensaetze/berliner-weihnachtsm%C3%A4rkte-2013
License|CC BY 3.0 DE

    maerkte-xmas.json
    maerkte-xmas.mod.json
    maerkte-xmas.geo.json
    maerkte-xmas.show.json

 |Berliner Wochen- und Trödelmärkte 2013 
-------|-------
Url    |http://daten.berlin.de/datensaetze/berliner-wochen-und-tr%C3%B6delm%C3%A4rkte-2013
License|CC BY-SA 3.0 DE

    maerkte-wochen-antik.json
    maerkte-wochen-antik.mod.json
    maerkte-wochen-antik.geo.json
    maerkte-wochen-antik.show.json

 |Einrichtungen und Projekte für Kinder, Jugendliche und Familien
-------|-------
Url    |http://daten.berlin.de/datensaetze/einrichtungen-und-projekte-f%C3%BCr-kinder-jugendliche-und-familien
License|CC BY 3.0 DE

    freizeit-sport-jfe.json
    freizeit-sport-jfe.mod.json
    freizeit-sport-jfe.geo.json
    freizeit-sport-jfe.show.json

 |Mietbare Veranstaltungsräume im Bezirk Lichtenberg
-------|-------
Url    |http://daten.berlin.de/datensaetze/mietbare-veranstaltungsr%C3%A4ume-im-bezirk-lichtenberg
License|CC BY 3.0 DE

    wirtschaft-mietraum.json
    wirtschaft-mietraum.mod.json
    wirtschaft-mietraum.geo.json
    wirtschaft-mietraum.show.json

 |Prüfberichte der Berliner Heimaufsicht
-------|-------
Url    |http://daten.berlin.de/datensaetze/pr%C3%BCfberichte-der-berliner-heimaufsicht
License|CC BY-SA 3.0 DE

    heimaufsicht-pruefberichte.json
    heimaufsicht-pruefberichte.mod.json
    heimaufsicht-pruefberichte.geo.json
    heimaufsicht-pruefberichte.show.json

 |Stadtführer Entwicklungspolitik
-------|-------
Url    |http://daten.berlin.de/datensaetze/stadtf%C3%BChrer-entwicklungspolitik
License|CC BY 3.0 DE

    euro-inter-lez-stadtfuehrer-lez.json
    euro-inter-lez-stadtfuehrer-lez.mod.json
    euro-inter-lez-stadtfuehrer-lez.geo.json
    euro-inter-lez-stadtfuehrer-lez.show.json

 |Tagespflegestellen im Bezirk Lichtenberg
-------|-------
Url    |http://daten.berlin.de/datensaetze/tagespflegestellen-im-bezirk-lichtenberg
License|CC BY 3.0 DE

    buergerservice-familie-tagespflege.json
    buergerservice-familie-tagespflege.mod.json
    buergerservice-familie-tagespflege.geo.json
    buergerservice-familie-tagespflege.show.json

 |Veranstaltungsangebote der Seniorenbegegnungsstätten
-------|-------
Url    |http://daten.berlin.de/datensaetze/veranstaltungsangebote-der-seniorenbegegnungsst%C3%A4tten
License|CC BY 3.0 DE

    buergerservice-familie-sbst.json
    buergerservice-familie-sbst.mod.json
    buergerservice-familie-sbst.geo.json
    buergerservice-familie-sbst.show.json

 |Spielplatzbestand Berlin
-------|-------
Url    |http://fbinter.stadt-berlin.de/fb/berlin/service.jsp?id=re_spielplatz@senstadt&type=WFS&themeType=spatial
License|nutzIII.pdf "Geoportal Berlin / Spielplatzbestand Berlin"

    re-spielplatz.geo.json
	re-spielplatz.aelterekinderjugendliche.show.json
	re-spielplatz.allgemeinerspielplatz.show.json
	re-spielplatz.kleinkinderspielplatz.show.json
	re-spielplatz.zeitlichbegrenzt.show.json

 |Friedhofsbestand Berlin
-------|-------
Url    |http://fbinter.stadt-berlin.de/fb/berlin/service.jsp?id=re_friedh@senstadt&type=WFS&themeType=spatial
License|nutzIII.pdf "Geoportal Berlin / Friedhofsbestand Berlin"

    re-friedh.geo.json
	re-friedh.show.json

 |RBS-LOR, Lebensweltlich orientierte Räume, Dezember 2014
-------|-------
Url    |http://daten.berlin.de/datensaetze/rbs-lor-lebensweltlich-orientierte-r%C3%A4ume-dezember-2014
License|CC BY 3.0 DE

