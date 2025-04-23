# Slooze Assignment Backend

This is a role-based backend system for a food ordering application built using **NestJS**, **Prisma**, and *
*PostgreSQL (Supabase)**.

## Features

- JWT Authentication
- Role-Based Access Control (Admin, Manager, Member)
- Country-based data access
- Manage Restaurants, Menus, Orders, and Payments
- Admin-only Payment Method control

---

## Getting Started

### 1. Clone & Install

```code
git clone https://github.com/renji18/slooze_assignment_backend.git
cd slooze_assignment_backend
npm install
```

### 2. Setup Environment Variables

```code
DATABASE_URL=postgresql_db_url
JWT_SECRET=your_jwt_secret
```

### 3. Run Migrations & Seed Data

```code
npm run seed
```

This will run the prisma migrations and seed the database with the following starter template. Running this command is important to load sample data in the database.

```code
addRoles
addCountries
addUsers
addRestaurants
addMenuItems
addPaymentMethod
```

You will get access to sample users, sample restaurants with preset menu.

```code
nick@shield.com
marvel@team.com
cap@team.com
thanos@team.com
thor@team.com
travis@team.com
```

password for all the users is
```code
password123
```

### 4. Start the App

The server should be running on port 8000, if not, please modify the base url in the frontend in src/lib/axios.ts

```code
npm run start:dev
```

## API Endpoints

👉 [Open in Postman](https://www.postman.com/galactic-capsule-507211/workspace/slooze/collection/24589974-f08cdacf-dbe7-417b-80db-20a398f6997e?action=share&creator=24589974&active-environment=24589974-5a6f43b2-e474-43cf-a546-e6ecb7824fac)

> Make sure your backend is running locally at `http://localhost:8000` and your `.env` is configured properly.

### Auth

```code
POST /auth/login
POST /auth/logout
```

### User

```code
GET /user/me
```

### Restaurant & Menu

```code
GET /restaurants
```

### Order

```code
POST /orders/create
POST /orders/checkout/:orderId
DELETE /orders/cancel/:orderId
GET /orders
```

### Payment

```code
POST /payment (ADMIN ONLY)
GET /payment (ADMIN & MANAGER ONLY)
DELETE /payment/:paymentId (ADMIN ONLY)
```