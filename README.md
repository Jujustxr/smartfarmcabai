

# 🌶️ Smart Farm Chili

> Automated monitoring and control system for chili cultivation based on IoT with React + Vite

[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=flat-square\&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?style=flat-square\&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.13-38B2AC?style=flat-square\&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

## 📋 Description

Smart Farm Chili is a modern web application for monitoring and controlling smart farming systems specifically for chili cultivation. It provides a real-time dashboard to monitor environmental conditions, control actuators, and view sensor data history.

## ✨ Key Features

* 🏠 **Dashboard** - Real-time overview of farm conditions
* 📊 **Monitor** - Monitor environmental sensors (temperature, humidity, pH, etc.)
* ⚙️ **Actuator Control** - Control automation devices (pump, fan, light)
* 📈 **History** - Analyze historical data and trends
* 🌙 **Dark Mode** - Dark theme for user comfort
* 📱 **Responsive Design** - Optimized display on all devices

## 🛠️ Tech Stack

* **Frontend:** React 19.1.1
* **Build Tool:** Vite 7.1.7
* **Styling:** TailwindCSS 4.1.13
* **Icons:** React Icons 5.5.0
* **Linting:** ESLint 9.36.0

## 🚀 Installation & Setup

### Prerequisites

* Node.js (version 18 or later)
* npm or yarn
* Git

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/Jujustxr/smartfarmcabai.git
   ```

2. **Navigate to project directory**

   ```bash
   cd smartfarmcabai
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Run development server**

   ```bash
   npm run dev
   ```

5. **Open your browser** and go to `http://localhost:5173`

## 📜 Available Scripts

| Script            | Description                  |
| ----------------- | ---------------------------- |
| `npm run dev`     | Run development server       |
| `npm run build`   | Build the app for production |
| `npm run preview` | Preview the production build |
| `npm run lint`    | Run ESLint for code quality  |

## 📁 Project Structure

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

> *Screenshots and demo will be added after development is complete*

## 🤝 Contributing

1. Fork this repository
2. Create a new feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👥 Development Team

* **Jujustxr** - *Initial work* - [GitHub](https://github.com/Jujustxr)

## 📞 Contact

If you have any questions or suggestions, please open an [issue](https://github.com/Jujustxr/smartfarmcabai/issues) in this repository.

---

⭐ **Don’t forget to give a star if you find this project useful!** ⭐

