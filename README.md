# EventHub - Event Web Portal

A complete event management platform built with React.js, Firebase, and modern web technologies.

## 🚀 Features

### Authentication & User Management
- ✅ Firebase Authentication (Email/Password)
- ✅ Role-based access control (User/Organizer)
- ✅ User profile management
- ✅ Interest-based personalization

### User Dashboard
- ✅ Personalized event feed
- ✅ Advanced search and filtering
- ✅ Event registration system
- ✅ Analytics and insights
- ✅ My Events management

### Organizer Dashboard
- ✅ Event creation and management
- ✅ Registration tracking
- ✅ Revenue analytics
- ✅ Performance metrics
- ✅ Attendee management

### Modern UI/UX
- ✅ Responsive design with Tailwind CSS
- ✅ Smooth animations with Framer Motion
- ✅ Professional component library (shadcn/ui)
- ✅ Dark/Light mode support
- ✅ Mobile-friendly interface

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **UI Components**: shadcn/ui, Lucide Icons
- **Animations**: Framer Motion
- **Forms**: React Hook Form, Zod validation
- **Charts**: Recharts
- **Notifications**: React Hot Toast

## 📋 Prerequisites

- Node.js 18+ and npm/pnpm
- Firebase account
- Git

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd event-web-portal
```

### 2. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 3. Firebase Setup

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Follow the setup wizard

#### Enable Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider

#### Create Firestore Database
1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (we'll add security rules later)
4. Select a location

#### Enable Storage
1. Go to "Storage"
2. Click "Get started"
3. Choose "Start in test mode"

#### Get Firebase Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" and select "Web"
4. Register your app
5. Copy the configuration object

### 4. Configure Environment

Update `src/lib/firebase.js` with your Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 5. Deploy Security Rules

#### Install Firebase CLI
```bash
npm install -g firebase-tools
```

#### Login and Initialize
```bash
firebase login
firebase init
```

Select:
- Firestore
- Hosting
- Storage

#### Deploy Rules
```bash
firebase deploy --only firestore:rules
firebase deploy --only storage
```

### 6. Run Development Server
```bash
npm run dev
# or
pnpm run dev
```

Visit `http://localhost:5173`

## 🔐 Security Rules

The project includes comprehensive security rules:

- **Firestore**: Role-based access control for users, events, and registrations
- **Storage**: Secure file uploads for profile pictures and event images
- **Authentication**: Email/password with proper validation

## 📱 Usage

### For Users
1. **Sign Up**: Create account with interests selection
2. **Browse Events**: Search and filter events by category, date, location
3. **Register**: Register for events with secure payment processing
4. **Dashboard**: Track registrations, view analytics, manage profile

### For Organizers
1. **Sign Up**: Create organizer account
2. **Create Events**: Add events with images, descriptions, pricing
3. **Manage**: Edit events, view registrations, track revenue
4. **Analytics**: Monitor event performance and attendee engagement

## 🚀 Deployment

### Build for Production
```bash
npm run build
# or
pnpm run build
```

### Deploy to Firebase Hosting
```bash
firebase deploy --only hosting
```

### Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Set environment variables (if any)
3. Deploy automatically on push

## 📊 Project Structure

```
event-web-portal/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── auth/            # Authentication components
│   │   └── layout/          # Layout components
│   ├── pages/               # Main pages
│   ├── contexts/            # React contexts
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # Utilities and configurations
│   └── data/                # Mock data for development
├── public/                  # Static assets
├── firestore.rules          # Firestore security rules
├── storage.rules            # Storage security rules
├── firebase.json            # Firebase configuration
└── package.json
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables
Create `.env.local` for additional configuration:
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
# ... other Firebase config
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review Firebase documentation for backend issues

## 🎯 Roadmap

- [ ] Payment integration (Stripe/Razorpay)
- [ ] Google Maps integration
- [ ] Calendar sync
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Multi-language support

---

Built with ❤️ using React, Firebase, and modern web technologies.

