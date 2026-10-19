import { join, parse } from 'node:path'
import { fileURLToPath } from 'node:url'
import Slugger from 'github-slugger'
import { toString } from 'mdast-util-to-string'
import { escapeSvelte } from 'mdsvex'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeSlug from 'rehype-slug'
import remarkFFF from 'remark-fff'
import remarkFootnotes from 'remark-footnotes'
import { codeToHtml } from 'shiki'
import { visit } from 'unist-util-visit'

function remarkUraraFm() {
  return (tree, { data, filename }) => {
    const filepath = filename ? filename.split('/src/routes')[1] : 'unknown'
    const { dir, name } = parse(filepath)
    if (!data.fm)
      data.fm = {}
      // Generate slug & path
    data.fm.slug = filepath
    data.fm.path = join(dir, `/${name}`.replace('/+page', '').replace('.svelte', ''))
    // remark-fff 1.x merges normalized arrays into the input arrays. Keep set-like
    // metadata stable rather than duplicating tags/flags on every compilation.
    for (const key of ['tags', 'flags']) {
      if (Array.isArray(data.fm[key]))
        data.fm[key] = [...new Set(data.fm[key])]
    }
    // Generate ToC
    if (data.fm.toc !== false) {
      const [slugs, toc] = [new Slugger(), []]
      visit(tree, 'heading', (node) => {
        toc.push({
          depth: node.depth,
          slug: slugs.slug(toString(node), false),
          title: toString(node),
        })
      })
      if (toc.length > 0)
        data.fm.toc = toc
      else data.fm.toc = false
    }
  }
}

// Better type definitions needed
function remarkUraraSpoiler() {
  return tree =>
    visit(tree, 'paragraph', (node) => {
      const { children } = node
      const text = children[0].value
      const re = /\|\|(.+?)\|\|/g
      if (re.test(children[0].value)) {
        children[0].type = 'html'
        children[0].value = text.replace(re, (_match, p1) => `<span class="spoiler">${p1}</span>`)
      }
      return node
    })
}

/** @type {import("mdsvex").MdsvexOptions} */
export default {
  extensions: ['.svelte.md', '.md'],
  highlight: {
    highlighter: async (code, lang = 'text') => `{@html \`${escapeSvelte(
      await codeToHtml(code, { lang: lang || 'text', theme: 'material-theme' }),
    )}\` }`,
  },
  layout: {
    _: fileURLToPath(new URL('./src/lib/components/post_layout.svelte', import.meta.url)),
  },
  rehypePlugins: [
    rehypeSlug,
    [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    [
      rehypeExternalLinks,
      {
        rel: ['nofollow', 'noopener', 'noreferrer', 'external'],
        target: '_blank',
      },
    ],
  ],
  remarkPlugins: [
    [
      remarkFFF,
      {
        autofill: {
          path: path => path.replace('/src/routes/', '/urara/'),
          provider: 'fs',
        },
        presets: [],
        strict: {
          media: {
            array: false,
            type: 'string',
          },
        },
        target: 'mdsvex',
      },
    ],
    remarkUraraFm,
    remarkUraraSpoiler,
    [remarkFootnotes, { inlineNotes: true }],
  ],
  smartypants: {
    dashes: 'oldschool',
  },
}
