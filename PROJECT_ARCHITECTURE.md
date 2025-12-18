# Project Architecture & Documentation

## 1. Project Overview
**KirdarBarcelona** is a full-stack web application (MERN Stack) designed for blogging and community sharing. It features a modern, responsive UI, user authentication, role-based access control (Admin/User), and rich content management.

### Tech Stack
-   **Frontend**: React.js (Vite), React Router, Context API, CSS Variables (Theming).
-   **Backend**: Node.js, Express.js.
-   **Database**: Firebase Firestore (via `firebase-admin` SDK).
-   **Authentication**: JWT (JSON Web Tokens) & Firebase Auth.

---

## 2. Folder Structure & Connections

### Root Directory
-   `client/`: Contains the React frontend application.
-   `server/`: Contains the Node.js/Express backend API.

### Frontend Structure (`/client/src`)
The frontend is the "View" layer, handling user interaction and display.

| File/Folder | Purpose | Connection |
| :--- | :--- | :--- |
| `main.jsx` | Entry point | Mounts `App.jsx` to the DOM. |
| `App.jsx` | Main Component | Defines **Routes** (`/`, `/post/:id`, `/dashboard`) and layout structure (Navbar, Footer). |
| `api.js` | API Utility | Configures **Axios** to communicate with the backend (`http://localhost:5001/api`). |
| `pages/` | Page Components | Individual screens like `Home.jsx`, `Post.jsx`, `Dashboard.jsx`. |
| `components/` | UI Components | Reusable parts like `Navbar.jsx`, `BentoGrid.jsx`. |
| `index.css` | Global Styles | Defines CSS variables for themes (colors, fonts) and global utilities. |

### Backend Structure (`/server`)
The backend is the "Controller" and "Model" layer, handling logic and data.

| File/Folder | Purpose | Connection |
| :--- | :--- | :--- |
| `index.js` | Server Entry | Sets up Express, Middleware (CORS, Helmet), and connects Routes. |
| `routes/` | API Routes | Defines endpoints (e.g., `GET /api/posts`). Maps URLs to Controllers. |
| `controllers/` | Logic Handlers | Contains the actual functions that run when a route is hit (e.g., `getPosts`, `createPost`). |
| `models/` | Data Models | Defines data structure (though Firebase is schema-less, models help structure data). |
| `middleware/` | Interceptors | Functions that run *before* controllers (e.g., `verifyToken` to check login). |
| `config/` | Configuration | Firebase setup (`firebase.js`) and environment variables. |

---

## 3. How Things Work Together (Data Flow)

### Example: Viewing the Home Page
1.  **User** visits `kirdarbarcelona.com`.
2.  **Frontend (`Home.jsx`)** loads and runs a `useEffect` hook.
3.  **API Call**: `Home.jsx` calls `api.get('/posts')`.
4.  **Request**: The browser sends a GET request to the **Server** (`/api/posts`).
5.  **Server Routing**: `index.js` directs the request to `routes/postRoutes.js`.
6.  **Controller**: The route calls `getPosts` in `controllers/postController.js`.
7.  **Database**: The controller queries **Firebase Firestore** for the "posts" collection.
8.  **Response**: Firebase returns data -> Controller sends JSON back to Frontend.
9.  **Display**: `Home.jsx` receives the JSON and renders the `BentoGrid` component with the posts.

### Example: Creating a Post (Protected Action)
1.  **User** goes to `/dashboard` (protected by `ProtectedRoute.jsx`).
2.  **Frontend** checks if a valid JWT token exists in `localStorage`.
3.  **User** fills the form and clicks "Publish".
4.  **API Call**: `Dashboard.jsx` calls `api.post('/posts', data)`.
5.  **Middleware**: The Server runs `verifyToken` middleware.
    -   If valid: Request proceeds.
    -   If invalid: Returns 401 Unauthorized.
6.  **Controller**: `createPost` function saves the new post to Firebase.
7.  **Result**: Success message returned, user redirected to the new post.

