import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Login } from '@/pages/Login';
import { Signup } from '@/pages/Signup';

export const AuthModal = ({ isOpen, onClose, defaultMode = 'login' }) => {
  const [mode, setMode] = useState(defaultMode);

  const handleSuccess = () => {
    onClose();
  };

  const switchToLogin = () => setMode('login');
  const switchToSignup = () => setMode('signup');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader>
          <DialogTitle className="sr-only">{mode === 'login' ? 'Sign In' : 'Sign Up'}</DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-muted/50 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Form Container */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {mode === 'login' ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Login
                    onSuccess={handleSuccess}
                    onSwitchToSignup={switchToSignup}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Signup
                    onSuccess={handleSuccess}
                    onSwitchToLogin={switchToLogin}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};


