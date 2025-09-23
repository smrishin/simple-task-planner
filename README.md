# Simple Task Planner

A personal task planner built with **Next.js 15, TailwindCSS, and Upstash Redis** deployed on **Vercel**.  
It lets you create daily task lists, mark them done, and save them across devices.

---

## 🚀 Features

- Two pages:
  - `/` → View tasks (read-only, sorted by start time)
  - `/edit` → Edit tasks (add, update, mark done, soft delete, save)
- Data persistence with Upstash Redis (via Vercel Integration)
- Dark mode UI with TailwindCSS
- Toast notifications for saves and updates
- Secrets-protected access (requires a code to enter)

---

## 🔧 Local Development

1. Clone the repo
   ```bash
   git clone https://github.com/smrishin/simple-task-planner.git
   cd task-manager-next
   ```
2. Install dependencies

```bash
npm install
```

3. Create a .env.local file and add:

```env
SIMPLE_TASK_PLANNER_STORAGE_KV_REST_API_URL=<your-upstash-url>
SIMPLE_TASK_PLANNER_STORAGE_KV_REST_API_TOKEN=<your-upstash-token>
ACCESS_CODE=your-secret-code
```

4. Run the dev server

```bash
npm run dev
```

## 🌐 Deployment on Vercel

1. Push the project to GitHub.

2. Import the repo into Vercel.

3. Add Upstash Redis from the Vercel Marketplace.

4. Vercel injects storage env vars automatically:

   - SIMPLE_TASK_PLANNER_STORAGE_KV_REST_API_URL

   - SIMPLE_TASK_PLANNER_STORAGE_KV_REST_API_TOKEN

5. Add your own access code:

   - ACCESS_CODE=your-secret-code

6. Redeploy, then access your app at the Vercel-provided domain.

## 🔐 Access Protection

This app requires a secret access code (set via env vars).
Users must enter the correct code to unlock the app; until then:

- No pages are accessible

- No DB reads/writes are made
