# Buku Tamu Lab ini menggunakana Framework React 
untuk pennggunaan silahkan tekan windows + r  setelah menghidupkan server 

# Penting
lalu masukkan code : msedge --kiosk http://localhost:5173/guest --edge-kiosk-type=fullscreen 
untuk keluar dar form pendataan tamu tekan esc dan masukkan password "lsdimoep" 
untuk keluar dari fullscreen sistem silahkan tekan alt + f4 dan itu cuma bisa di halaman dashboard jika d halaman buku tamu tidak bisa 

sebelum menggunakan aplikasi ini pastikan server sudah berjalan dengan menggunakan perintah "npm run dev" 
selalu buat 2 terminal untuk menjalankan aplikasi ini 

Terminal 1 FrontEnd : ".../BukuTamuLSD" 
Terminal 2 BackEnd : ".../BukuTamuLSD/backend"

Pastikan Terminal mengarah ke file tersebut

# Untuk mengisi data dummy
masuk ke terminal backend dan jalankan perintah "node seed.js" 

# Untuk isi dari env sendiri
PORT=8000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME= {nama database}
