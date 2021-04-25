# HomePage

## 設定ファイル 
/etc/httpd/conf/httpd.conf

### HTTPステータスがエラーである場合の表示

```
# 4xx Client_Error クライアントエラー
# 401 Unauthorized 認証が必要である
ErrorDocument 401 /error/401_unauthorized.html
# 403 Forbidden 禁止されている
ErrorDocument 403 /error/403_forbidden.html
# 404 Not_Found 見つからない
ErrorDocument 404 /error/404_not_found.html
# 418 418 I'm_a_teapot 私はティーポットです
#ErrorDocument 418 /error/418_im_a_teapot.html

# 5xx Server_Error サーバエラー
# 500 Internal_Server_Error サーバ内部エラー
ErrorDocument 500 /error/500_internal_server_error.html
# 503 Service_Unavailable サービス利用不可
ErrorDocument 503 /error/503_service_unavailable.html
```

### サーバー情報の表示

```
# バージョンを表示しない
ServerTokens ProductOnly
```
