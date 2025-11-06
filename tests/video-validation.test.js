const { validateVideoUrl } = require('../scripts/video-validator');

describe('Video URL Validation', () => {
    test('should accept valid video URLs', () => {
        const validUrls = [
            'https://yourdomain.com/video.mp4',
            'https://storage.googleapis.com/yourbucket/video.mp4',
            'https://yourdomain.com/path/to/video.mp4'
        ];

        validUrls.forEach(url => {
            expect(validateVideoUrl(url)).toBe(true);
        });
    });

    test('should reject TikTok video URLs', () => {
        const invalidUrls = [
            'https://www.tiktok.com/video/1234567890',
            'https://tiktok.com/@user/video/1234567890'
        ];

        invalidUrls.forEach(url => {
            expect(validateVideoUrl(url)).toBe(false);
        });
    });

    test('should reject URLs without a valid domain', () => {
        const invalidUrls = [
            'ftp://example.com/video.mp4',
            'http://localhost/video.mp4',
            'https://tiktok.com/video.mp4'
        ];

        invalidUrls.forEach(url => {
            expect(validateVideoUrl(url)).toBe(false);
        });
    });

    test('should reject empty URLs', () => {
        expect(validateVideoUrl('')).toBe(false);
    });
});