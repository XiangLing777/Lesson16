const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const port = 3000;

//database config info
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
};

//initialize Express app
const app = express();
//helps app to read JSON
app.use(express.json());

//start the server
app.listen(port, () => {
    console.log('Server running on port', port);
});

// Example Route: Get all cards

app.get('/allpokemon', async (req, res) => {
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM pokemon');
        await connection.end();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error for allpokemon' });
    }
});

app.post('/addpokemon', async (req, res) => {
    const { pokemon_name, pokemon_pic } = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('INSERT INTO pokemon (pokemon_name, pokemon_pic) VALUES (?, ?)', [pokemon_name, pokemon_pic]);
        await connection.end();
        res.status(201).json({ message: 'Pokemon ' + pokemon_name + ' added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not add pokemon ' + pokemon_name });
    }
});

app.put('/updatepokemon/:id', async (req, res) => {
    const { pokemon_name, pokemon_pic } = req.body;
    const pokemonId = req.params.id;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('UPDATE pokemon SET pokemon_name = ?, pokemon_pic = ? WHERE id = ?', [pokemon_name, pokemon_pic, pokemonId]);
        await connection.end();
        res.json({ message: 'Pokemon updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not update pokemon' });
    }
});

app.delete('/deletepokemon/:id', async (req, res) => {
    const pokemonId = req.params.id;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('DELETE FROM pokemon WHERE id = ?', [pokemonId]);
        await connection.end();
        res.json({ message: 'Pokemon deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not delete pokemon' });
    }
});