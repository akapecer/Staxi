require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const mysql = require('mysql2');

// Crea un'app Express
const app = express();
const port = 3000;

// Configura il body parser per leggere i dati in arrivo
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configura Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Connetti a MySQL (o usa il database che preferisci)
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// Connessione al database
db.connect((err) => {
    if (err) throw err;
    console.log('Database connected');
});

// Dati di stato per il flusso di prenotazione e lingua
let bookingData = {};
let languageData = {};

// Endpoint Webhook per Twilio
app.post('/whatsapp', (req, res) => {
    const body = req.body;
    const from = body.From;
    const message = body.Body.toLowerCase().trim();

    // Gestione della lingua
    if (message === 'italiano' || message === 'english') {
        languageData[from] = message;
        sendMessage(from, `Hai selezionato ${message === 'italiano' ? 'italiano' : 'english'}. Come posso aiutarti?`);
        return res.status(200).end();
    } 

    // Se non è stata selezionata la lingua, chiedi all'utente di scegliere
    if (!languageData[from]) {
        sendMessage(from, "Ciao, scegli la tua lingua. Scrivi 'italiano' o 'english'.");
        return res.status(200).end();
    }

    // Risposte in base alla lingua
    const lang = languageData[from];
    let responseMessage = '';

    // Flusso di prenotazione
    if (message === 'prenotazione') {
        sendMessage(from, lang === 'italiano' ? "Perfetto! Quando desideri prenotare?" : "Great! When would you like to book?");
        bookingData[from] = { step: 'date' };
    } else if (bookingData[from] && bookingData[from].step === 'date') {
        bookingData[from].date = body.Body;
        sendMessage(from, lang === 'italiano' ? "Ok, a che ora?" : "Great, what time?");
        bookingData[from].step = 'time';
    } else if (bookingData[from] && bookingData[from].step === 'time') {
        bookingData[from].time = body.Body;
        sendMessage(from, lang === 'italiano' ? "Ok, qual è l'indirizzo di partenza?" : "Great, what is the pick-up address?");
        bookingData[from].step = 'start_address';
    } else if (bookingData[from] && bookingData[from].step === 'start_address') {
        bookingData[from].start_address = body.Body;
        sendMessage(from, lang === 'italiano' ? "Qual è l'indirizzo di destinazione?" : "What is the destination address?");
        bookingData[from].step = 'destination_address';
    } else if (bookingData[from] && bookingData[from].step === 'destination_address') {
        bookingData[from].destination_address = body.Body;
        sendMessage(from, lang === 'italiano' ? "Ok, quante persone?" : "Great, how many people?");
        bookingData[from].step = 'people';
    } else if (bookingData[from] && bookingData[from].step === 'people') {
        bookingData[from].people = body.Body;
        saveBooking(bookingData[from]);
        sendMessage(from, lang === 'italiano' ? "La tua prenotazione è stata registrata!" : "Your booking has been saved!");
        delete bookingData[from];
    } else if (message === 'visualizza prenotazioni') {
        // Solo il taxista può visualizzare le prenotazioni
        if (from === process.env.TAXI_PHONE) { // Sostituisci con il numero WhatsApp del taxista
            getBookings(from);
        } else {
            sendMessage(from, lang === 'italiano' ? "Non sei autorizzato a visualizzare le prenotazioni." : "You are not authorized to view the bookings.");
        }
    } else {
        responseMessage = lang === 'italiano' ? "Ciao, come posso aiutarti?" : "Hi, how can I help you?";
        sendMessage(from, responseMessage);
    }

    res.status(200).end(); // Rispondiamo a Twilio
});

// Funzione per inviare un messaggio
function sendMessage(to, body) {
    client.messages.create({
        body: body,
        from: process.env.TWILIO_WHATSAPP_NUMBER, // Numero WhatsApp sandbox di Twilio
        to: to
    })
    .then(message => console.log(message.sid))
    .catch(err => console.error(err));
}

// Funzione per salvare la prenotazione nel database
function saveBooking(booking) {
    const query = `INSERT INTO bookings (date, time, people, start_address, destination_address) 
                   VALUES ('${booking.date}', '${booking.time}', '${booking.people}', '${booking.start_address}', '${booking.destination_address}')`;
    db.query(query, (err, result) => {
        if (err) throw err;
        console.log('Prenotazione salvata:', result);
    });
}

// Funzione per recuperare le prenotazioni
function getBookings(to) {
    const query = 'SELECT * FROM bookings';
    db.query(query, (err, results) => {
        if (err) {
            sendMessage(to, 'Errore nel recupero delle prenotazioni.');
            return;
        }

        if (results.length > 0) {
            let message = 'Prenotazioni:\n';
            results.forEach((booking, index) => {
                message += `${index + 1}. Data: ${booking.date}, Ora: ${booking.time}, Persone: ${booking.people}, Partenza: ${booking.start_address}, Destinazione: ${booking.destination_address}\n`;
            });
            sendMessage(to, message);
        } else {
            sendMessage(to, 'Non ci sono prenotazioni.');
        }
    });
}

// Avvia il server
app.listen(port, () => {
    console.log(`Server avviato su http://localhost:${port}`);
});
