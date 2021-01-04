export const environment = process.env.NODE_ENV;
export const isDevMode = Object.is(environment, 'development');
export const isProdMode = Object.is(environment, 'production');
export const isTestMode = Object.is(environment, 'test');

export const APP_SERVER = {
    hostname: 'localhost',
    port: '8080',
    environment,
};

export const MONGODB = {
    uri: isDevMode
        ? 'mongodb://localhost:27017/dev'
        : isTestMode
        ? 'mongodb://localhost:27017/test'
        : process.env.MONGODB_URL ||
          `mongodb://${process.env.MONGODB_HOSTNAME || 'localhost'}:${process.env.MONGODB_PORT || '27017'}/blog`,
    username: process.env.MONGODB_USERNAME || '',
    password: process.env.MONGODB_PASSWORD || '',
};

export const TOKEN_SECRET_KEY = 'NODEBLOG/TOKEN';

export const GITHUB_SECRET_KEY = 'Github/TOKEN';

export const ADMIN_USER_INFO = {
    nickName: 'admin',
    email: 'admin@gmail.com',
    location: 'vn',
};

export const RSS = {
    title: 'title',
    link: 'http://vnexpress.net',
    language: 'zh-cn',
    description: 'description',
    maxRssItems: 50,
};

export const API_COMMENT_POST_RATE_LIMIT = {
    windowMs: 60 * 60 * 1000,
    max: 30,
};

export const API_REQUEST_RATE_LIMIT = {
    windowMs: 60 * 60 * 1000,
    max: 5000,
};
