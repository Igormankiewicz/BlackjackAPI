require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const { host } = require('pg/lib/defaults');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: process.env.DB_LOGIN,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.connect()
.then(() => console.log('Connected to PostgreSQL successfully!'))
.catch(err => console.error('Connection error', err.stack));


function calculateScore(cardsString) {
    if (!cardsString) return 0;
    
    const cards = cardsString.split(',');
    let total = 0;
    let aces = 0;

    cards.forEach(card => {
        // Extract the value part (everything before the suit name)
        // e.g., "10spades" -> "10", "Qhearts" -> "Q"
        const value = card.replace(/(spades|hearts|diamonds|clubs)/, '');

        if (['J', 'Q', 'K'].includes(value)) {
            total += 10;
        } else if (value === 'A') {
            total += 11;
            aces += 1;
        } else {
            total += parseInt(value);
        }
    });

    // If we busted but have Aces, turn 11s into 1s
    while (total > 21 && aces > 0) {
        total -= 10;
        aces -= 1;
    }

    return total;
}

function getRandomCard() {
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const suits = ['spades', 'hearts', 'diamonds', 'clubs'];
    
    const randomValue = values[Math.floor(Math.random() * values.length)];
    const randomSuit = suits[Math.floor(Math.random() * suits.length)];
    
    return `${randomValue}${randomSuit}`;
}


// ====== user register =====

app.post('/register', async (req, res) => {
    const keys = ["username", "password"] // keys to test
    const {username, password} = req.body // keys from request
    const keysFromRequest = Object.keys(req.body);

    if (keys.length !== 2 || !keysFromRequest.every(key => keys.includes(key))) {
        console.log(req.ip + " | Illegal request")
        return res.status(400).json({error: 'Illegal request'})
    }

    try {
        if(!String(username).length > 100 && !String(password).length > 100) {
            console.log(req.ip + " | Username or password too long")
            return res.status(400).json({error: 'Username or password too long'})
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10)
    
            const result = await pool.query('INSERT INTO users (name, password) VALUES ($1, $2) RETURNING id, name', [username, hashedPassword]) 
            
            console.log(req.ip + " | User created successfully " + result.rows[0])
            return res.status(200).json({
                message: 'User created successfully',
                user: result.rows[0]
            })
        } catch (err) {
            console.log(req.ip + " | User already exists in the database")
            return res.status(400).json({error: 'User already exists in the database'})
        }
        
    } catch (err) {
        console.log(req.ip + " | Parsing to string has failed")
        return res.status(400).json({error: 'Parsing to string has failed'})
    }

})


