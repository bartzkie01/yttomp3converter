const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');

exports.handler = async (event, context) => {
    try {
        // Extract YouTube URL from the request body
        const { youtubeUrl } = JSON.parse(event.body);

        // Check if the URL is empty
        if (!youtubeUrl) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Please provide a YouTube URL' })
            };
        }

        // Check if the URL is a valid YouTube URL
        if (!ytdl.validateURL(youtubeUrl)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid YouTube URL' })
            };
        }

        // Set response headers
        const headers = {
            'Content-Type': 'audio/mpeg',
            'Content-Disposition': 'attachment; filename="audio.mp3"'
        };

        // Perform YouTube to MP3 conversion
        const audioStream = ytdl(youtubeUrl, { filter: 'audioonly' })
            .pipe(ffmpeg())
            .format('mp3');

        // Return audio stream as binary data
        return {
            statusCode: 200,
            headers,
            body: audioStream
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};
