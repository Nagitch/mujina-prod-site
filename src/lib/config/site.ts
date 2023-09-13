import type { SiteConfig } from '$lib/types/site'

export const site: SiteConfig = {
  protocol: import.meta.env.URARA_SITE_PROTOCOL ?? import.meta.env.DEV ? 'http://' : 'https://',
  domain: import.meta.env.a ?? 'mujina-prod.com',
  // domain: import.meta.env.a ?? 'localhost:5173',
  title: '狢制作 by Nagitch',
  subtitle: 'Mujina Production by Nagitch',
  lang: 'ja-JP',
  description: "Mujina Production - Nagitch's carrer blanding site",
  header: {
    logo: '/assets/any@192.png'
  },
  author: {
    avatar: '/assets/maskable@512.png',
    name: 'Nagitch',
    status: '🙂',
    bio: 'ちびちびと個人制作しつつ、会社員とフリーランサーを兼業しているプログラマーです🐺<br><strong>狢制作 (Mujina Production)</strong> は屋号、ブランド名、サークル名 etc... を兼ねたものです。'
  },
  themeColor: '#091540'
}
