const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const Storage = {
  uploadImage: async (file) => {
    if (!file) return null;
    
    try {
      // Get file extension
      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      // Extended list of supported file types and extensions
      const allowedTypes = [
        // Standard MIME types
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/tiff',
        'image/bmp',
        'image/x-icon',
        'image/vnd.microsoft.icon',
        'image/svg+xml',
        'image/avif',
        'image/heic',
        'image/heif',
        // Additional SVG MIME types
        'application/svg+xml',
        // File extensions (as fallback)
        'svg',
        'jpg',
        'jpeg',
        'png',
        'gif',
        'webp',
        'tiff',
        'bmp',
        'ico',
        'avif',
        'heic',
        'heif'
      ];

      // Check both MIME type and file extension
      if (!allowedTypes.includes(file.type) && !allowedTypes.includes(fileExtension)) {
        throw new Error(
          'Invalid file type. Supported formats: JPG, JPEG, PNG, GIF, WEBP, TIFF, BMP, ICO, SVG, AVIF, HEIC/HEIF'
        );
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('File size must be less than 10MB');
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      // Add specific handling for SVGs
      if (fileExtension === 'svg' || file.type.includes('svg')) {
        formData.append('resource_type', 'raw');
      }

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload image');
      }

      const data = await response.json();

      return {
        url: data.secure_url,
        path: data.public_id
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  deleteImage: async (publicId) => {
    if (!publicId) return;

    try {
      // Note: Deleting images requires backend implementation for security
      // You would typically call your backend API to handle deletion
      console.log('Image deletion would happen here:', publicId);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }
};

export default Storage; 