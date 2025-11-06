module.exports = {
  storage: {
    provider: 'AWS', // Options: 'AWS', 'GCS', 'Local'
    aws: {
      bucketName: 'your-tiktok-videos',
      region: 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    gcs: {
      bucketName: 'your-tiktok-videos',
      projectId: process.env.GCS_PROJECT_ID,
      keyFilename: process.env.GCS_KEY_FILE,
    },
    local: {
      path: './uploads', // Local storage path
    },
  },
};