// ===== user login =====

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const keys = ["username", "password"];
    const keysFromRequest = Object.keys(req.body);

    if (keysFromRequest.length !== 2 || !keysFromRequest.every(key => keys.includes(key))) {
        return res.status(400).json({ error: 'Illegal request' });
    }

    try {
        if (username.length > 100 || password.length > 100) {
            return res.status(400).json({ error: 'Username or password too long' });
        }

        const result = await pool.query('SELECT * FROM users WHERE name = $1', [username]);

        if (result.rows.length === 0) {
            console.log(req.ip + " | Login failed: User not found");
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            console.log(req.ip + " | Login successful for: " + username);
            return res.status(200).json({
                message: 'Login successful',
                user: { id: user.id, name: user.name }
            });
        } else {
            console.log(req.ip + " | Login failed: Wrong password");
            return res.status(401).json({ error: 'Invalid username or password' });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// ===== create lobby =====

app.post('/createLobby', async (req, res) => {
    const { hostId } = req.body;
    const keys = ["hostId"];
    const keysFromRequest = Object.keys(req.body);

    // Validation
    if (keysFromRequest.length !== 1 || !keysFromRequest.every(key => keys.includes(key))) {
        return res.status(400).json({ error: 'Illegal request' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Start Transaction

        // 1. Insert the room and get the generated ID
        // Note: player2Id and player3Id will remain NULL for now
        const roomResult = await client.query(
            'INSERT INTO rooms ("player1Id") VALUES ($1) RETURNING id',
            [hostId]
        );
        
        const roomId = roomResult.rows[0].id;
        const turnTableName = `turns_${roomId}`;

        // 2. Create the dynamic turns table
        // SQL identifiers (table names) can't be parameterized with $1, 
        // so we use a template literal. Since roomId is a DB-generated integer, this is safe.
        await client.query(`
            CREATE TABLE ${turnTableName} (
                id SERIAL PRIMARY KEY,
                playerId INTEGER,
                hasLost BOOLEAN DEFAULT FALSE,
                points INTEGER DEFAULT 0,
                cards VARCHAR(200)
            )
        `);

        // 3. Update the room with the turnTableId (storing the table name)
        await client.query(
            'UPDATE rooms SET "turnTableId" = $1 WHERE id = $2',
            [turnTableName, roomId]
        );

        const cardString = getRandomCard() + "," + getRandomCard()

        await client.query(
            `INSERT INTO ${turnTableName} ("playerid", "points", "cards") VALUES ($1, $2, $3)`, [hostId, calculateScore(cardString), cardString]
        )

        await client.query('COMMIT'); // Save changes

        res.status(201).json({ 
            message: 'Lobby created successfully', 
            roomId, 
            turnTable: turnTableName 
        });

    } catch (err) {
        await client.query('ROLLBACK'); // Undo everything if an error occurs
        console.error('Error creating lobby:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release(); // Return the connection to the pool
    }
});

// ===== user makes a move =====

app.post('/playTurn', async (req, res) => {
    const { playerId, roomId, action } = req.body; // action: 'draw' or 'stop'
    const tableName = `turns_${roomId}`;

    const client = await pool.connect();

    try {
        // 1. Get current player status
        const playerQuery = await client.query(
            `SELECT cards, hasLost FROM ${tableName} WHERE playerId = $1`,
            [playerId]
        );

        if (playerQuery.rows.length === 0) {
            return res.status(404).json({ error: "Player not found in this room" });
        }

        let { cards, haslost } = playerQuery.rows[0];

        if (haslost) {
            return res.status(400).json({ error: "Player has already lost/finished" });
        }

        if (action === 'draw') {
            const newCard = getRandomCard();
            // Append the card: if empty, just the card; otherwise, add a comma
            const updatedCards = cards ? `${cards},${newCard}` : newCard;
            const newScore = calculateScore(updatedCards);
            const busted = newScore > 21;

            // 2. Update the database
            await client.query(`
                UPDATE ${tableName} 
                SET cards = $1, points = $2, hasLost = $3 
                WHERE playerId = $4`,
                [updatedCards, newScore, busted, playerId]
            );

            return res.json({ 
                message: busted ? "Busted!" : "Card drawn", 
                card: newCard, 
                score: newScore, 
                busted 
            });

        } else if (action === 'stop') {
            // Player decides to stay with their current score
            // We can treat hasLost as "Finished" or add a new 'stayed' column
            await client.query(`UPDATE ${tableName} SET hasLost = true WHERE playerId = $1`, [playerId]);
            return res.json({ message: "Player stayed" });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    } finally {
        client.release();
    }
});

// ===== user joins a lobby =====

app.post('/joinLobby', async (req, res) => {
    const { playerId, roomId } = req.body;
    const keys = ["playerId", "roomId"];
    const keysFromRequest = Object.keys(req.body);

    // Validation
    if (keysFromRequest.length !== 2 || !keysFromRequest.every(key => keys.includes(key))) {
        return res.status(400).json({ error: 'Illegal request' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Check if the room exists and find an empty slot
        const roomResult = await client.query(
            'SELECT "player1Id", "player2Id", "player3Id", "turnTableId" FROM rooms WHERE id = $1 FOR UPDATE',
            [roomId]
        );

        if (roomResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Room not found' });
        }

        const room = roomResult.rows[0];
        let slotToUpdate = null;

        // Check if player is already in the room
        if (room.player1Id === playerId || room.player2Id === playerId || room.player3Id === playerId) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Player already in this lobby' });
        }

        // Determine which slot is available
        if (room.player2Id === null) {
            slotToUpdate = 'player2Id';
        } else if (room.player3Id === null) {
            slotToUpdate = 'player3Id';
        } else {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Lobby is full' });
        }

        // 2. Update the room table with the new player
        await client.query(
            `UPDATE rooms SET "${slotToUpdate}" = $1 WHERE id = $2`,
            [playerId, roomId]
        );

        // 3. Initialize the player in the turns table
        const turnTableName = room.turnTableId;
        const cardString = getRandomCard() + "," + getRandomCard();
        const initialScore = calculateScore(cardString);

        await client.query(
            `INSERT INTO ${turnTableName} ("playerid", "points", "cards") VALUES ($1, $2, $3)`,
            [playerId, initialScore, cardString]
        );

        await client.query('COMMIT');

        res.status(200).json({
            message: 'Joined lobby successfully',
            roomId,
            cards: cardString,
            score: initialScore
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error joining lobby:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
});

// ===== close game and cleanup =====

app.post('/closeGame', async (req, res) => {
    const { roomId } = req.body;

    if (!roomId) {
        return res.status(400).json({ error: 'Room ID is required' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Fetch room details to get the turn table name
        const roomResult = await client.query(
            'SELECT "turnTableId" FROM rooms WHERE id = $1',
            [roomId]
        );

        if (roomResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Room not found' });
        }

        const tableName = roomResult.rows[0].turnTableId;

        // 2. Check if all active players are finished (hasLost = true)
        // We check if there are any players who HAVEN'T finished yet
        const statusCheck = await client.query(`SELECT id FROM ${tableName} WHERE hasLost = false`);

        if (statusCheck.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ 
                error: 'Cannot close game: Some players are still playing',
                remainingPlayers: statusCheck.rows.length 
            });
        }

        // 3. Drop the dynamic turns table
        // Note: Using template literals for table names is safe here as it comes from our DB
        await client.query(`DROP TABLE IF EXISTS ${tableName}`);

        // 4. Remove the room from the rooms table
        await client.query('DELETE FROM rooms WHERE id = $1', [roomId]);

        await client.query('COMMIT');

        res.status(200).json({ 
            message: `Game ${roomId} closed and resources cleaned up successfully.` 
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error closing game:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
});

// ===== displaying all avaliable rooms =====

app.get('/displayRooms', async (req, res) => {
    const result = await pool.query('SELECT * FROM rooms') 
            
    console.log(req.ip + " | got data")
    return res.status(200).json({
        roomsData: result.rows
    })
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}`)})