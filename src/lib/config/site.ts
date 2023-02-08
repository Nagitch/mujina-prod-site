import type { SiteConfig } from '$lib/types/site'

export const site: SiteConfig = {
  protocol: import.meta.env.URARA_SITE_PROTOCOL ?? import.meta.env.DEV ? 'http://' : 'https://',
  domain: import.meta.env.a ?? 'urara-demo.netlify.app',
  title: 'Mujina Production',
  subtitle: 'by Nagitch',
  lang: 'ja-JP',
  description: 'Mujina Production - Nagitch\'s carrer blanding site',
  author: {
    avatar: '/assets/maskable@512.png',
    name: 'Nagitch',
    status: '🫠',
    bio: '個人制作の計画を練りつつ、会社員とフリーランサーを兼業しているプログラマーです。<br />知らないうちに私の書いたコードが北極に保存されてました。。🐻‍❄️'
  },
  themeColor: '#3D4451'
}
