import { useState } from 'react';
import PropTypes from 'prop-types';
import { db } from '../../services/firebase';
import { doc, setDoc, addDoc, collection } from 'firebase/firestore';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { useToast } from '@/hooks/use-toast';

const ProductForm = ({ product, onSave, onCancel, categories }) => {
  const [name, setName] = useState(product ? product.name : '');
  const [price, setPrice] = useState(product ? product.price : '');
  const [category, setCategory] = useState(product ? product.category : categories[0]);
  const [condition, setCondition] = useState(product ? product.condition : 'New');
  const [description, setDescription] = useState(product ? product.description : '');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const conditions = ['New', 'Used'];
  const showCondition = category === 'Electronics';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Input validation
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price greater than 0.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!name.trim() || !description.trim()) {
      toast({
        title: "Error",
        description: "Name and description cannot be empty.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const productData = {
        name,
        price: parseFloat(price),
        category,
        description,
        ...(category === 'Electronics' && { condition }),
      };

      if (product) {
        // Update existing product
        await setDoc(doc(db, 'products', product.id), productData);
      } else {
        // Add new product
        const docRef = await addDoc(collection(db, 'products'), productData);
        productData.id = docRef.id; // Add the ID to the product data
      }

      // Call onSave with the product data
      onSave(productData);
      
      // Reset form
      if (!product) {
        setName('');
        setPrice('');
        setDescription('');
        setCategory(categories[0]);
        if (category === 'Electronics') {
          setCondition('New');
        }
      }
    } catch (error) {
      console.error('Firestore Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>{product ? 'Edit Product' : 'Add Product'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="product-name" className="block text-sm font-medium">
              Product Name
            </label>
            <Input
              id="product-name"
              type="text"
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="product-price" className="block text-sm font-medium">
              Price
            </label>
            <Input
              id="product-price"
              type="number"
              step="0.01"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="product-category" className="block text-sm font-medium">
              Category
            </label>
            <select
              id="product-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-2 border rounded w-full bg-background text-foreground"
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          {showCondition && (
            <div className="space-y-2">
              <label htmlFor="product-condition" className="block text-sm font-medium">
                Condition
              </label>
              <select
                id="product-condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="p-2 border rounded w-full bg-background text-foreground"
                required
              >
                {conditions.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="product-description" className="block text-sm font-medium">
              Description
            </label>
            <Input
              id="product-description"
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Processing...' : (product ? 'Update' : 'Add') + ' Product'}
            </Button>
            <Button variant="outline" type="button" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

ProductForm.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    condition: PropTypes.string,
    description: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProductForm;