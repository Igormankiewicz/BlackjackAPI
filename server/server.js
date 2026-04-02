require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const app = express();
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


// ====== user register =====

app.post('/register', async (req, res) => {
    const keys = ["username", "password"]
    const {username, password} = req.body
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



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}`)})