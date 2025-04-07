# AI-Powered Personal Health Coach for Chronic Disease Management

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
7. [Additional Features](#additional-features)  
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

## Additional Features

![Chatur Guidance](<img/Chatur Guidance.png>) ![Telegram](<img/Telegram.png>)  
![Documents](<img/Documents.png>) ![Weight-1](<img/Weight-1.png>) ![Weight-2](<img/Weight-2.png>)  
AI assistant, messaging integration, and document storage for medical reports and prescriptions.

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

## Installation

```bash
git clone https://github.com/aaren2044/Health-Coach-AI-Web-App
cd ai-health-coach
npm install
npm run dev

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
