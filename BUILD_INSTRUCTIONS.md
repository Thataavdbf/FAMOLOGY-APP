# Famology Mobile App - Build Instructions

## Overview
This document provides instructions for building and running the Famology mobile app on Android and iOS devices.

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- For iOS: macOS with Xcode installed
- For Android: Android Studio with Android SDK

## Project Setup
1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
   ```
   npm install
   ```

## Running the App in Development Mode
1. Start the development server:
   ```
   npm start
   ```
2. Use the Expo Go app on your device to scan the QR code, or run in a simulator:
   - For iOS: Press `i` in the terminal
   - For Android: Press `a` in the terminal

## Building for Production

### Android
1. Build the Android APK:
   ```
   expo build:android -t apk
   ```
2. For Google Play Store submission:
   ```
   expo build:android -t app-bundle
   ```

### iOS
1. Build for iOS:
   ```
   expo build:ios
   ```
2. Follow the prompts to create certificates and provisioning profiles

## Distribution

### Android
- The APK file can be directly installed on Android devices
- Enable "Install from Unknown Sources" in device settings
- The app bundle can be uploaded to Google Play Console for distribution

### iOS
- The IPA file can be distributed through TestFlight for testing
- For App Store distribution, submit through App Store Connect

## Pre-loaded User Data
The app comes with a pre-loaded user:
- Name: Tyler Jerome Daniels
- Birthdate: June 2, 1988
- Birthplace: Des Moines, Iowa
- Birth Time: 12:41 AM

## Features
- Family tree visualization and management
- Numerology calculations (Life Path Number)
- Western and Chinese zodiac information
- Profile management
- Offline data storage

## Troubleshooting
- If you encounter build issues, try clearing the cache:
  ```
  expo r -c
  ```
- For Android device connection issues, ensure USB debugging is enabled
- For iOS build issues, verify your Apple Developer account has the necessary permissions
