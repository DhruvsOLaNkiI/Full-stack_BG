# Server ↔️ Client Communication Guide

## Overview
Your application follows a **client‑server architecture** where the **frontend** (React + Vite) talks to the **backend** (Node.js + Express) over **HTTP** using **RESTful API endpoints**.  The admin panel is just another React page that consumes the same API but with **admin‑only routes** protected by JWT authentication.

---

## 1. How the Server Exposes Data

| Layer | File | Purpose |
|------|------|---------|
| **Routing** | `server/routes/*.js` | Defines URL paths (e.g. `/api/posts`, `/api/featured`, `/api/admin/*`). |
| **Controller** | `server/controllers/*.js` | Contains the business logic – fetching from Firestore, applying business rules, and sending JSON responses. |
| **Middleware** | `server/middleware/auth.js` (or similar) | Verifies the JWT token, adds `req.user` and `req.role` (e.g. `admin`). |
| **Database** | Firebase Firestore (`server/config/firebase.js`) | NoSQL store for posts, users, settings, etc. |

### Example: Getting Featured Posts
```js
// server/routes/featuredRoutes.js
router.get('/featured', featuredController.getFeatured);
```
```js
// server/controllers/featuredController.js
exports.getFeatured = async (req, res) => {
  const doc = await db.collection('settings').doc('home_featured').get();
  // ... fetch posts, return JSON
  res.json({ hero, topRight, middleList, bottomRight });
};
```
The controller builds a **JSON payload** and sends it with `res.json()`.  The response also includes a `Cache‑Control` header for client‑side caching.

---

## 2. How the Client Consumes the API

The client uses **Axios** (wrapped in `client/src/api/index.js`) to make HTTP calls:
```js
import axios from 'axios';
const api = axios.create({ baseURL: '/api' });
export default api;
```
Typical usage in a React component:
```js
useEffect(() => {
  const fetchFeatured = async () => {
    const { data } = await api.get('/featured');
    setFeatured(data);
  };
  fetchFeatured();
}, []);
```
The data returned from the server is stored in component state (`useState`) and rendered with **Material‑UI** components.

---

## 3. Admin → Server → Client Flow

1. **Admin logs in** – The login form sends credentials to `POST /api/auth/login`. The server validates the user, creates a **JWT** (`token`) and returns it.
2. **Token storage** – The client stores the token in `localStorage` (or a cookie) and attaches it to every subsequent request via an `Authorization: Bearer <token>` header (Axios interceptor).
3. **Protected routes** – Server middleware checks the token and ensures `req.role === 'admin'`. If the check fails, a `403 Forbidden` response is sent.
4. **Admin actions** – Example: updating featured posts.
   ```js
   // client side (AdminFeatured.jsx)
   const save = async () => {
     await api.put('/admin/featured', payload);
   };
   ```
   ```js
   // server side (featuredController.updateFeatured)
   if (req.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
   // write new config to Firestore
   ```
5. **Client receives updated JSON** – The admin page updates its local state, and the **home page** (or any component that fetches `/featured`) will automatically receive the new data on the next request or via a manual refresh.

---

## 4. Data Flow Diagram (Textual)
```
+----------+          HTTP (JSON)          +----------+          Firestore          +----------+
|  Admin   |  <--- POST /admin/...  --->  |  Server  |  <--- SDK calls --->   | Database |
|  UI (React) |                         | (Express) |                         | (Firestore) |
+----------+          <-- GET /featured --   +----------+   --> getDocument() --> +----------+
```
* The **client** never talks directly to the database – all data passes through the **server**.
* **Admin‑only endpoints** are guarded by JWT middleware.
* Regular users call the same public endpoints (e.g., `/posts`, `/featured`) without a token.

---

## 5. Quick Checklist for Adding New Endpoints
1. **Create a route** in `server/routes/…`.  Use `router.get|post|put|delete`.
2. **Write a controller** function that interacts with Firestore via the SDK.
3. **Add middleware** if the endpoint needs authentication/authorization.
4. **Expose the route** in `server/index.js` (or wherever you mount routers).
5. **Call it from the client** with `api.<method>(‘/your/endpoint’)` and handle the response.

---

## 6. Resources
* **Axios docs** – https://axios-http.com/
* **Express middleware** – https://expressjs.com/en/guide/using-middleware.html
* **Firebase Admin SDK** – https://firebase.google.com/docs/admin/setup
* **JWT guide** – https://jwt.io/introduction/

---

### TL;DR
* **Server** = Express → Firestore → JSON responses (with caching).
* **Client** = React + Axios → consumes JSON → renders UI.
* **Admin** = Same client but uses protected routes; token‑based auth ensures only admins can modify data.

Feel free to copy this file into your repo and expand any section as needed.
