# Patriks lösa noteringar för att inte glömma goda Tychosium ideer

## Trace

Funktionen bör ha ett antal presets som den i gamla Tychosium
Dvs Mars, Solen osv har egna trace konfigurationer som är detsamma som i gamla Tychosium (då blir Simon nöjd :-)
Men det går att bocka ur "presets". Och då kan man "freebasea". Dvs konfigurera hur lång tracen ska vara, hur många punkter den ska ha osv.

## PlanetCamera

Tar sig. Åntligen! Men funderar på att skriva om den så att den är en egen komponent precis som SystemCamera. Fördelen med det är att då kan man attacha den med useThree och getObjectByName till en planet och kan attacha den till planetens
group som inte roterar. Dvs man får en planetkamera som inte följer med i planetens dagliga rotation
