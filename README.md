# Build_Site

Build_Site is a modern **React-based web application** built using **TypeScript** and **Vite**, integrated with **Google's Gemini AI model**. The project allows you to run and develop an **AI-powered application locally**, originally derived from **Google AI Studio**.


---

## ✨ Features

* ⚛️ Modern React setup with **TypeScript**
* 🧩 Modular architecture (components, services, utilities)
* 🤖 Integration with **Google Gemini API** for AI functionalities
* ⚡ Fast development server powered by **Vite**
* 🛠️ Clean and scalable project structure

---

## 📦 Prerequisites

Before running the project, ensure you have the following installed:

* **Node.js** (v18 or higher recommended)
* **Google Gemini API Key** (obtain from Google AI Studio)

---

## 🚀 Installation & Running Locally

### 1. Clone the Repository

```bash
git clone https://github.com/Uganthan-V/Build_Site.git
cd Build_Site
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory and add your Gemini API key:

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

> **Note:** Vite requires environment variables to be prefixed with `VITE_`. Adjust the variable name only if the code explicitly expects a different one.

### 4. Start the Development Server

```bash
npm run dev
```

Open the provided local URL (usually):

```
http://localhost:5173
```

---

## 📜 Available Scripts

* `npm run dev` — Start the development server
* `npm run build` — Build the app for production
* `npm run preview` — Preview the production build locally

---

## 🗂️ Project Structure

```text
Build_Site/
├── components/     # Reusable React components
├── services/       # API calls and services (Gemini integration)
├── utils/          # Utility functions
├── App.tsx         # Main application component
├── index.tsx       # Application entry point
├── index.html      # HTML template
├── vite.config.ts  # Vite configuration
├── tsconfig.json   # TypeScript configuration
└── package.json    # Dependencies and scripts
```

---

## 🤝 Contributing

Contributions are welcome!

* Fork the repository
* Create a new feature branch
* Commit your changes
* Open a pull request

You can also raise issues for bugs, enhancements, or feature requests.

---


### 👨‍💻 Author

**Uganthan V**
GitHub: [https://github.com/Uganthan-V](https://github.com/Uganthan-V)

---

⭐ If you find this project useful, consider giving it a star on GitHub!
