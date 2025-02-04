import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const Products = ({ category, addToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, 'products'),
          where('category', '==', category)
        );
        const querySnapshot = await getDocs(q);
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsData);
        // Initialize quantities state for all products
        const initialQuantities = {};
        productsData.forEach(product => {
          initialQuantities[product.id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const updateQuantity = (productId, change) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, prev[productId] + change)
    }));
  };

  const handleAddToCart = (product) => {
    const quantity = quantities[product.id];
    const productWithQuantity = {
      ...product,
      quantity: quantity
    };
    addToCart(productWithQuantity);
    toast({
      title: "🛍️ Added to Cart",
      description: `${quantity}x ${product.name} added to your cart ✨`,
    });
  };

  return (
    <div className="container mx-auto p-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {loading ? (
        <div className="flex justify-center">
          Loading...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <Card key={product.id}>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>${product.price}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {product.description && (
                    <p className="text-sm text-muted-foreground">
                      {product.description}
                    </p>
                  )}
                  {product.condition && (
                    <p className="text-sm">
                      Condition: {product.condition}
                    </p>
                  )}
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(product.id, -1)}
                      disabled={quantities[product.id] <= 1}
                    >
                      -
                    </Button>
                    <span>{quantities[product.id]}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(product.id, 1)}
                    >
                      +
                    </Button>
                  </div>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full"
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

Products.propTypes = {
  category: PropTypes.string.isRequired,
  addToCart: PropTypes.func.isRequired,
};

export default Products;