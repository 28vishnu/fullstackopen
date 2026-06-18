# 🚀 **Full Stack Open — University of Helsinki**

This repository contains my completed exercises and projects for the **Full Stack Open** course offered by the University of Helsinki. It covers modern web development using JavaScript/TypeScript, React, Node.js, Express, and cloud deployments.

---

## 🔗 **Live Production Deployment**

My complete full-stack **Phonebook Application** from Part 2 & Part 3 is fully integrated and running live on the cloud!

👉 **[Live App on Render](https://phonebook-backend-7n5y.onrender.com/)**

---

## 📂 **Repository Structure**

The workspace is cleanly divided into separate parts according to the curriculum structure:

```text
fullstackopen/
├── part0/                  # Fundamentals of Web Apps
│   └── README.md           # Traditional & Single Page App (SPA) sequence diagrams (Mermaid)
├── part1/                  # Introduction to React
│   ├── courseinfo/         # Basic React component structuring & passing props
│   ├── unicafe/            # Feedback application with statistics state tracking
│   └── anecdotes/          # Random anecdotes with voting mechanics
├── part2/                  # Communicating with Server
│   ├── courseinfo/         # Refactored courses using dynamic array maps & reduction
│   ├── countries/          # Interactive Restcountries API application with weather metrics
│   └── phonebook/          # Frontend client integrating status alerts and notifications
└── part3/                  # Node.js and Express Backend
    └── phonebook-backend/  # Combined server serving both the Express REST API and static UI
        ├── dist/           # Transpiled and minified production build of the React app
        ├── index.js        # Main entry point (CORS, custom Morgan logger, routing)
        ├── package.json    # Backend dependencies and safe build automations
        └── db.json         # In-memory mock database representations
