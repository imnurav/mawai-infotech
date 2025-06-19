# 📆 Appointment Booking Frontend

This is the **frontend** for the Appointment Booking System built using **React**, **TailwindCSS**, and **Vite**. It allows users to:

- View available appointment slots by date
- Book a time slot
- Receive confirmation messages
- Admins can securely log in and manage bookings

---

## 🚀 Features

- Clean responsive UI with modern design
- Slot booking with real-time availability check
- Scrollable and date picker-based calendar interface
- Admin login panel
- View, edit, delete bookings (admin only)
- Auto logout on session expiration

---

## 📦 Tech Stack

- React + Vite
- TailwindCSS
- React Router
- Axios
- React Toastify
- React Datepicker

---

## 🛠️ Getting Started

### ✅ Prerequisites

- Node.js (v18+ recommended)
- Yarn (recommended) or npm

---

## 🚚 Installation

```bash
cd booking-portal
yarn install
npm install
```

### Running the App

```bash
yarn dev
npm dev

Then open in browser:
http://localhost:5173
```

### 🔐 Admin Panel

- Navigate to /admin/login

### Use the following credentials:

- Username: admin
- Password: secret123

### The frontend communicates with the backend via this URL:

- http://localhost:3001/api
- Make sure your backend is running before interacting with this frontend.

### You can change this in frontend/api/index.js:

```bash
const API = axios.create({ baseURL: "http://localhost:3001/api" });
```
