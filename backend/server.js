require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Configuration
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'buku_tamu_lab',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Create tables if not exist (Initialization)
const initializeDatabase = async () => {
    try {
        const connection = await pool.getConnection();

        await connection.query(`
            CREATE TABLE IF NOT EXISTS visitors (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nim VARCHAR(20) NOT NULL,
                purpose TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('Database synchronized.');
        connection.release();
    } catch (error) {
        console.error('Failed to initialize database:', error.message);
    }
};

initializeDatabase();

// Route: Server Heartbeat 
app.get('/api/status', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Backend is running' });
});

// Route: Get all visitors
app.get('/api/visitors', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM visitors ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching visitors:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route: Add a new visitor
app.post('/api/visitors', async (req, res) => {
    try {
        const { nim, purpose, created_at } = req.body;

        if (!nim || !purpose) {
            return res.status(400).json({ error: 'NIM dan Alasan Kunjungan wajib diisi' });
        }

        const dateToStore = created_at ? new Date(created_at) : new Date();

        const [result] = await pool.query(
            'INSERT INTO visitors (nim, purpose, created_at) VALUES (?, ?, ?)',
            [nim, purpose, dateToStore]
        );

        res.status(201).json({
            message: 'Data pengunjung berhasil disimpan',
            data: {
                id: result.insertId,
                nim,
                purpose,
                created_at: dateToStore
            }
        });
    } catch (error) {
        console.error('Error submitting visitor:', error);
        res.status(500).json({ error: 'Terjadi kesalahan pada server saat menyimpan data' });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`✅ Backend API is running on http://localhost:${port}`);
    console.log(`Database target: ${process.env.DB_NAME || 'buku_tamu_lab'}`);
});
