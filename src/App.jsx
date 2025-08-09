import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { HomePage } from '@/pages/HomePage';
import { EventsPage } from '@/pages/EventsPage';
import { UserDashboard } from '@/pages/UserDashboard';
import { OrganizerDashboard } from '@/pages/OrganizerDashboardSimple';
import { ProtectedRoute, UserRoute, OrganizerRoute } from '@/components/auth/ProtectedRoute';
import './App.css';

// Placeholder components (to be implemented in later phases)
const EventDetailsPage = () => <div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold">Event Details - Coming Soon</h1></div>;
const CreateEventPage = () => <div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold">Create Event - Coming Soon</h1></div>;
const ProfilePage = () => <div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold">Profile Settings - Coming Soon</h1></div>;
const NotFoundPage = () => <div className="container mx-auto px-4 py-8 text-center"><h1 className="text-2xl font-bold">404 - Page Not Found</h1></div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public Routes */}
            <Route index element={<HomePage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="events/:id" element={<EventDetailsPage />} />
            
            {/* Protected Routes - Any authenticated user */}
            <Route path="profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            
            {/* User-only Routes */}
            <Route path="dashboard" element={
              <UserRoute>
                <UserDashboard />
              </UserRoute>
            } />
            
            {/* Organizer-only Routes */}
            <Route path="organizer" element={
              <OrganizerRoute>
                <OrganizerDashboard />
              </OrganizerRoute>
            } />
            <Route path="organizer/create" element={
              <OrganizerRoute>
                <CreateEventPage />
              </OrganizerRoute>
            } />
            <Route path="organizer/events/:id/edit" element={
              <OrganizerRoute>
                <CreateEventPage />
              </OrganizerRoute>
            } />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

