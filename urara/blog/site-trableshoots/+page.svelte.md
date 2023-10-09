---
title: '[Vercel][SvelteKit] デプロイに関するトラブルシューティング'
created: 2023-09-23
updated: 2023-09-23
tags:
  - '技術'
  - 'プログラミング'
  - 'SvelteKit'
  - 'Vercel'
---

## Sharp Missing In Production エラー

## favicon が反映されない・とれない

=favicon が localhost を参照してしまう

## EEXIST エラー でこける

```
[urara] error EEXIST: file already exists, mkdir 'src/routes/blog'
```

```js
fs.mkdir(path)
```

```js
fs.mkdir(path, { recursive: true })
```

参考: [Node.js create folder or use existing](https://stackoverflow.com/questions/13696148/node-js-create-folder-or-use-existing)

## GitHub Pages (gh-pages ブランチ) のデプロイを抑止する

https://github.com/Nagitch/mujina-prod-site/pull/14/files

---

## 更新履歴

- 2021-09-23: 初稿
