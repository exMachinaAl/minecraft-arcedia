const db = require("./db");


function register(req, res) {
    const { userpop, passcode } = req.body;
    const dbConn = db.connect();

    dbConn.run('INSERT INTO users (username, password) VALUES (?, ?)', [userpop, passcode], (err) => {
        if (err) {
        console.error('Error registering user:', err.message);
        res.status(500).json({ message: 'Internal server error' });
        } else {
        res.json({ message: 'User registered successfully' });
        console.log("send suucces")
        }

        // Tutup koneksi database setelah selesai
        db.close(dbConn);
    });
}


function login(req, res) {
    const { username, password } = req.body;
    const dbConn = db.connect();
    // Query untuk mendapatkan data pengguna berdasarkan username
    dbConn.get('SELECT password FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
        return res.status(500).send('Internal Server Error');
        }
    
        // Jika pengguna tidak ditemukan
        if (!row) {
        return res.status(401).send('Username is incorrect');
        }
    
        // Membandingkan password yang dimasukkan dengan password yang tersimpan
        if (row.password === password) {
        // Jika cocok, kirim respon login berhasil
        res.send('Login successful');
        } else {
        // Jika tidak cocok, kirim respon login gagal
        res.status(401).send('password is incorrect');
        }
    });
  dbConn.close();
}

module.exports = { register, login };
