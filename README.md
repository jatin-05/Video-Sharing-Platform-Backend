# 🎬 Video Sharing Platform Backend (YouTube-Inspired)

This project is afunctional backend for a video-sharing platform, inspired by core features of YouTube. Built with Node.js, Express.js, and MongoDB, it includes secure user authentication, profile management, and subscriber/follower functionality.

## 🚀 Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas), Mongoose
- **Authentication:** JWT (Access & Refresh Tokens stored in HTTP-only cookies)
- **Tools:** Postman, Git, GitHub

## 📦 Features

- 🔐 **Authentication**
  - User registration and login
  - JWT-based access and refresh token system
  - Secure cookies (HTTP-only) for session management

- 👤 **User Management**
  - Update profile details and password
  - Upload/change cover image
  - Retrieve user profile including followers/subscribers

- 🧱 **Clean Code Architecture**
  - Modular structure with controllers, routes, and models
  - Centralized error handling and validation

## 🧪 API Testing

All routes can be tested using [Postman](https://www.postman.com/). 


## 🛠️ Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/jatin-05/Video-Sharing-Platform-Backend
   cd your-repo-name
   npm install


    SET up ENVIRONMENT VARIABLES 
    PORT = 8000
        
    MONGODB_URI = our_mongodb_connection_string

    CORS_ORIGIN= * 

    ACCESS_TOKEN_SECRET = your_access_token_secret
    ACCESS_TOKEN_EXPIRY=1d
    REFRESH_TOKEN_SECRET  =your_refresh_token_secret
    REFRESH_TOKEN_EXPIRY  =10d


    CLOUDINARY_CLOUD_NAME = your_cloudinary_cloud_name
    CLOUDINARY_API_KEY = your_cloudinary_api_key
    CLOUDINARY_API_SECRET =  your_cloudinary_api_key 


    Run the server 
    npm run dev 