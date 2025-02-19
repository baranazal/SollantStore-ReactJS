import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail as firebaseUpdateEmail,
  updatePassword,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/services/firebase';

const Auth = {
  // Sign up new user
  signUp: async (userData) => {
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      country,
      countryCode,
      city,
      village,
      streetAddress,
      phoneNumber 
    } = userData;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !country || 
        !city || !streetAddress || !phoneNumber) {
      throw new Error('All fields are required');
    }
    
    try {
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user document in Firestore with additional fields
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        firstName,
        lastName,
        phoneNumber,
        address: {
          country,
          countryCode,
          city,
          village: village || null, // Include village if it exists
          streetAddress
        },
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
        displayName: `${firstName} ${lastName}`,
      });

      // Update auth profile
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`
      });

      return user;
    } catch (error) {
      console.error('Error in signup:', error);
      throw error;
    }
  },

  // Sign in user
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
  updateProfile: async (uid, userData) => {
    try {
      const userRef = doc(db, 'users', uid);
      const user = auth.currentUser;

      // Update Firestore document
      await updateDoc(userRef, {
        ...userData,
        updatedAt: new Date()
      });

      // Update Auth profile if name is being updated
      if (userData.firstName && userData.lastName && user) {
        await updateProfile(user, {
          displayName: `${userData.firstName} ${userData.lastName}`
        });
      }

      // Update email if it's being changed
      if (userData.email && user && user.email !== userData.email) {
        await firebaseUpdateEmail(user, userData.email);
      }

      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Update password
  updatePassword: async (newPassword) => {
    try {
      const user = auth.currentUser;
      if (user) {
        await updatePassword(user, newPassword);
        return true;
      }
      throw new Error('No user is currently signed in');
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  },

  // Get user profile
  getUserProfile: async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }
      return userDoc.data();
    } catch (error) {
      console.error('Error getting user profile:', error);
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
      return false;
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

  // Get user role
  getUserRole: async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      return userDoc.exists() ? userDoc.data().role : null;
    } catch (error) {
      console.error('Error getting user role:', error);
      throw error;
    }
  },
};

export default Auth;
