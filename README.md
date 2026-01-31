# Campus App Backend API

A comprehensive Node.js/Express backend API for a campus mobile application featuring past questions, news, wallet, timetable, tasks, and more.

## 🚀 Features

- **Authentication**: Login, Register, Password reset, Session management
- **Past Questions**: Upload, fetch, download/purchase with earnings system
- **Campus News**: Article management with categories and search
- **User Profile**: Profile management with avatar upload
- **Wallet System**: Balance tracking, transactions, withdrawals, earnings
- **Subscription Plans**: Free, Basic, Premium, Enterprise tiers
- **Timetable**: Personal class schedule management
- **Task/Planner**: Task CRUD with priorities and categories
- **Dashboard Analytics**: Study streaks, stats, and insights
- **Notifications**: In-app notification system

## Project Structure

```
src/
├── config/
│   ├── index.js          # Configuration variables
│   └── database.js       # MongoDB connection
├── controllers/
│   ├── authController.js
│   ├── dashboardController.js
│   ├── newsController.js
│   ├── notificationController.js
│   ├── pastQuestionController.js
│   ├── profileController.js
│   ├── subscriptionController.js
│   ├── taskController.js
│   ├── timetableController.js
│   ├── walletController.js
│   └── index.js
├── middleware/
│   ├── auth.js           # JWT authentication middleware
│   ├── errorHandler.js   # Global error handler
│   ├── upload.js         # File upload middleware
│   └── index.js
├── models/
│   ├── Download.js
│   ├── News.js
│   ├── Notification.js
│   ├── PastQuestion.js
│   ├── StudyStats.js
│   ├── Subscription.js
│   ├── Task.js
│   ├── Timetable.js
│   ├── User.js
│   ├── Wallet.js
│   └── index.js
├── routes/
│   ├── authRoutes.js
│   ├── dashboardRoutes.js
│   ├── newsRoutes.js
│   ├── notificationRoutes.js
│   ├── pastQuestionRoutes.js
│   ├── subscriptionRoutes.js
│   ├── taskRoutes.js
│   ├── timetableRoutes.js
│   ├── userRoutes.js
│   ├── walletRoutes.js
│   └── index.js
├── utils/
│   └── validators.js     # Input validation rules
└── server.js             # App entry point
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
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

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| POST | `/api/auth/logout` | Logout user | Yes |
| POST | `/api/auth/refresh-token` | Refresh access token | No |
| PUT | `/api/auth/profile` | Update profile | Yes |
| PUT | `/api/auth/change-password` | Change password | Yes |

### Past Questions (`/api/past-questions`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/past-questions` | Fetch all (with filters) | No |
| GET | `/api/past-questions/:id` | Get single question | No |
| POST | `/api/past-questions/upload` | Upload past question | Yes |
| POST | `/api/past-questions/:id/download` | Download/purchase | Yes |
| POST | `/api/past-questions/:id/rate` | Rate a question | Yes |
| GET | `/api/past-questions/user/my-uploads` | Get user's uploads | Yes |

### Campus News (`/api/news`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/news` | Fetch articles | No |
| GET | `/api/news/categories` | Get categories | No |
| GET | `/api/news/:id` | Get single article | No |
| POST | `/api/news` | Create article | Yes |
| PUT | `/api/news/:id` | Update article | Yes |
| DELETE | `/api/news/:id` | Delete article | Yes |

### User Profile (`/api/users`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/profile` | Get profile | Yes |
| PUT | `/api/users/profile` | Update profile | Yes |
| POST | `/api/users/avatar` | Upload avatar | Yes |

### Wallet (`/api/wallet`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/wallet/balance` | Get balance | Yes |
| GET | `/api/wallet/transactions` | Get transactions | Yes |
| POST | `/api/wallet/withdraw` | Withdraw funds | Yes |
| POST | `/api/wallet/fund` | Fund wallet | Yes |

### Subscription (`/api/subscription`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/subscription/plans` | Get plans | No |
| GET | `/api/subscription` | Get user subscription | Yes |
| POST | `/api/subscription/subscribe` | Subscribe | Yes |
| POST | `/api/subscription/cancel` | Cancel | Yes |

### Timetable (`/api/timetable`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/timetable` | Get timetable | Yes |
| PUT | `/api/timetable` | Update timetable | Yes |
| GET | `/api/timetable/today` | Get today's schedule | Yes |
| POST | `/api/timetable/item` | Add schedule item | Yes |
| PUT | `/api/timetable/item/:itemId` | Update item | Yes |
| DELETE | `/api/timetable/item/:itemId` | Delete item | Yes |

### Tasks (`/api/tasks`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tasks` | Get all tasks | Yes |
| GET | `/api/tasks/upcoming` | Get upcoming | Yes |
| GET | `/api/tasks/overdue` | Get overdue | Yes |
| GET | `/api/tasks/:id` | Get single task | Yes |
| POST | `/api/tasks` | Create task | Yes |
| PUT | `/api/tasks/:id` | Update task | Yes |
| DELETE | `/api/tasks/:id` | Delete task | Yes |

### Dashboard (`/api/dashboard`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/dashboard/stats` | Get stats | Yes |
| GET | `/api/dashboard/analytics` | Get analytics | Yes |
| POST | `/api/dashboard/study-session` | Log session | Yes |

### Notifications (`/api/notifications`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/notifications` | Get all | Yes |
| GET | `/api/notifications/unread-count` | Get unread count | Yes |
| PUT | `/api/notifications/read-all` | Mark all read | Yes |
| DELETE | `/api/notifications/clear-all` | Clear all | Yes |
| PUT | `/api/notifications/:id/read` | Mark as read | Yes |
| DELETE | `/api/notifications/:id` | Delete | Yes |

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

## 🚀 Deployment to Render

### Option 1: Using Blueprint (Recommended)

1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New" → "Blueprint"
4. Connect your GitHub repository
5. Render will detect the `render.yaml` file and configure automatically
6. Set the following environment variables in Render:
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `CLIENT_URL` - Your frontend URL

### Option 2: Manual Deployment

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: campus-app-api
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables:
   - `NODE_ENV=production`
   - `MONGODB_URI=<your-mongodb-atlas-uri>`
   - `JWT_SECRET=<generate-a-secure-secret>`
   - `JWT_EXPIRE=30d`
   - `CLIENT_URL=<your-frontend-url>`

### MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Add `0.0.0.0/0` to IP whitelist (for Render)
5. Get your connection string and add it as `MONGODB_URI`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | Secret for JWT tokens | Required |
| `JWT_EXPIRE` | JWT expiration time | `30d` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:3000` |

## License

ISC
