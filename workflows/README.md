# TikTok & Shopee Automation Workflows

This document provides an overview of the workflows included in the TikTok & Shopee automation project, detailing how to use and configure them effectively.

## Overview

The workflows in this project are designed to automate the process of posting videos on TikTok with integrated Shopee affiliate links. The automation leverages n8n workflow automation to streamline the posting process while ensuring compliance with TikTok's policies.

## Workflow File

- **tiktok-auto-post.json**: This is the main workflow file that contains the configuration for automating TikTok posts. It includes steps for reading data from Google Sheets, validating video URLs, generating captions, and posting videos to TikTok.

## Getting Started

1. **Installation**: Ensure you have n8n installed and configured on your system. Follow the instructions in the `docs/SETUP.md` file for detailed setup steps.

2. **Configuration**: Before running the workflows, configure the necessary credentials and settings in the `config` directory. Make sure to fill in the `credentials.example.json` with your actual API keys and tokens.

3. **Importing Workflows**: Import the `tiktok-auto-post.json` workflow into your n8n instance. You can do this through the n8n UI by navigating to the workflows section and selecting the import option.

4. **Running the Workflow**: Once imported, you can trigger the workflow manually or set it to run on a schedule using the Cron Trigger node included in the workflow.

## Usage

- **Google Sheets**: The workflow reads video data from a Google Sheet. Ensure your sheet is structured according to the specifications outlined in the `docs/ARCHITECTURE.md`.

- **Video Validation**: The workflow includes a step to validate video URLs to ensure they meet TikTok's requirements. This is handled by the `video-validator.js` script.

- **Caption Generation**: Captions for the TikTok posts are generated using the `caption-generator.js` script, which can utilize AI or predefined templates.

- **Posting to TikTok**: The workflow handles the posting of videos to TikTok, ensuring that all necessary parameters are included and that the post complies with TikTok's policies.

## Troubleshooting

If you encounter issues while using the workflows, refer to the `docs/TROUBLESHOOTING.md` for common problems and solutions. Additionally, ensure that all configurations are correctly set up and that you have the necessary permissions for the APIs being used.

## Conclusion

The TikTok & Shopee automation workflows provide a powerful tool for automating video posting and affiliate marketing. By following the setup and usage instructions, you can efficiently manage your TikTok posts and maximize your affiliate marketing efforts with Shopee.