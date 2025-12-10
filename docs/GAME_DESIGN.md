# Tidal Survivor – Game Design & Technical Specification

*Version 1.0 – Arbeitsentwurf*

## 0. Logline / Elevator Pitch
Tidal Survivor ist ein 2D-Top-Down-Bullet-Heaven-Actionspiel. Der Spieler steuert ein Boot durch eine überflutete Welt, bekämpft endlose Wellen von Wasser-Monstern und Bossen in kompakten 9-Minuten-Runs. Das Boot wächst zu einer schwimmenden Waffenplattform, wird jedoch mit jedem Upgrade größer, schwerfälliger und leichter zu treffen. Elementare Waffen (Feuer, Eis, Elektro, Gift) verändern nicht nur Gegner, sondern auch die Wasseroberfläche (Feuerflächen, Eisfelder, Giftzonen, Kettenblitz-Zonen).

## 1. Kern-Fantasy & Spielgefühl
- Du bist der letzte Kapitän in einer halb untergegangenen Welt.
- Du fährst durch Seen, Flüsse, Küsten und tiefe Ozeane auf der Suche nach Überlebenden, Signalen und Ressourcen.
- Die Welt setzt dir zu: mutierte Fische, Quallen, Seeungeheuer und Vögel greifen dich an.
- Jeder Run stärkt dein Boot, schaltet neue Waffen, Module, Boote und Zonen frei.
- Steuerung: flüssig, direkt und responsiv.
- Kämpfe: chaotisch, aber gut lesbar trotz vieler Projektile, Flächen und Gegner.
- Runs: kurz (ca. 9 Minuten) und intensiv, keine lange Aufwärmphase.

## 2. Makro-Gameflow
1. **App starten:** Logo → Splash → Hauptmenü.
2. **Hauptmenü:**
   - Buttons: Play, Boats, Upgrades, Zones, Settings.
   - Anzeigen: aktuelle Währung, Bestzeiten pro Zone.
   - Zone/Boot auswählen (Startzone: Lake/See, ein Starterboot).
3. **Run starten:** Fade-in auf Top-Down-Map, Boot in der Mitte, erste Gegnerwelle nach kurzer Einlaufzeit.
4. **Während des Runs:**
   - Player bewegt Boot, Waffen feuern automatisch.
   - Gegner spawnen nach Wave-Tables; XP-Orbs droppen, Level-Ups bringen Upgrade-Auswahl.
5. **Level-Up-Overlay:** pausiert Zeit/Action, bietet 3–4 Upgrade-Karten; Auswahl setzt Run fort.
6. **Boss-Events:** bei 3/6/9 Minuten; Boss ankündigen (Musik/Farbton); nach Boss-Tod Belohnung + Verschnaufpause.
7. **Run-Ende:**
   - Tod → Defeat Screen.
   - Überleben + Endboss → Victory Screen.
   - Anzeigen: Run-Dauer, Kills/Boss-Kills, XP, verdiente Meta-Währung; Button „Return to Base“.
8. **Meta-Progression:** Rückkehr zu Upgrades (bei genug Ressourcen) oder Main Menu.

## 3. Kern-Gameplay
### 3.1 Steuerung & Physik
- Perspektive: Top-Down 2D.
- Boot-Attribute: Position, Velocity, Speed (Basis + Modifier), Canvas-Begrenzung.
- Eingaben: WASD/Pfeile; optional Maus-Joystick oder virtueller Stick auf Mobile (One-Finger-Modus: Finger → Richtung Boot→Finger).
- Physik: `velocity = inputDirection * speed`; optional leichte Trägheit per Lerp.

### 3.2 Kampf & Auto-Fire
- Player steuert nur Movement; Waffen feuern automatisch per `fireRate`.
- Zielrichtung Phase 1: feste Richtung (z. B. nach vorne oder nach oben); später Auto-Target/AoE/Rotation.
- Damage-System: `baseDamage`, optional `elementTag`, `critChance`, `critMultiplier`.
- Trefferauflösung: Projektil → Gegner reduziert HP; On-Hit Element-Effekt. Gegner → Player reduziert HP, optional Knockback/Slow.

## 4. Boot-Wachstum & Module
### 4.1 Boot-Basiswerte (Starterboot)
- `maxHp`: ca. 100
- `speedBase`: ca. 220 px/s
- `radiusBase`: ca. 24 px
- `weaponSlots`: 1
- `moduleSlots`: 2 (passiv)

### 4.2 Module-Typen
- **Weapon Module:** neue Waffe (Raketenlauncher, Eiswerfer, Elektrokanone), sichtbare Plattform.
- **Defense Module:** Panzerplatten (HP/Armor), Schildemitter (regenerierbar).
- **Utility Module:** Magnet (XP-Reichweite), Thruster (Speed), Storage (mehr HP/Loot).

