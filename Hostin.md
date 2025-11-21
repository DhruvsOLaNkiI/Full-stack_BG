# Hosting Options for the Full‑Stack Blog Application

This document provides a quick reference map of **different ways you can host the front‑end and back‑end** of the project. Choose the combination that best fits your needs, budget, and familiarity.

---

## 1️⃣ Vercel (Frontend) + Render (Backend)
| Component | Service | Free tier limits | Key steps |
|-----------|---------|------------------|-----------|
| **Frontend** | **Vercel** | 100 GB bandwidth, 125 k build minutes/mo | 1. Sign up at https://vercel.com.<br>2. Connect your GitHub repo.<br>3. Set **Root Directory** to `client`.<br>4. Deploy – you get `your‑project.vercel.app`. |
| **Backend** | **Render** | 750 hrs compute/mo (≈ 1 instance) | 1. Sign up at https://render.com.<br>2. Create a **Web Service** with **Node.js** runtime.<br>3. Set **Root Directory** to `server`.<br>4. Set **Start Command** to `npm start`.<br>5. Add secrets (`JWT_SECRET`, Firebase service‑account JSON). |

**How to connect**: In `client/src/api.js` set `axios.defaults.baseURL = "https://<render‑url>/api"`.

---

## 2️⃣ Netlify (Frontend) + Railway (Backend)
| Component | Service | Free tier limits | Key steps |
|-----------|---------|------------------|-----------|
| **Frontend** | **Netlify** | 100 GB bandwidth, 300 build minutes/mo | 1. Sign up at https://app.netlify.com.<br>2. New site → **Import from Git** → select repo.<br>3. **Build command**: `npm run build` (inside `client`).<br>4. **Publish directory**: `client/dist`. |
| **Backend** | **Railway** | 500 hrs compute/mo, auto‑sleep after 15 min idle | 1. Sign up at https://railway.app.<br>2. New Project → **Deploy from GitHub** → select repo.<br>3. Choose `server` as the service root.<br>4. **Start Command**: `npm start`.<br>5. Add environment variables (`JWT_SECRET`, Firebase JSON). |

**How to connect**: Update `client/src/api.js` to point to `https://<railway‑url>/api`.

---

## 3️⃣ Firebase Hosting (Frontend) + Firebase Cloud Functions (Backend)
| Component | Service | Free tier limits | Key steps |
|-----------|---------|------------------|-----------|
| **Frontend** | **Firebase Hosting** | 10 GB storage, 10 GB/month bandwidth | 1. Install Firebase CLI: `npm i -g firebase-tools`.<br>2. Run `firebase login`.<br>3. `firebase init hosting` → set **public** folder to `client/dist`.<br>4. Build client: `npm run build`.<br>5. Deploy: `firebase deploy --only hosting`. |
| **Backend** | **Cloud Functions** (or Cloud Run) | 2 M invocations/mo, 400 k GB‑seconds compute/mo | 1. `firebase init functions` → choose **Node.js**.<br>2. Move Express code into `functions/index.js` (or keep `server` and use `firebase deploy --only functions`).<br>3. Add the service‑account JSON as a **secret** (`firebase functions:secrets:set FIREBASE_CONFIG …`).<br>4. Deploy: `firebase deploy --only functions`. |

**How to connect**: Functions are exposed at `https://<region>-<project>.cloudfunctions.net/<functionName>`. Set that URL as the API base in `client/src/api.js`.

---

## 4️⃣ GitHub Pages (Frontend) + Heroku (Backend)
| Component | Service | Free tier limits | Key steps |
|-----------|---------|------------------|-----------|
| **Frontend** | **GitHub Pages** | 1 GB storage, 100 GB/month bandwidth | 1. Build the client: `npm run build` (output in `client/dist`).<br>2. Commit the `dist` folder to a `gh-pages` branch (use the `gh-pages` npm package or manual commit).<br>3. In repo **Settings → Pages**, set source to `gh-pages`. |
| **Backend** | **Heroku (Eco)** | 550 dyno‑hrs/mo (≈ 1 dyno continuously) | 1. Sign up at https://heroku.com.<br>2. Create a new app → connect to GitHub repo.<br>3. Set **Buildpack** to Node.js.<br>4. **Start Command**: `npm start`.<br>5. Add config vars (`JWT_SECRET`, Firebase JSON). |

**How to connect**: Use the Heroku app URL (`https://<app>.herokuapp.com/api`) as the base URL in the client.

---

## 5️⃣ Self‑Hosted (VPS / Docker) – Full Control
| Component | Service | Typical cost | Key steps |
|-----------|---------|--------------|-----------|
| **Frontend** | **NGINX** on a VPS (DigitalOcean, Linode, AWS EC2, etc.) | $5‑$10/mo for a small droplet | 1. Build client (`npm run build`).<br>2. Copy `client/dist` to `/var/www/html`.<br>3. Configure NGINX to serve static files. |
| **Backend** | **Docker** on the same VPS (or separate) | $5‑$10/mo (same droplet) | 1. Write a `Dockerfile` for the Express server.<br>2. Build image: `docker build -t blog-backend .`.<br>3. Run container exposing port 5000.<br>4. Use a reverse proxy (NGINX) to forward `/api/*` to the backend container.<br>5. Store secrets in environment variables or Docker secrets. |

**How to connect**: The reverse proxy makes the API reachable at `https://your‑domain.com/api`.

---

## 📌 Quick Decision Guide
| Preference | Recommended combo |
|------------|-------------------|
| **Zero‑cost, easiest CI/CD** | **Vercel + Render** |
| **All‑Google ecosystem** | **Firebase Hosting + Functions** |
| **Static site only** | **GitHub Pages** (frontend) + any backend you already have |
| **Full control / custom domain** | **Self‑hosted VPS + Docker** |
| **Familiar with Netlify** | **Netlify + Railway** |

---

## How to Add This File to Your Repo
```bash
# From the project root
cat <<'EOF' > HOSTING_OPTIONS.md
$(cat HOSTING_OPTIONS.md)  # (this is just illustrative – you already have the file content above)
EOF

git add HOSTING_OPTIONS.md
git commit -m "Add hosting options reference"
git push
```
Now the file will appear in your repository and can be linked from the main `README.md`.

---

*Happy deploying! 🎉 If you need step‑by‑step commands for a specific platform, just let me know.*
