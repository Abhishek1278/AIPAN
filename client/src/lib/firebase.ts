import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithRedirect, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, getRedirectResult, User } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, updateDoc, deleteDoc, addDoc } from "firebase/firestore";
import type { Product, InsertProduct, Order, InsertOrder, User as AppUser } from "@shared/schema";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project"}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project"}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "demo-app-id",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

// Auth functions
export const signInWithGoogle = () => {
  return signInWithRedirect(auth, googleProvider);
};

export const handleRedirectResult = () => {
  return getRedirectResult(auth);
};

export const signInWithEmail = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signUpWithEmail = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signOutUser = () => {
  return signOut(auth);
};

// User functions
export const createUserProfile = async (user: User, additionalData?: any) => {
  if (!user) return;
  
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    const { displayName, email } = user;
    const createdAt = new Date();
    
    try {
      await setDoc(userRef, {
        displayName,
        email,
        createdAt,
        isAdmin: false,
        ...additionalData
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  }
  
  return userRef;
};

export const getUserProfile = async (userId: string): Promise<AppUser | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        id: userSnap.id,
        email: data.email,
        name: data.displayName,
        isAdmin: data.isAdmin || false,
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Product functions
export const addProduct = async (product: InsertProduct): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      ...product,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const getProducts = async (): Promise<Product[]> => {
  try {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as Product[];
  } catch (error) {
    console.error('Error getting products:', error);
    return [];
  }
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, 'products'),
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as Product[];
  } catch (error) {
    console.error('Error getting products by category:', error);
    return [];
  }
};

export const getProduct = async (id: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Product;
    }
    return null;
  } catch (error) {
    console.error('Error getting product:', error);
    return null;
  }
};

export const updateProduct = async (id: string, updates: Partial<InsertProduct>) => {
  try {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'products', id));
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Order functions
export const createOrder = async (order: InsertOrder): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...order,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrders = async (): Promise<Order[]> => {
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as Order[];
  } catch (error) {
    console.error('Error getting orders:', error);
    return [];
  }
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as Order[];
  } catch (error) {
    console.error('Error getting user orders:', error);
    return [];
  }
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, {
      status,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};
