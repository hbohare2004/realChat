# 💬 RealChat — Real-Time Chat Application Backend

A **production-level**, scalable real-time chat backend built with **Node.js**, **Express.js**, **Socket.io**, and **MongoDB Atlas**. Features JWT authentication, one-to-one messaging, room-based chat, typing indicators, online presence tracking, and more.

---

## 🚀 Tech Stack

| Technology         | Purpose                          |
| ------------------ | -------------------------------- |
| Node.js            | Runtime environment              |
| Express.js         | HTTP server framework            |
| MongoDB Atlas      | Cloud database                   |
| Mongoose           | MongoDB ODM                      |
| Socket.io          | Real-time bidirectional events   |
| JWT                | Token-based authentication       |
| bcryptjs           | Password hashing                 |
| Joi                | Request validation               |
| Helmet             | HTTP security headers            |
| express-rate-limit | API rate limiting                |
| Morgan             | HTTP request logging             |
| Multer             | File upload support (ready)      |
| cookie-parser      | Cookie handling                  |
| CORS               | Cross-origin resource sharing    |
| dotenv             | Environment variable management  |

---

## 📁 Project Structure

```
backend/
│
├── src/
│   ├── config/          # Database & app configuration
│   ├── controllers/     # Route handler logic
│   ├── middleware/       # Auth, error handling, validation
│   ├── models/          # Mongoose schemas & models
│   ├── routes/          # Express route definitions
│   ├── services/        # Business logic layer
│   ├── sockets/         # Socket.io event handlers
│   ├── utils/           # Reusable utility classes
│   ├── validators/      # Joi validation schemas
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
│
├── .env.example         # Environment variable template
├── package.json         # Dependencies & scripts
└── README.md            # You are here
```

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** v18+ installed
- **MongoDB Atlas** account with a cluster created
- **npm** or **yarn** package manager

### 1. Clone the repository

```bash
git clone <repository-url>
cd RealChat/backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

| Variable         | Description                              | Example                                      |
| ---------------- | ---------------------------------------- | -------------------------------------------- |
| `PORT`           | Server port                              | `5000`                                       |
| `NODE_ENV`       | Environment mode                         | `development` / `production`                 |
| `MONGODB_URI`    | MongoDB Atlas connection string          | `mongodb+srv://user:pass@cluster.mongodb.net/realchat` |
| `JWT_SECRET`     | Secret key for signing JWTs              | A long random string                         |
| `JWT_EXPIRES_IN` | JWT token expiration                     | `7d`                                         |
| `CLIENT_URL`     | Frontend URL for CORS                    | `http://localhost:3000`                       |
| `COOKIE_MAX_AGE` | Cookie expiration in milliseconds        | `604800000` (7 days)                          |

### 4. Start the server

```bash
# Development (with hot-reload)
npm run dev

# Production
npm start
```

The server will start at `http://localhost:5000` (or your configured `PORT`).

---

## 🔗 API Endpoints

### Authentication

| Method | Endpoint             | Description          | Auth Required |
| ------ | -------------------- | -------------------- | ------------- |
| POST   | `/api/auth/register` | Register a new user  | ❌            |
| POST   | `/api/auth/login`    | Login & get token    | ❌            |
| POST   | `/api/auth/logout`   | Logout & clear token | ✅            |
| GET    | `/api/auth/me`       | Get current user     | ✅            |

### Users

| Method | Endpoint          | Description        | Auth Required |
| ------ | ----------------- | ------------------ | ------------- |
| GET    | `/api/users`      | List all users     | ✅            |
| GET    | `/api/users/:id`  | Get user by ID     | ✅            |

### Messages

| Method | Endpoint                  | Description             | Auth Required |
| ------ | ------------------------- | ----------------------- | ------------- |
| POST   | `/api/messages`           | Send a message          | ✅            |
| GET    | `/api/messages/:roomId`   | Get messages by room    | ✅            |

### Rooms

| Method | Endpoint       | Description         | Auth Required |
| ------ | -------------- | ------------------- | ------------- |
| POST   | `/api/rooms`   | Create a chat room  | ✅            |
| GET    | `/api/rooms`   | Get user's rooms    | ✅            |

---

## 🔌 Socket.io Events

### Client → Server

| Event          | Payload                        | Description                 |
| -------------- | ------------------------------ | --------------------------- |
| `join-room`    | `{ roomId }`                   | Join a chat room            |
| `leave-room`   | `{ roomId }`                   | Leave a chat room           |
| `send-message` | `{ roomId, receiverId, message, messageType }` | Send a message |
| `typing`       | `{ roomId }`                   | Start typing indicator      |
| `stop-typing`  | `{ roomId }`                   | Stop typing indicator       |

### Server → Client

| Event              | Payload               | Description                       |
| ------------------ | --------------------- | --------------------------------- |
| `new-message`      | Message object         | New message received              |
| `user-typing`      | `{ userId, roomId }`  | User is typing                    |
| `user-stop-typing` | `{ userId, roomId }`  | User stopped typing               |
| `online-users`     | `[userId, ...]`        | Updated list of online users      |
| `user-connected`   | `{ userId }`          | A user came online                |
| `user-disconnected`| `{ userId }`          | A user went offline               |

---

## 🔐 Authentication Flow

1. **Register** → Creates user, hashes password, returns JWT in HTTP-only cookie
2. **Login** → Validates credentials, returns JWT in HTTP-only cookie
3. **Protected Routes** → Middleware extracts JWT from cookie or `Authorization` header
4. **Logout** → Clears the authentication cookie

---

## 🏗️ Architecture

The backend follows a **layered architecture** for separation of concerns:

```
Request → Route → Middleware → Controller → Service → Model → Database
```

- **Routes**: Define endpoints and wire up middleware + controllers
- **Middleware**: Auth guards, validation, error handling, rate limiting
- **Controllers**: Handle HTTP request/response cycle
- **Services**: Encapsulate business logic and database operations
- **Models**: Define data schemas and database interactions
- **Sockets**: Real-time event handling in a separate, modular layer

---

## 📝 License

ISC
