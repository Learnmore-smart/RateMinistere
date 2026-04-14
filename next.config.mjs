/** @type {import('next').NextConfig} */

const nextConfig = {
    basePath: '/rateministere',
    assetPrefix: '/rateministere',
    // delete this line if you are doing prod - never deploy secrets on Github!!!
    // This is all secrets that you will need!!!
    env: {
        GOOGLE_CLIENT_ID: '',
        GOOGLE_CLIENT_SECRET: '',
        MONGODB_URI: '',
        GEMINI_API_KEY: '',
        NEXTAUTH_SECRET: '',
        NEXTAUTH_URL: process.env.NEXTAUTH_URL || '',
        NotAPassword: "",
        discourseSsoUrl: '',
        sso: "",
        BREVO_SMTP_USER: "",
        BREVO_SMTP_KEY: "",
        BREVO_SMTP_SERVER: "",

        BREVO_API_KEY: ""
    },
};

export default nextConfig;