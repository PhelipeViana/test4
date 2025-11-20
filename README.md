# Take‑Home Assessment

Welcome, candidate! This project contains **intentional issues** that mimic real‑world scenarios.
Your task is to refactor, optimize, and fix these problems.

## Objectives

### 🔧 Backend (Node.js)

1. **Refactor blocking I/O**  
   - `src/routes/items.js` uses `fs.readFileSync`. Replace with non‑blocking async operations.

2. **Performance**  
   - `GET /api/stats` recalculates stats on every request. Cache results, watch file changes, or introduce a smarter strategy.

3. **Testing**  
   - Add **unit tests** (Jest) for items routes (happy path + error cases).

### 💻 Frontend (React)

1. **Memory Leak**  
   - `Items.js` leaks memory if the component unmounts before fetch completes. Fix it.

2. **Pagination & Search**  
   - Implement paginated list with server‑side search (`q` param). Contribute to both client and server.

3. **Performance**  
   - The list can grow large. Integrate **virtualization** (e.g., `react-window`) to keep UI smooth.

4. **UI/UX Polish**  
   - Feel free to enhance styling, accessibility, and add loading/skeleton states.

### 📦 What We Expect

- Idiomatic, clean code with comments where necessary.
- Solid error handling and edge‑case consideration.
- Tests that pass via `npm test` in both frontend and backend.
- A brief `SOLUTION.md` describing **your approach and trade‑offs**.

## Quick Start

node version: 18.XX
```bash
nvm install 18
nvm use 18

# Terminal 1
cd backend
npm install
npm start

# Terminal 2
cd frontend
npm install
npm start
```

> The frontend proxies `/api` requests to `http://localhost:3001`.

Phelipe PrintScrenn Solution
<img width="1855" height="964" alt="image" src="https://github.com/user-attachments/assets/1267d3a6-fc29-4fc4-bf84-07a06bb032f5" />

<img width="1792" height="546" alt="image" src="https://github.com/user-attachments/assets/a9338f41-be97-484a-aeb0-776f46161b26" />

<img width="783" height="489" alt="image" src="https://github.com/user-attachments/assets/28c7fd30-1b72-463d-a767-0fda28cdfe1f" />
<img width="1842" height="501" alt="image" src="https://github.com/user-attachments/assets/e6b3b2e5-9972-46c1-89fa-667b5f50f60e" />
<img width="1869" height="956" alt="image" src="https://github.com/user-attachments/assets/6d186708-d2ec-4fc4-910d-c6219d8548d2" />
<img width="1842" height="390" alt="image" src="https://github.com/user-attachments/assets/75f834f0-fba2-4469-a03e-98426b1eca03" />











