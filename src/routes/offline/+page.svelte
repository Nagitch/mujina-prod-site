<script lang='ts'>
  import Head from '#lib/components/head.svelte'
</script>

<Head page={{ title: 'オフライン', path: '/offline/' }} />
<main class='prose urara-prose mx-auto p-8'>
  <h1>このページはオフラインでは開けません</h1>
  <p>接続を確認してから、もう一度開いてください。動画・スライド・外部サービスは保存されません。</p>
  <p>保存済みのページから、引き続き閲覧できます。</p>
  <ul>
    <li><a href='/'>トップ</a></li>
    <li><a href='/blog/'>ブログ一覧と公開記事</a></li>
    <li><a href='/portfolio/'>ポートフォリオ</a></li>
  </ul>
</main>
