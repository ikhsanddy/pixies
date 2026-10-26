import { defineConfig } from 'vitepress'

export const shared = defineConfig({
    rewrites: {
        'en/:rest*': ':rest*'
    },

    title: 'Pixies',

    lastUpdated: true,
    cleanUrls: true,
    metaChunk: true,
    ignoreDeadLinks: [
        /^http:\/\/localhost/
    ],

    /* prettier-ignore */
    head: [
        ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],
        ['meta', { name: 'theme-color', content: '#1C2232' }],
        ['meta', { property: 'og:type', content: 'website' }],
        ['meta', { property: 'og:locale', content: 'en' }],
        ['meta', { property: 'og:title', content: 'Pixies | Self-hosted speedtest analysis software' }],
        ['meta', { property: 'og:site_name', content: 'Pixies' }]
    ],
    themeConfig: {
        logo: '/logo.png',
        footer: {
            copyright: '© 2026 Pixies',
        },
        search: {
            provider: 'local'
        },
        socialLinks: [
            {icon: 'github', link: 'https://github.com/ikhsanddy/pixies'}
        ],
    }
})