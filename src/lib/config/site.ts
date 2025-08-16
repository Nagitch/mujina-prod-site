import type { SiteConfig } from '$lib/types/site'

export const site: SiteConfig = {
  author: {
    avatar: '/assets/maskable@512.png',
    bio: 'ちびちびと個人制作しつつ、会社員とフリーランサーを兼業しているプログラマーです🐺<br><strong>狢制作 (Mujina Production)</strong> は屋号、ブランド名、サークル名 etc... を兼ねたものです。',
    name: 'Nagitch',
    status: '🙂',
  },
  description: 'Mujina Production - Nagitch\'s carrer blanding site',
  domain: import.meta.env.URARA_SITE_DOMAIN ?? 'mujina-prod.com',
  header: {
    logo: '/assets/any@192.png',
  },
  lang: 'ja-JP',
  protocol: import.meta.env.URARA_SITE_PROTOCOL ?? (import.meta.env.DEV ? 'http://' : 'https://'),
  subtitle: 'Mujina Production by Nagitch',
  themeColor: '#091540',
  // domain: import.meta.env.a ?? 'localhost:5173',
  title: '狢制作',
}
