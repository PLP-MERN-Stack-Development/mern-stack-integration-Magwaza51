# MERN Stack Blog Application

A full-stack blog platform built with MongoDB, Express.js, React.js, and Node.js. This application demonstrates seamless integration between front-end and back-end components, including database operations, API communication, and state management.

## 🚀 Features

### Core Features
- **User Authentication**: Registration, login, logout with JWT tokens
- **Blog Management**: Create, read, update, delete blog posts
- **Category System**: Organize posts by categories
- **Comment System**: Users can comment on blog posts
- **User Profiles**: Manage user information and view post statistics
- **Search & Filter**: Find posts by title, content, or category
- **Responsive Design**: Mobile-friendly interface

### Advanced Features
- **Protected Routes**: Authentication-based route protection
- **Role-based Access**: Admin and user roles with different permissions
- **Input Validation**: Both client-side and server-side validation
- **Error Handling**: Comprehensive error handling and user feedback
- **Loading States**: User-friendly loading indicators
- **Pagination**: Efficient data loading with pagination
- **Image Upload**: Support for featured images (extensible)

## 🛠️ Tech Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication tokens
- **Bcrypt**: Password hashing
- **Joi**: Input validation
- **Multer**: File uploads
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing

### Frontend
- **React 18**: UI library
- **Vite**: Build tool and dev server
- **React Router**: Client-side routing
- **React Query**: Data fetching and caching
- **React Hook Form**: Form handling
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **React Hot Toast**: Notifications
- **Axios**: HTTP client

## 📁 Project Structure

```
mern-stack-integration-Magwaza51/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── Auth/       # Authentication components
│   │   │   ├── Layout/     # Layout components
│   │   │   └── UI/         # General UI components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── App.jsx         # Main App component
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   └── vite.config.js
├── server/                 # Express backend
│   ├── middleware/         # Custom middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── server.js          # Main server file
│   └── package.json
├── README.md
└── Week4-Assignment.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PLP-MERN-Stack-Development/mern-stack-integration-Magwaza51.git
   cd mern-stack-integration-Magwaza51
   ```

2. **Set up the server**
   ```bash
   cd server
   npm install
   
   # Copy environment variables
   cp .env.example .env
   
   # Edit .env file with your configurations
   # Required: MONGODB_URI, JWT_SECRET
   ```

3. **Set up the client**
   ```bash
   cd ../client
   npm install
   
   # Copy environment variables
   cp .env.example .env
   
   # Edit .env file if needed (API URL)
   ```

4. **Environment Configuration**
   
   **Server (.env)**:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/mern_blog
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=30d
   CLIENT_URL=http://localhost:3000
   ```
   
   **Client (.env)**:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. **Start the development servers**
   
   **Terminal 1 - Server**:
   ```bash
   cd server
   npm run dev
   ```
   
   **Terminal 2 - Client**:
   ```bash
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout user

### Post Endpoints
- `GET /api/posts` - Get all posts (with pagination, search, filter)
- `GET /api/posts/:id` - Get single post by ID or slug
- `POST /api/posts` - Create new post (Protected)
- `PUT /api/posts/:id` - Update post (Protected, Owner/Admin)
- `DELETE /api/posts/:id` - Delete post (Protected, Owner/Admin)
- `POST /api/posts/:id/comments` - Add comment to post (Protected)
- `GET /api/posts/search` - Search posts

### Category Endpoints
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category with posts
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)
- `GET /api/categories/stats` - Get category statistics

## 🚀 Deployment

Ready for deployment to platforms like Heroku, Vercel, or Railway. Check the deployment section in the documentation for detailed instructions.

## 🤝 Contributing

This is an educational project. Feel free to fork and improve!

## 📝 License

MIT License - see LICENSE file for details.

---

**Educational Project**: Created for PLP Academy MERN Stack Development Course

This assignment focuses on building a full-stack MERN (MongoDB, Express.js, React.js, Node.js) application that demonstrates seamless integration between front-end and back-end components.

## Assignment Overview

You will build a blog application with the following features:
1. RESTful API with Express.js and MongoDB
2. React front-end with component architecture
3. Full CRUD functionality for blog posts
4. User authentication and authorization
5. Advanced features like image uploads and comments

## Project Structure

```
mern-blog/
├── client/                 # React front-end
│   ├── public/             # Static files
│   ├── src/                # React source code
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   ├── context/        # React context providers
│   │   └── App.jsx         # Main application component
│   └── package.json        # Client dependencies
├── server/                 # Express.js back-end
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   ├── server.js           # Main server file
│   └── package.json        # Server dependencies
└── README.md               # Project documentation
```

## Getting Started

1. Accept the GitHub Classroom assignment invitation
2. Clone your personal repository that was created by GitHub Classroom
3. Follow the setup instructions in the `Week4-Assignment.md` file
4. Complete the tasks outlined in the assignment

## Files Included

- `Week4-Assignment.md`: Detailed assignment instructions
- Starter code for both client and server:
  - Basic project structure
  - Configuration files
  - Sample models and components

## Requirements

- Node.js (v18 or higher)
- MongoDB (local installation or Atlas account)
- npm or yarn
- Git

## Submission

Your work will be automatically submitted when you push to your GitHub Classroom repository. Make sure to:

1. Complete both the client and server portions of the application
2. Implement all required API endpoints
3. Create the necessary React components and hooks
4. Document your API and setup process in the README.md
5. Include screenshots of your working application

## Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Mongoose Documentation](https://mongoosejs.com/docs/) 