---

## 4. Key Files Breakdown

### `client/src/App.jsx`
This is the **Router Hub**. It decides which page to show based on the URL.
-   It wraps everything in `HelmetProvider` for SEO management.
-   It includes the `Navbar` so it's visible on all pages.

### `server/index.js`
This is the **Server Brain**.
-   `app.use(cors())`: Allows the frontend to talk to the backend.
-   `app.use('/api/posts', ...)`: Tells the server "If a request starts with /api/posts, send it to the postRoutes file".

### `client/src/api.js`
This is the **Bridge**.
-   It creates a central Axios instance.
-   It automatically adds the Authorization token to every request if the user is logged in.

### `server/controllers/postController.js`
This is the **Worker**.
-   It contains the actual logic: "Get all posts", "Delete this post", "Update that post".
-   It talks directly to the database.

---

## 5. Ad Integration (Recent Addition)
-   **`client/index.html`**: Contains the global ad scripts and sidebar containers (`.ad-sidebar-left`, `.ad-sidebar-right`).
-   **`client/src/pages/Post.jsx`**: Contains specific ad slots injected dynamically via React `useEffect` (Below Title, Below Content).
-   **CSS**: `index.css` handles the responsive hiding of ads on smaller screens.

---

## 6. Detailed Component Reference

This section explains exactly what each file in your `client/src` folder does.

### A. Components (`client/src/components/`)
These are reusable building blocks used across different pages.

#### 1. `Navbar.jsx`
*   **Purpose**: The top navigation bar visible on every page.
*   **Key Features**:
    *   **Responsive Design**: Shows a full menu on desktop and a hamburger menu on mobile.
    *   **Dark Mode Toggle**: Switches the entire site between light and dark themes using CSS variables.
    *   **User State**: Checks if a user is logged in. If yes, shows "Write", "Profile", and "Logout". If no, shows "Login" and "Register".
    *   **Logout Logic**: Clears the token from storage and redirects to Login.

#### 2. `BentoGrid.jsx`
*   **Purpose**: The main display layout for blog posts on the Home page.
*   **Key Features**:
    *   **Grid Layout**: Uses a CSS Grid to display posts in a visually appealing "bento box" style (some large, some small).
    *   **Filtering**: Handles the "Trending", "Latest", and "Category" tabs.
    *   **Search**: Filters posts based on the search bar input.
    *   **Pagination**: Handles "Load More" functionality.
    *   **Ad Injection**: Logic to insert ads between grid items (every 6th item).

#### 3. `InteractionButtons.jsx`
*   **Purpose**: The "Like" and "Comment" buttons found on posts.
*   **Key Features**:
    *   **State Management**: Tracks whether the current user has liked the post.
    *   **Animation**: Adds a bounce effect when clicked.
    *   **Props**: Receives `likes` count, `comments` count, and `onLike`/`onComment` handler functions from the parent.

#### 4. `AdminFeatured.jsx`
*   **Purpose**: A sub-component used in the Dashboard for Admins to manage the "Featured" section.
*   **Key Features**:
    *   **Drag & Drop**: Allows admins to reorder featured posts.
    *   **Selection**: Lets admins pick which posts appear in the top slider.

#### 5. `ProtectedRoute.jsx`
*   **Purpose**: A security wrapper for pages.
*   **Logic**:
    *   Checks if a `token` exists in `localStorage`.
    *   If **No Token**: Redirects user to `/login`.
    *   If **Token Exists**: Renders the child component (e.g., Dashboard).
    *   **Admin Check**: If `adminOnly={true}` is passed, it also checks if `user.role === 'admin'`.

---

### B. Pages (`client/src/pages/`)
These represent full screens in your application.

#### 1. `Home.jsx`
*   **Purpose**: The landing page of the website.
*   **Work**:
    *   Fetches all posts from the API on load.
    *   Fetches "Featured" posts separately for the top slider.
    *   Renders the `BentoGrid` component to display the main content.
    *   Contains the "Hero" section (the big welcome banner).

