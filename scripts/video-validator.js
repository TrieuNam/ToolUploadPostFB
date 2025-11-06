const { URL } = require('url');

function validateVideoUrl(videoUrl) {
    try {
        const parsedUrl = new URL(videoUrl);
        
        // Check if the URL is from a valid domain
        const validDomains = ['yourdomain.com', 's3.amazonaws.com', 'drive.google.com'];
        if (!validDomains.includes(parsedUrl.hostname)) {
            return {
                valid: false,
                message: 'Invalid domain. Only specific domains are allowed.'
            };
        }

        // Check if the URL has the correct format
        if (!videoUrl.endsWith('.mp4')) {
            return {
                valid: false,
                message: 'Invalid video format. Only .mp4 files are accepted.'
            };
        }

        return {
            valid: true,
            message: 'Video URL is valid.'
        };
    } catch (error) {
        return {
            valid: false,
            message: 'Invalid URL format.'
        };
    }
}

// Example usage
const videoUrl = 'https://yourdomain.com/path/to/video.mp4';
const validationResult = validateVideoUrl(videoUrl);
console.log(validationResult);