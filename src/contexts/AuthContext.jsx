import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { USER_ROLES } from '@/lib/constants';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Fetch user profile from Firestore
        await fetchUserProfile(firebaseUser.uid);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Fetch user profile from Firestore
  const fetchUserProfile = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Sign up with email and password
  const signup = async (email, password, userData) => {
    try {
      setLoading(true);
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name
      await updateProfile(firebaseUser, {
        displayName: userData.name
      });

      // Create user profile in Firestore
      const userProfile = {
        uid: firebaseUser.uid,
        name: userData.name,
        email: firebaseUser.email,
        role: userData.role,
        interests: userData.interests || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        profilePicture: null,
        phone: userData.phone || '',
        bio: userData.bio || '',
        location: userData.location || '',
        isActive: true
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);
      setUserProfile(userProfile);
      
      toast.success('Account created successfully!');
      return firebaseUser;
    } catch (error) {
      console.error('Signup error:', error);
      let errorMessage = 'An unknown error occurred during signup.';
      if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'The email address is already in use by another account.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'The email address is not valid.';
            break;
          case 'auth/operation-not-allowed':
            errorMessage = 'Email/password accounts are not enabled. Enable Email/Password sign-in method in Firebase console.';
            break;
          case 'auth/weak-password':
            errorMessage = 'The password is too weak.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your internet connection.';
            break;
          case 'auth/invalid-api-key':
            errorMessage = 'Invalid Firebase API key. Please check your Firebase configuration.';
            break;
          default:
            errorMessage = error.message;
        }
      }
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const signin = async (email, password) => {
    try {
      setLoading(true);
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
      toast.success("Signed in successfully!");
      return firebaseUser;
    } catch (error) {
      console.error("Signin error:", error);
      let errorMessage = 'An unknown error occurred during signin.';
      if (error.code) {
        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage = 'The email address is not valid.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'The user account has been disabled.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'No user found with this email address.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your internet connection.';
            break;
          case 'auth/invalid-api-key':
            errorMessage = 'Invalid Firebase API key. Please check your Firebase configuration.';
            break;
          default:
            errorMessage = error.message;
        }
      }
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password (alias for signin)
  const login = async (email, password) => {
    return await signin(email, password);
  };

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
      toast.success('Signed out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(error.message);
    }
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      const updatedProfile = {
        ...userProfile,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(doc(db, 'users', user.uid), updatedProfile);
      setUserProfile(updatedProfile);
      
      // Update Firebase Auth profile if name changed
      if (updates.name && updates.name !== user.displayName) {
        await updateProfile(user, { displayName: updates.name });
      }
      
      toast.success('Profile updated successfully!');
      return updatedProfile;
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error(error.message);
      throw error;
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return userProfile?.role === role;
  };

  // Check if user is organizer
  const isOrganizer = () => {
    return hasRole(USER_ROLES.ORGANIZER);
  };

  // Check if user is regular user
  const isUser = () => {
    return hasRole(USER_ROLES.USER);
  };

  const value = {
    user,
    userProfile,
    loading,
    signup,
    signin,
    login,
    logout,
    updateUserProfile,
    fetchUserProfile,
    hasRole,
    isOrganizer,
    isUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};



