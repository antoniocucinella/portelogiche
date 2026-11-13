# Porte logiche in A-Frame

Programma didattico per esercitarsi con porte logiche, tabelle di verità e circuiti, in 2D, 3D e realtà virtuale.

## Come si apre

Serve un piccolo server locale, perché il programma legge `data/esercizi.json`:

```
python3 -m http.server 8000
```

lanciato nella cartella principale del sito (quella con la home dei laboratori), poi apri
`http://localhost:8000/progetti/porte-logiche/` nel browser. Per la **modalità docente** aggiungi `#docente` all'indirizzo.
Dal menu a sinistra il pulsante **Laboratori** riporta alla home.
Serve connessione internet per scaricare la libreria A-Frame.

## Struttura delle cartelle

```
index.html            la struttura della pagina (HTML) e il collegamento ai file
css/                  l'ASPETTO (colori, posizioni, dimensioni)
aframe/               i componenti 3D (i "mattoncini" della scena A-Frame)
js/                   il COMPORTAMENTO (la logica del programma)
data/esercizi.json    gli esercizi, modificabili senza toccare il codice
```

## css/ (si caricano in quest'ordine: l'ordine conta!)

| File | Cosa contiene |
|---|---|
| 01-base.css | colori (variabili, stessi della home), tema chiaro/scuro, pulsanti, campi, tabelle |
| 02-menu-laterale.css | menu a sinistra e linguetta laterale per nasconderlo / mostrarlo |
| 03-porta-singola.css | pannello con tabella di verità, vista 2D, pulsanti 2D/3D |
| 04-area-circuiti.css | sezione Circuiti: funzione in alto, colonna strumenti a sinistra (tavolozza, pulsanti, guida), lavagna, messaggi |
| 05-simboli-svg.css | come si colorano porte, fili, LED, interruttori; lavagna sempre bianca |
| 06-finestre-aiuto-docente.css | finestra Aiuto ed editor docente |
| 07-responsive.css | adattamento a telefoni (va per ultimo) |

## aframe/ (un file per componente)

`label` (testi 3D) · `gate3d` (porta in 3D) · `rbox-geometry` (cubo arrotondato) · `ico` (icone) · `c3txt` (pannello testo) · `ttpanel` (tabella 3D) · `gatesym` (simbolo porta)

## js/ (si eseguono in ordine numerico)

| File | Cosa fa |
|---|---|
| 00-gestione-errori | mostra gli errori a schermo |
| 01-base-e-stato | scorciatoie, tabella delle porte `PORTE`, stato della porta singola |
| 02-porta-singola | `aggiornaPortaSingola()` e `avviaProgramma()` della sezione Porta singola |
| 03-dati-e-costanti | elenco esercizi `ESERCIZI` e variabili della lavagna (con glossario) |
| 04-cronologia-undo | annulla / ripeti |
| 05-disegno-circuito-2d | disegno SVG del circuito, `disegnaCircuito()` |
| 06-circuito-3d-vr | circuiti in 3D / VR |
| 07-azioni-e-caricamento | collegare i pin, `caricaEsercizio()` |
| 08-zoom-e-trascinamento | mouse e tocco: trascinare, zoom, pan |
| 09-pulsanti-e-verifica | pulsanti della lavagna e `verificaCircuito()` |
| 10-modalita-e-viste | cambio sezione e vista 2D/3D |
| 11-configurazione-docente | attivazione modalità docente |
| 12-parser-espressioni | legge formule come `A*!B+C` |
| 13-analisi-circuiti | esercizi "scrivi la funzione del circuito" |
| 14-esercizi-personalizzati | lettura del JSON ed editor docente |
| 15-aiuto-circuiti-elettrici | finestra Aiuto |
| 16-menu-e-avvio | menu, caricamento esercizi, avvio |
| 17-tema | pulsante Tema (chiaro/scuro, condiviso con la home) |

## Attenzione

- Gli script JS **condividono le variabili globali**: non cambiare l'ordine né i numeri dei file.
- La logica è identica all'originale: il codice è stato diviso, commentato e i nomi abbreviati sono stati sostituiti da nomi leggibili (vedi `DIZIONARIO-NOMI.md`).
- Unica modifica funzionale: il file degli esercizi ora si trova in `data/esercizi.json`.

## Sintassi degli esercizi (data/esercizi.json)

Ogni esercizio può avere `espressione` (es. `A*!B+C`: `!` NOT, `*` AND, `+` OR, `^` XOR), oppure `tabella` (uscite da 000 a 111), oppure `circuito` (es. `AND(A,NOT(B))`), più `titolo`, `porte` (porte consentite), `min` (numero minimo di porte) e `teoria` (spiegazione dopo la verifica).
