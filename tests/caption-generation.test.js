const { generateCaption } = require('../scripts/caption-generator');

describe('Caption Generation', () => {
    it('should generate a valid caption with hashtags', async () => {
        const input = {
            title_seed: 'Amazing Product',
            hashtags_base: '#shopping #sale',
            shopee_links: 'https://shopee.vn/product/123456'
        };

        const result = await generateCaption(input);

        expect(result).toHaveProperty('caption');
        expect(result.caption).toBeTruthy();
        expect(result.caption.length).toBeGreaterThan(0);
        expect(result).toHaveProperty('hashtags');
        expect(Array.isArray(result.hashtags)).toBe(true);
        expect(result.hashtags.length).toBeGreaterThan(0);
    });

    it('should include disclosure in the caption', async () => {
        const input = {
            title_seed: 'Amazing Product',
            hashtags_base: '#shopping #sale',
            shopee_links: 'https://shopee.vn/product/123456'
        };

        const result = await generateCaption(input);

        expect(result.caption).toMatch(/#ad|#affiliate/);
    });

    it('should not exceed character limit for caption', async () => {
        const input = {
            title_seed: 'Amazing Product',
            hashtags_base: '#shopping #sale',
            shopee_links: 'https://shopee.vn/product/123456'
        };

        const result = await generateCaption(input);

        expect(result.caption.length).toBeLessThanOrEqual(300);
    });
});