### 4.3 Wachstum & Hitbox
- Jedes große Modul vergrößert Boot-Fläche/Hitbox; Faustregel: Weapon-Slot +X% Radius, Defense-Block kleiner Bonus.
- Balancing-Ideen: Glaskanone (wenige Module, DMG/Speed-Fokus) vs. Tank-Schiff (viele Module, große Hitbox, viel HP).

## 5. Waffen & Elemente
### 5.1 Waffen-Basiswerte
- Attribute: `id`, `name`, `description`, `fireRate`, `baseDamage`, `projectileSpeed`, `projectileLifetime`, `patternType` (forward/circle/spread/random_area), `maxLevel`, Level-Effekte (Damage+, Range+, Multi-Projectiles, Cooldown↓).

### 5.2 Elemente & Flächeneffekte
- Elemente: fire, ice, electric, poison.
- Element-Daten: `onHitEffect`, `color`, optionale Synergien.
- AreaEffects: `id`, `element`, `radius`, `duration`, `tickInterval`, `tickDamage`, Flags (affectsEnemies/player, slowFactorEnemies, slipperyForPlayer), visuelle Darstellung.

### 5.3 Beispielwaffen
- **Basic Cannon:** neutraler Frontschuss.
- **Fire Rocket:** langsame, starke Rakete, spawnt Fire-Patch.
- **Ice Mortar:** ballistische Geschosse, erzeugen Ice-Field.
- **Tesla Coil:** Dauerschaden-Kreis oder Kettenblitze.
- **Toxic Sprayer:** Giftwolke bleibt kurz bestehen.

### 5.4 Status-Effekte
- **Burning:** Tick-Schaden, stapelbar bis X.
- **Frozen/Slowed:** reduzierte Movement/Attack-Speed.
- **Shocked:** erhöhte Kettenblitz-Chance, kurzer Stun möglich.
- **Poisoned:** längerer, schwächerer DoT, reduzierte Regeneration/Resistenz.
- Stack-Regeln: pro Ziel pro Element max. ein Status-Typ, aber Stärke/Dauer skalierbar; Feuer/Eis können sich aufheben oder zu „Steam“ werden (visuell).

## 6. Gegner-Design (Zone: See)
Jeder Gegner: `id`, `speed`, `hp`, `damage`, `behaviorPattern`, `spawnZones`, `xpValue`.

### 6.1 Basic-Typen
- **Piranha:** klein, schnell, wenig HP; direktes Chasen; Masse-Druck, AoE-freundlich.
- **Mutierter Fisch (Chaser):** mittelgroß, mittlere HP; hält Abstand und cirkelt.
- **Panzerkrabbe:** langsam, hohe HP; frontal, ignoriert kleine Flächen; optional Resistenz gegen frontale Treffer.
- **Geisterqualle:** langsam, taucht; Vorwarnung durch Schatten/Blasen/Licht; On-Death Gift- oder Elektro-Zone.
- **Möwe/Mutierter Vogel:** fliegend, ignoriert Wasserhindernisse; Dive-Attack vom Rand; zwingt zu vertikalen/diagonalen Waffen.

### 6.2 Elites & Spezialtypen
- **Explosionsfisch:** schwimmt zu, explodiert in Nähe.
- **Heiler-Qualle:** heilt Gegner im Radius.
- **Schwarmführer:** bufft Piranhas (Speed/Damage).

## 7. Bosse (See)
- **Boss 1: Kleine Seeschlange (3-Minuten):** niedrige/mittlere HP, mobil; Phasen: Umlauf + Minion-Wellen, Biss-Charge mit Telegraph (gefärbtes Wasser/Ausrichtung).
- **Boss 2: Kraken-Mini (6-Minuten):** mittlere/hohe HP, stationärer Kern; 4–6 Tentakel; Tentakel-Slam (markierte Zonen → Knockback), Grab-Phase (zieht Boot); Tentakel zerstörbar → weniger Schaden/Attacken.
- **Boss 3: Große Seeschlange (9-Minuten-Endboss):** hohe HP; Phasen: Kreispfade mit Gift/Feuer-Spuren, Sprungangriffe auf markierte Stellen; Rage <30% HP: mehr Minions, schnelleres Umlaufen, engere Muster.

## 8. Zonen / Biome
- **See:** kompakte Map mit Hindernissen (Häuserreste, Bäume, Autos, Kisten, Trümmer, Masten); wenig Strömung.
- **Fluss:** längliche Map mit Strömung, die das Boot zieht; Hindernisse wie Brückenpfeiler, Uferteile; Strömungsvektoren pro Bereich.
- **Küste:** Mischung Meer/Land; Hindernisse (Felsen, Hafenanlagen, Bojenreihen); Wellenbewegung/Tidenzonen.
- **Ozean:** offene Flächen, wenig Struktur; Schatten großer Kreaturen; mehr große Gegner, weniger kleine.

