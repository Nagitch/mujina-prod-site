<script lang="ts">
  import { onMount } from 'svelte'
  import { fade, fly } from 'svelte/transition'
  import { page } from '$app/stores'
  import { browser } from '$app/environment'
  import { goto } from '$app/navigation'
  import { posts as storedPosts, tags as storedTags } from '$lib/stores/posts'
  import { title as storedTitle } from '$lib/stores/title'
  import Head from '$lib/components/head.svelte'
  import Footer from '$lib/components/footer.svelte'
  import Post from '$lib/components/post_card.svelte'

  let allPosts: Urara.Post[]
  let allTags: string[]
  let loaded: boolean
  let [posts, tags, years]: [Urara.Post[], string[], number[]] = [[], [], []]

  storedTitle.set('')

  $: storedPosts.subscribe(storedPosts => (allPosts = storedPosts.filter(post => !post.flags?.includes('unlisted'))))

  $: storedTags.subscribe(storedTags => (allTags = storedTags as string[]))

  $: if (posts.length > 1) years = [new Date(posts[0].published ?? posts[0].created).getFullYear()]

  $: if (tags) {
    posts = !tags ? allPosts : allPosts.filter(post => tags.every(tag => post.tags?.includes(tag)))
    if (browser && window.location.pathname === '/')
      goto(tags.length > 0 ? `?tags=${tags.toString()}` : `/`, { replaceState: true })
  }

  onMount(() => {
    if (browser) {
      if ($page.url.searchParams.get('tags')) tags = $page.url.searchParams.get('tags')?.split(',') ?? []
      loaded = true
    }
  })
</script>

<Head />

