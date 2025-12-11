# Firebase Setup Guide

To complete the Firebase integration, you need to create a Firebase project and add your configuration keys to the application.

## 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and follow the setup steps.
3. Once the project is created, click the **Web** icon (</>) to add a web app to your project.
4. Register the app (you can name it "ClearMe").
5. You will be shown a `firebaseConfig` object. Keep this page open or copy the config.

## 2. Enable Authentication

1. In the Firebase Console, go to **Build** > **Authentication**.
2. Click **Get Started**.
3. Select **Sign-in method** tab.
4. Enable **Email/Password**.

## 3. Configure the App

Open `src/config/firebase.js` and replace the placeholder values with your actual Firebase configuration keys:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## 4. Secure Keys (Completed)

I have already configured the app to use environment variables for security.

1.  Your keys are stored in `.env`.
2.  `app.config.js` loads these keys into `extra`.
3.  `src/config/firebase.js` reads them from `Constants.expoConfig.extra`.

**Important:** Do not commit `.env` to version control if you are using a public repository. Add it to your `.gitignore`.
