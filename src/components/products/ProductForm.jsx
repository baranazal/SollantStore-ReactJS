import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Storage from '@/services/storage';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ProductForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    price: initialData?.price || '',
    description: initialData?.description || '',
    category: initialData?.category || 'Electronics',
    image: null
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData?.imageUrl || '');
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isImageMarkedForDeletion, setIsImageMarkedForDeletion] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        price: initialData.price || '',
        description: initialData.description || '',
        category: initialData.category || 'Electronics',
        image: initialData.imageUrl ? { url: initialData.imageUrl, path: initialData.imagePath } : null
      });
      setImagePreview(initialData.imageUrl || '');
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Error",
          description: "Please upload a valid image file (JPEG, PNG, GIF, or WEBP)",
          variant: "destructive"
        });
        e.target.value = ''; // Reset input
        return;
      }

      // Validate file size (e.g., 5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast({
          title: "Error",
          description: "File size must be less than 5MB",
          variant: "destructive"
        });
        e.target.value = ''; // Reset input
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setIsImageMarkedForDeletion(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setImagePreview(null);
    setImageFile(null);
    setIsImageMarkedForDeletion(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageData = formData.image;

      // If we're editing and the image was removed
      if (initialData?.imagePath && !imageFile && !imagePreview) {
        imageData = { remove: true };
      }
      // If there's a new image file
      else if (imageFile) {
        const uploadResult = await Storage.uploadImage(imageFile);
        imageData = {
          url: uploadResult.url,
          path: uploadResult.path
        };
      }
      // If we're editing and the image wasn't changed
      else if (initialData?.imageUrl) {
        imageData = {
          url: initialData.imageUrl,
          path: initialData.imagePath
        };
      }

      await onSubmit({
        ...formData,
        image: imageData
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to save product: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Product' : 'Add New Product'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="Electronics">Electronics</option>
              <option value="Digital">Digital</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Product Image</Label>
            <div className="flex flex-col gap-2">
              {(imagePreview || initialData?.imageUrl) && (
                <div className="space-y-2">
                  <div className="relative w-40 h-40">
                    <img
                      src={imagePreview || initialData?.imageUrl}
                      alt="Product preview"
                      className="object-cover w-full h-full rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {isImageMarkedForDeletion && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Image will be permanently deleted when you save the changes
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : initialData ? 'Update' : 'Add'} Product
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

ProductForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.number,
    description: PropTypes.string,
    category: PropTypes.string,
    imageUrl: PropTypes.string,
    imagePath: PropTypes.string,
  }),
};

export default ProductForm;