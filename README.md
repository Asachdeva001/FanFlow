# FanFlow

FanFlow is a real-time location-based social networking app built with React Native and Firebase. It allows users to discover and connect with other users nearby, share their location, and chat in real-time.

## Features

- **Real-time Location Sharing**: Share your location with other users in real-time
- **Nearby Users**: Discover other users nearby based on their location
- **Chat**: Real-time chat with other users
- **User Profiles**: Create and manage your user profile
- **Push Notifications**: Get notified when other users are nearby or send you messages

## Tech Stack

- **Frontend**: React Native (Expo)
- **Backend**: Firebase (Firestore, Authentication, Cloud Functions)
- **Mapping**: react-native-maps
- **Real-time**: Firebase Firestore
- **Notifications**: Expo Push Notifications

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Expo CLI (`npm install -g expo-cli`)
- Firebase account and project

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Promptwars_virtual
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase:
   - Create a Firebase project at [https://firebase.google.com/](https://firebase.google.com/)
   - Enable Firestore, Authentication, and Cloud Functions
   - Download the `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) files
   - Place them in the `android/app/` and `ios/` directories respectively

4. Start the development server:
   ```bash
   npm start
   ```

5. Run on your device or emulator:
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Press `w` for web

## Deployment

### Build for Web

```bash
npm run build:web
```

### Deploy to Cloud Run

```bash
./deploy-cloud-run.sh
```

## Project Structure

```
Promptwars_virtual/
├── android/              # Android native project
├── ios/                  # iOS native project
├── src/
│   ├── screens/          # App screens
│   ├── components/       # Reusable components
│   ├── navigation/       # Navigation setup
│   ├── services/         # Firebase services
│   ├── utils/            # Utility functions
│   └── config/           # Configuration
├── assets/               # Static assets
├── firebase/             # Firebase configuration
├── .dockerignore         # Docker ignore file
├── Dockerfile            # Dockerfile for web deployment
├── nginx.conf            # Nginx configuration
├── package.json          # Project dependencies
└── README.md             # Project documentation
```


