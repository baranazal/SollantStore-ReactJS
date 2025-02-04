import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '@/services/firebase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'; 

const PayPalCheckout = ({ total, cart }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: total,
          },
        },
      ],
    });
  };

  const onApprove = async (data, actions) => {
    setLoading(true);
    try {
      await actions.order.capture();
      const user = auth.currentUser;
      const order = {
        userId: user.uid,
        items: cart,
        total: parseFloat(total),
        timestamp: new Date(),
      };
      await addDoc(collection(db, 'orders'), order);
      setSuccess(true);
    } catch (err) {
      console.error('Error saving order:', err);
      alert('Payment completed, but there was an error saving the order.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        navigate('/orders');
      }, 3000);
    }
  }, [success, navigate]);

  if (success) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p>Thank you for your order. You will be redirected shortly.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Checkout</CardTitle>
        </CardHeader>
        <CardContent>
          <PayPalScriptProvider options={{ 'client-id': import.meta.env.VITE_PAYPAL_CLIENT_ID }}>
            {loading && <p className="text-center">Processing payment...</p>}
            <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
          </PayPalScriptProvider>
        </CardContent>
      </Card>
    </div>
  );
};

PayPalCheckout.propTypes = {
  total: PropTypes.string.isRequired,
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default PayPalCheckout;