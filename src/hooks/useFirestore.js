import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';

// Generic hook for Firestore operations
export const useFirestore = (collectionName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all documents from collection
  const getAll = async (constraints = []) => {
    try {
      setLoading(true);
      setError(null);
      
      const collectionRef = collection(db, collectionName);
      const q = constraints.length > 0 ? query(collectionRef, ...constraints) : collectionRef;
      const snapshot = await getDocs(q);
      
      const documents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setData(documents);
      return documents;
    } catch (err) {
      setError(err.message);
      toast.error(`Error fetching ${collectionName}: ${err.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get single document by ID
  const getById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const document = { id: docSnap.id, ...docSnap.data() };
        return document;
      } else {
        throw new Error('Document not found');
      }
    } catch (err) {
      setError(err.message);
      toast.error(`Error fetching document: ${err.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Add new document
  const add = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      const docData = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, collectionName), docData);
      const newDoc = { id: docRef.id, ...docData };
      
      setData(prev => [...prev, newDoc]);
      toast.success(`${collectionName.slice(0, -1)} created successfully!`);
      return newDoc;
    } catch (err) {
      setError(err.message);
      toast.error(`Error creating ${collectionName.slice(0, -1)}: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update document
  const update = async (id, updates) => {
    try {
      setLoading(true);
      setError(null);
      
      const docRef = doc(db, collectionName, id);
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(docRef, updateData);
      
      setData(prev => prev.map(item => 
        item.id === id ? { ...item, ...updateData } : item
      ));
      
      toast.success(`${collectionName.slice(0, -1)} updated successfully!`);
      return { id, ...updateData };
    } catch (err) {
      setError(err.message);
      toast.error(`Error updating ${collectionName.slice(0, -1)}: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete document
  const remove = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      await deleteDoc(doc(db, collectionName, id));
      setData(prev => prev.filter(item => item.id !== id));
      
      toast.success(`${collectionName.slice(0, -1)} deleted successfully!`);
      return true;
    } catch (err) {
      setError(err.message);
      toast.error(`Error deleting ${collectionName.slice(0, -1)}: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Subscribe to real-time updates
  const subscribe = (constraints = [], callback) => {
    const collectionRef = collection(db, collectionName);
    const q = constraints.length > 0 ? query(collectionRef, ...constraints) : collectionRef;
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const documents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setData(documents);
      if (callback) callback(documents);
    }, (err) => {
      setError(err.message);
      toast.error(`Error subscribing to ${collectionName}: ${err.message}`);
    });

    return unsubscribe;
  };

  return {
    data,
    loading,
    error,
    getAll,
    getById,
    add,
    update,
    remove,
    subscribe
  };
};

// Specific hooks for different collections
export const useEvents = () => useFirestore('events');
export const useUsers = () => useFirestore('users');
export const useRegistrations = () => useFirestore('registrations');

// Hook for user's events (as organizer)
export const useUserEvents = (userId) => {
  const { data, loading, error, getAll, subscribe } = useEvents();
  
  useEffect(() => {
    if (userId) {
      const constraints = [where('organizerId', '==', userId), orderBy('createdAt', 'desc')];
      getAll(constraints);
    }
  }, [userId]);

  return { events: data, loading, error, getAll, subscribe };
};

// Hook for user's registrations
export const useUserRegistrations = (userId) => {
  const { data, loading, error, getAll, subscribe } = useRegistrations();
  
  useEffect(() => {
    if (userId) {
      const constraints = [where('userId', '==', userId), orderBy('createdAt', 'desc')];
      getAll(constraints);
    }
  }, [userId]);

  return { registrations: data, loading, error, getAll, subscribe };
};

// Hook for event registrations (for organizers)
export const useEventRegistrations = (eventId) => {
  const { data, loading, error, getAll, subscribe } = useRegistrations();
  
  useEffect(() => {
    if (eventId) {
      const constraints = [where('eventId', '==', eventId), orderBy('createdAt', 'desc')];
      getAll(constraints);
    }
  }, [eventId]);

  return { registrations: data, loading, error, getAll, subscribe };
};

