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

## 4. (Optional) Secure Keys

For a production app, it is recommended to use environment variables.
1. Add your keys to `.env` file (create it if it doesn't exist).
2. Update `app.config.js` to load these values.
3. Update `src/config/firebase.js` to read from `Constants.expoConfig.extra`.

For now, directly replacing the values in `src/config/firebase.js` will work for development.