<div class="flex flex-col flex-nowrap justify-center xl:flex-row xl:flex-wrap h-feed">
  <div class="flex-none w-full max-w-screen-xl mx-auto xl:mx-0">
    <main
      class="flex flex-col relative bg-base-100 md:bg-transparent md:gap-8 z-10"
      itemprop="mainEntityOfPage"
      itemscope
      itemtype="https://schema.org/Blog">
      <h1 class="mx-auto font-normal md:font-medium text-2xl">ポートフォリオ Portfolio</h1>
      <h2 class="ml-4 font-medium text-base md:text-xl leading-8 md:leading-3">略歴</h2>
      <div class="mx-6 my-2">
        <p class="indent-4">
          システムエンジニア・プログラマー経験約10年以上。組み込み(マイコン)、デスクトップアプリケーション、業務系Web、エンタメ(ゲーム、メタバースプラットフォーム)の領域でそれぞれ現場経験あり。
          多様かつ多数の案件に参入し一定の成果と評価を得てきた実績があります。
        </p>
        <p class="indent-4">
          直近数年間では業務系Webまたはエンタメ系案件の参加が多いです。
          バックエンド・フロントエンド両方とも、システムのたたき台から設計・実装した経験あり。
          <br />
          十分な裁量がある現場において、要件を最短かつ合理的に満たすような動き方を得意とします。
        </p>
        <p class="indent-4">
          小規模開発でのリーディング、案件費用見積もりの経験あり。また副業の並行経験あり（直近では休止中）。余暇での個人制作も常時並行しており成果物が多数あります。
        </p>
      </div>

      <h2 class="ml-4 font-medium text-base md:text-xl leading-8 md:leading-3">スキルセット</h2>
      <h3 class="ml-4 font-medium text-base md:text-ml leading-8 md:leading-3">業務系Web</h3>
      <div class="mx-6">
        <ul class="list-disc ml-4">
          <li>PHP, バックエンドフレームワーク</li>
          <ul class="list-disc ml-4">
            <li>Laravel</li>
            <li>Zend Framework</li>
          </ul>
          <li>NodeJS</li>
          <li>JavaScript, フロントエンド</li>
          <ul class="list-disc ml-4">
            <li>TypeScript</li>
            <li>React</li>
            <li>Next</li>
            <li>CSS</li>
          </ul>
          <li>DBMS, インフラ等</li>
          <ul class="list-disc ml-4">
            <li>SQL (Postgres, MySQL)</li>
            <li>Firebase</li>
            <li>AWS</li>
            <li>Nginx</li>
          </ul>
        </ul>
      </div>
      <h3 class="ml-4 font-medium text-base md:text-ml leading-8 md:leading-3">ゲーム・エンタメ系</h3>
      <div class="mx-6">
        <ul class="list-disc ml-4">
          <li>Unity (Unity C#)</li>
          <ul class="list-disc ml-4">
            <li>UniRx</li>
            <li>UniTask</li>
          </ul>
          <li>C#, ASP.NET</li>
          <li>リアルタイム通信, Protobuf</li>
          <li>メトリクス解析 Prometheus, Grafana, 時系列DB</li>
        </ul>
      </div>
      <h3 class="ml-4 font-medium text-base md:text-ml leading-8 md:leading-3">組み込み</h3>
      <div class="mx-6">
        <ul class="list-disc ml-4">
          <li>組み込み（マイコン）C</li>
          <li>アセンブラ</li>
          <li>RTOS</li>
          <li>ThreadX</li>
        </ul>
      </div>

      <h2 class="ml-4 font-medium text-base md:text-xl leading-8 md:leading-3">個人制作一覧</h2>
      <div class="mx-6 my-2">
        <p class="indent-4">
          <a href="/">
            <span class="border-b-2 border-slate-200 hover:bg-slate-800 transition-all">
              トップページのビデオを参照してください。
            </span>
          </a>
          （詳細な一覧は作成中）
        </p>
      </div>

      <h2 class="ml-4 font-medium text-base md:text-xl leading-8 md:leading-3">経歴・案件一覧</h2>
      <h3 class="ml-4 font-medium text-base md:text-ml leading-8 md:leading-3">副業 2021/4 - 現在</h3>
      <div class="ml-6 my-4">
        <table class="table-auto border-collapse border border-slate-500">
          <thead>
            <tr>
              <th class="p-2 border border-slate-600">期間</th>
              <th class="p-2 border border-slate-600">案件名</th>
              <th class="p-2 border border-slate-600">概要</th>
              <th class="p-2 border border-slate-600">要スキルセット</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="p-2 border border-slate-600">2023/12 - 2024/3</td>
              <td class="p-2 border border-slate-600">アニメーションコンテンツ向け楽曲制作</td>
              <td class="p-2 border border-slate-600">
                個人制作のアニメーションクリエイター向けに、指定されたテーマに従って楽曲を制作。2曲を納品。
              </td>
              <td class="p-2 border border-slate-600">Ableton Live 作曲 MIDI</td>
            </tr>
            <tr>
              <td class="p-2 border border-slate-600">2021/4 - 2023/08</td>
              <td class="p-2 border border-slate-600">プログラミング教育向けゲーム形式アプリのコンテンツ作成</td>
              <td class="p-2 border border-slate-600">
                ゲーム形式でプログラミングを学習できるアプリケーションの開発。
                すでにリリース済みで、新たに学習する単元ごとのステージ（コンテンツ）作成
                が主業務。ステージ内容の企画提案、ステージに必要な機能実装、まれに、ステージに配置するモデルの作成(Blender)。※下記案件に当たっている間は休止。
              </td>
              <td class="p-2 border border-slate-600">Unity UniRx C# Blender</td>
            </tr>
            <tr>
              <td class="p-2 border border-slate-600">2021/11 - 2021/12</td>
              <td class="p-2 border border-slate-600">上記案件の関連Webサービスの管理画面開発</td>
              <td class="p-2 border border-slate-600">
                キーボードのタイピングを学ぶためのWebサービス（リリース済み）について、学校や生徒を管理する機能の追加開発。
                管理画面について、フロントエンドを叩き台作成から担当。
              </td>
              <td class="p-2 border border-slate-600">JavaScript React NextJS</td>
            </tr>
            <tr>
              <td class="p-2 border border-slate-600">2022/9 - 2022/12</td>
              <td class="p-2 border border-slate-600">上記案件のユーザー向けお知らせ（ニュース）機能開発</td>
              <td class="p-2 border border-slate-600">
                アプリ内でのお知らせ機能の追加開発。お知らせの一覧表示、詳細表示、お知らせの新規作成、編集、削除などの機能を実装。
              </td>
              <td class="p-2 border border-slate-600">Unity JavaScript Django</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h3 class="ml-4 font-medium text-base md:text-ml leading-8 md:leading-3">システム開発会社C 2017/7 - 現在</h3>
      <div class="ml-6">
        <table class="border-collapse border border-slate-500">
          <thead>
            <tr>
              <th class="p-2 border border-slate-600">期間</th>
              <th class="p-2 border border-slate-600">案件名</th>
              <th class="p-2 border border-slate-600">概要</th>
              <th class="p-2 border border-slate-600">要スキルセット</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="p-2 border border-slate-600">2025/05 - 現在</td>
              <td class="p-2 border border-slate-600">建機メンテナンスアプリケーション刷新</td>
              <td class="p-2 border border-slate-600">
                既存の建機メンテナンスアプリケーションの刷新。Windowsアプリケーション。.NET MAUI、xUnitを利用。
                Web等と比較するとニッチな技術や要件をキャッチアップすることが求められる案件。
              </td>
              <td class="p-2 border border-slate-600">C#, MAUI, xUnit, SQLite</td>
            </tr>
            <tr>
              <td class="p-2 border border-slate-600">2024/11 - 2025/3</td>
              <td class="p-2 border border-slate-600">遊技機メーカー向けシステム開発支援</td>
              <td class="p-2 border border-slate-600">
                パチンコ・パチスロ連携アプリの遊技機履歴等表示機能の別アプリ化。
                バックエンド全般を担当。特有の業務プロセスと仕様理解が求められる案件。
              </td>
              <td class="p-2 border border-slate-600">JavaScript, TypeScript, Node.js, NextJS</td>
            </tr>
            <tr>
              <td class="p-2 border border-slate-600">2023/03 - 現在</td>
              <td class="p-2 border border-slate-600">VR(メタバース)プラットフォームのバックエンドサーバー開発</td>
              <td class="p-2 border border-slate-600">
                顧客企業の現場での作業(SES)。
                可能な限り多数の同時接続数が求められるBtoCサービス。たたき台をリリースしたタイミングから参加。
                積み残しの要件対応、パフォーマンス改善・解析ツール開発の対応あり。
              </td>
              <td class="p-2 border border-slate-600">C# ASP.NET Protobuf リアルタイム通信 時系列DB</td>
            </tr>
            <tr>
              <td class="p-2 border border-slate-600">2022/08 - 2023/02</td>
              <td class="p-2 border border-slate-600">VR/AR作品共有プラットフォームのモバイルアプリ部分の開発</td>
              <td class="p-2 border border-slate-600">
                顧客企業の現場での作業(SES)。フロントエンド(Unity)のアプリ開発。
                たたき台がすでにある状態から参加し、改善要件の担当として業務を実施。
                シェーダープログラミングによるモーフィングアニメーション描画の対応あり。
              </td>
              <td class="p-2 border border-slate-600">Unity C# UniRx UniTask</td>
            </tr>
            <tr>
              <td class="p-2 border border-slate-600">2020/11 - 2022/7</td>
              <td class="p-2 border border-slate-600">大手業務系 Web システム R&D, リプレイス</td>
              <td class="p-2 border border-slate-600">
                顧客企業の現場での作業(SES)。複数の案件に随時対応。
                <ul class="list-disc ml-4">
                  <li>k8sバックエンドのサーバー負荷モニタリングシステム構築(NuxtJS, C3js)</li>
                  <li>
                    位置情報追跡による配送情報管理アプリのバックエンド(Azure Functions, Event Hub)設計、ライブラリ検討、実装
                  </li>
                  <li>オートロックマンション向け置き配対応システム開発(デジタルキーによる解錠)。API、管理サーバー開発</li>
                  <li>Docker による開発環境構築</li>
                </ul>
              </td>
              <td class="p-2 border border-slate-600">Java Spring Boot AWS, Azure Kubernetes(k8s) JavaScript Docker</td>
            </tr>
            <tr>
              <td class="p-2 border border-slate-600">2020/06 - 2020/10</td>
              <td class="p-2 border border-slate-600">大規模IPスマホゲームプロトタイプ制作</td>
              <td class="p-2 border border-slate-600">
                顧客企業の現場での作業(SES)。大規模IPのスマホゲーム案件。本番開発前のプロトタイプ制作。Unity での作業。
                フレンド連携にまつわるバックエンド （環境の叩き台構築～）、フロントエン ドを主に担当。他、随時の要件対応。
              </td>
              <td class="p-2 border border-slate-600">Unity UniRx UniTask Chinemachine Firebase</td>
            </tr>
            <tr>
              <td class="p-2 border border-slate-600">2020/01 - 2020/04</td>
              <td class="p-2 border border-slate-600">カジノ系スマホゲームアプリ</td>
              <td class="p-2 border border-slate-600">
                顧客企業の現場での作業(SES)。
                カジノ系スマホゲームアプリ案件。クライアント側のインゲーム外の部分の開発を主に担当。
                担当画面の仕様とデザインモックをもとに設計と実装を担当。
              </td>
              <td class="p-2 border border-slate-600">Unity UniTask Nakama Jenkins</td>
            </tr>
            <tr>
              <td class="p-2 border border-slate-600">2019/05 - 2019/12</td>
              <td class="p-2 border border-slate-600">防災避難支援スマホアプリ</td>
              <td class="p-2 border border-slate-600">
                自社内での作業（受託）。
                養護施設等のスタッフ向けに、災害の予告、また避難施設への経路を示す機能を持つAndroidネイティブアプリとバックエンドの開発。APIサーバーの仕様設計と実装,
                Androidアプリの画面設計と実装
              </td>
              <td class="p-2 border border-slate-600">PHP Laravel Docker SQL Java AndroidStudio</td>
            </tr>
            <tr>
              <td class="p-2 border border-slate-600">2019/04 - 2019/08</td>
              <td class="p-2 border border-slate-600">ビデオ会議システム</td>
              <td class="p-2 border border-slate-600">
                顧客企業の現場での作業(SES)。 営業向けビデオ会議システムの作成。バックエンドの設計と実装。
                フロントエンドの設計と実装。ビデオ通話部分はAgora.ioを利用。
              </td>
              <td class="p-2 border border-slate-600">PHP Laravel Docker SQL JavaScript JQuery ReactJS AgoraSDK</td>
            </tr>
            <tr>
              <td class="p-2 border border-slate-600">2018/11 - 2019/03</td>
              <td class="p-2 border border-slate-600">バルブ検品レポート作成システム</td>
              <td class="p-2 border border-slate-600">
                顧客企業の現場での作業(SES)。 バルブ検品のためのレポート (Word, Excel)
                作成システムの機能追加、また関連システムの新規作成。
                <ul class="list-disc ml-4">
                  <li>仕様策定、顧客折衝</li>
                  <li>設計、実装</li>
                  <li>DLL, API仕様作成</li>
                  <li>リリース、ドキュメント作成、納品作業</li>
                </ul>
              </td>
              <td class="p-2 border border-slate-600">C# .NET Framework VisualStudio NPOI</td>
            </tr>
            <tr>
              <td class="p-2 border border-slate-600">2018/09 - 2018/10</td>
              <td class="p-2 border border-slate-600">中古建機 オークションシステム</td>
              <td class="p-2 border border-slate-600">
                顧客企業の現場での作業(SES)。 中古建機（重機など）の売買システム・ワイヤーフレームを元にした画面実装
              </td>
              <td class="p-2 border border-slate-600">PHP Laravel Docker SQL JavaScript</td>
            </tr>
            <tr>
              <td class="p-2 border border-slate-600">2017/07 - 2018/08</td>
              <td class="p-2 border border-slate-600">医療系Webシステム開発(カルテ管理等)</td>
              <td class="p-2 border border-slate-600">
                顧客企業の現場での作業(SES)。医療系Webシステムの開発業務・バックエンドの設計と実装 ・フロントエンドの設計と実装
              </td>
              <td class="p-2 border border-slate-600">PHP ZendFramework JavaScript</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h3 class="ml-4 font-medium text-base md:text-ml leading-8 md:leading-3">システム開発会社B 2015/05 - 2017/06</h3>
      <div class="ml-6">
        <table class="border-collapse border border-slate-500">
          <thead>
            <tr>
              <th class="p-2 border border-slate-600">期間</th>
              <th class="p-2 border border-slate-600">案件名</th>
              <th class="p-2 border border-slate-600">概要</th>
              <th class="p-2 border border-slate-600">要スキルセット</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="p-2 border border-slate-600">2015/05 - 2017/06</td>
              <td class="p-2 border border-slate-600">プリンター開発</td>
              <td class="p-2 border border-slate-600">
                Wifi通信機能つきフォトプリンター向けの、Web管理機能の実装
                <ul class="list-disc ml-4">
                  <li>無線通信のためのWifiチップの制御</li>
                  <li>プリンター設定のためのWebUI、表示のためのサーバープログラム実装</li>
                  <li>セキュア通信(SSL、TLS、OpenSSL)の実装</li>
                </ul>
              </td>
              <td class="p-2 border border-slate-600">C RTOS ThreadX WireShark SSL/TSL</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h3 class="ml-4 font-medium text-base md:text-ml leading-8 md:leading-3">システム開発会社A 2012/04 - 2015/04</h3>
      <div class="ml-6">
        <table class="border-collapse border border-slate-500">
          <thead>
            <tr>
              <th class="p-2 border border-slate-600">期間</th>
              <th class="p-2 border border-slate-600">案件名</th>
              <th class="p-2 border border-slate-600">概要</th>
              <th class="p-2 border border-slate-600">要スキルセット</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="p-2 border border-slate-600">2012/04 - 2015/04</td>
              <td class="p-2 border border-slate-600">車載機開発</td>
              <td class="p-2 border border-slate-600">
                <ul class="list-disc ml-4">
                  <li>カーオーディオのBluetooth通信制御</li>
                  <li>バージョンアップ機能のためのフラッシュメモリ書き換え機構の実装</li>
                </ul>
              </td>
              <td class="p-2 border border-slate-600">C アセンブラ RTOS</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
    <div
      class:hidden={!loaded}
      class="sticky bottom-0 md:static md:mt-8"
      in:fly={{ x: posts.length + (1 % 2) ? 100 : -100, duration: 300, delay: 500 }}
      out:fly={{ x: posts.length + (1 % 2) ? -100 : 100, duration: 300 }}>
      <div class="divider mt-0 mb-8 hidden lg:flex" />
      <Footer />
    </div>
  </div>
</div>
