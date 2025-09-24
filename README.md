# 🌶️ Smart Farm Cabai

> Sistem monitoring dan kontrol otomatis untuk budidaya cabai berbasis IoT dengan React + Vite

[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.13-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

## 📋 Deskripsi

Smart Farm Cabai adalah aplikasi web modern untuk monitoring dan kontrol sistem pertanian pintar khusus budidaya cabai. Aplikasi ini menyediakan dashboard real-time untuk memantau kondisi lingkungan, mengontrol aktuator, dan melihat riwayat data sensor.

## ✨ Fitur Utama

- 🏠 **Dashboard** - Overview kondisi farm secara real-time
- 📊 **Monitor** - Monitoring sensor lingkungan (suhu, kelembaban, pH, dsb)
- ⚙️ **Kontrol Aktuator** - Kontrol perangkat otomatis (pompa, kipas, lampu)
- 📈 **Riwayat** - Analisis data historis dan tren
- 🌙 **Dark Mode** - Mode gelap untuk kenyamanan pengguna
- 📱 **Responsive Design** - Tampilan optimal di semua perangkat

## 🛠️ Tech Stack

- **Frontend:** React 19.1.1
- **Build Tool:** Vite 7.1.7
- **Styling:** TailwindCSS 4.1.13
- **Icons:** React Icons 5.5.0
- **Linting:** ESLint 9.36.0

## 🚀 Instalasi & Setup

### Prasyarat
- Node.js (versi 18 atau lebih baru)
- npm atau yarn
- Git

### Langkah Instalasi

1. **Clone repository**
   ```bash
   git clone https://github.com/Jujustxr/smartfarmcabai.git
   ```

2. **Masuk ke direktori project**
   ```bash
   cd smartfarmcabai
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Jalankan development server**
   ```bash
   npm run dev
   ```

5. **Buka browser** dan akses `http://localhost:5173`

## 📜 Available Scripts

| Script | Deskripsi |
|--------|-----------|
| `npm run dev` | Menjalankan development server |
| `npm run build` | Build aplikasi untuk production |
| `npm run preview` | Preview build production |
| `npm run lint` | Menjalankan ESLint untuk code quality |

## 📁 Struktur Project

```
smartfarmcabai/
├── public/                 # Static assets
├── src/
│   ├── assets/
│   │   ├── components/     # Reusable components
│   │   │   ├── AktuatorCard.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Chart.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PageTransition.jsx
│   │   │   └── SensorCard.jsx
│   │   ├── hooks/          # Custom React hooks
│   │   │   ├── useDarkMode.js
│   │   │   └── useTogglemenu.js
│   │   └── pages/          # Page components
│   │       ├── Dashboard.jsx
│   │       ├── KontrolAkuator.jsx
│   │       ├── Monitor.jsx
│   │       └── Riwayat.jsx
│   ├── App.jsx             # Main App component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── eslint.config.js        # ESLint configuration
├── tailwind.config.js      # Tailwind configuration
├── vite.config.js          # Vite configuration
└── package.json            # Dependencies & scripts
```

## 🎨 Preview

> *Screenshot dan demo akan ditambahkan setelah development selesai*

## 🤝 Contributing

1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👥 Tim Pengembang

- **Jujustxr** - *Initial work* - [GitHub](https://github.com/Jujustxr)

## 📞 Kontak

Jika ada pertanyaan atau saran, silakan buat [issue](https://github.com/Jujustxr/smartfarmcabai/issues) di repository ini.

---

⭐ **Jangan lupa berikan star jika project ini bermanfaat!** ⭐

