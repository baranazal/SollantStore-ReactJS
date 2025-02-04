import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail as firebaseUpdateEmail,
  updatePassword,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/services/firebase';

const Auth = {
  // Sign up new user
  signUp: async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        ...userData,
        role: 'user',
        createdAt: new Date(),
      });

      return user;
    } catch (error) {
      console.error('Error in signup:', error);
      throw error;
    }
  },

  // Sign in existing user
  signIn: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Error in signin:', error);
      throw error;
    }
  },

  // Sign out user
  signOut: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error in signout:', error);
      throw error;
    }
  },

  // Reset password
  resetPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error in password reset:', error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      // Update auth profile
      await updateProfile(user, {
        displayName: userData.displayName,
        photoURL: userData.photoURL,
      });

      // Update user document in Firestore
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        ...userData,
        updatedAt: new Date(),
      }, { merge: true });

    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Update user email
  updateEmail: async (newEmail) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      await firebaseUpdateEmail(user, newEmail);
      
      // Update email in Firestore
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        email: newEmail,
        updatedAt: new Date(),
      }, { merge: true });

    } catch (error) {
      console.error('Error updating email:', error);
      throw error;
    }
  },

  // Update password
  updatePassword: async (newPassword) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      await updatePassword(user, newPassword);
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  },

  // Get current user data
  getCurrentUser: async () => {
    try {
      const user = auth.currentUser;
      if (!user) return null;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) return null;

      return {
        uid: user.uid,
        email: user.email,
        ...userDoc.data(),
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  },

  // Check if user is admin
  isAdmin: async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      return userDoc.exists() && userDoc.data().role === 'admin';
    } catch (error) {
      console.error('Error checking admin status:', error);
      throw error;
    }
  },

  // Get user role
  getUserRole: async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      return userDoc.exists() ? userDoc.data().role : null;
    } catch (error) {
      console.error('Error getting user role:', error);
      throw error;
    }
  }
};

export default Auth;
