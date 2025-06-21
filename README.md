# 🍽️ MyRestaurantApp – EasyDine

A cross-platform restaurant reservation app built with React Native frontend and Node.js backend 
using MySQL.

---

## Overview

MyRestaurantApp allows users to browse restaurants, make, update, and delete reservations. 
It supports user authentication for a personalized experience.

---

## Features

- User registration and login (JWT authentication)
- Browse available restaurants
- Make new reservations
- Update or cancel existing reservations
- View user reservation history

---

## Technologies Used

### Frontend
- React Native
- React Navigation
- Axios
- AsyncStorage

### Backend
- Node.js with Express
- MySQL (using mysql2)
- JWT for authentication
- bcrypt for password hashing
- dotenv for environment variables
- cors for cross-origin requests

---

## Getting Started

### Backend Setup

1. Navigate to the backend directory and install dependencies:

    ```bash
    cd RestaurantApp
    npm install
    ```

2. Start the backend server:

    ```bash
    node main.js
    ```

### Frontend Setup

1. Navigate to the frontend directory and install dependencies:

    ```bash
    cd MyRestaurantApp
    npm install
    ```

2. Ensure you have installed:

    - Node.js
    - Expo CLI (`npm install -g expo-cli`)
    - Expo Go app on your mobile device or Android Studio for emulation

3. Start the frontend app:

    ```bash
    npm start
    ```

---

## API Endpoints

| Method | Endpoint                 | Description                     |
|--------|--------------------------|--------------------------------|
| POST   | /api/auth/signup         | User registration              |
| POST   | /api/auth/login          | User login                     |
| GET    | /api/restaurants         | Get list of restaurants        |
| POST   | /api/reservations        | Create reservation             |
| PUT    | /api/reservations/:id    | Update reservation             |
| DELETE | /api/reservations/:id    | Delete reservation             |
| GET    | /api/reservations/check  | Check seat availability        |
| GET    | /api/user/reservations   | Get user reservations (JWT required) |

---

## Notes

- Replace `your-backend-ip` with your backend’s local IP address to enable mobile device connectivity.
- Make sure your backend server and mobile device are connected to the same network for proper communication.

---

## Author

Developed by Marina Bitro.

---

## License

This project is for educational purposes only.






