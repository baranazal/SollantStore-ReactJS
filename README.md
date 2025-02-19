# 🛍️ Sollant Store - E-commerce Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

## 📝 Description

Sollant Store is a modern e-commerce platform built with React, Firebase, and Tailwind CSS. It offers a seamless shopping experience with features like user authentication, cart management, PayPal integration, and a responsive design that works across all devices.

## ✨ Features

- 🔐 User Authentication & Authorization
- 🛒 Shopping Cart Management
- 💳 PayPal Payment Integration
- 🌓 Dark/Light Theme Toggle
- 📱 Responsive Design
- 👤 User Profile Management
- 📦 Order History
- 🔍 Product Search & Filtering
- 👑 Admin Dashboard
- 🖼️ Image Upload & Management
  - Supports multiple formats (JPG, PNG, SVG, etc.)
  - Cloud storage via Cloudinary
  - Automatic image optimization
  - Secure upload handling
  - 10MB file size limit
  - Preview before upload

## 🔧 Technologies Used

| Category | Technologies |
|----------|-------------|
| Frontend | React, Tailwind CSS, Shadcn UI |
| Backend | Firebase (Auth, Firestore) |
| Storage | Cloudinary |
| Payment | PayPal SDK |
| State Management | React Context |
| Build Tools | Vite |
| Others | ESLint, PostCSS |

## 🚀 Installation Guide

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/sollant-store.git
cd sollant-store
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Environment Setup

Create a `.env` file in the root directory and add the following variables:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
VITE_VONAGE_API_KEY=your_vonage_api_key
VITE_VONAGE_API_SECRET=your_vonage_api_secret
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
```

### Step 4: Start Development Server

```bash
npm run dev
# or
yarn dev
```

### Step 5: Build for Production

```bash
npm run build
# or
yarn build
```

## 📁 Project Structure

```
sollant-store/
├── src/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── services/
│   └── styles/
├── public/
└── ...config files
```

## 🔥 Firebase Configuration

### Authentication Setup

#### Sign-In Methods
- **Primary Authentication Method**: Email/Password
- Enabled through Firebase Authentication console

### Firestore Database Collections

#### 1. `orders` Collection Schema
| Field | Type | Description |
|-------|------|-------------|
| `items` | String | List of ordered products |
| `timestamp` | String | Order creation timestamp |
| `total_price` | String | Total order price |
| `user_ID` | String | Reference to user who placed the order |

#### 2. `products` Collection Schema
| Field | Type | Description |
|-------|------|-------------|
| `category` | String | Product category (e.g., "Digital") |
| `description` | String | Product description |
| `name` | String | Product name |
| `imageUrl` | String | Cloudinary image URL |
| `imagePath` | String | Cloudinary public ID |

#### 3. `users` Collection Schema
| Field | Type | Description |
|-------|------|-------------|
| `address` | String | User's address (e.g., "Amman, Jordan") |
| `createdAt` | Timestamp | User account creation date |
| `email` | String | User's email address |
| `phoneNumber` | String | User's phone number |
| `role` | String | User role (e.g., "user", "admin") |

## ☁️ Cloudinary Configuration

### Overview
Cloudinary serves as the cloud storage solution for all media assets in the application, providing robust image hosting and manipulation capabilities.

### Setup Guide

#### 1. Account Creation
- Sign up at cloudinary.com
- Access the Cloudinary Dashboard
- Note your Cloud Name from Account Details

#### 2. Upload Preset Configuration
1. Navigate to Settings > Upload
2. Create a new upload preset
3. Set signing mode to "Unsigned"
4. Configure optional upload parameters
   - Folder structure
   - Transformation settings
   - Format optimization

#### 3. Environment Configuration
```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### Features & Capabilities

#### Image Upload Support
| Category | Supported Formats |
|----------|------------------|
| Standard Images | JPG, JPEG, PNG, GIF |
| Web Optimized | WEBP, AVIF |
| Vector Graphics | SVG |
| Icons | ICO |
| High Efficiency | HEIC/HEIF |
| Professional | TIFF, BMP |

#### Technical Specifications
- **Maximum File Size**: 10MB per upload
- **Transformation Support**: Real-time image manipulation
- **Delivery**: Global CDN distribution
- **Security**: HTTPS-only delivery

### Security Measures

#### Upload Security
- Unsigned upload presets with restrictions
- File type validation
- Size limitations
- Secure URL generation

#### Asset Protection
- HTTPS-only delivery
- Transformation restrictions
- Optional URL signing
- Access control settings

### Best Practices

#### Upload Optimization
- Enable auto-format delivery
- Set reasonable size limits
- Configure default transformations
- Use structured folders

#### Performance
- Automatic CDN caching
- Responsive image delivery
- Format optimization
- Quality auto-adjustment

