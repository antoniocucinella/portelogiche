# Laboratori didattici

Home del laboratorio (a cura del Prof. Cucinella Antonio) e programmi interattivi in 2D e VR.

## Come si apre

Serve un piccolo server locale (Porte logiche legge `data/esercizi.json`):

```
python3 -m http.server 8000
```

poi apri `http://localhost:8000`. Modalità docente di Porte logiche: `http://localhost:8000/progetti/porte-logiche/#docente`.
Su Meta Quest apri l'indirizzo del sito ospitato (GitHub Pages, Netlify...) con il browser del visore.

## Struttura

```
index.html                home (tema scuro, GSAP + Lenis da CDN); l'elenco è ESPERIENZE nello script
assets/img/favicon.svg
progetti/
  _modello/               scheletro da copiare per ogni nuovo progetto
  porte-logiche/          programma completo (HTML, css/, js/, aframe/, data/) - invariato
  fisica/  chimica/       in arrivo
```

## Collegamenti con la home

- "Apri" → `progetti/porte-logiche/index.html`; 2D, 3D e VR si scelgono dentro il programma (con `#vr` in fondo all'indirizzo si apre direttamente la vista 3D).
- Unica modifica a Porte logiche: una riga in `js/10-modalita-e-viste.js` che riconosce `#vr`.
- Il pulsante "Laboratori" di Porte logiche riporta a `index.html`.
- Per aggiungere un'esperienza: nuova cartella in `progetti/` e una riga in `ESPERIENZE` (campo `materia` uguale a una delle cinque per avere l'emblema animato).
