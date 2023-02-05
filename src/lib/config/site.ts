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
    name: 'John Doe',
    status: '🐺',
    bio: 'lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  },
  themeColor: '#3D4451'
}
