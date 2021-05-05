# HomePage

## 設定ファイル 

設定ファイル変更後はWebサーバを再起動する

```
sudo systemctl restart httpd
```

### HTTPステータスがエラーである場合の表示の設定

```
/etc/httpd/conf/httpd.conf

# 4xx Client_Error クライアントエラー
# 401 Unauthorized 認証が必要である
ErrorDocument 401 /error/401_unauthorized.html
# 403 Forbidden 禁止されている
ErrorDocument 403 /error/403_forbidden.php
# 404 Not_Found 見つからない
ErrorDocument 404 /error/404_not_found.html
# 418 418 I'm_a_teapot 私はティーポットです
#ErrorDocument 418 /error/418_im_a_teapot.php
#
# 5xx Server_Error サーバエラー
# 500 Internal_Server_Error サーバ内部エラー
ErrorDocument 500 /error/500_internal_server_error.html
# 503 Service_Unavailable サービス利用不可
ErrorDocument 503 /error/503_service_unavailable.html
```

### サーバー情報の表示の設定

```
/etc/httpd/conf/httpd.conf

# バージョンを表示しない（製品のみ表示する）
ServerTokens ProductOnly
```

### TRACEメソッドの設定

```
/etc/httpd/conf/httpd.conf

# TRACEメソッドのリクエストを受け付けない
TraceEnable off
```

### ヘッダーの設定

```
/etc/httpd/conf/httpd.conf

# レスポンスヘッダーの設定
# X-Powered-Byを設定しない
Header always unset X-Powered-By
# MIMEタイプのスニッフィングを行わない
Header always set X-Content-Type-Options "nosniff"
# ページの埋め込みを禁止する
Header always set X-Frame-Options "DENY"
# CSPを設定する
Header always set Content-Security-Policy "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';"
```

| Directive | Source | Description |
| --- | --- | --- |
| `default-src` | 'none' | `-src`で終わる**Directive**のデフォルト値を設定 |
| `script-src ` | 'self' |  |
| `style-src` | 'self' 'unsafe-inline' | 'unsafe-inline'の使用は避けたほうが良い |
| `img-src` | 'self' |  |
| `connect-src` | 'self' |  |
| `base-uri` | 'self' |  |
| `form-action` | 'self' |  |
| `frame-ancestors` | 'none' | X-Frame-Options "DENY"と同様 |

### ルートディレクトリのオプションの設定

```
/etc/httpd/conf/httpd.conf

<Directory "/var/www/html">
    ...
    # インデックス機能を使用しない（Indexesの記述を削除）
    Options FollowSymLinks
    ...
</Directory>
```

### インデックス機能（ディレクトリ内容一覧表示機能）の設定

```
/etc/httpd/conf.d/autoindex.conf

# インデックス機能を使用しないため、すべての行をコメントアウト
```

### Welcomeページの設定

```
/etc/httpd/conf.d/welcome.conf

# Welcomeページを無効にするため、すべての行をコメントアウト
```
