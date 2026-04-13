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

## API Endpoints

### User Management
- `POST /register`: Register a new user
- `POST /login`: Authenticate an existing user

### Game Management
- `POST /createLobby`: Create a new game room
- `POST /joinLobby`: Join an existing game room
- `POST /playTurn`: Perform a game action (draw a card or stop)
- `POST /closeGame`: End a game session and clean up database tables
- `GET /roomState/:roomId`: Fetch the current status of all players in a room
- `GET /displayRooms`: Retrieve a list of all active rooms

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

