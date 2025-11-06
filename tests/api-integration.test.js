const request = require('supertest');
const app = require('../../app'); // Adjust the path to your app

describe('API Integration Tests', () => {
    it('should successfully post a video to TikTok', async () => {
        const response = await request(app)
            .post('/api/tiktok/post')
            .send({
                video_url: 'https://example.com/video.mp4',
                title_seed: 'Amazing Product',
                hashtags_base: '#shopping #sale',
                shopee_links: 'https://shopee.vn/product/12345',
                schedule_time: new Date().toISOString(),
                privacy_level: 'PUBLIC_TO_EVERYONE'
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('publish_id');
        expect(response.body).toHaveProperty('tiktok_post_url');
    });

    it('should return an error for invalid video URL', async () => {
        const response = await request(app)
            .post('/api/tiktok/post')
            .send({
                video_url: 'https://tiktok.com/video/invalid',
                title_seed: 'Invalid Video',
                hashtags_base: '#error',
                shopee_links: 'https://shopee.vn/product/12345',
                schedule_time: new Date().toISOString(),
                privacy_level: 'PUBLIC_TO_EVERYONE'
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    it('should validate Shopee affiliate link', async () => {
        const response = await request(app)
            .post('/api/shopee/validate-link')
            .send({
                link: 'https://shopee.vn/product/12345'
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('isValid', true);
    });

    it('should return an error for invalid Shopee affiliate link', async () => {
        const response = await request(app)
            .post('/api/shopee/validate-link')
            .send({
                link: 'https://invalid-link.com'
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });
});