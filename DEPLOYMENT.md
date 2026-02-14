# Deployment Guide for National EHR System

This guide explains how to deploy the National EHR System to the cloud so everyone can access it.

## Architecture
- **Frontend**: Next.js (Deploy on Vercel)
- **Backend**: Go (Deploy on Render or Railway using Docker)
- **Database**: PostgreSQL (Hosted on Neon, Supabase, or Railway)

---

## 1. Database Setup (PostgreSQL)

Since cloud platforms don't support persistent SQLite files well, use PostgreSQL.

1.  Create a free PostgreSQL database on **[Neon](https://neon.tech)**, **[Supabase](https://supabase.com)**, or **[Railway](https://railway.app)**.
2.  Copy the **Connection String** (e.g., `postgres://user:pass@host:5432/dbname`).

---

## 2. Backend Deployment (Go)

We have included a `Dockerfile` in `backend-core/` for easy deployment.

### Option A: Deploy on Render
1.  Push your code to a GitHub repository.
2.  Log in to **[Render](https://render.com)**.
3.  Click "New" -> "Web Service".
4.  Connect your GitHub repo.
5.  Set **Root Directory** to `backend-core`.
6.  Set **Runtime** to `Docker`.
7.  **Environment Variables**:
    *   `DATABASE_URL`: Paste your PostgreSQL connection string here.
    *   `PORT`: `8080` (Render might auto-detect, but good to ensure).
8.  Click **Create Web Service**.
9.  Copy the URL (e.g., `https://my-ehr-backend.onrender.com`).

### Option B: Deploy on Railway
1.  Log in to **[Railway](https://railway.app)**.
2.  "New Project" -> "Deploy from GitHub repo".
3.  Select `backend-core` as the root if asked, or just let it detect the Dockerfile.
4.  Add Variable: `DATABASE_URL`.
5.  Railway usually handles the rest.

---

## 3. Frontend Deployment (Next.js)

1.  Log in to **[Vercel](https://vercel.com)**.
2.  "Add New..." -> "Project".
3.  Import your GitHub repo.
4.  **Root Directory**: Edit to select `patient-portal`.
5.  **Environment Variables**:
    *   `NEXT_PUBLIC_API_URL`: Set this to your **Backend URL** from Step 2 (e.g., `https://my-ehr-backend.onrender.com`).
    *   *Important*: Do not add a trailing slash.
6.  Click **Deploy**.

---

## 4. Verification

1.  Open your Vercel URL.
2.  The app should load.
3.  Appointments and Health Records should fetch from your live Backend/Database.
4.  **Note**: Since it's a new Database, it will auto-seed with "John Doe" data on first run.

## Troubleshooting

-   **CORS Errors**: If frontend fails to call backend, ensure the Backend handles CORS correctly (currently set to allow `*` or specific origins).
-   **Database Connection**: Check backend logs to see if "Connecting to Postgres database..." appears.

---

## 5. Updating Your App (After Deployment)

Yes! You can easily update your live application anytime. This is called **Continuous Deployment**.

### How to update code:
1.  **Edit Files Locally**: Make changes on your computer (e.g., adding a new feature or fixing a bug).
2.  **Push to GitHub**: Commit and push your changes.
    ```bash
    git add .
    git commit -m "Added a cool new feature"
    git push origin main
    ```
3.  **Automatic Redeploy**: Vercel and Render/Railway will detect the new code and automatically rebuild your site within minutes.

### Does updating delete my data?
**No.** Your users, appointments, and records are stored in the **PostgreSQL Database**, which is separate from your code. Re-deploying your backend or frontend will **not** affect your database content.

### What if I change the Database Schema?
Our backend uses **GORM AutoMigrate**. This means if you add a new field to a model (e.g., adding `Age` to `Profile`), the system will automatically update the database schema the next time it deploys. No manual SQL scripts needed!

