# Setup & Troubleshooting Guide

## 🔧 Complete Setup Instructions

### 1. Install Node Modules
```bash
cd /Users/sharaj/FarmConnect
npm install
```

### 2. iOS Setup (Mac only)

#### Install Worklets Dependency
```bash
npm install react-native-worklets-core
```

#### Install Pods
```bash
cd ios
pod install
cd ..
```

If you encounter issues with Xcode:
```bash
# Make sure Xcode is installed, not just Command Line Tools
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
```

### 3. Android Setup

The app should work out of the box for Android. Just run:
```bash
npm run android
```

## 🐛 Common Issues & Solutions

### Issue 1: RNWorklets not found
**Solution:**
```bash
npm install react-native-worklets-core
cd ios && pod install && cd ..
```

### Issue 2: Vector Icons not showing
**Android Solution:**
Add to `android/app/build.gradle`:
```gradle
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

### Issue 3: Maps not working
**Solution:** You need to add API keys:

**iOS:** Add to `ios/FarmConnect/AppDelegate.swift`:
```swift
import GoogleMaps
// In application didFinishLaunching:
GMSServices.provideAPIKey("YOUR_API_KEY")
```

**Android:** Add to `android/app/src/main/AndroidManifest.xml`:
```xml
<application>
  <meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="YOUR_API_KEY"/>
</application>
```

### Issue 4: Camera/Photos not working
Add permissions to `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

And to `ios/FarmConnect/Info.plist`:
```xml
<key>NSCameraUsageDescription</key>
<string>We need camera access for photos</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>We need photo library access</string>
```

## 🚀 Running the App

### Start Metro Bundler
```bash
npm start
```

### Run on Android
```bash
npm run android
```

### Run on iOS
```bash
npm run ios
```

### Clear Cache (if needed)
```bash
npm start -- --reset-cache
```

## 📱 Testing the App

1. **Login Screen:**
   - Use credentials: SUP001 / admin123
   - Test "Remember Me" checkbox

2. **Dashboard:**
   - Test check-in/check-out functionality
   - Verify timer updates every second
   - Click on field cards to see maps

3. **Navigation:**
   - Test all 5 tabs
   - Verify center home button is elevated
   - Check tab switching animations

4. **Labour Screen:**
   - Test search functionality
   - Try filtering by status
   - Click on labour cards for details
   - Test phone call functionality

5. **Vehicles & Tasks:**
   - Switch between Vehicles and Tasks tabs
   - Test scheduling modal for vehicles
   - Expand/collapse task details
   - Update task status

6. **Field Visits:**
   - View pending and completed visits
   - Test section expansion/collapse

7. **Requests:**
   - Switch between My Requests and Make Request
   - Submit a new request
   - View request details

8. **Profile:**
   - View profile information
   - Test logout functionality

## 🔐 App Credentials

```
Supervisor ID: SUP001
Password: admin123
```

## 📊 App Features Checklist

- [x] Login/Logout
- [x] Attendance Check-in/Check-out with timer
- [x] Dashboard with stats
- [x] Labour management
- [x] Vehicle management and scheduling
- [x] Task management
- [x] Field visit tracking
- [x] Request system
- [x] Profile management
- [x] Custom bottom tab navigation
- [x] Interactive maps
- [x] Search and filter
- [x] Toast notifications
- [x] Pull to refresh
- [x] Modal forms

## 💡 Development Tips

1. **Hot Reload:** Shake device or press Cmd+D (iOS) / Cmd+M (Android) for dev menu
2. **Debugging:** Enable Remote JS Debugging from dev menu
3. **Inspect Element:** Use React DevTools
4. **Check Logs:** Run `npm run android` or `npm run ios` to see console logs

## 🎨 Customization

### Change Theme Color
Edit `src/utils/theme.ts`:
```typescript
export const colors = {
  primary: '#10b981',  // Change this to your color
  // ...
};
```

### Add New Mock Data
Edit `src/utils/mockData.ts` to add more fields, labours, tasks, etc.

### Modify Navigation
Edit `src/navigation/AppNavigator.tsx` to add or modify screens.

## 📦 Building for Production

### Android APK
```bash
cd android
./gradlew assembleRelease
# APK will be in android/app/build/outputs/apk/release/
```

### iOS IPA
1. Open Xcode
2. Select Product > Archive
3. Follow distribution steps

## 🔄 Updating Dependencies
```bash
npm update
cd ios && pod update && cd ..
```

## 📞 Need Help?

Check the main README.md for more information about the app structure and features.
