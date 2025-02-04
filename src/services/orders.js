import { collection, getDocs, query, where, addDoc, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '@/services/firebase';

const Orders = {
  createOrder: async (orderData) => {
    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        timestamp: new Date()
      });
      return { id: docRef.id, ...orderData };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  fetchUserOrders: async (userId, lastOrder = null, orderFilter = 'recent', pageSize = 10) => {
    try {
      let q;
      if (lastOrder) {
        q = query(
          collection(db, 'orders'),
          where('userId', '==', userId),
          orderBy(orderFilter === 'recent' ? 'timestamp' : 'total', 'desc'),
          startAfter(lastOrder),
          limit(pageSize)
        );
      } else {
        q = query(
          collection(db, 'orders'),
          where('userId', '==', userId),
          orderBy(orderFilter === 'recent' ? 'timestamp' : 'total', 'desc'),
          limit(pageSize)
        );
      }

      const querySnapshot = await getDocs(q);
      const orders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return {
        orders,
        lastOrder: querySnapshot.docs[querySnapshot.docs.length - 1],
        hasMore: querySnapshot.docs.length === pageSize
      };
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  fetchAllOrders: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching all orders:', error);
      throw error;
    }
  }
};

export default Orders;
