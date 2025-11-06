# Troubleshooting Guide for TikTok Shopee Automation Tool

## Common Issues and Solutions

### 1. Video Upload Issues
**Symptoms:** Videos fail to upload to TikTok.

**Possible Causes:**
- The video URL is not publicly accessible.
- The video format is unsupported (ensure it is MP4).
- The video file size exceeds TikTok's limits (check for size restrictions).

**Solutions:**
- Verify that the video URL is accessible by testing it in a browser.
- Convert the video to MP4 format if necessary.
- Compress the video file to reduce its size.

### 2. TikTok API Errors
**Symptoms:** API calls return error codes.

**Common Error Codes:**
- `invalid_param`: Check the parameters being sent in the API request.
- `access_token_invalid`: Refresh the access token and try again.
- `rate_limit_exceeded`: Reduce the frequency of API calls.

**Solutions:**
- Review the API request parameters for correctness.
- Implement token refresh logic in your application.
- Monitor API usage and adjust the call frequency accordingly.

### 3. Shopee Affiliate Link Issues
**Symptoms:** Affiliate links do not track clicks or commissions.

**Possible Causes:**
- The link format is incorrect.
- Cookies or tracking settings are blocking the link.

**Solutions:**
- Ensure the affiliate link is generated correctly and follows the required format.
- Check browser settings for cookie permissions and tracking.

### 4. Caption Generation Problems
**Symptoms:** Captions are not generated or are incorrect.

**Possible Causes:**
- The caption generator script is not functioning properly.
- Input data is missing or incorrectly formatted.

**Solutions:**
- Review the caption generator script for errors.
- Ensure that all required input fields are populated correctly in the Google Sheet.

### 5. Workflow Execution Failures
**Symptoms:** The n8n workflow fails to execute as expected.

**Possible Causes:**
- Incorrect configuration in the n8n workflow.
- Missing credentials or API keys.

**Solutions:**
- Double-check the workflow configuration and ensure all nodes are set up correctly.
- Verify that all necessary credentials are provided and correctly configured in the n8n environment.

## Additional Resources
- Refer to the [API Reference](API_REFERENCE.md) for detailed information on API endpoints and usage.
- Consult the [Setup Guide](SETUP.md) for installation and configuration instructions.
- Review the [Architecture Document](ARCHITECTURE.md) for an overview of the system components and workflows.

## Contact Support
If issues persist, consider reaching out to the support community or forums related to TikTok API and Shopee Affiliate for further assistance.