#### 2. `Post.jsx` (Single Post Page)
*   **Purpose**: Displays a single full blog post.
*   **Work**:
    *   **Fetching**: Uses the URL ID (`/post/:id`) to fetch specific post data.
    *   **Rendering**: Displays Title, Author, Date, and the full HTML content.
    *   **Ad Injection**: Dynamically inserts ad scripts below the Title and below the Content using `useEffect`.
    *   **Interaction**: Handles Liking and Commenting logic.
    *   **Editing**: If the viewer is the author, it shows an "Edit" button to modify the post.

#### 3. `Dashboard.jsx`
*   **Purpose**: The user's control center.
*   **Work**:
    *   **Create Post**: A form to write new articles (Title, Category, Image, Content).
    *   **Rich Text Editor**: Uses `ReactQuill` to allow bold, italic, lists, etc.
    *   **HTML Mode**: A toggle to switch between Visual Editor and Raw HTML editing (for adding custom scripts/ads).
    *   **Tab System**: Switches between "Write Story" and "Manage Featured" (if Admin).

#### 4. `Admin.jsx`
*   **Purpose**: A dedicated panel for site administrators.
*   **Work**:
    *   **User Management**: View all users, promote/demote roles.
    *   **Post Management**: View all posts, delete any post (moderation).
    *   **Mass Actions**: Select multiple posts to delete them at once.

#### 5. `Profile.jsx`
*   **Purpose**: Shows a public user profile.
*   **Work**:
    *   Displays user details (Name, Bio, Avatar).
    *   Lists all posts written by that specific user.
    *   Allows the user to edit their own profile info.

#### 6. `Login.jsx` & `Register.jsx`
*   **Purpose**: Authentication forms.
*   **Work**:
    *   Capture email/password.
    *   Send data to `/api/auth/login` or `/register`.
    *   On success, save the received `token` to `localStorage` and redirect to Home.

---

### C. Backend Structure (`server/`)
The backend is the brain of the operation, built with Node.js and Express.

#### 1. `index.js` (Entry Point)
*   **Purpose**: Initializes the server.
*   **Key Features**:
    *   **Middleware**: Sets up `cors` (security), `helmet` (headers), and `express.json` (body parsing).
    *   **Routing**: Connects URL paths (like `/api/posts`) to their respective route files.
    *   **Port**: Starts listening on port 5001 (or env variable).

#### 2. `routes/postRoutes.js`
*   **Purpose**: Defines the available URLs for post-related actions.
*   **Endpoints**:
    *   `GET /`: Fetch all posts (calls `getAllPosts`).
    *   `GET /:id`: Fetch a single post (calls `getPostById`).
    *   `POST /`: Create a new post (Protected, calls `createPost`).
    *   `DELETE /:id`: Delete a post (Protected).
    *   `POST /:id/like`: Toggle like on a post.

#### 3. `controllers/postController.js`
*   **Purpose**: Contains the logic for each route.
*   **Key Functions**:
    *   `getAllPosts`: Fetches posts from Firebase, handles filtering (category, tag) and sorting (likes, date).
    *   `createPost`: Validates input, creates a "slug" (URL-friendly title), and saves to Firebase.
    *   `toggleLike`: Adds or removes a user's ID from the post's `likes` array.

#### 4. `models/Post.js`
*   **Purpose**: A wrapper around Firebase Firestore operations.
*   **Why**: Even though Firebase is "NoSQL", this file helps organize database queries (like `findAll`, `findById`, `create`) in one place, making the controller cleaner.

#### 5. `middleware/auth.js`
*   **Purpose**: Security gatekeepers.
*   **Functions**:
    *   `verifyToken`: Checks the `Authorization` header for a valid JWT. If invalid, blocks the request.
    *   `verifyAdmin`: Checks if the user's role is 'admin'.


