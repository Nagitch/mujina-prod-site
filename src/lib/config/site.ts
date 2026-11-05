import type { SiteConfig } from '#lib/types/site.ts'
import { SITE_ORIGIN } from '#lib/utils/urls.ts'

export const site: SiteConfig = {
  author: {
    avatar: '/assets/maskable@512.png',
    bio: 'ちびちびと個人制作しつつ、会社員とフリーランサーを兼業しているプログラマーです🐺<br><strong>狢制作 (Mujina Production)</strong> は屋号、ブランド名、サークル名 etc... を兼ねたものです。',
    name: 'Nagitch',
    status: '🙂',
  },
  description: 'Mujina Production - Nagitch\'s carrer blanding site',
  domain: new URL(SITE_ORIGIN).hostname,
  header: {
    logo: '/assets/any@192.png',
  },
  lang: 'ja-JP',
  protocol: `${new URL(SITE_ORIGIN).protocol}//`,
  subtitle: 'Mujina Production by Nagitch',
  themeColor: '#091540',
  // domain: import.meta.env.a ?? 'localhost:5173',
  title: '狢制作',
}
