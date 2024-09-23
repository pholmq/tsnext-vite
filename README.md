# Tychosium dev

## Commits
- [x] Added sidebar that displays a chapter of the book in an `iframe` using a new component called `Sidebar.tsx`
- [x] Added css padding for`rightclick` on planets.
- [x] Added css padding for`posWriter` on planets.
- [x] Added clickable text on `TYCHOSIUM`, for minimizing the UI panel.
- [x] Added mobile `breakpoint` for responsivness `768px`
- [x] Change font on `leva` object, for more coherent style
- [x] Added `weight` to the cross symbol next to the tychosium text
- [x] Added a feature where you have a short description to each planet, *though descriptions are pending*

## Buggar

- [ ] Mobile version
- [ ] Settings är inte mobilanpassad och nu kan man inte stänga ned den för `close` knappen är inte tillgänglig att klicka på
    - [ ] Det går ej att dubbelklicka eller högerklicka på planeter, detta var endast i chromes egna visare (viewer)
- [ ] Det går inte på ett smidigt sätt att sluta fokusera på ett objekt. (inte att förväxlas med `Camera: follow`)
- [ ] Neptunus saknar textur, kan vara medvetet då det ej finns bra högupplösta bilder på alla planeter
- [ ] Saknas en loadingbar för långa laddningar
- [ ] Hackar när man kör själva simuleringen (kan vara min dator)

## Features
- [ ] **Mobile version**
    - [ ] Anpassad UI till storleken på skärmen och kontrollpanelen (responsivitet)
- [x] **Tooltip**
    - [x] Använd tooltip för att informera om ett teoretisk koncept (exempelvis: PVP-banan)
- [ ] **Controls**
    - [ ] Kunna använda pilarna till att gå frammåt och bakåt i tid
- [ ] **Fullscreen**
    - [ ] Ett sätt att få till fullscreen, utan att det är för lätt att komma åt knappen
- [ ] **URL**
    - [ ] En URL bör ha med kameran också så att man kan länka till ett mer exakt ställe i systemet
- [ ] **Interval**
    - [ ] För att lättare kunna se ett fenomen så kan det vara bra att kunna spela upp endast ett specifikt intervall mellan två årtal i en given hastighet
- [ ] **.icon**
    - [ ] Fixa en .icon som visas som visas när man öppnar en ny tab
- [ ] Glow on hovering on object / planet
