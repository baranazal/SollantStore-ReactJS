import { useEffect, useState, useCallback } from 'react';
import { collection, query, where, getDocs, orderBy, limit, startAfter } from 'firebase/firestore';
import { db, auth } from '@/services/firebase';
import { Button } from '@/components/ui/button'; 
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'; 


const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [lastOrder, setLastOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState('recent');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const user = auth.currentUser;
    if (user) {
      let q;
      if (lastOrder) {
        q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy(filter === 'recent' ? 'timestamp' : 'total', 'desc'),
          startAfter(lastOrder),
          limit(5)
        );
      } else {
        q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy(filter === 'recent' ? 'timestamp' : 'total', 'desc'),
          limit(5)
        );
      }
      const querySnapshot = await getDocs(q);
      const ordersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders((prevOrders) => [...prevOrders, ...ordersList]);
      setLastOrder(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(querySnapshot.docs.length === 5);
    }
    setLoading(false);
  }, [filter, lastOrder]);

  useEffect(() => {
    setOrders([]);
    setLastOrder(null);
    fetchOrders();
  }, [filter, fetchOrders]);

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label className="mr-2">Filter by:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 border rounded bg-background text-foreground"
            >
              <option value="recent">Most Recent</option>
              <option value="total">Total Amount</option>
            </select>
          </div>
          {loading ? (
            <div className="flex justify-center">
              Loading...
            </div>
          ) : (
            <>
              {orders.length === 0 ? (
                <p className="text-center text-muted-foreground">No orders found</p>
              ) : (
                <>
                  <ul className="space-y-4">
                    {orders.map((order) => (
                      <li key={order.id} className="border p-4 rounded-lg">
                        <p>Order ID: {order.id}</p>
                        <p>Total: ${order.total}</p>
                        <p>Date: {order.timestamp.toDate().toLocaleString()}</p>
                        <p>Payment Method: PayPal</p>
                        <p>Status: Shipped</p>
                        <p>Tracking Number: 1234567890</p>
                        <ul className="mt-2">
                          {order.items.map((item) => (
                            <li key={item.id} className="text-sm text-muted-foreground">
                              {item.name} - ${item.price}
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                  {hasMore && (
                    <Button onClick={fetchOrders} className="w-full mt-4">
                      Load More
                    </Button>
                  )}
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderHistory;