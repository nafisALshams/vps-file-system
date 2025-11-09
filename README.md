# VPS File System (Express + TypeScript)

Small API to upload/list/delete `.mp4` and `.wav` files. Designed to run on a VPS and be tested via Postman.

## Project structure

```
src/
	app.ts              # Express app wiring (health, root, mount routes)
	server.ts           # Starts the server (uses PORT from env or 3000)
	config/
		index.ts          # Port, upload dir, allowed mime types
	controllers/
		files.controller.ts
	middleware/
		upload.ts         # Multer config, dir creation, type filter
		errorHandler.ts   # Centralized error responses
	routes/
		index.ts          # POST /upload, GET /list, DELETE /delete/:filename
uploads/              # Saved files (ignored by Git)
dist/                 # Compiled JS output (ignored by Git)
.gitignore            # Excludes dist, node_modules, uploads, env files, logs
```

## Local usage

```powershell
npm install
npm run build
npm start   # runs node dist/server.js on PORT=3000 by default
```

Change port or upload directory:

```powershell
$env:PORT=4000; $env:UPLOAD_DIR="uploads"; npm start
```

Endpoints:
- GET /health
- POST /api/files/upload  (form-data; key=file; value=.mp4/.wav)
- GET /api/files/list
- DELETE /api/files/delete/:filename

## Prepare repository for GitHub

The `.gitignore` prevents committing `node_modules`, `dist`, `uploads`, env files, and logs. If you had already added these, untrack them once:

```bash
git rm -r --cached node_modules dist uploads || true
git add .
git commit -m "chore: apply .gitignore and clean tracked artifacts"
```

Push to GitHub (replace placeholders):

```bash
git remote add origin https://github.com/<your-account>/<your-repo>.git
git branch -M main
git push -u origin main
```

## VPS installation (Ubuntu) via PuTTY/SSH

Assumes a fresh Ubuntu server. Connect using PuTTY with the IP, username, and password your company provided.

1) Update system and install Node.js and Git

```bash
sudo apt-get update -y
sudo apt-get install -y ca-certificates curl gnupg git ufw
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v && npm -v
```

2) Open firewall for your API port (optional if firewall is disabled)

```bash
sudo ufw allow 3000/tcp
sudo ufw status
```

3) Clone your repository and install dependencies

```bash
cd ~
git clone https://github.com/<your-account>/<your-repo>.git vps-file-system
cd vps-file-system
npm ci
npm run build
```

4) Run the server (simple background with nohup)

```bash
export PORT=3000 UPLOAD_DIR=uploads
nohup node dist/server.js > app.log 2>&1 & echo $! > app.pid
```

Check it:

```bash
curl http://localhost:3000/health
```

Stop it later:

```bash
kill $(cat app.pid) && rm -f app.pid
```

Optional (recommended) – keep it running with PM2:

```bash
sudo npm i -g pm2
export PORT=3000 UPLOAD_DIR=uploads
pm2 start dist/server.js --name vps-file-system --update-env
pm2 save
pm2 startup   # follow the printed instruction once to enable boot start
```

## Postman quick test

- POST http://<server-ip>:3000/api/files/upload  (Body: form-data, key=file, choose .mp4/.wav)
- GET  http://<server-ip>:3000/api/files/list
- DELETE http://<server-ip>:3000/api/files/delete/<filename>

## Notes

- Do not edit files in `dist/` directly; always change TypeScript in `src/` and run `npm run build`.
- Uploaded files live in `uploads/` on the server (ignored by Git).
- To change the port, set `PORT` before starting the app.
