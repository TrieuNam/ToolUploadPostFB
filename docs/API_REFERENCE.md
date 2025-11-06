# API Reference for TikTok and Shopee Integration

## Overview

This document provides a comprehensive reference for the APIs utilized in the TikTok posting automation tool integrated with Shopee affiliate links. It includes details on the endpoints, request methods, parameters, and response formats.

## TikTok API

### 1. Content Posting API

#### 1.1. Initialize Video Post

- **Endpoint:** `POST https://open.tiktokapis.com/v2/post/publish/video/init/`
- **Description:** Initializes a video post on TikTok.
- **Request Body:**
  ```json
  {
    "post_info": {
      "title": "string",
      "privacy_level": "string",
      "disable_duet": "boolean",
      "disable_comment": "boolean",
      "disable_stitch": "boolean",
      "video_cover_timestamp_ms": "integer",
      "brand_content_toggle": "boolean"
    },
    "source_info": {
      "source": "string",
      "video_url": "string"
    }
  }
  ```
- **Response:**
  ```json
  {
    "data": {
      "publish_id": "string"
    },
    "error": {
      "code": "string",
      "message": "string"
    }
  }
  ```

#### 1.2. Check Post Status

- **Endpoint:** `POST https://open.tiktokapis.com/v2/post/publish/status/fetch/`
- **Description:** Checks the status of a published video.
- **Request Body:**
  ```json
  {
    "publish_id": "string"
  }
  ```
- **Response:**
  ```json
  {
    "data": {
      "status": "string",
      "fail_reason": "string",
      "publicaly_available_post_id": ["string"]
    }
  }
  ```

## Shopee Affiliate API

### 2. Affiliate Link Generation

#### 2.1. Generate Deeplink

- **Endpoint:** `POST https://affiliate.shopee.vn/api/v1/deeplink/generate`
- **Description:** Generates an affiliate link for a Shopee product.
- **Request Body:**
  ```json
  {
    "product_url": "string"
  }
  ```
- **Response:**
  ```json
  {
    "data": {
      "affiliate_link": "string"
    },
    "error": {
      "code": "string",
      "message": "string"
    }
  }
  ```

## Error Handling

### Common Error Codes

| Code                  | Description                          |
|-----------------------|--------------------------------------|
| `ok`                  | Request successful                   |
| `invalid_param`      | Invalid parameter in request         |
| `access_token_invalid`| Access token is invalid or expired   |
| `rate_limit_exceeded` | Rate limit exceeded                  |
| `video_not_found`    | Video not found at the specified URL|
| `spam_risk_user`     | User account flagged for spam        |

## Conclusion

This API reference serves as a guide for developers working with the TikTok and Shopee APIs within the automation tool. Ensure to handle errors gracefully and adhere to the API usage policies.