## 9. Progression & Meta
### 9.1 Meta-Währungen
- **Schrott (Scrap):** Hauptwährung pro Run (Drops von Gegnern/Bossen).
- **Forschungsdaten:** selten, aus Bossen oder Spezial-Events.
- **Optional:** Tickets/Premiumwährung (später).

### 9.2 Meta-Upgrades
- **Überleben:** Max-HP, leichte Regeneration, Start-Schild.
- **Mobilität:** Basis-Speed, Dash/Boost freischaltbar, besseres Handling (weniger Trägheit).
- **Offensiv:** Basis-Projektil-Schaden, Projectile-Speed, Crit-Chance/Schaden, Element-Schaden-Multiplikatoren.
- **Utility:** XP-Gain, Magnetradius, Gold/Schrott-Gain.
- **Run-Qualität:** mehr Upgrade-Auswahlkarten (z. B. 3→4), höhere Chance auf seltene Upgrades.

### 9.3 Boot-Freischaltungen
- **Boot 1: Scout:** klein, schnell, wenig HP.
- **Boot 2: Freighter/Tanker:** viele HP, weniger Speed, mehr Slots.
- **Boot 3: Research Vessel:** normal, Bonus auf Element-Synergien (Statuschance/Effektstärke).
- Freischaltungen: Endboss-Zone X besiegen, Level Y erreichen oder N Forschungsdaten sammeln.

## 10. UI / UX
- **In-Run-HUD:** oben links HP-Bar; oben rechts Level & XP; unten Waffen-/Passive-Icons; oben Mitte Run-Zeit.
- **Level-Up-Overlay:** pausiert Spiel, 3–4 Karten mit Icon/Name/Kurzbeschreibung/Seltenheit (Farbrand). Auswahl = Klick auf Karte; kein Skip.
- **Game-Over/Victory:** prominentes Ergebnis; Stats (Zeit, Kills/Boss-Kills, Level, Währung); Button „Return to Base“.

## 11. Technische Spezifikation (HTML5)
### 11.1 Architektur
- **index.html:** bindet `src/*.js`, initialisiert Canvas & Game.
- **game.js:** Canvas-Setup, Event-Listener, GameLoop via `requestAnimationFrame`; Funktionen `startRun(zoneId)`, `update(dt)`, `render()`.
- **state.js:** `gameState` mit `runTime`, `isPaused`, `isGameOver`, `playerBoat`, Arrays (`enemies`, `projectiles`, `areaEffects`, `xpOrbs`), `currentZone`, `waveState`, `rngSeed`, `level`, `currentXP`, `xpToNextLevel`; Funktionen `resetRun(zoneConfig)`, `levelUp()`.
- **entities.js:** Klassen/Factories für `PlayerBoat`, `Enemy`, `Projectile`, `AreaEffect`, `XpOrb`.
- **systems.js:** `updatePlayer(dt, input, gameState)`, `updateEnemies(dt, gameState)`, `updateProjectiles(dt, gameState)`, `updateAreaEffects(dt, gameState)`, `handleCollisions(gameState)`, `updateXPAndLevel(gameState)`, `updateWaves(dt, gameState)`.
- **config.js:** `ZONES`, `ENEMY_TYPES`, `WEAPONS`, `ELEMENTS`, `AREA_EFFECTS`, `UPGRADES`, `PLAYER_BASE_STATS`.
- **render.js:** `renderScene(ctx, gameState)`, `renderWaterBackground(zone, time)`, `renderBoot`, `renderEnemies`, `renderProjectiles`, `renderAreaEffects`, `renderXpOrbs`, `renderUI`, `renderLevelUpOverlay`.

### 11.2 Technische Regeln
- Delta-Time: alles in px/s, `pos += vel * dt`.
- Entity-Lifecycle: beim Update rückwärts iterieren/filtern; entfernen bei Out-of-Bounds, `hp <= 0`, `duration <= 0` (AreaEffects).
- Collision: Kreis-Checks `distSq < (r1 + r2)^2`; optional mehrere Kreise fürs Boot.
- Randomness: einfacher RNG mit Seed (`gameState.rngSeed`) für reproduzierbare Runs.

## 12. Entwicklung / Debugging
- Dev-Key **D**: Debug-Overlay (FPS, Enemy-Count, Projectile-Count).
- Dev-Key **N**: Spawn Mana-Boss (nur Dev).
- Option: Hitbox-Outline anzeigen.

## 13. Offene Punkte
- Balancing-Zahlen TBD.
- Detail-Design für Fluss/Küste/Ozean noch ausstehend.
- Skill-Baum-Visualisierung im Meta-Menü.
- Monetarisierung später.
- Audio: Musik pro Zone, SFX-Details.
