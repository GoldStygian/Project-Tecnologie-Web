# Introduzione
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

# Inizializzazione & Esecuzione (genereale)

```bash
cd backend
npm install
```

```bash
cd ..
cd Frontend/streetcats
npm install
```

Avviare in due terminali diversi `npm start` nelle directory:
- backend
- Frontend/streetcats

# Inizializzazione & Esecuzione (windows)
- Init: Lanciare lo script init.bat nella radice del progetto `.\init.bat`
- Per eseguire: Lanciare lo script start.bat nella radice del progetto `.\start.bat`