import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Plus, Minus, Trash2, ArrowRight, ShoppingCart } from "lucide-react";
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { auth } from '@/services/firebase';
import { useState } from 'react';

const CartSheet = ({ cart, setCart, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const user = auth.currentUser;

  const updateQuantity = (productId, change) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === productId) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const handleCheckoutClick = () => {
    setIsOpen(false);
    navigate(user ? '/checkout' : '/signup');
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-[90vw] sm:w-[540px] transition-transform duration-500 ease-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>
            Manage your items and proceed to checkout
          </SheetDescription>
        </SheetHeader>
        <div className="mt-8">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <ShoppingCart className="w-12 h-12 text-muted-foreground" />
              <p className="text-muted-foreground">Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-red-500 font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, -1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-4">
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-medium">${calculateTotal()}</span>
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleCheckoutClick}
                >
                  {user ? 'Proceed to Checkout' : (
                    <span className="flex items-center gap-2">
                      Checkout Now <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

CartSheet.propTypes = {
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
  setCart: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default CartSheet; 