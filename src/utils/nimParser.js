export const parseNIM = (nim) => {
    // Memastikan NIM memiliki panjang 10 karakter
    if (!nim || nim.length !== 10 || isNaN(nim)) {
        return null;
    }

    // Memecah kode NIM berdasarkan aturan Universitas Andalas
    const yearSuffix = nim.substring(0, 2);
    const jenjangCode = parseInt(nim.substring(2, 3), 10);
    const fakultasCode = parseInt(nim.substring(3, 5), 10);
    const prodiCode = parseInt(nim.substring(5, 6), 10);
    const jalurCode = parseInt(nim.substring(6, 7), 10);
    const urutId = nim.substring(7, 10);

    // Pemetaan Jenjang
    const jenjangMap = {
        1: 'Sarjana (S1)',
        2: 'Magister (S2)',
        3: 'Doktor (S3)',
        4: 'Ahli Madya (D3)'
    };

    // Pemetaan Fakultas
    const fakultasMap = {
        1: 'Hukum', 2: 'Pertanian', 3: 'Kedokteran', 4: 'MIPA',
        5: 'Ekonomi dan Bisnis', 6: 'Peternakan', 7: 'Ilmu Budaya',
        8: 'Ilmu Sosial dan Ilmu Politik', 9: 'Teknik',
        10: 'Farmasi', 11: 'Teknologi Pertanian',
        12: 'Kesehatan Masyarakat', 13: 'Keperawatan',
        14: 'Kedokteran Gigi', 15: 'Teknologi Informasi'
    };

    // Pemetaan Program Studi Khusus (Sesuai Konteks TI yang diminta)
    let prodiName = `Prodi Kode ${prodiCode}`;
    if (fakultasCode === 15) {
        if (prodiCode === 1) prodiName = 'Teknik Komputer';
        else if (prodiCode === 2) prodiName = 'Sistem Informasi';
        else if (prodiCode === 3) prodiName = 'Informatika';
    } else {
        prodiName = `Eksternal FTI`; // Label default fakultas lain
    }

    // Pemetaan Jalur Masuk
    const jalurMap = {
        1: 'SNBP (Prestasi)',
        2: 'SNBT (Tes Tulis)',
        3: 'Mandiri (SIMA-Akademik)',
        4: 'Mandiri Internasional',
        5: 'Pindahan',
        6: 'Transfer',
        7: 'Mandiri Prestasi Unggul',
        8: 'Mandiri Kerjasama dan lainnya',
        9: 'Afirmasi'

    };

    return {
        angkatan: `20${yearSuffix}`,
        jenjang: jenjangMap[jenjangCode] || `Kode ${jenjangCode}`,
        fakultas: fakultasMap[fakultasCode] || `Fakultas ${fakultasCode}`,
        jurusan: prodiName,
        jalur: jalurMap[jalurCode] || `Jalur ${jalurCode}`,
        urut: urutId
    };
};
