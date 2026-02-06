# FarmConnect - Agricultural Supervisor Mobile App

A comprehensive React Native mobile application for agricultural field management and supervision.

## ✨ Features Implemented

### 🏠 Dashboard (Home Screen)
- ✅ **Real-time Attendance Tracking** with check-in/check-out
- ✅ Live elapsed timer (HH:MM:SS format)
- ✅ Statistics dashboard (Fields, Labour, Vehicles, Area)
- ✅ Field visit summary
- ✅ Interactive field maps
- ✅ Reporting officer contact

### 👥 Labour Management
- ✅ View all labours with search and filter
- ✅ Status filtering (Active, Inactive, On Leave)
- ✅ Direct call functionality

### 🚜 Vehicles & Tasks
- ✅ Vehicle management with status tracking
- ✅ Vehicle scheduling modal
- ✅ Task management (Create, Update, Complete)
- ✅ Priority and status indicators

### 🗺️ Field Visits
- ✅ Pending and completed visit tracking
- ✅ Visit statistics dashboard
- ✅ Interactive visit cards

### 📝 Requests System
- ✅ Submit and track requests
- ✅ Category-based organization
- ✅ Priority levels
- ✅ Status tracking (Pending, Approved, Rejected)

### 👤 Profile & Settings
- ✅ User profile management
- ✅ Settings menu
- ✅ Logout functionality

## 🚀 Quick Start

### Prerequisites
- Node.js >= 20
- React Native development environment
- iOS: Xcode and CocoaPods (optional)
- Android: Android Studio

### Installation

```bash
# Install dependencies
npm install

# For iOS (if running on Mac)
cd ios && pod install && cd ..

# Start Metro
npm start

# Run on Android
npm run android

# Run on iOS (Mac only)
npm run ios
```

## 🔐 Demo Credentials

```
Supervisor ID: SUP001
Password: admin123
```

## 📱 Tech Stack

- React Native 0.83.1
- TypeScript
- React Navigation 6.x
- React Native Paper
- AsyncStorage
- React Native Maps
- React Native Toast Message

## 📂 Project Structure

```
src/
├── components/     # Reusable UI components
├── context/        # Auth context
├── navigation/     # Navigation setup
├── screens/        # All app screens
├── types/          # TypeScript types
└── utils/          # Helpers and mock data
```

## 🎨 Design

- Custom bottom tab bar with elevated center button
- Green theme (#10b981)
- Material Design principles
- Smooth animations

---

**Built for Agricultural Management**

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
