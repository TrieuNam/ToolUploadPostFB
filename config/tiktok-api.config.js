module.exports = {
    tiktokApi: {
        baseUrl: 'https://open.tiktokapis.com/v2',
        endpoints: {
            publishVideo: '/post/publish/video/init/',
            checkStatus: '/post/publish/status/fetch/',
        },
        scopes: [
            'video.publish',
            'user.info.basic',
        ],
        oauth: {
            authUrl: 'https://www.tiktok.com/v2/auth/authorize/',
            tokenUrl: 'https://open.tiktokapis.com/v2/oauth/token/',
        },
        credentials: {
            clientId: process.env.TIKTOK_CLIENT_ID,
            clientSecret: process.env.TIKTOK_CLIENT_SECRET,
            accessToken: process.env.TIKTOK_ACCESS_TOKEN,
        },
    },
};