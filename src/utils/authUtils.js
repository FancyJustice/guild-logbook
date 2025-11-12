/**
 * Firebase Authentication Utilities for Guild Logbook
 *
 * Manages user authentication via Google Sign-In
 * Handles login, logout, and auth state management
 */

import { auth } from '../firebaseConfig';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

const googleProvider = new GoogleAuthProvider();

/**
 * Sign in with Google
 * Returns the signed-in user object on success
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

/**
 * Sign out the current user
 */
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

/**
 * Subscribe to auth state changes
 * Calls the callback whenever authentication state changes
 * Returns unsubscribe function
 */
export const subscribeToAuthState = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

/**
 * Get current user info
 * Returns user object or null if not authenticated
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};
