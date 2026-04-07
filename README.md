# TaskFlow — React Native App

Firebase-powered Task Manager with full CRUD, authentication, and realtime updates.

---

## 🚀 Setup করুন

### ১. Dependencies install করুন
```bash
npm install
```

### ২. Firebase Project তৈরি করুন
1. [Firebase Console](https://console.firebase.google.com/) এ যান
2. নতুন project তৈরি করুন
3. **Authentication** enable করুন → Email/Password sign-in চালু করুন
4. **Firestore Database** তৈরি করুন (Test mode দিয়ে শুরু করুন)
5. Project Settings → Your Apps → Web App → SDK config copy করুন

### ৩. Environment Variables সেট করুন
```bash
cp .env.example .env
```
`.env` file খুলে Firebase config values দিন।

### ৪. Firestore Security Rules (Production-এ)
Firebase Console → Firestore → Rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### ৫. App চালু করুন
```bash
# Expo Go দিয়ে (সহজ)
npx expo start

# Android
npx expo start --android

# iOS
npx expo start --ios
```

---

## 📁 Project Structure

```
TaskApp/
├── App.tsx                     # Root component, auth listener
├── src/
│   ├── types/index.ts          # TypeScript types
│   ├── theme/index.ts          # Design tokens (colors, spacing)
│   ├── services/
│   │   ├── firebase.ts         # Firebase initialization
│   │   ├── taskService.ts      # Firestore CRUD operations
│   │   └── authService.ts      # Authentication service
│   ├── store/index.ts          # Zustand global state
│   ├── hooks/
│   │   └── useTasks.ts         # Firebase + CRUD custom hook
│   ├── components/
│   │   ├── common/index.tsx    # Button, Input, Card, Badge
│   │   └── tasks/TaskCard.tsx  # Task list item component
│   ├── navigation/index.tsx    # Stack + Tab navigation
│   └── screens/
│       ├── HomeScreen.tsx      # Dashboard
│       ├── ProfileScreen.tsx   # User profile
│       ├── auth/
│       │   ├── LoginScreen.tsx
│       │   └── RegisterScreen.tsx
│       └── tasks/
│           ├── TaskListScreen.tsx
│           ├── TaskFormScreen.tsx   # Add + Edit (shared)
│           └── TaskDetailScreen.tsx
```

---

## ✨ Features

- 🔐 Email/Password Authentication
- 📋 Task CRUD (Create, Read, Update, Delete)
- 🔴 Priority levels (Low / Medium / High)
- 📊 Status tracking (Todo / In Progress / Done)
- 🏷️ Category filtering
- 📡 Realtime Firestore listener
- 🌙 Dark theme with indigo + cyan palette
- 🇧🇩 Bengali language support

---

## 🛠 Tech Stack

| Tool | Purpose |
|------|---------|
| React Native + Expo | Mobile framework |
| TypeScript | Type safety |
| Firebase Firestore | Database + realtime |
| Firebase Auth | Authentication |
| React Navigation | Navigation |
| Zustand | State management |
| @expo/vector-icons | Icons |
