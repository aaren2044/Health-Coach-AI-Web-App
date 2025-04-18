## Overview

The **AI-Powered Personal Health Coach for Chronic Disease Management** is a comprehensive mobile and web application designed to empower individuals with chronic health conditions like diabetes and hypertension. The app serves as an autonomous health assistant that integrates with wearable devices (such as smartwatches) to provide real-time guidance on medication management, exercise, diet planning, and health monitoring. By leveraging AI and wearable data, the app delivers personalized insights, improving patient adherence and overall health outcomes.

**Value Proposition:**  
- **30% higher patient adherence** via AI-driven reminders & coaching  
- **Reduces hospital visits** through early anomaly detection  
- **Seamless wearable integration** (Apple Watch, Google Fit, etc.) for live health tracking  

---

## Table of Contents

1. [Core Features](#core-features)  
   - [Activity Dashboard](#activity-dashboard)  
   - [Authentication Flow](#authentication-flow)  
   - [Dashboard Overview](#dashboard-overview)  
2. [Health Monitoring](#health-monitoring)  
   - [Vital Signs Tracking](#vital-signs-tracking)  
   - [Health Alerts](#health-alerts)  
3. [Medication Management](#medication-management)  
4. [Exercise Analytics](#exercise-analytics)  
5. [Sleep & Nutrition](#sleep--nutrition)  
   - [Sleep Tracking](#sleep-tracking)  
   - [Diet Planning](#diet-planning)  
6. [User Profiles](#user-profiles)  
7. [Telegram Bots](#telegram-bots)  
8. [Technology Stack](#technology-stack)  
9. [Installation](#installation)  

---

## Core Features

### Activity Dashboard
![Activity Summary](<img/Activity Summary.png>)  
Comprehensive overview of daily health metrics and progress, enabling users to track their physical activity and energy expenditure.  
Real-time overview of **steps, calories burned, and active minutes** synced from wearables.

### Authentication Flow
![Login](<img/Login.png>) ![Sign Up](<img/Sign Up.png>)  
Secure login via email verification and Google OAuth, ensuring a smooth and secure user experience.

### Dashboard Overview
![Dashboard-1](<img/Dashboard-1.png>) ![Dashboard-2](<img/Dashboard-2.png>)  
Personalized health metrics and quick navigation to core features such as medication, exercise, and health alerts.

---

## Health Monitoring

### **Heart Rate & ECG Tracking**
![Heart Rate](img/Heart_Rate.png)  
- **Real-time Apple Watch/Google Fit sync** for **continuous HR/ECG monitoring**.  
- **AI-driven alerts** for irregular rhythms (e.g., atrial fibrillation).

### Vital Signs Tracking
![Blood SpO2-1](<img/Blood SpO2-1.png>) ![Blood SpO2-2](<img/Blood SpO2-2.png>)  
![Heart Rate](<img/Heart Rate.png>) ![Wrist Temperature-1](<img/Wrist Temperature-1.png>)  
Real-time tracking of blood oxygen, heart rate, and body temperature, with visual representation of data for easy monitoring.

### Health Alerts
![Monitoring](<img/Monitoring.png>)  
Proactive notifications for abnormal health readings, helping users stay on top of potential health risks.

---

## Medication Management
![Medication Scheduling](<img/Medication Scheduling.png>)  
A complete medication scheduler with dosage tracking, helping users adhere to their prescribed medication schedule with ease.

---

## Exercise Analytics
![Exercise Analysis-1](<img/Exercise Analysis-1.png>) ![Exercise Analysis-2](<img/Exercise Analysis-2.png>)  
![Exercise Analysis-3](<img/Exercise Analysis-3.png>) ![Exercise](<img/Exercise.png>)  
Detailed visual breakdowns of workout performance, with analytics that help users track progress and set goals for improvement.

---

## Sleep & Nutrition

### Sleep Tracking
![Sleep Analysis-1](<img/Sleep Analysis-1.png>) ![Sleep Analysis-2](<img/Sleep Analysis-2.png>)  
AI-powered sleep analysis, providing insights into sleep quality and stage distribution for better rest management.

### Diet Planning
![Diet Plan](<img/Diet Plan.png>)  
Personalized meal recommendations based on user profiles, dietary restrictions, and health goals. AI-driven diet plans can also be generated based on user input.

---

## User Profiles

![Profile-1](<img/Profile-1.png>) ![Profile-2](<img/Profile-2.png>)  
![Profile-3](<img/Profile-3.png>) ![Profile-4](<img/Profile-4.png>)  
Complete health profile management where users can add personal details, medications, health conditions, dietary restrictions, exercise preferences, and health goals.

---

## Telegram Bots

### 🤖 My Medicine – [@MedGuardian Bot](https://t.me/MedGuardian_bot)
![MedGuardian Bot](https://github.com/user-attachments/assets/13254c0c-adcb-4d57-8e54-3f132ba03ae4)
- **Smart Reminders:** Medication, doctor appointments, workout, and sleep reminders
- **Emergency Alerts:** Automatic SOS notifications during falls or abnormal readings
- **Document Upload:** Securely store prescriptions and medical reports via chat
- **24/7 Support:** AI assistant powered by Gemini for health Q&A

### 🍽️ My Diet – [@Diet Bot](https://t.me/MedGuardianDietBot)
![Diet Bot](https://github.com/user-attachments/assets/60764302-b432-4bfc-ba11-194491cb713e)
- **AI Diet Coach:** Personalized meal planning based on your profile and health conditions
- **Daily Suggestions:** Get tailored diet charts with nutritional values
- **Food Logging:** Log meals with SmartCam and get instant calorie analysis

### 🏋️ My Exercise – [@MedGuardian Bot](https://t.me/MedGuardian_bot)
![image](https://github.com/user-attachments/assets/de4697b9-6563-4aac-ba85-0dacf248bfbb)
![image](https://github.com/user-attachments/assets/8ab0f097-c684-4b98-b9db-23ea0c044b0b)
- **AI Workout Generator:** Daily routines tailored to your health status
- **Progress Tracker:** View stats, calories burned, heart rate zones
- **Posture Monitoring:** Real-time posture correction tips via sensor input

### 🗓️ My Task – [@DailyTask Bot](https://t.me/MedGaurdianDaily_bot)
![DailyTask Bot](https://github.com/user-attachments/assets/c6264b84-ae74-4550-8367-3ea551405981)
- **Daily Planner:** Organize your day with intelligent task reminders
- **Health Integration:** Syncs with meds, exercises, and doctor appointments
- **Custom Notifications:** AI learns your patterns and suggests optimal routines

---

## Technology Stack

**Frontend:**  
- React + TypeScript + Vite  
- Tailwind CSS + Framer Motion  
- Chart.js / Recharts

**Backend:**  
- Node.js / Express  
- Supabase (Auth)  
- MongoDB

**Integrations:**  
- Apple HealthKit  
- Google Fit  
- Telegram Bot API

---

## Mobile App Overview

The *AI-Powered Personal Health Coach – Mobile App* (built with *React Native*) brings the full platform to your pocket, offering **real-time health insights**, **AI-driven assistance**, and **sensor-based monitoring** to support chronic disease management like diabetes and hypertension.

---

### Key Features

- *Live Health Dashboard*  
  Monitor *steps, **heart rate, **SpO2, **temperature* via *Google Fit* / *Apple HealthKit*.

- *AI Task Planner*  
  Smart *calendar, **to-do list, and intelligent reminders for **meds, **workouts, and **doctor visits*.

- *Community Support*  
  Chat with users who have similar conditions, share advice, and support recovery together.

- *Emergency Helpline & SOS*  
  One-tap help with *auto SOS trigger* during *falls* or *abnormal health alerts*.

- *SmartCam*  
  Upload *medical reports, **prescriptions* – processed by *AI* for insights and stored securely.

- *AI Chatbot Assistant*  
  24/7 help for *symptoms, **diet, **fitness tips* powered by *Gemini AI*.

- *Nearby Services Map*  
  Locate nearby *clinics, **pharmacies, and **gyms* using real-time *orientation & path detection*.

- *Health Articles*  
  Get personalized health & wellness content tailored to your condition.

---

### Sensor Integration

| Sensor          | Features                                               |
|-----------------|--------------------------------------------------------|
| Accelerometer   | Fall detection, emergency motion triggers              |
| Gyroscope       | Posture correction, exercise precision                 |
| Pedometer       | Step tracking, movement history                        |
| Barometer       | Breathing patterns, stress level, elevation tracking  |
| DeviceMotion    | Full-body motion accuracy for workouts & alerting     |
| Magnetometer    | Orientation-based navigation (indoor/outdoor)         |
| Light Sensor    | Auto brightness, ambient light awareness               |

---

### Tech Stack

- *React Native*  
- *Gemini AI (Google)* – Chatbot, Smart Suggestions  
- *Supabase* – Realtime DB, Auth, File Storage  
- *Google Fit* – Wearable integration  
- *Flask + TensorFlow Lite* – Backend & AI Model Integration  

---

### App Images

1. Home Screen 🏠  
![image](https://github.com/user-attachments/assets/a8117995-b180-4db0-bf13-0261f3607b19)

2. Profile 📋  
![image](https://github.com/user-attachments/assets/2c9c2c6b-9d1e-48c8-a1a7-d887dd626476)

3. Ai-Chat 💬  
![image](https://github.com/user-attachments/assets/c25085e5-f2b3-4155-adfe-47712352edc9)

4. AI Diet Planner 🍏  
![image](https://github.com/user-attachments/assets/d36de50b-012e-4d13-b4de-8e9889cd47b1)

5. Smart Camera (OCR) 📷  
![WhatsApp Image 2025-04-09 at 10 10 35_b225a51a](https://github.com/user-attachments/assets/610d1b68-0a8a-49e0-9cbf-6ddd89ba9e0a)

6. Hydration Tracker 💧  
![image](https://github.com/user-attachments/assets/90df12ff-9b43-4714-a239-e4e283dfa130)

7. Step & Calorie Tracker 🚶‍♂️🔥  
![image](https://github.com/user-attachments/assets/463f1dad-41f6-4c94-b6ca-e9eedae21f1b)

---

## Installation

```bash
git clone https://github.com/aaren2044/Health-Coach-AI-Web-App
cd ai-health-coach
npm install
npm run dev
```

## Configure .env file  

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
VITE_GEMINI_API_KEY=
VITE_GEMINI_API_URL=
VITE_GEMINI_TEXT_MODEL=
VITE_GEMINI_VISION_MODEL=
VITE_GEMINI_API_VERSION=
```

