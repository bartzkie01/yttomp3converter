const express = require('express');
const bodyParser = require('body-parser');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static('public'));

// Serve the homepage
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Convert endpoint
app.post('/convert', (req, res) => {
    const youtubeUrl = req.body.youtubeUrl;

    // Check if the URL is empty
    if (!youtubeUrl) {
        return res.status(400).json({ error: 'Please provide a YouTube URL' });
    }

    // Check if the URL is a valid YouTube URL
    if (!ytdl.validateURL(youtubeUrl)) {
        return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    // Set response headers
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'attachment; filename="audio.mp3"');

    // Convert YouTube video to MP3 and send the stream
    ytdl(youtubeUrl, { filter: 'audioonly' })
        .pipe(ffmpeg())
        .format('mp3')
        .pipe(res);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
