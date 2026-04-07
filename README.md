# TaskFlow — React Native App

Firebase-powered Task Manager with full CRUD, authentication, and realtime updates.

---

## 🚀 Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** → Turn on **Email/Password sign-in**
4. Create a **Firestore Database** (start in **Test mode**)
5. Go to **Project Settings** → **Your Apps** → **Web App** → Copy the **SDK config**

### 3. Set Environment Variables

```bash
cp .env.example .env
```

Open the `.env` file and add your Firebase configuration values.

### 4. Firestore Security Rules (for Production)

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

### 5. Run the Application

```bash
# With Expo Go (easiest)
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
- 🌈 Dynamic Light/Dark mode toggle (powered by Zustand, accessible from Profile)

---

## 🛠 Tech Stack

| Tool                | Purpose             |
| ------------------- | ------------------- |
| React Native + Expo | Mobile framework    |
| TypeScript          | Type safety         |
| Firebase Firestore  | Database + realtime |
| Firebase Auth       | Authentication      |
| React Navigation    | Navigation          |
| Zustand             | State management    |
| @expo/vector-icons  | Icons               |
