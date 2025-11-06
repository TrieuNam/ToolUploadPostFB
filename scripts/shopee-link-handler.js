// This file manages the generation and validation of Shopee affiliate links.

const axios = require('axios');

// Function to generate a Shopee affiliate link
const generateAffiliateLink = async (productUrl, affiliateId) => {
    try {
        const response = await axios.post('https://affiliate.shopee.vn/api/v1/link/generate', {
            product_url: productUrl,
            affiliate_id: affiliateId
        });
        return response.data.link;
    } catch (error) {
        console.error('Error generating affiliate link:', error);
        throw new Error('Failed to generate affiliate link');
    }
};

// Function to validate a Shopee affiliate link
const validateAffiliateLink = (link) => {
    const regex = /^(https?:\/\/)?(shopee\.vn|shopee\.com)\//;
    return regex.test(link);
};

// Export the functions for use in other modules
module.exports = {
    generateAffiliateLink,
    validateAffiliateLink
};