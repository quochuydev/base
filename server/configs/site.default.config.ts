const smptConfig = {
    isEnableSmtp: false,
    smtpHost: null,
    smtpSecure: true,
    smtpPort: 465,
    smtpAuthUser: 'your email address like : @',
    smtpAuthpass: 'your email password',
};

export type SmptConfigType = typeof smptConfig;

const config = {
    siteTitle: 'siteTitle',
    siteMetaKeyWords: 'siteMetaKeyWords',
    siteMetaDescription: 'siteMetaDescription',
    siteLogo: '/static/logo.svg',

    siteIcp: 'siteMetaDescription',
    icpGovCn: null,

    github: 'https://github.com/',
    projectGithub: 'https://github.com/',

    siteDomain: process.env.NODE_ENV === 'production' ? 'http://127.0.0.1:3000' : 'http://127.0.0.1:3000',

    ...smptConfig,
};

export type configType = typeof config;

export default config;
