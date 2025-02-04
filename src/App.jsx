import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import PropTypes from 'prop-types';

// Auth
import { auth } from '@/services/firebase';
import Login from '@/components/auth/Login';
import Signup from '@/components/auth/Signup';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Layout
import Navbar from '@/components/layout/Navbar';

// Cart & Checkout
import Cart from '@/components/cart/Cart';
import PayPalCheckout from '@/components/cart/PayPalCheckout';

// Profile
import Profile from '@/components/profile/Profile';
import OrderHistory from '@/components/profile/OrderHistory';

// Admin
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminOrders from '@/components/admin/AdminOrders';
import AdminProducts from '@/components/admin/AdminProducts';

// Pages
import Home from '@/pages/Home';
import Electronics from '@/pages/Electronics';
import Digital from '@/pages/Digital';
import Terms from '@/components/terms/Terms';

// Features
import { ThemeProvider } from '@/features/themes/ThemeProvider';

// UI Components
import { Toaster } from '@/components/ui/toaster';

// New wrapper component to handle authentication redirection
const AuthWrapper = ({ children }) => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // If not logged in and trying to access any route other than login/signup/terms, redirect to login
  if (!user && !['/login', '/signup', '/terms'].includes(location.pathname)) {
    return <Navigate to="/login" replace />;
  }

  // If logged in and trying to access login/signup, redirect to home
  if (user && ['/login', '/signup'].includes(location.pathname)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

AuthWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: product.quantity || 1 }];
    });
  };

  return (
    <ThemeProvider>
      <Router>
        <AuthWrapper>
          <div className="min-h-screen flex flex-col">
            <Navbar user={user} handleLogout={handleLogout} cart={cart} setCart={setCart} />
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/electronics" element={<Electronics addToCart={addToCart} />} />
                <Route path="/digital" element={<Digital addToCart={addToCart} />} />
                <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute user={user}>
                      <PayPalCheckout total={calculateTotal()} cart={cart} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute user={user}>
                      <OrderHistory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute user={user} requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <ProtectedRoute user={user} requiredRole="admin">
                      <AdminOrders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/products"
                  element={
                    <ProtectedRoute user={user} requiredRole="admin">
                      <AdminProducts />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/terms" element={<Terms />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute user={user}>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
            <Toaster />
          </div>
        </AuthWrapper>
      </Router>
    </ThemeProvider>
  );
}

export default App;