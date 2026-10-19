import type { FFFAuthor } from 'fff-flavored-frontmatter'

interface IconMetadata {
  icon: string
  link?: string
  rel?: string
  text?: string
}

interface TextMetadata {
  icon?: string
  link?: string
  rel?: string
  text: string
}

export interface SiteConfig {
  author: {
    bio?: string
    metadata?: (IconMetadata | TextMetadata)[]
    status?: string
  } & Omit<FFFAuthor, 'url'>
  /** site description. `<meta name="description" content={site.description}>` */
  description?: string
  /** site domain. for example: `example.com` */
  domain: string
  header?: { logo?: string }
  /** site keywords. `<meta name="keywords" content={site.keywords}>` */
  keywords?: string[]
  /** site lang. `<html lang={site.lang}>` */
  lang?: string
  /** site protocol. for example: `https://` */
  protocol: string
  /** site subtitle. */
  subtitle?: string
  /**
   * for web app manifest only.
   * ```
   * "background_color": {site.themeColor},
   * "theme_color": {site.themeColor}
   * ```
   */
  themeColor?: string
  /** site title. */
  title: string
}
