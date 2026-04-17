# IronLance - Frontend

## Demo

🌐 **Live Demo:** [https://ironlance.vercel.app](https://ironlance.vercel.app/)

The frontend is deployed on Vercel and connects to the backend API also hosted on Vercel.

## Description

**IronLance** is a job board platform that connects Ironhack alumni (Ironhackers) with companies offering job opportunities. This is the **Frontend** application built with **React**.

### Technologies Used

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Mantine v8** - UI component library
- **Axios** - HTTP client for API calls
- **Day.js** - Date manipulation library
- **CSS Modules** - Component-scoped styling

### Related Repository

The backend for this application is hosted in a separate repository. You can find it here:

🔗 **[IronLance Backend (Express API)](https://github.com/CesarDevtools/ironLance-server)**

> **Note:** Both the frontend and backend are deployed on Vercel:
> - Frontend: [https://ironlance.vercel.app/](https://ironlance.vercel.app/)
> - Backend API: [https://ironlance-server.vercel.app/](https://ironlance-server.vercel.app/api)

---

## Instructions to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/CesarDevtools/ironLance-client.git
cd ironlance-client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Create a `.env` file in the root directory with the following variable:

```env
VITE_API_URL=http://localhost:5000/api
```

> **Note:** The backend must be running on port 5000 (or update the URL accordingly).

### 4. Run the application

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port shown in your terminal).

---

## Features

- **User Authentication** - Sign up/Login for Ironhackers and Companies
- **Job Board** - Browse and search active job listings
- **Ironhackers Board** - Companies can browse public Ironhack alumni profiles
- **Application System** - Ironhackers can apply to jobs; Companies can review applicants
- **Job Management** - Companies can create, edit, and delete job postings
- **Profile Management** - Users can update their profiles and visibility settings