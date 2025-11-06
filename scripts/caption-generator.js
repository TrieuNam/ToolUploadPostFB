const fs = require('fs');
const path = require('path');

// Load caption prompts from the JSON file
const promptsFilePath = path.join(__dirname, '../templates/caption-prompts.json');
const prompts = JSON.parse(fs.readFileSync(promptsFilePath, 'utf-8'));

// Function to generate a caption based on a title and additional context
function generateCaption(title, productLink) {
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    const caption = `${randomPrompt} ${title} ${productLink} #ad #affiliate`;
    return caption;
}

// Example usage
const title = "Amazing Product!";
const productLink = "https://shopee.ee/example";
const caption = generateCaption(title, productLink);
console.log(caption);