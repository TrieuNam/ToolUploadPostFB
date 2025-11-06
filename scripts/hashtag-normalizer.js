// This script normalizes hashtags to ensure they are formatted correctly and are unique.

function normalizeHashtags(hashtags) {
    const uniqueHashtags = new Set();

    hashtags.forEach(tag => {
        const normalizedTag = tag.trim().toLowerCase();
        if (normalizedTag && !uniqueHashtags.has(normalizedTag)) {
            uniqueHashtags.add(normalizedTag.startsWith('#') ? normalizedTag : `#${normalizedTag}`);
        }
    });

    return Array.from(uniqueHashtags);
}

// Example usage
const inputHashtags = ['#TikTok', 'tiktok', ' #Shopee', 'Shopee', ' #Affiliate', '#affiliate'];
const normalized = normalizeHashtags(inputHashtags);
console.log(normalized); // Output: ['#tiktok', '#shopee', '#affiliate']