import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from '@/services/firebase';

// Auth
import Login from '@/components/auth/Login';
import Signup from '@/components/auth/Signup';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Layout
import Navbar from '@/components/layout/Navbar';

// Cart & Checkout
import PayPalCheckout from '@/components/cart/PayPalCheckout';

// Profile
import Profile from '@/components/profile/Profile';

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
import { Toaster } from '@/components/ui/toaster';

// Admin Routes Component
const AdminRoutes = () => (
  <Routes>
    <Route path="/" element={<AdminDashboard />} />
    <Route path="/orders" element={<AdminOrders />} />
    <Route path="/products" element={<AdminProducts />} />
  </Routes>
);

function App() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: quantity }];
    });
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Navbar cart={cart} setCart={setCart} />
          <div className="container mx-auto py-4">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route 
                path="/electronics" 
                element={<Electronics addToCart={(product, quantity) => addToCart(product, quantity)} />} 
              />
              <Route 
                path="/digital" 
                element={<Digital addToCart={(product, quantity) => addToCart(product, quantity)} />} 
              />
              <Route path="/terms" element={<Terms />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Routes */}
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute user={user}>
                    <PayPalCheckout cart={cart} total={calculateTotal()} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute user={user}>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute user={user} requiredRole="admin">
                    <AdminRoutes />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;