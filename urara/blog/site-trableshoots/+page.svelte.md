---
title: '[Vercel][SvelteKit] デプロイに関するトラブルシューティング'
created: 2023-10-01
updated: 2023-10-01
tags:
  - '技術'
  - 'プログラミング'
  - 'SvelteKit'
  - 'Vercel'
---

## favicon が反映されない・とれない

favicon が localhost を参照してしまう、という問題だった。(アプリのコンフィグの問題)
ブラウザのデバッガで特定できる。

## EEXIST エラー でこける (file already exists)

```
[urara] error EEXIST: file already exists, mkdir 'src/routes/blog'
```

このようなエラーでコケる場合は、`fs.mkdir` で `recursive` オプションを指定する。 `mkdir -p` と同じ動きとなるため。

```js
// fs.mkdir(path)
fs.mkdir(path, { recursive: true })
```

参考: [Node.js create folder or use existing](https://stackoverflow.com/questions/13696148/node-js-create-folder-or-use-existing)

## GitHub Pages (gh-pages ブランチ) のデプロイを抑止する

GitHub Pages (Actions) の設定で main に push すると gh-pages ブランチに勝手にマージされてしまうことにより Vercel もデプロイしてしまう。というのが原因だったのでそれを抑止する。

[対策例: https://github.com/Nagitch/mujina-prod-site/pull/14/files](https://github.com/Nagitch/mujina-prod-site/pull/14/files)

## Sharp Missing In Production エラー

モジュールがインストールされていない・古いだけだった。
（エラーログのメモを忘れた…が、すぐにピンとくるはず）

---

## 更新履歴

- 2024-07-04: 不足していた説明を追加・校正
- 2023-10-01: 初稿
