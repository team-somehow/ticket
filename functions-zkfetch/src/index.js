// src/index.js
const functions = require('firebase-functions');
const express = require('express');
const { getSpotifyData } = require('./spotify');

const app = express();
app.use(express.json());

app.post('/get_spotify_data', async (req, res) => {
    const { access_token, artist_name } = req.body;
    if (!access_token || !artist_name) {
        return res.status(400).json({ error: 'Missing access_token or artist_name' });
    }

    try {
        const data = await getSpotifyData(access_token, artist_name);
        if (!data) {
            return res.status(404).json({ error: 'Artist not found' });
        }
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

 