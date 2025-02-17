# Flashcard Learning App with Leitner System

A MERN stack application that implements the Leitner System for efficient flashcard learning through spaced repetition.

## Features

- Create and manage flashcards
- Leitner System implementation for spaced repetition
- Box-based progression system
- Review scheduling based on performance
- Clean and intuitive user interface
- Dark mode support
- JWT Authentication

## Tech Stack

- **Frontend:**
  - React
  - Axios for API calls
  - Tailwind CSS for styling
  - Framer Motion for animations
  - React Router for navigation

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - JWT for authentication

## Project Structure

```
flashcard-app/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # Context providers
│   │   ├── hooks/        # Custom hooks
│   │   ├── pages/        # Page components
│   │   └── utils/        # Utility functions
│   └── public/           # Static files
│
└── server/                # Backend Node.js/Express application
    ├── controllers/      # Route controllers
    ├── models/          # Mongoose models
    ├── routes/          # Express routes
    ├── middleware/      # Custom middleware
    └── utils/           # Utility functions
```

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/[your-username]/ALFREDTASK.git
   cd ALFREDTASK
   ```

2. Install dependencies:
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables:
   Create `.env` files in both client and server directories with the necessary environment variables.

4. Start the application:
   ```bash
   # Start server (from server directory)
   npm run dev

   # Start client (from client directory)
   npm start
   ```

## Leitner System Implementation

The app implements the Leitner System, a flashcard-based learning technique that uses spaced repetition. Here's how it works:

1. New flashcards start in Box 1
2. Correctly answered cards move to the next box
3. Incorrectly answered cards return to Box 1
4. Each box has a different review interval:
   - Box 1: Daily
   - Box 2: Every 2 days
   - Box 3: Every 4 days
   - Box 4: Every 8 days
   - Box 5: Every 16 days

## API Endpoints

- `POST /api/flashcards` - Create a new flashcard
- `GET /api/flashcards` - Get all flashcards
- `PUT /api/flashcards/:id` - Update flashcard
- `DELETE /api/flashcards/:id` - Delete flashcard
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

## Contributing

This project was created as part of an internship task. Feel free to use it as a reference or starting point for your own projects.

## License

MIT License 