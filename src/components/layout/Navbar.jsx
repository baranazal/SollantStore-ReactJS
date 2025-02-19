import { Link } from 'react-router-dom';
import { auth } from '@/services/firebase';
import { useTheme } from '@/features/themes/useTheme';
import { Button } from '@/components/ui/button';
import { Moon, Sun, ShoppingCart, ShieldCheck, Home, Laptop, FileDown, LogOut } from 'lucide-react';
import CartSheet from '@/components/cart/CartSheet';
import PropTypes from 'prop-types';
import lightLogo from '@/assets/light_theme_logo.png';
import darkLogo from '@/assets/dark_theme_logo.png';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { signOut } from 'firebase/auth';
import { User2 } from 'lucide-react';

const Navbar = ({ cart, setCart }) => {
  const { theme, toggleTheme } = useTheme();
  const user = auth.currentUser;
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);

  // Calculate total quantity of items in cart
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Add useEffect to check admin role
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        setIsAdmin(userDoc.exists() && userDoc.data().role === 'admin');
      } else {
        setIsAdmin(false);
      }
    };
    checkAdminStatus();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged out successfully",
        description: "See you next time! 👋",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again.",
      });
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - always visible */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <img
                src={theme === 'dark' ? darkLogo : lightLogo}
                alt="Logo"
                className="h-8 w-8"
              />
              <span className="font-semibold">Sollant Store</span>
            </Link>
          </div>

          {/* Navigation Links - Modified to ensure visibility */}
          <div className="flex items-center gap-6">
            <Link 
              to="/" 
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link 
              to="/electronics" 
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Laptop className="h-5 w-5" />
              <span>Electronics</span>
            </Link>
            <Link 
              to="/digital" 
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <FileDown className="h-5 w-5" />
              <span>Digital</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Cart */}
            <CartSheet cart={cart} setCart={setCart}>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
            </CartSheet>

            {/* Authentication Buttons */}
            {!user ? (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button variant="default" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/profile">
                    <User2 className="h-5 w-5" />
                  </Link>
                </Button>
                {isAdmin && (
                  <Button variant="ghost" size="icon" asChild>
                    <Link to="/admin">
                      <ShieldCheck className="h-5 w-5" />
                    </Link>
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            )}

            {/* Theme Toggle - always visible */}
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  cart: PropTypes.array.isRequired,
  setCart: PropTypes.func.isRequired,
};

export default Navbar;
