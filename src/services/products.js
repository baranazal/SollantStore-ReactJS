import { collection, getDocs, query, where, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/services/firebase';

export const fetchProducts = async (category) => {
  try {
    const q = query(
      collection(db, 'products'),
      where('category', '==', category)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const addProduct = async (productData) => {
  try {
    const docRef = await addDoc(collection(db, 'products'), productData);
    return { id: docRef.id, ...productData };
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const productRef = doc(db, 'products', productId);
    const updateData = {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      category: productData.category,
    };

    // Handle image update
    if (productData.image) {
      if (productData.image.remove) {
        // If image was removed, remove the image fields
        updateData.imageUrl = null;
        updateData.imagePath = null;
      } else if (productData.image.url) {
        // If new image or keeping existing image
        updateData.imageUrl = productData.image.url;
        updateData.imagePath = productData.image.path;
      }
    }

    await updateDoc(productRef, updateData);
    return { id: productId, ...updateData };
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    await deleteDoc(doc(db, 'products', productId));
    return productId;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

const Products = {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct
};

export default Products;
