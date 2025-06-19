# 🗓️ Appointment Booking System – Backend

A Node.js and Express-based RESTful API for managing appointment bookings, time slots, and admin access. Built with MongoDB for persistence.

## 🚀 Features

- Book an available time slot
- Admin login with JWT authentication
- Admin panel: view, edit, delete bookings
- Automatic token-based route protection
- Auto logout (redirect) on token expiry from frontend
- CORS-enabled for frontend integration

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB (via Mongoose)
- JSON Web Token (JWT)
- dotenv for environment management

---

## 📁 Project Structure

```bash
src/
├── config/ # Configuration files (e.g. DB connection, constants)
├── controllers/ # Route handlers and business logic
├── middlewares/ # Custom Express middlewares (e.g. auth)
├── models/ # Mongoose models/schemas
├── routes/ # Express route definitions
├── utils/ # Slot generation, time utilities, etc.
app.js # Express app setup
server.js # Server entry point
```
### Create Environment File
```bash
PORT=3001
MONGODB_URI=mongodb://localhost:27017/appointments
ADMIN_USERNAME=admin
ADMIN_PASSWORD=secret123
JWT_SECRET=somesecretkey
```

### Install Dependencies
```bash
yarn 

npm install
```

### Run Server
```bash
yarn dev     # uses nodemon
# or
node server.js
```

### 🧑‍💼 Admin Flow
```bash
POST /api/admin/login with { username, password }

On success, receive JWT token → must be used in frontend for all admin routes

Admin can:

View bookings: GET /api/admin/bookings

Delete: DELETE /api/admin/bookings/:id

Update: PUT /api/admin/bookings/:id

Create/update slots

### 🚀 Public Routes
GET /api/bookings/slots – grouped slots by date

POST /api/bookings – create a booking
```