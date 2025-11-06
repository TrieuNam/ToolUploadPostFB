# Setup Instructions for TikTok Shopee Automation Tool

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js (version 14 or higher)
- npm (Node Package Manager)
- Access to TikTok and Shopee Affiliate accounts

## Installation

1. **Clone the Repository**

   Open your terminal and run the following command to clone the project:

   ```
   git clone https://github.com/yourusername/tiktok-shopee-automation.git
   ```

2. **Navigate to the Project Directory**

   Change into the project directory:

   ```
   cd tiktok-shopee-automation
   ```

3. **Install Dependencies**

   Run the following command to install the required npm packages:

   ```
   npm install
   ```

## Configuration

1. **Environment Variables**

   Copy the `.env.example` file to `.env` and fill in your API keys and other configuration settings:

   ```
   cp .env.example .env
   ```

   Edit the `.env` file with your preferred text editor.

2. **API Credentials**

   Update the `config/credentials.example.json` file with your TikTok and Shopee API credentials. Rename it to `credentials.json` after editing:

   ```
   cp config/credentials.example.json config/credentials.json
   ```

3. **API Configuration**

   Configure the TikTok and Shopee API settings in their respective config files:

   - `config/tiktok-api.config.js`
   - `config/shopee-affiliate.config.js`

4. **Storage Configuration**

   If you are using AWS S3 or Google Cloud Storage, configure the storage settings in `config/storage.config.js`.

## Running the Project

To start the automation tool, run the following command:

```
npm start
```

This will initiate the n8n workflow for automating TikTok posts with Shopee affiliate links.

## Testing

To run the tests included in the project, use the following command:

```
npm test
```

## Additional Resources

- Refer to the `docs/API_REFERENCE.md` for detailed API usage.
- Check `docs/TROUBLESHOOTING.md` for common issues and solutions.

## Conclusion

You are now set up to use the TikTok Shopee Automation Tool. For further assistance, please refer to the documentation or reach out to the community.