# Nicys — Luxury Letter Writing & Storytelling Brand

> *Helping you say what matters most.*

A full-stack web application for Nicys, a bespoke letter-writing brand. Built with React + Vite, Express, and MongoDB. Features Three.js ambient animations, a multi-step order flow, order tracking, and Nodemailer email notifications.

---

## Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, Framer Motion     |
| 3D / FX   | Three.js (vanilla, no R3F)                      |
| Routing   | React Router v6                                 |
| Backend   | Node.js, Express 4                              |
| Database  | MongoDB + Mongoose 8                            |
| Email     | Nodemailer (Gmail SMTP)                         |
| Uploads   | Multer (local disk, `/server/uploads/`)         |

---

## Project Structure

```
nicys-website/
├── client/                   # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── three/        # Three.js animation components
│   │   │   ├── layout/       # Navbar, Footer
│   │   │   └── order/        # Multi-step form steps 1–5
│   │   ├── context/          # OrderContext (form state)
│   │   ├── data/             # Collections, gift boxes, add-ons data
│   │   └── pages/            # Home, Services, Packages, Order, Track, Contact
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                   # Express backend
│   ├── config/db.js          # MongoDB connection
│   ├── controllers/          # orderController, contactController
│   ├── middleware/upload.js  # Multer config
│   ├── models/               # Order, Contact schemas
│   ├── routes/               # /api/orders, /api/contact
│   ├── utils/email.js        # Nodemailer helpers
│   └── index.js              # Express entry point
├── .env.example
└── README.md
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local) or a MongoDB Atlas URI

### 1. Clone & set up environment

```bash
# Copy env template
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/nicys
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
ADMIN_EMAIL=your-admin@email.com
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

> **Gmail App Password**: In your Google Account → Security → 2-Step Verification → App passwords. Generate one for "Mail".

### 2. Install dependencies

```bash
# Client
cd client && npm install

# Server
cd ../server && npm install
```

### 3. Run in development

Open two terminals:

```bash
# Terminal 1 — backend (port 5000)
cd server && npm run dev

# Terminal 2 — frontend (port 3000)
cd client && npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable      | Description                                  | Example                              |
|---------------|----------------------------------------------|--------------------------------------|
| `PORT`        | Server port                                  | `5000`                               |
| `MONGO_URI`   | MongoDB connection string                    | `mongodb://localhost:27017/nicys`    |
| `EMAIL_USER`  | Gmail address for sending emails             | `studio@nicys.ng`                    |
| `EMAIL_PASS`  | Gmail App Password (not your Gmail password) | `abcd efgh ijkl mnop`                |
| `ADMIN_EMAIL` | Where order/contact notifications go         | `admin@nicys.ng`                     |
| `CLIENT_URL`  | Frontend URL (for CORS)                      | `http://localhost:3000`              |

---

## API Reference

### Orders

| Method | Endpoint                  | Description                          |
|--------|---------------------------|--------------------------------------|
| POST   | `/api/orders`             | Create new order (multipart/form-data)|
| GET    | `/api/orders/:id`         | Get order by ID (+ `?email=` verify) |
| PATCH  | `/api/orders/:id/status`  | Update order status (admin)          |
| GET    | `/api/orders`             | List all orders (admin)              |

**Order Status values:** `Received` → `In Progress` → `Complete` → `Delivered`

### Contact

| Method | Endpoint        | Description                        |
|--------|-----------------|------------------------------------|
| POST   | `/api/contact`  | Save message & send email to admin |

---

## Brand Design System

### Colours
| Name        | Hex       | Usage                          |
|-------------|-----------|--------------------------------|
| Lavender    | `#C8A4D4` | Primary accent, headings tint  |
| Cream       | `#FFF8F0` | Background                     |
| Dusty Rose  | `#D4A5A5` | Secondary accent, cards        |
| Emerald     | `#2D6A4F` | Success states, wax seal       |
| Baby Pink   | `#F4C2C2` | Soft highlights                |
| Midnight    | `#1B2A4A` | Primary text, dark sections    |

### Fonts
- **Display:** Cormorant Garamond (romantic serif, headings)
- **Body:** DM Sans (clean, minimal, UI text)

---

## Three.js Animations

| Component           | Effect                                              |
|---------------------|-----------------------------------------------------|
| `ParticleBackground`| Floating dust/petal particles in brand palette      |
| `FloatingEnvelope`  | 3D envelope with wax seal, gentle rotation + float  |
| `CursorGlow`        | Custom cursor dot + trailing dusty-rose glow        |

All Three.js components properly clean up renderers and animation frames on unmount.

---

## Deployment

### Frontend (Vercel / Netlify)
```bash
cd client && npm run build
# Deploy the `dist/` folder
```

Set environment variable `VITE_API_URL` if your backend is on a different domain, and update `vite.config.js` proxy accordingly.

### Backend (Railway / Render / VPS)
```bash
cd server && npm start
```

Set all environment variables in your deployment platform dashboard.

---

## Collections

1. **Lavender and Longing** — Long-distance couples
2. **Midnight Letter** — Intimate love, moody
3. **Century of Love** — Anniversaries
4. **A Year of Heartfelt** — Birthdays
5. **Grace and Lavender** — Thinking of you
6. **A Note of a Note** — Mentors & colleagues
7. **Sunshine Script** — Friends & encouragement
8. **Velvet and Vanilla** — Valentine's Day

---

*Built with care for Nicys — where every letter becomes an heirloom.*
