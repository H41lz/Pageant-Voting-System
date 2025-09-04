# 🏆 Pageant Voting System - Complete Setup & Usage Guide

A full-stack web application for managing pageant voting with user authentication, admin controls, and real-time vote tracking.

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [System Usage](#system-usage)
- [API Testing with Postman](#api-testing-with-postman)
- [Troubleshooting](#troubleshooting)

## 🚀 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **XAMPP** (with Apache and MySQL)
- **PHP 8.0+**
- **Composer**
- **Node.js 16+**
- **Git**

## 📥 Installation

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd Pageant-Voting-System
```

### Step 2: Install Backend Dependencies
```bash
composer install
```

### Step 3: Install Frontend Dependencies
```bash
cd Frontend_Altatech
npm install
cd ..
```

## 🗄️ Database Setup

> **⚠️ Important**: If you cloned a repository that includes database files, you may be able to skip some database creation steps. However, if you encounter database errors, follow the fresh database setup below.

### Step 1: Start XAMPP Services
1. Open XAMPP Control Panel
2. Start **Apache** and **MySQL** services
3. Ensure both services show green status

### Step 2: Create Database

#### **Option A: Fresh Database (Recommended for first-time setup)**
1. Open your web browser
2. Navigate to: `http://localhost/phpmyadmin`
3. Click **New** on the left sidebar
4. Enter database name: `pageant_voting`
5. Click **Create**

#### **Option B: Use Existing Database (If database files are in repository)**
1. **Skip this step** - Database already exists
2. **Go directly to Step 4** (Run Migrations and Seeders)
3. **Note**: If you get database errors, use Option A instead

### Step 3: Configure Environment
1. Copy `.env.example` to `.env` (if it exists)
2. Update database configuration in `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pageant_voting
DB_USERNAME=root
DB_PASSWORD=
```

### Step 4: Run Migrations and Seeders
```bash
php artisan migrate
php artisan db:seed
```

This will create:
- Users table
- Candidates table
- Votes table
- Sample admin user: `admin@pageant.com` / `password`
- Sample regular user: `user@pageant.com` / `password`

## ⚙️ Backend Setup

### Step 1: Generate Application Key
```bash
php artisan key:generate
```

### Step 2: Start Laravel Server
```bash
php artisan serve --host=127.0.0.1 --port=8000
```

Your backend API will be available at: `http://127.0.0.1:8000`

## 🎨 Frontend Setup

### Step 1: Start React Development Server
```bash
cd Frontend_Altatech
npm run dev
```

Your frontend will be available at: `http://localhost:5173`

## 🎯 System Usage

### 👤 User Registration & Login

#### Registration
1. Navigate to the registration page
2. Fill in your details:
   - Email address
   - Password (minimum 8 characters)
   - Confirm password
3. Click **Register**
4. You'll be automatically logged in

#### Login
1. Navigate to the login page
2. Enter your credentials:
   - Email address
   - Password
3. Click **Login**
4. You'll be redirected to the voting page

### 🗳️ Voting System

#### Daily Voting Limit
- **Free Vote**: 1 vote per day per user
- **Paid Vote**: Additional votes require payment
- **Vote Reset**: New voting cycle starts daily at midnight

#### How to Vote
1. **View Candidates**: See all candidates with photos and descriptions
2. **Select Candidate**: Click **"Vote Now"** button
3. **Vote Confirmation**: Your vote is recorded immediately
4. **Daily Limit**: After voting, you'll see "You've Voted Today!" message

#### Vote Again (Paid)
1. If you've used your daily free vote
2. Click **"Vote Again (Payment Required)"**
3. Complete payment process
4. Cast additional vote

### 📊 Vote History
1. Click **"Vote History"** button
2. View all your past votes with:
   - Candidate name and photo
   - Vote date and time
   - Vote type (free/paid)

### 🔐 Admin Panel

#### Access Admin Features
1. Login with admin account: Email:`admin@pageant.com`, Password:`password`
2. Navigate to admin panel
3. Access candidate management features

#### Manage Candidates

##### Add New Candidate
1. Click **"Add New Candidate"**
2. Fill in candidate details:
   - **Name**: Candidate's full name
   - **Description**: Brief bio or description
   - **Photo**: Upload candidate image
3. Click **"Save"**

##### Edit Candidate
1. Find the candidate in the list
2. Click **"Edit"** button
3. Modify:
   - Name
   - Description
   - Photo (click "Change Photo")
4. Click **"Save"**

##### Delete Candidate
1. Find the candidate in the list
2. Click **"Delete"** button
3. Confirm deletion

#### View Vote Statistics
- **Free Votes**: Number of free votes per candidate
- **Paid Votes**: Number of paid votes per candidate
- **Total Votes**: Combined vote count
- **Refresh**: Click "Refresh Votes" to update statistics

## 🧪 API Testing with Postman


**⚠️ Important** remove the "2|" when you used the Authorization
### POSTMAN FLOW

#### Step 1: Register
```
POST http://127.0.0.1:8000/api/register
Headers:
   Content-Type: application/json
   Accept: application/json

Body:
{
   "email": "test3@example.com",
   "password": "password123"
}
```

#### Step 2: Logging in to get token
```
POST http://localhost:8000/api/login
Headers:
   Accept: application/json
   Content-Type: application/json

Body:
{
   "email": "admin@pageant.com",
   "password": "password"
}
```

#### Step 3: Logging Out
```
POST http://localhost:8000/api/logout
Headers:
   Authorization: Bearer {{TOKEN THAT YOU GET WHEN YOU LOGGED IN THE ADMIN ACCOUNT}}
   Accept: application/json
   Content-Type: application/json

Body:
{
   "email": "admin@pageant.com",
   "password": "password"
}
```

#### Step 4: Voting Result
```
GET http://localhost:8000/api/results
Headers:
   Accept: application/json
   Content-Type: application/json

Body:
{
   "email": "admin@pageant.com",
   "password": "password"
}
```

#### Step 5: All Candidates
```
GET http://localhost:8000/api/candidates
Headers:
   Accept: application/json
   Content-Type: application/json

Body:
{
   "email": "admin@pageant.com",
   "password": "password"
}
```

#### Step 6: Cast Vote
```
POST http://localhost:8000/api/votes
Headers:
   Authorization: Bearer {{TOKEN THAT YOU GET WHEN YOU LOGGED IN THE ADMIN ACCOUNT}}
   Accept: application/json
   Content-Type: application/json

Body:
{
   "candidate_id": 2,
   "type": "free"
}
```

#### Step 7: Vote History
```
GET http://localhost:8000/api/votes/history
Headers:
   Authorization: Bearer {{TOKEN THAT YOU GET WHEN YOU LOGGED IN THE ADMIN ACCOUNT}}
   Accept: application/json
   Content-Type: application/json

Body:
{
   "candidate_id": 2,
   "type": "free"
}
```

#### Step 8: Create a Candidate
```
POST http://localhost:8000/api/candidates
Headers:
   Authorization: Bearer {{TOKEN THAT YOU GET WHEN YOU LOGGED IN THE ADMIN ACCOUNT}}
   Accept: application/json
   Content-Type: application/json

Body:
{
   "name": "Anne",
   "description": "Beautiful and talented candidate",
   "image_url": "https://example.com/image.jpg"
}
```

#### Step 9: Update a Candidate
```
PUT http://localhost:8000/api/candidates/
Headers:
   Authorization: Bearer {{TOKEN THAT YOU GET WHEN YOU LOGGED IN THE ADMIN ACCOUNT}}
   Accept: application/json
   Content-Type: application/json

Body:
{
   "name": "Anne",
   "description": "Beautiful and talented",
   "updated_at": "2025-08-24T10:49:40.000000Z",
   "created_at": "2025-08-24T10:49:40.000000Z",
   "id": 14
}
```

#### Step 10: Delete a Candidate
```
DELETE http://localhost:8000/api/candidates/14
Headers:
   Authorization: Bearer {{TOKEN THAT YOU GET WHEN YOU LOGGED IN THE ADMIN ACCOUNT}}
   Accept: application/json
   Content-Type: application/json

Body:
{
   "name": "Anne",
   "description": "Beautiful and talented candidate",
   "updated_at": "2025-08-24T10:49:40.000000Z",
   "created_at": "2025-08-24T10:49:40.000000Z",
   "id": 14
}
```

#### Step 11: Get Admin Votes
```
GET http://localhost:8000/api/admin/votes
Headers:
   Authorization: Bearer {{TOKEN THAT YOU GET WHEN YOU LOGGED IN THE ADMIN ACCOUNT}}
   Accept: application/json
   Content-Type: application/json
```


### API Endpoints

#### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

#### Candidates (Admin Only)
- `GET /api/candidates` - List all candidates
- `POST /api/candidates` - Create new candidate
- `PUT /api/candidates/` - Update candidate
- `DELETE /api/candidates/` - Delete candidate

#### Voting
- `GET /api/candidates` - List candidates for voting
- `POST /api/votes` - Cast free vote
- `POST /api/votes/purchase` - Cast paid vote
- `GET /api/votes/history` - Get user's vote history

#### Results
- `GET /api/results` - Get voting results
- `GET /api/candidates/{id}/votes` - Get specific candidate votes

### Postman Collection Setup

1. **Create New Collection**: "Pageant Voting System"
2. **Set Collection Variables**:
   - `base_url`: `http://127.0.0.1:8000/api`
   - `token`: (leave empty, will be set after login)
3. **Add Authorization**:
   - Type: Bearer Token
   - Token: `{{token}}`

## 🚨 Troubleshooting

### Common Issues

#### Database Connection Error
```
SQLSTATE[HY000] [1049] Unknown database 'pageant_voting'
```
**Solution**: Create the database manually in phpMyAdmin

#### Authentication Error
```
{"message": "Unauthenticated."}
```
**Solutions**:
1. Get a fresh token by logging in again
2. Ensure `Authorization: Bearer TOKEN` header is set
3. Check if token has expired

#### Middleware Error
```
Target class [admin] does not exist
```
**Solution**: Restart Laravel server after configuration changes

#### CORS Issues
**Solution**: Ensure Laravel server is running on correct port

#### Image Upload Issues
```
Failed to update candidate. Please try again.
```
**Problem**: Database field size limitations for base64 images
**Solutions**:
1. **Database Updated**: Image field now supports large data
2. **File Storage**: Images are stored as file paths, not base64 strings
3. **Restart Required**: Restart Laravel server after database changes

### Debug Steps

1. **Check Laravel Logs**: `storage/logs/laravel.log`
2. **Verify Database**: Check tables exist in phpMyAdmin
3. **Test API**: Use Postman to test endpoints individually
4. **Check Console**: Browser developer tools for frontend errors

## 🔄 Daily Operations

### Morning Setup
1. Start XAMPP services
2. Start Laravel backend: `php artisan serve`
3. Start React frontend: `npm run dev`

### Evening Shutdown
1. Stop React development server (Ctrl+C)
2. Stop Laravel server (Ctrl+C)
3. Stop XAMPP services

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Ensure services are running on correct ports
4. Check console logs for error messages
