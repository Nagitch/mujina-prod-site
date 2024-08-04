---
title: 'GitLabをローカルネット上のMac Mini + Dockerでホスティングする'
created: 2024-08-04
updated: 2024-08-04
tags:
  - '技術'
  - 'GitLab'
  - 'Docker'
  - 'OrbStack'
  - '仮想環境'
  - 'Mac Mini'
---

## モチベーション

バージョン管理のエコシステムとしては GitHub がデファクトスタンダードではありますが、プロジェクトによっては少々無理が生じることがあります。

今回の私の場合では、ゲーム開発のプロジェクトで大量のバイナリファイルを扱う見込みですが、 GitHub では [容量制限](https://docs.github.com/ja/billing/managing-billing-for-git-large-file-storage/about-billing-for-git-large-file-storage#purchasing-additional-storage-and-bandwidth) があり、（執筆時点では）ストレージが無料枠で 1 GB のストレージ, 追加購入プランでも 50GiB かつ帯域幅（例えば、ダウンロードで使う通信量を含む）も 50GiB/月までとなっており、そこそこの規模のゲームであれば容易に使い果たしてしまう可能性があります。

一応代替策として [LFS を別のサービス(AWS S3 など)にホスティング](https://alanedwardes.com/blog/posts/serverless-git-lfs-for-game-dev/) したり、 [LFS だけローカルでホスティングする](https://qiita.com/Nagitch/items/cee05ef6526f1cc9e0be) という荒業も可能ですが、AWS を利用するのであれば正しい知識を持ってプロダクションレベルで管理しないと構成がめちゃくちゃになる可能性がありますし（経験あり）、個人レベルではわずかながらコストがかかるのも気になります。

そんなわけで色々考えるのもめんどくさくなり、バックアップ策という意味ではクラウド必須ではないし、 PC が分かれてればいいでしょ…ということで、自宅で少々持て余していた Mac Mini (M2Pro) に GitLab をホスティングすることにしました。

ただし GitHub を捨てるということは草が生えないという点が残念ですが、対策のために労力を費やすモチベーションもそんなにないので、まぁいいかなという感じです。

## 構成

構成を下記に一覧しますが、基本的には Docker で GitLab をホスティングするというだけです。

ただ注意点としては、ハードウェアに関してはそれなりのスペックが必要です。最近の Mac (Mini) であれば十分そうですが、当初 Docker ホスティング機能のある NAS(QNAP, メモリ 8GB ぐらい)を利用しようとしたところ、スペックが足りず断念しました。
[参考：GitLab の動作要件](https://docs.gitlab.com/ee/install/requirements.html)

- ハードウェア: Mac Mini (M2Pro)
- 仮想化バックエンド: OrbStack (Docker Desktop の代替)
- GitLab イメージ: [gitlab/gitlab-ce:latest](https://hub.docker.com/r/gitlab/gitlab-ce)
  - EE(Enterprise Edition) ではなく CE(Community Edition) を利用

## 導入手順

導入手順としてはシンプルで、GitLab のコンテナを起動するだけです。
GitLab のイメージは単一で完全なインフラストラクチャ(DB など)を構成してくれるので、コンテナを起動するだけで動作します。

### docker-compose.yml を作成

[公式のガイド](https://gitlab-docs.creationline.com/ee/install/docker.html#docker-composer%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%9Fgitlab%E3%81%AE%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB) が参考になります。ここの docker-compose.yml をコピーして、適宜編集しています。

Mac 特有の注意点として、例えば 共有 volume はホームディレクトリ以下に配置するなどしないと、書き込み不可能な領域に volume を割り当てようとしてデータが書き込めない(永続化されない)ことがあります。
`~/GitLab/docker-compose.yml` などに配置するといいでしょう。

```yaml
services:
  gitlab:
    container_name: gitlab
    image: 'gitlab/gitlab-ce:latest'
    restart: always
    environment:
      GITLAB_OMNIBUS_CONFIG: |
        external_url 'http://YOUR_PC_HOST.local:8929'
        gitlab_rails['gitlab_shell_ssh_port'] = 2224
        nginx['listen_port'] = 80
    ports:
      - '8929:80'
      - '2224:22'
    volumes:
      - './volumes/config:/etc/gitlab'
      - './volumes/logs:/var/log/gitlab'
      - './volumes/data:/var/opt/gitlab'
```

[Gist にも公開しています。](https://gist.github.com/Nagitch/a54118b612265a2e422b38272952484d)

## 起動・root のログイン

なにはともあれ、`docker-compose up` で立ち上げます。
`-d` オプションをつけて立ち上げる場合もありますが、私はエラーなどが出ていないかログを確認することを推奨する委員会なので軽く確認してほしいです。

他の端末からアクセスする場合は[http://YOUR_HOST_NAME_OR_IP:8929/](http://YOUR_HOST_NAME_OR_IP:8929/) にアクセスして、ローカルネットワークで疎通できていることを確認します。

問題なければ root ユーザでログインします。初期パスワードはコンテナ内で自動生成されている（有効期限つき）ため、例えばこちらの方法で確認します： [GitLab 初期パスワード](https://qiita.com/AbeTetsuya20/items/5aaf5efb31865a9e71b1#%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E5%90%8D)

ログインしたら、パスワードを変更してください。

## データが永続化されていることを確認する

万が一プロジェクトのデータ（issue やレビュー機能を活用してるかもしれませんね）を失うと号泣するしかないので、万全を期してデータが永続化されていることを確認します。

`docker-compose down` でコンテナを停止（滅する）し、`docker-compose up` で再度立ち上げます。
root で更新後のパスワードでログインして、データが残っていることを確認します。

また、 `ls -al ./volumes/data` などを実行して、何らかのデータが残っていることを確認します。

## 所感など

Mac (Mini) を使うと iOS アプリのビルドもできますし、そのような場合に CI/CD が比較的簡単に設定できそうです。ゲーム開発向けのビルド・デプロイサーバーとしての Mac (Mini) の選択肢は結構いいんじゃないかなぁと思いました。

---

## 更新履歴

- 2024-08-04: 初稿
