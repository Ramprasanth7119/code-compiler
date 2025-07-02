Here’s a **structured and humanized `README.md`** for your **Code Compiler Monitor** project:

---

```md
# 🚀 Code Compiler Monitor

A full-stack web-based tool to **compile and monitor code execution** in multiple languages like Python, Node.js, C++, and Java. This project allows developers, educators, and students to write code, execute it on a backend server, monitor performance metrics, and visualize usage data — all from a user-friendly interface.

---

## 📌 Features

- ✅ Supports **Python, Node.js, C++, and Java**
- 🧪 Run and test code snippets directly in the browser
- 📊 Visual execution metrics (success rate, execution time)
- 📈 Language usage analytics with live charts
- 🧾 History of recent executions with status and timestamps
- 📁 Download execution history as **CSV** or **JSON**
- 🔐 API Key authorization for backend control
- 💾 Local persistence using `localStorage`

---

## 🛠 Tech Stack

| Layer        | Technology       |
|--------------|------------------|
| Frontend     | React + Tailwind CSS + Chart.js |
| Backend      | Node.js + Express |
| Runtime Env  | Dockerized Ubuntu (with Node, Python3, g++, Java) |
| Deployment   | Render.com (API + UI) |
| State Storage| Browser `localStorage` |

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
[https://github.com/Ramprasanth7119/code-compiler.git](https://github.com/Ramprasanth7119/code-compiler.git)
cd code-compiler
````

### 2. Install Dependencies

Make sure you install dependencies for both the **frontend (client)** and **backend (server)**:

#### Install Client Dependencies

```bash
cd client
npm install

#### Install Server Dependencies

```bash
cd server
npm install


### 3. Set Up Environment Variables

Create a `.env` file in the client root directory:

```env
VITE_API_KEY=your-api-key-here
VITE_API_URL=https://your-backend-url.com/run
```

> **Note**: These variables are used in `config.js` via `import.meta.env`.


### 4. Start the Application

## 4.1. Start Backend (Server)
```bash
cd server
npm start
```
The backend server will start at: `http://localhost:3000`

## 4.2. Start Frontend (Client)
Open a new terminal:
```bash
cd client
npm run dev
```
The React app will be available at: `http://localhost:5173`

---

## 🚦 API Overview

The backend supports a `/run` endpoint which expects:

### POST `/run`

**Headers:**

```http
x-api-key: your-api-key
```

**Body:**

```json
{
  "language": "python", // or cpp, java, node
  "code": "print('Hello')"
}
```

**Response:**

```json
{
  "output": "Hello\n"
}
```

---

## 📊 Analytics & Monitoring

* **Execution History**: Track the last 10 executions with timestamps and results.
* **Language Chart**: Bar chart showing how many times each language was used.
* **Download Logs**: Export history as `.csv` or `.json` for records.

---

## 🧱 Built With Modularity in Mind

This project is modular. Each feature is isolated in its own component for scalability and maintainability.

* `CodeExecutorMonitor` – Main logic and UI
* `ExecutionHistory` – Last 10 execution logs
* `MetricsPanel` – Shows time taken, success/failure, etc.
* `LanguageUsageChart` – Dynamic Chart.js-based bar chart

---

## 📤 Deployment

Frontend is deployed using **Vercel**

Backend is dockerized and built for deployment on **Render.com** with Ubuntu + compilers pre-installed.

---

## ✨ Future Improvements

* [ ] User authentication and dashboards
* [ ] Syntax highlighting (Monaco or CodeMirror)
* [ ] Execution quota per user
* [ ] Backend database (e.g., MongoDB) for persistent history

---

## 🙌 Contributing

Contributions are welcome! Please open an issue or PR for any improvements or bug fixes.


## 👨‍💻 Author

**Ram Prasanth Sakthivel**
GitHub: [@Ramprasanth7119](https://github.com/Ramprasanth7119)

---

## 🔗 Links

* 🌐 Deployed UI: `https://code-compiler-pi.vercel.app`
* 🛠 API Live: `https://code-compiler-2-jode.onrender.com`

---

Happy coding! 💻🔥

