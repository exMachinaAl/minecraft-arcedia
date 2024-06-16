const sqlite3 = require('sqlite3').verbose();

function connect(req, res) {
    return new sqlite3.Database('./database/user_database.db', (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
        } else {
          console.log('Connected to the user database.');
        }
    });
}

function close(db) {
    db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
        } else {
          console.log('Database connection closed.');
        }
      });
}

function createDb(){
    // Buat koneksi ke database SQLite
    const db = new sqlite3.Database('./user_database.db');

    // Buat tabel "users" jika belum ada
    db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
    )`, (err) => {
    if (err) {
        console.error('Error creating table:', err.message);
    } else {
        console.log('Users table created or already exists.');
    }
    });

    // Tutup koneksi database setelah selesai
    db.close();
}

module.exports = { connect, close, createDb };