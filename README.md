# Tychosium Development

## Hackmd

- https://hackmd.io/M2MinhfMQK-qlE6nthuOfg

## Commits

- [x] Added sidebar that displays a chapter of the book in an `iframe` using a new component called `Sidebar.tsx`
- [x] Added CSS padding for `rightclick` on planets.
- [x] Added CSS padding for `posWriter` on planets.
- [x] Added clickable text on `TYCHOSIUM`, for minimizing the UI panel.
- [x] Added mobile `breakpoint` for responsiveness `768px`
- [x] Changed font on `leva` object for a more coherent style.
- [x] Added `weight` to the cross symbol next to the tychosium text.
- [x] Added a feature where each planet has a short description, _though descriptions are pending_.
- [x] Added all chapters for the book in the settings menu

## Bugs

- [x] `follow` and `planetView` and functions alike should be cancelable by using `ESC` key
      The reset button now stops the simulation, turns off planet camera and follow
- [ ] Mobile version
- [ ] Settings are not mobile-friendly, and the `close` button is inaccessible.
      Lets wait with the mobile stuff
  - [ ] Unable to double-click or right-click on planets; this only occurs in Chrome's viewer.
        Seems to be working for me
- [ ] There's no easy way to stop focusing on an object (not to be confused with `Camera: follow`).

- [ ] Neptune lacks texture, which might be intentional due to the lack of high-resolution images for all planets.
- [x] Missing a loading bar for long loading times.
- [ ] Simulation stutters when running (could be an issue with my computer).
      This is something we need to address. It's usually too many React re-renders that kills performance.

## Features

- [ ] **Mobile version**
  - [ ] UI adjusted to the screen size and control panel (responsiveness).
- [x] **Tooltip**
  - [x] Use tooltips to inform about theoretical concepts (e.g., PVP orbit).
- [ ] **Controls**
  - [ ] Ability to use arrow keys to move forward and backward in time.
- [ ] **Fullscreen**
  - [ ] A way to enable fullscreen without making the button too easy to access.
- [ ] **URL**
  - [ ] The URL should include the camera position, allowing more precise linking within the system.
- [ ] **Interval**
  - [ ] To better observe phenomena, allow playing a specific interval between two years at a given speed.
- [ ] **.icon**
  - [ ] Create an .icon that displays when opening a new tab.
- [ ] Glow on hover over object/planet.

## Positions menu

Is now working. Some details left to do.
The function consists of two components:
PosWriter that is inside the canvvas and writes the positions to a Zustand store.
PositionsInfo that is outside the canvas and displays the positions from the store.

## Trace

Funktionen bör ha ett antal presets som den i gamla Tychosium
Dvs Mars, Solen osv har egna trace konfigurationer som är detsamma som i gamla Tychosium (då blir Simon nöjd :-)
Men det går att bocka ur "presets" alt heter den "Custom trace on/off". Och då kan man "freebasea". Dvs konfigurera hur lång tracen ska vara, hur många punkter den ska ha osv.

## PlanetCamera

Tar sig. Åntligen! Men funderar på att skriva om den så att den är en egen komponent precis som SystemCamera. Fördelen med det är att då kan man attacha den med useThree och getObjectByName till en planet och kan attacha den till planetens
group som inte roterar. Dvs man får en planetkamera som inte följer med i planetens dagliga rotation.
Time to do this. Lots of problems with it being a component attached to the planet.

## ToDo

- [x] Funktioner som gör om Azimuth, Altitude, Lat, Long och tid till RA och Dec så att det kan visas i planetkamerapanelen. Solved this with a camera "lookat" object placed far away from the camera that follow its movement which we can then use the raDecDistance to calculate the RA and Dec of the lookat object.

Layer Planets, so that planet camera see a different size than the system camera. Three has a layer system where you assign objects to layers. So the idea is to assign differently sized planets to a layer and then make the camera see those layers.

- [ ] PlanetCamera controls needs to be rewritten (rerender hell). Soulution: useFrame loop?
- [ ] Seperate planet camera component and attach it to planets runtime
- [ ] North South West East markers on the camera Ground component
- [ ] Hover menu is wonky and it needs an option to be turned off
- [ ] Make it so that when earth is spinning at a certain speed, that the textures are replaced by a blue ball.

- [ ] Load the big textures in the background. When the app starts the planets have lightweight textures and then the bigger textures is loaded with useLoader and Suspense and replaces the smaller textures when loaded
