import { Link, useLocation } from 'react-router-dom';
import { auth } from '@/services/firebase';
import { useTheme } from '@/features/themes/useTheme';
import { Button } from '@/components/ui/button';
import { Moon, Sun, ShoppingCart, ShieldCheck, Home, Laptop, FileDown, LogOut, Menu } from 'lucide-react';
import CartSheet from '@/components/cart/CartSheet';
import PropTypes from 'prop-types';
import lightLogo from '@/assets/light_theme_logo.png';
import darkLogo from '@/assets/dark_theme_logo.png';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { signOut } from 'firebase/auth';
import { NavLink } from 'react-router-dom';
import { User2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = ({ cart, setCart }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const user = auth.currentUser;
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if we're on auth pages (login/signup)
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  // Navigation links configuration
  const navLinks = [
    { path: '/', label: 'Home', icon: <Home className="h-4 w-4" /> },
    { path: '/electronics', label: 'Electronics', icon: <Laptop className="h-4 w-4" /> },
    { path: '/digital', label: 'Digital', icon: <FileDown className="h-4 w-4" /> },
    ...(user ? [{ path: '/orders', label: 'Orders', icon: <ShoppingCart className="h-4 w-4" /> }] : []),
    ...(isAdmin ? [{ path: '/admin', label: 'Admin Panel', icon: <ShieldCheck className="h-4 w-4" /> }] : []),
  ];

  // Add useEffect to check admin role
  useEffect(() => {
    const checkAdminRole = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          setIsAdmin(true);
        }
      }
    };
    checkAdminRole();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged Out!",
        description: "👋 You have been logged out successfully",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Error",
        description: "❌ Failed to log out. Please try again.",
        variant: "destructive",
        duration: 3000,
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

          {/* Navigation Links - only visible when logged in and not on auth pages */}
          {user && !isAuthPage && (
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <NavLink 
                  key={link.path} 
                  to={link.path} 
                  className="nav-link-hover flex items-center gap-2"
                >
                  {link.icon}
                  {link.label}
                </NavLink>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4">
            {user && !isAuthPage && (
              <>
                {/* Mobile Menu Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="md:hidden">
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {navLinks.map((link) => (
                      <DropdownMenuItem key={link.path} asChild>
                        <Link
                          to={link.path}
                          className="flex items-center gap-2 w-full"
                        >
                          {link.icon}
                          {link.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Cart with notification badge */}
                <div className="relative">
                  <CartSheet cart={cart} setCart={setCart}>
                    <Button variant="ghost" size="icon">
                      <ShoppingCart className="h-5 w-5" />
                      {cart.length > 0 && (
                        <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                          {cart.reduce((total, item) => total + item.quantity, 0)}
                        </span>
                      )}
                    </Button>
                  </CartSheet>
                </div>

                {/* Profile Menu */}
                <Link to="/profile">
                  <Button variant="ghost" size="icon">
                    <User2 className="h-5 w-5" />
                  </Button>
                </Link>

                {/* Logout Button */}
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
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
