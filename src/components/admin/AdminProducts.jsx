import { useState, useEffect, useMemo, useCallback } from 'react';
import { db } from '@/services/firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import ProductForm from '@/components/products/ProductForm';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Products from '@/services/products';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Define available categories
  const categories = ['Electronics', 'Digital'];

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsList);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedProduct) {
        // Update existing product
        const updatedProduct = await Products.updateProduct(selectedProduct.id, {
          name: formData.name,
          price: parseFloat(formData.price),
          description: formData.description,
          category: formData.category,
          ...(formData.image ? { imageUrl: formData.image.url, imagePath: formData.image.path } : {})
        });
        
        setProducts(prevProducts =>
          prevProducts.map(product =>
            product.id === selectedProduct.id ? updatedProduct : product
          )
        );
        
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        // Add new product
        const newProduct = await Products.addProduct({
          name: formData.name,
          price: parseFloat(formData.price),
          description: formData.description,
          category: formData.category,
          imageUrl: formData.image?.url,
          imagePath: formData.image?.path
        });
        
        setProducts(prev => [...prev, newProduct]);
        
        toast({
          title: "Success",
          description: "Product added successfully",
        });
      }
      
      setShowForm(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save product",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedProduct(null);
  };

  const handleDelete = async (productId) => {
    try {
      await deleteDoc(doc(db, 'products', productId));

      // Immediately remove product from list
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );

      toast({
        title: "Success",
        description: "Product deleted successfully",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  // Memoize filtered products based on search and filters
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = !filterCategory || product.category === filterCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, filterCategory, searchQuery]);

  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Manage Products</CardTitle>
          <Button
            onClick={() => {
              setSelectedProduct(null);
              setShowForm(true);
            }}
          >
            Add Product
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="max-w-sm"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="p-2 border rounded bg-background text-foreground"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          {showForm ? (
            <ProductForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              initialData={selectedProduct}
              categories={categories}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {loading ? (
                <div className="flex justify-center">
                  Loading...
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <Card key={product.id}>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">${product.price}</p>
                        <p className="text-sm text-muted-foreground">Category: {product.category}</p>
                        {product.category === 'Electronics' && (
                          <p className="text-sm text-muted-foreground">
                            Condition: {product.condition || 'Not specified'}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          Description: {product.description}
                        </p>
                        <div className="flex gap-2">
                          <Button onClick={() => handleEdit(product)}>
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDelete(product.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProducts;