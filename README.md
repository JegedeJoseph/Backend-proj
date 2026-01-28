# Mobile App Backend API

A robust Node.js backend API for mobile applications with authentication system.

## Features

- **User Authentication**: Signup, Login, Logout with JWT tokens
- **Token Management**: Access tokens + Refresh tokens for secure sessions
- **Password Security**: bcrypt hashing with salt rounds
- **Input Validation**: Express-validator for request validation
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **MongoDB**: Mongoose ODM for database operations

## Project Structure

```
src/
├── config/
│   ├── index.js          # Configuration variables
│   └── database.js       # MongoDB connection
├── controllers/
│   └── authController.js # Authentication logic
├── middleware/
│   ├── auth.js           # JWT authentication middleware
│   └── errorHandler.js   # Global error handler
├── models/
│   └── User.js           # User model schema
├── routes/
│   ├── index.js          # Main router
│   └── authRoutes.js     # Auth routes
├── utils/
│   └── validators.js     # Input validation rules
└── server.js             # App entry point
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/mobile_app_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d
```

3. Start the development server:
```bash
npm run dev
```

4. For production:
```bash
npm start
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| POST | `/api/auth/logout` | Logout user | Yes |
| POST | `/api/auth/refresh-token` | Refresh access token | No |
| PUT | `/api/auth/profile` | Update profile | Yes |
| PUT | `/api/auth/change-password` | Change password | Yes |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | API health check |

## API Usage Examples

### Signup

```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "isEmailVerified": false,
      "isActive": true,
      "createdAt": "...",
      "updatedAt": "..."
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Protected Routes

Include the access token in the Authorization header:

```http
GET /api/auth/me
Authorization: Bearer <access_token>
```

### Refresh Token

```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Flutter Integration

Example Dart code for using this API:

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class AuthService {
  static const String baseUrl = 'http://YOUR_SERVER_IP:5000/api';
  
  // For Android emulator use: http://10.0.2.2:5000/api
  // For iOS simulator use: http://localhost:5000/api
  
  Future<Map<String, dynamic>> signup({
    required String name,
    required String email,
    required String password,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/signup'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'name': name,
        'email': email,
        'password': password,
      }),
    );
    return jsonDecode(response.body);
  }
  
  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'password': password,
      }),
    );
    return jsonDecode(response.body);
  }
  
  Future<Map<String, dynamic>> getProfile(String accessToken) async {
    final response = await http.get(
      Uri.parse('$baseUrl/auth/me'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $accessToken',
      },
    );
    return jsonDecode(response.body);
  }
}
```

## Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Optional: validation errors array
}
```

## Security Features

- Password hashing with bcrypt (12 salt rounds)
- JWT tokens with configurable expiration
- Refresh token rotation
- Account deactivation support
- Input validation and sanitization
- CORS configured for mobile apps

## License

ISC
