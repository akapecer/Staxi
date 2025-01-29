# Stefano Taxi Bot

Stefano Taxi Bot è un chatbot sviluppato con **WhatsApp Business API** per gestire prenotazioni di taxi. Il bot permette agli utenti di prenotare una corsa con Stefano, un taxista, direttamente su WhatsApp.

## Caratteristiche principali
- **Selezione della lingua**: Gli utenti possono scegliere la lingua del bot.
- **Prenotazione corsa**: Gli utenti possono prenotare una corsa con dettagli come orario, indirizzo di partenza e destinazione.
- **Chiamata urgente**: Gli utenti possono scegliere di chiamare direttamente Stefano per una corsa immediata.
- **Interazione tramite WhatsApp**: Tutte le comunicazioni avvengono tramite WhatsApp, senza bisogno di un'app separata.

## Tecnologie utilizzate
- **Node.js**: Per la logica di backend e gestione delle richieste.
- **WhatsApp Business API**: Per integrare WhatsApp con il bot.
- **Twilio API** (opzionale per il testing): Per il testing iniziale del bot prima della transizione a WhatsApp Business.
- **Express.js**: Framework per la creazione del server HTTP.
- **Axios**: Per le richieste HTTP al server di WhatsApp.
- **GitHub**: Per il versionamento del codice.

## Setup
### Prerequisiti:
- Un account **WhatsApp Business API**.
- Un account **Twilio** (se desideri fare il testing con Twilio prima di passare a WhatsApp Business API).
- Node.js installato.

### Installazione:
1. Clona il repository:
    ```bash
    git clone https://github.com/tuo-username/stefano-taxi-bot.git
    ```

2. Vai nella cartella del progetto:
    ```bash
    cd stefano-taxi-bot
    ```

3. Installa le dipendenze:
    ```bash
    npm install
    ```

4. Configura il tuo account WhatsApp Business API o Twilio. Aggiungi il token di accesso al file `.env`:
    ```text
    WHATSAPP_API_TOKEN=your-whatsapp-api-token
    TWILIO_ACCOUNT_SID=your-twilio-account-sid
    TWILIO_AUTH_TOKEN=your-twilio-auth-token
    ```

5. Avvia il server:
    ```bash
    npm start
    ```

6. Il bot dovrebbe essere ora attivo e funzionante.

## Funzionalità
- **Lingua**: Gli utenti selezionano la lingua preferita all'inizio della conversazione.
- **Prenotazione corsa**: Il bot guida l'utente attraverso la procedura di prenotazione di una corsa.
- **Chiamata urgente**: Gli utenti possono scegliere di parlare direttamente con Stefano per prenotazioni immediate.
- **Risposta automatica**: Il bot invia risposte automatiche in base alle azioni dell'utente.

## Contribuire
1. Forka il repository.
2. Crea un nuovo branch per la tua funzionalità (`git checkout -b feature/nome-funzionalità`).
3. Aggiungi i tuoi cambiamenti (`git add .`).
4. Commit i tuoi cambiamenti (`git commit -m 'Aggiungi nuova funzionalità'`).
5. Push del branch (`git push origin feature/nome-funzionalità`).
6. Crea una pull request.

## License
Distribuito sotto la licenza MIT. Vedi `LICENSE` per ulteriori dettagli.

