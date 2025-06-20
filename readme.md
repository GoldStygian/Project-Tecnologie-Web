# Introsuzione
STREETCATS una piattaforma web dedicata alla condivisione di avvistamenti di 
gatti randagi. Gli utenti registrati potranno inserire nuovi gatti nel sistema, caricando una fotografia, 
indicando la posizione geografica tramite una mappa interattiva, e aggiungendo un titolo e una 
descrizione testuale. La descrizione dovrà supportare la formattazione del testo, permettendo l'uso 
di grassetto, corsivo e link ipertestuali (per esempio, utilizzando un linguaggio di annotazione come 
Markdown). 
Tutti gli utenti, anche quelli non registrati, potranno esplorare i gatti presenti sulla piattaforma 
visualizzandoli su una mappa interattiva. Cliccando su ciascun marker, sarà possibile visualizzare un 
tooltip di riepilogo, da cui si può accedere alla pagina di dettaglio del gatto. In tale pagina, verranno 
mostrate la foto, la posizione sulla mappa, la data di inserimento, il titolo, la descrizione formattata 
e i commenti lasciati dagli altri utenti. Solo gli utenti autenticati, però, potranno contribuire con 
nuovi commenti, arricchendo la community con osservazioni, consigli o semplici messaggi dedicati 
ai felini avvistati.

# TO-DO

- signup

# Frontend (Angular)

## Mappa interattiva (LeafLet)

- leaflet scaricato direttamente (npm) e i file statici non tramite CDN

## Flash messages (Toaster)

## Editor di testo con supporto MarkDown (SimpleMDE)

- Editor e anteprima

## Rendering testo MD (ngx-markdown)


# Beckedn (Express)

## API

## Gestione delle immagini (Multer)

- Download e stoccaggio in `/upload`

## Controllo dei dati in entrata (ZOD)
**Zod** is a TypeScript-first validation library

### Controlli effettuati

- [x] Cat
- [x] Comemnti

# NOTE

- l'authGuard estende CanActivateFn verivica tramite AuthService se l'utente è autenticato oppure no
- ...jsonCat: **object spread** di JavaScript (introdotto in ES2018) e serve a creare un nuovo oggetto copiando le proprietà di uno esistente, più eventuali proprietà aggiuntive o sovrascritte.
`const payload = { ...req.body, photo };`
1) Espande (...) tutte le proprietà di req.body dentro un nuovo oggetto.
2) Aggiunge (o sovrascrive, se già presente) la proprietà photo con il valore della variabile photo.