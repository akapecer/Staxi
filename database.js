const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./bookings.db');

// Crea la tabella delle prenotazioni
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user TEXT,
            date TEXT,
            time TEXT,
            location TEXT
        )
    `);
});

module.exports = db;
