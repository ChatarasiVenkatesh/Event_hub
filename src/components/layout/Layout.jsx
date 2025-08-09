import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { AuthModal } from '@/components/auth/AuthModal';

export const Layout = () => {
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });

  const handleAuthClick = (mode = 'login') => {
    setAuthModal({ isOpen: true, mode });
  };

  const handleAuthClose = () => {
    setAuthModal({ isOpen: false, mode: 'login' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onAuthClick={handleAuthClick} />
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <Footer />
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={handleAuthClose}
        defaultMode={authModal.mode}
      />
      
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
          },
        }}
      />
    </div>
  );
};

