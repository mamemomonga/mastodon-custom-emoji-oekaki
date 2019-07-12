# マストドン カスタム絵文字でお絵かきツール

マストドンにカスタム絵文字でお絵かきできるツールです。

https://mamemomonga.github.io/mastodon-custom-emoji-oekaki/

# ツールの使い方

[MANUAL.md](./MANUAL.md) をご覧ください。

# 使用ライブラリ

* [JQuery](https://jquery.com/)
* [Font Awesome](http://fontawesome.io/)
* [reset.css](http://meyerweb.com/eric/tools/css/reset/ )

# 開発環境

* Node v8.11.1
* yarn 1.5.1

# ビルド

モジュールインストール

	$ yarn install -D

developmentの実行、http://localhost:3000/var/dev/index.html

	$ NODE_ENV=development yarn run gulp

productionの実行、http://localhost:3000/index.html

	$ NODE_ENV=production yarn run gulp

GitHub Pagesを利用したリリース

productionを一度実行すると index.html が更新されますので、それをコミットしてください。

# License

* [MIT License](./LICENSE)
