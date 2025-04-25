# **🌦️ Weather App – Decoupled Architecture with Next.js & Laravel**

Welcome to my Weather App – a full-stack project built to demonstrate my ability to design and implement a **decoupled architecture** using modern web technologies. The frontend is built with **Next.js**, while the backend API is powered by **Laravel (latest version)**. Weather data is fetched in real-time from the [OpenWeatherMap API](https://openweathermap.org/api).

This project highlights my skills in API integration, full-stack architecture, and clean code organization.

---

## **🧠 Project Overview**

The goal of this project was to build a responsive and scalable weather app where the frontend and backend operate independently. This approach allows for easier maintenance, better scalability, and the ability to swap or upgrade parts of the stack without impacting the entire system.

---

## **🔧 Technologies Used**

### **Frontend**

* **Next.js** – React-based framework for fast, SSR/SSG web apps

* **Tailwind CSS** – For rapid, responsive UI development (optional, if used)

### **Backend**

* **Laravel** (latest version) – RESTful API handling and business logic

* **OpenWeatherMap API** – Provides real-time weather data

---

## **💡 Key Features**

* ✅ Search for current weather by city name

* ✅ Real-time API data rendering

* ✅ Clean separation between frontend and backend

* ✅ Responsive UI for both desktop and mobile

* ✅ Built with scalability and maintainability in mind

---

## **📁 Project Structure**

/weather-app  
  ├── /frontend (Next.js)  
  └── /backend  (Laravel API)

---

## **🌐 Getting Started**

To run this project locally:

### **1\. Clone the Repository**

```git clone https://github.com/yourusername/weather-app-decoupled.git```

### **2\. Set Up Laravel API**
```
cd backend  
composer install  
cp .env.example .env  
php artisan key:generate  
\# Add your OpenWeatherMap API key to .env  
php artisan serve
```

### **3\. Set Up Next.js Frontend**
```
cd ../frontend  
npm install  
\# Add your OpenWeatherMap API key and backend URL to .env.local  
npm run dev
```
---

## **🔐 API Key Setup**

You’ll need a free API key from [OpenWeatherMap](https://openweathermap.org/api) to fetch weather data.

1. Sign up on their site

2. Generate a free API key

3. Add it to your `.env` files (never commit it to version control)

---

## **🎯 Why This Project?**
A decoupled frontend and backend mimics real-world application development and opens up future possibilities like mobile app integration or deploying microservices.

---

## **🌍 Production Ready Hosting**

* **Frontend**: The frontend is hosted and deployed on [Vercel](https://vercel.com/), offering a fast, scalable, and global delivery platform.

* **Backend**: The backend API is hosted on [Fly.io](https://fly.io/), providing a globally distributed, low-latency environment for the Laravel API.

---

## **📬 Contact**

If you're a recruiter, developer, or just curious—feel free to reach out\!

* 🌐 Portfolio: [Tevin's Portfolio](millatevin-portfolio.vercel.app/).


