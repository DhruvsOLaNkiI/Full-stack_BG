# Full‑Stack Blog Application

A modern, premium‑looking blog platform built with React, Express, and Firebase Firestore.

## 🎯 Goal
- Register / log in with JWT authentication  
- Beautiful **Home** feed showing posts, author names, likes, comments, and view counts  
- Full **Post** view with like/unlike and comment submission  
- Editable **Profile** (display name) and a list of the user’s posts  
- **Admin** dashboard for managing posts  

## 🛠️ Tech Stack
| Layer | Tech |
|-------|------|
| **Frontend** | React (Vite), React Router, Axios, Lucide icons, Glassmorphism UI, responsive CSS |
| **Backend** | Express.js, JWT, Helmet, CORS, Morgan, Firebase Admin SDK |
| **Database** | Firebase Firestore (users, posts, comments, likes) |
| **Auth** | JWT stored in `localStorage`, verified by [verifyToken](cci:1://file:///f:/AIproject%20Google%20Air/blog-fullstack/server/middleware/auth.js:2:0-21:2) middleware |

## 📐 Architecture Diagram
![Blog Architecture](client/public/assets/architecture.png)

*The diagram shows the flow between the React client, the Express API, JWT authentication, and Firestore.*

## 🔄 Data Flow (Key Requests)

1. **Login** – `POST /api/auth/login` → returns JWT & user info → stored in `localStorage`  
2. **Fetch Posts** – `GET /api/posts` → returns posts with `authorName`  
3. **Update Profile** – `PUT /api/users/:id` → updates `name` in Firestore  
4. **Like Post** – `PUT /api/posts/:id/like` → toggles like count  

## ✅ Recent Improvements
- Author names now appear on Home, Profile, and Admin panels.  
- Profile editing works and updates `localStorage`.  
- Added server‑side logging for profile updates.  
- Architecture diagram added (see above).  

## 🚀 Next Steps
- Add unit / integration tests for auth and post routes.  
- Implement pagination / infinite scroll on the Home feed.  
- Add dark‑mode toggle and optional user avatars.  
- Deploy: Vercel (frontend) + Render/Heroku (backend).  

---  ![blog_architecture_1763751941252](https://github.com/user-attachments/assets/6c4a3629-f23f-479b-8af3-ac514dec7979)


*Feel free to open issues or submit pull requests!*  