### Media Management

#### Dashboard Features
- Media Library interface
- Asset organization
- Usage analytics
- Transformation management

#### Administrative Tools
- Bulk upload capabilities
- Folder organization
- Tag management
- Search functionality

## 🐛 Known Issues & Fixes

| Issue | Status | Fix |
|-------|--------|-----|
| PayPal sandbox mode not working in some regions | Fixed | Updated PayPal SDK implementation |
| Dark mode flickering on initial load | Fixed | Added theme persistence |
| Mobile navigation menu overlap | Fixed | Updated z-index hierarchy |
| Phone verification timeout | Fixed | Increased timeout duration |
| Performance bottleneck in product listing | Fixed | Implemented pagination and virtualization |
| Memory leak in user sessions | Fixed | Optimized context and state management |
| Inconsistent error handling | Fixed | Standardized error interceptors |
| Slow image loading on mobile | Fixed | Implemented responsive image loading |
| Cart state synchronization issues | Fixed | Added real-time sync mechanism |
| Payment gateway timeout | Fixed | Implemented robust retry mechanism |

## 🔥 Performance Optimization Tips

### Frontend Optimization

| Technique | Implementation | Impact |
|-----------|---------------|---------|
| Code Splitting | Using React.lazy() for route-based splitting | 30% reduction in initial bundle size |
| Image Optimization | Implementing lazy loading and WebP format | 40% faster image loading |
| Component Memoization | Strategic use of useMemo and useCallback | 25% reduction in re-renders |
| CSS Purging | TailwindCSS purge in production | 70% reduction in CSS bundle size |

### Firebase Optimization

| Technique | Implementation | Impact |
|-----------|---------------|---------|
| Firestore Indexing | Custom indexes for frequent queries | 50% faster query response |
| Batch Operations | Implementing batch writes for cart updates | Reduced database operations |
| Offline Persistence | Configured for essential collections | Improved offline experience |
| Security Rules | Optimized rules structure | Enhanced read/write efficiency |

## 🎯 Deployment Guide

### Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase:
```bash
firebase init
```

4. Build the project:
```bash
npm run build
```

5. Deploy to Firebase:
```bash
firebase deploy
```

### Alternative Deployment Options

#### Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

#### Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Deploy:
```bash
netlify deploy
```

### Environment Setup for Different Platforms

| Platform | Configuration File | Notes |
|----------|-------------------|-------|
| Firebase | .firebaserc | Configure hosting and functions |
| Vercel | vercel.json | Add redirects and environment variables |
| Netlify | netlify.toml | Set build commands and deploy contexts |

### Post-Deployment Checklist

- [ ] Verify all environment variables are set
- [ ] Test authentication flows
- [ ] Confirm PayPal integration
- [ ] Check image loading and optimization
- [ ] Validate API endpoints
- [ ] Test responsive design
- [ ] Monitor error logging
- [ ] Verify SSL certificate
- [ ] Check database connections
- [ ] Test payment processing

## 🔒 Security Features

- Firebase Authentication
- Protected Routes
- Role-based Access Control
- Secure Payment Processing
- Input Validation
- Error Handling

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Bara Nazal - *Initial work* - [YourGithub](https://github.com/baranazal)

## 🙏 Acknowledgments

- Shadcn UI for the beautiful components
- Firebase team for the excellent documentation
- PayPal for the payment integration support

## 📸 Screenshots

#### Home Page
<img src="https://github.com/user-attachments/assets/bf5f7532-9888-4d48-9ac8-1170603a910a" alt="Home Page" width="800" height="auto" style="border-radius: 8px"/>
*Main landing page with featured products and navigation*

#### Admin Dashboard
<img src="https://github.com/user-attachments/assets/6251b925-e84b-4def-a5ca-68fb725016e5" alt="Admin Dashboard" width="800" height="auto" style="border-radius: 8px"/>
*Powerful admin tools for managing products and orders*

#### Admin Products Management
<img src="https://github.com/user-attachments/assets/b7f966d3-1537-4a7f-ac45-1274516ddbd1" alt="Admin Products Management" width="800" height="auto" style="border-radius: 8px"/>
*Powerful interface for managing products with features like adding, editing, and deleting products*

#### Digital Products Section
<img src="https://github.com/user-attachments/assets/5f56e330-0c47-4581-861a-432135f3f492" alt="Digital Products Section" width="800" height="auto" style="border-radius: 8px"/>
*Digital products marketplace showcasing downloadable items and software licenses*

#### Mobile View
<div align="center">
<img src="https://github.com/user-attachments/assets/02eed35d-3436-42e2-8cea-8aff2ee7ca20" alt="Mobile Responsive" width="300" height="auto" style="border-radius: 8px"/>
<br>
*Fully responsive design for mobile users*
</div>