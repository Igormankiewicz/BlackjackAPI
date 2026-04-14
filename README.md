# BlackjackAPI

A simple client and server for playing multiplayer blackjack.

## Overview

This project provides a complete multiplayer blackjack experience, featuring a custom Node.js backend and a React/TypeScript frontend. It supports multiple game rooms, real-time-like game state synchronization, and a fully functional simulated deck where cards are drawn uniquely per game session (no duplicate cards can exist across players in the same game).

## Technologies Used

- **Backend**: Node.js, Express
- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Database**: PostgreSQL (managed via pgAdmin or standard Postgres tools)
- **Authentication**: bcrypt for password hashing

## Features

- User Authentication (Register/Login)
- Lobby system allowing up to 3 players per room
- Unique card deck per game (cards cannot be drawn more than once)
- Standard Blackjack rules (Aces count as 1 or 11, Blackjack/Busts detected)
- Dynamic database tables for tracking turns and points per room

## How to Play

- **Objective:** Beat the other players by getting a hand value as close to 21 as possible without going over (busting).
- **Card Values:** Number cards are worth their face value. Face cards (J, Q, K) are worth 10. Aces are worth 1 or 11.
- **Actions:** 
  - **Draw:** Take another card to increase your hand value.
  - **Stop:** Keep your current hand and end your turn.
- **Winning:** The player with the highest score that is 21 or under wins the game.

## Lobby Management (Creating & Joining)

### How to Make a Room (Host)
1. Go to the main Menu.
2. Click the blue **"+ Create New Room"** button.
3. The server automatically creates your room and redirects you to the game table.
4. Wait for other players to join. You can "Close Room" when the game finishes to clean up server resources.

### How to Join a Room (Player)
1. Look at the **"Active Rooms"** section on the main Menu.
2. Find an available room (max 3 players) labeled with the host's name (e.g., "user1's room").
3. Click the **"Join Table"** button on the room card.
4. You will instantly enter the lobby. You can **"Leave Room"** at any point. If everyone leaves, the room deletes itself.

## API Endpoints

### User Management
- `POST /register`: Register a new user
  *Example Usage:*
  ```json
  // Request Payload
  {
    "login": "player1",
    "password": "password123"
  }
  ```
  ```json
  // Response Payload (200 OK)
  {
    "message": "User registered successfully",
    "user": { "id": 1, "login": "player1" }
  }
  ```
- `POST /login`: Authenticate an existing user
  *Example Usage:*
  ```json
  // Request Payload
  {
    "login": "player1",
    "password": "password123"
  }
  ```
  ```json
  // Response Payload (200 OK)
  {
    "message": "Login successful",
    "user": { "id": 1, "login": "player1" }
  }
  ```

### Game Management
- `POST /createLobby`: Create a new game room
  *Example Usage:*
  ```json
  // Request Payload
  {
    "hostId": 1,
    "hostName": "player1"
  }
  ```
  ```json
  // Response Payload (200 OK)
  {
    "message": "Room created successfully",
    "roomId": 15
  }
  ```
- `POST /joinLobby`: Join an existing game room
  *Example Usage:*
  ```json
  // Request Payload
  {
    "playerId": 2,
    "playerName": "player2",
    "roomId": 15
  }
  ```
  ```json
  // Response Payload (200 OK)
  {
    "message": "Joined room 15 successfully"
  }
  ```
- `POST /playTurn`: Perform a game action (draw a card or stop)
  *Example Usage:*
  ```json
  // Request Payload
  {
    "playerId": 42,
    "roomId": 15,
    "action": "draw" // or "stop"
  }
  ```
  ```json
  // Response Payload (200 OK)
  {
    "message": "Card drawn",
    "card": "10hearts",
    "score": 21,
    "busted": false,
    "finished": true,
    "isGameOver": false
  }
  ```
- `GET /roomState/:roomId`: Fetch the current status of all players in a room
  *Example Usage:*
  ```json
  // Response Payload (200 OK)
  {
    "players": [
      { "id": 1, "name": "player1", "points": 14, "cards": "10hearts,4spades", "haslost": false }
    ],
    "isGameOver": false,
    "hostId": 1
  }
  ```
- `GET /displayRooms`: Retrieve a list of all active rooms
  *Example Usage:*
  ```json
  // Response Payload (200 OK)
  {
    "rooms": [
      { "roomId": "15", "hostId": 1, "hostName": "player1", "playerCount": 2 }
    ]
  }
  ```
- `POST /closeGame`: End a game session and clean up database tables
  *Example Usage:*
  ```json
  // Request Payload
  {
    "roomId": 15
  }
  ```
  ```json
  // Response Payload (200 OK)
  {
    "message": "Game closed successfully"
  }
  ```

## Setup Instructions

1. Configure your PostgreSQL database.
2. Create a `.env` file in the `server` directory with your database credentials (e.g., `DB_LOGIN`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME`).
3. Run `npm install` in both the `server` and `client` directories.
4. Start the backend with `node server.js` from the `server` directory.
5. Start the frontend with `npm run dev` from the `client` directory.

## Database Schema

The core structure consists of a `users` table and a `rooms` table.
During active games, dynamic tables (`turns_<roomId>`) are generated to track player hands and scores.

<img width="705" height="619" alt="obraz" src="https://github.com/user-attachments/assets/dec234d1-cfaa-4aae-8607-7ce62feba6c6" />

