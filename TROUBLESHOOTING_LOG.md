# 🔧 Troubleshooting Log - FarmConnect Build Issues

## Issue #1: Port 8081 Already in Use
**Symptom**: `Error: listen EADDRINUSE: address already in use :::8081`

**Cause**: A previous Metro bundler process was still running

**Solution**:
```bash
lsof -ti:8081 | xargs kill -9
npm start
```

---

## Issue #2: react-native-worklets CMake Build Error
**Symptom**: 
```
CMake Error: Target "rnworklets" links to target "hermes-engine::libhermes" 
but the target was not found.
```

**Cause**: 
- `react-native-reanimated` v3.x requires `react-native-worklets-core`
- `react-native-worklets-core` has compatibility issues with React Native 0.83.1 + Hermes
- The CMake build can't find Hermes engine libraries during Android native compilation

**Root Cause Analysis**:
The app was initially set up with `react-native-reanimated` for animations, but:
1. None of the actual code uses reanimated (we use standard React Native Animated API)
2. The package was only added as a dependency
3. The worklets-core dependency has known build issues on macOS with certain Android SDK/NDK versions

**Solution**:
```bash
# 1. Remove the problematic packages
npm uninstall react-native-reanimated react-native-worklets-core react-native-worklets

# 2. Update babel.config.js - remove reanimated plugin
# Changed from:
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['react-native-reanimated/plugin'],
};

# To:
module.exports = {
  presets: ['module:@react-native/babel-preset'],
};

# 3. Clear all build caches
rm -rf android/app/build android/build android/.cxx android/app/.cxx

# 4. Reinstall dependencies to regenerate autolinking
rm -rf node_modules
npm install

# 5. Rebuild the app
npm run android
```

**Result**: Build now proceeds without CMake errors

---

## Issue #3: Autolinking Cache Issues
**Symptom**: Build references removed packages even after uninstalling

**Cause**: React Native's autolinking system caches native module references in:
- `android/app/build/generated/autolinking/`
- `android/.cxx/` (CMake cache)
- `node_modules/.bin/` (symlinks)

**Solution**: Complete cleanup and reinstall (see Issue #2 solution above)

---

## Lessons Learned

### 1. React Native Native Module Dependencies
- Always check if native modules are actually **used** in your code
- Some packages (like reanimated) can be removed if alternatives exist
- React Native's Animated API is built-in and doesn't require extra dependencies

### 2. Build Cache Management
- After uninstalling native modules, **always**:
  1. Clear `node_modules`
  2. Clear Android build directories
  3. Reinstall dependencies
  4. Clean rebuild

### 3. Package Compatibility
- Check package compatibility with your React Native version
- `react-native-reanimated` v3.x has ongoing issues with certain build toolchains
- Consider using built-in APIs before adding heavy dependencies

---

## Current Working Configuration

### Dependencies (Native Modules)
```json
{
  "@react-native-async-storage/async-storage": "^2.1.0",
  "@react-native-community/datetimepicker": "^8.2.0",
  "@react-native-community/geolocation": "^3.4.0",
  "@react-navigation/bottom-tabs": "^7.2.0",
  "@react-navigation/material-top-tabs": "^7.0.11",
  "@react-navigation/native": "^7.0.15",
  "@react-navigation/stack": "^7.2.0",
  "react-native-gesture-handler": "^2.21.2",
  "react-native-image-picker": "^7.3.2",
  "react-native-maps": "^1.21.2",
  "react-native-paper": "^5.12.5",
  "react-native-safe-area-context": "^5.0.2",
  "react-native-screens": "^4.4.0",
  "react-native-tab-view": "^3.5.2",
  "react-native-toast-message": "^2.2.1",
  "react-native-vector-icons": "^10.3.0"
}
```

**Note**: ❌ Removed `react-native-reanimated` and `react-native-worklets-core`

### Babel Configuration
```javascript
module.exports = {
  presets: ['module:@react-native/babel-preset'],
};
```

**Note**: No plugins needed

---

## Build Commands (Working)

### Start Metro Bundler
```bash
npm start
```

### Run Android
```bash
npm run android
```

### Run iOS (requires Xcode)
```bash
cd ios && pod install && cd ..
npm run ios
```

### Clean Build (if issues)
```bash
# Android
cd android
./gradlew clean
cd ..

# Clear Metro cache
npm start -- --reset-cache

# Full clean
rm -rf android/app/build android/build android/.cxx node_modules
npm install
```

---

## Success Indicators

✅ Metro bundler starts without errors
✅ Android Gradle build completes (no CMake errors)
✅ App installs on device/emulator
✅ Login screen appears
✅ Navigation works
✅ All features functional

---

## If You Still Have Issues

### Check Android SDK
```bash
# Verify Android SDK location
echo $ANDROID_HOME

# Should be: /Users/YOUR_USERNAME/Library/Android/sdk
```

### Check Java Version
```bash
java -version
# Should be Java 17 or 21
```

### Check Connected Devices
```bash
# Android
adb devices

# iOS
xcrun simctl list devices
```

### Reset Everything
```bash
# Nuclear option - complete reset
cd /Users/sharaj/FarmConnect
rm -rf node_modules android/build android/app/build android/.cxx ios/build ios/Pods
npm install
cd ios && pod install && cd ..
```

---

**Last Updated**: Build is currently running successfully without reanimated packages
