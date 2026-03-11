const mysql = require('mysql2/promise');
require('dotenv').config({ path: './.env' }); // pastikan membaca dari lokal

const seedDatabase = async () => {
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

    try {
        const connection = await pool.getConnection();

        console.log('Clearing existing visitors table data...');
        await connection.query('TRUNCATE TABLE visitors');

        const visitors = [];

        // Helper untuk menghasilkan tanggal random di range tertentu
        const randomDate = (start, end) => {
            return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        };

        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const lastWeekStart = new Date(today);
        lastWeekStart.setDate(lastWeekStart.getDate() - 7);

        const lastMonthStart = new Date(today);
        lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);

        // Data array alasan
        const purposes = ["Berkunjung", "Praktikum", "Penelitian", "Tugas Akhir", "Mencari Asisten"];
        const getRandomPurpose = () => purposes[Math.floor(Math.random() * purposes.length)];

        // Helper untuk generate NIM FTI Universitas Andalas (Fakultas 15)
        // Format: [Tahun (2)][Jenjang S1 (1)][Fakultas 15 (2)][Prodi (1)][Jalur (1)][Nomor Urut (3)]
        // Prodi FTI (1=Tekkom, 2=SI, 3=Sistem Informasi)
        const generateFtiNim = () => {
            const years = ['20', '21', '22', '23', '24', '25'];
            const year = years[Math.floor(Math.random() * years.length)];
            const prodis = ['1', '2', '3'];
            const prodi = prodis[Math.floor(Math.random() * prodis.length)];
            const jalurs = ['1', '2', '3']; // 1: SNBP, 2: SNBT, 3: Mandiri
            const jalur = jalurs[Math.floor(Math.random() * jalurs.length)];
            const urut = String(Math.floor(Math.random() * 150) + 1).padStart(3, '0');
            
            return `${year}115${prodi}${jalur}${urut}`;
        };

        // Helper untuk generate NIM Non-FTI (Fakultas 1-14)
        const generateNonFtiNim = () => {
            const years = ['20', '21', '22', '23', '24', '25'];
            const year = years[Math.floor(Math.random() * years.length)];
            const fakultasKode = Math.floor(Math.random() * 14) + 1; // 1-14
            const fakultasStr = String(fakultasKode).padStart(2, '0');
            const prodi = String(Math.floor(Math.random() * 3) + 1); // 1-3
            const jalurs = ['1', '2', '3'];
            const jalur = jalurs[Math.floor(Math.random() * jalurs.length)];
            const urut = String(Math.floor(Math.random() * 150) + 1).padStart(3, '0');
            
            return `${year}1${fakultasStr}${prodi}${jalur}${urut}`;
        };

        // Fungsi generate NIM acak dengan proporsi 50% FTI, 50% luar FTI
        const generateRandomNim = () => {
            return Math.random() < 0.5 ? generateFtiNim() : generateNonFtiNim();
        };

        console.log('Generating dummy data...');

        // Fungsi pembantu untuk membuat N pengunjung di tanggal tertentu
        const generateVisitorsForDay = (targetDate, count) => {
            for (let i = 0; i < count; i++) {
                const visitDate = new Date(targetDate);
                visitDate.setHours(Math.floor(Math.random() * 11) + 8, Math.floor(Math.random() * 60), 0, 0);
                visitors.push([generateRandomNim(), getRandomPurpose(), visitDate]);
            }
        };

        // Generate mundur 80 hari ke belakang dari Hari Ini untuk meng-cover Bulan Lalu dengan aman
        // Setiap harinya (Senin-Minggu) akan dijamin mendapat jumlah pengunjung yang setara
        for (let i = 0; i <= 80; i++) {
            const currentDate = new Date(today);
            currentDate.setDate(today.getDate() - i);
            
            // Setiap harinya merata diisi sekitar 20 hingga 25 orang (Sangat Merata vs hari lainnya)
            // Khusus kemarin dan hari ini kita beri sedikit booster untuk menunjukkan Trend Positif
            let dailyCount = Math.floor(Math.random() * 6) + 20; 
            if (i === 0) dailyCount = 35; // Hari Ini
            if (i === 1) dailyCount = 28; // Kemarin

            generateVisitorsForDay(currentDate, dailyCount);
        }

        console.log(`Inserting ${visitors.length} dummy data to database...`);
        
        await connection.query(
            'INSERT INTO visitors (nim, purpose, created_at) VALUES ?',
            [visitors]
        );

        console.log('✅ Dummy data successfully seeded!');
        connection.release();
        process.exit(0);
    } catch (error) {
        console.error('Failed to seed database:', error.message);
        process.exit(1);
    }
};

seedDatabase();
