<?php header("HTTP/1.1 418 I'm a teapot"); ?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error 418 (I'm a teapot)</title>
    <link rel="icon" type="image/vnd.microsoft.icon" href="/favicon.ico">
    <link rel="stylesheet" type="text/css" href="/styles/style_for_laptop.css" media="(min-width: 768px)">
    <link rel="stylesheet" type="text/css" href="/styles/style_for_tablet.css" media="(min-width: 576px) and (max-width: 767.98px)">
    <link rel="stylesheet" type="text/css" href="/styles/style_for_mobile.css" media="(max-width: 575.98px)">
</head>
<body>
    <header>
        <div class="content" style="background-color: whitesmoke;">
            <div style="font-size: 2rem; text-align: center;">
                オーティーの研究日誌
            </div>
        </div>
    </header>
    <main>
        <div class="content">
            <div class="flex-row-center">
                <div class="flex-item">
                    <div style="width: fit-content; margin: auto;">
                        <h1>418 エラー</h1>
                        <p>
                            私はティーポットです。
                        </p>
                        <div style="text-align: center;">
                            <a href="/index.html">TOPへ戻る</a>
                        </div>
                    </div>
                </div>
                <div class="flex-item">
                    <div style="width: 80%; margin: auto; text-align: center;">
                        <img alt="Not Found" src="/images/error/im_a_japanese_teapot.png" style="max-width: 100%;">
                    </div>
                </div>
            </div>
        </div>
    </main>
    <footer>
        <div class="content" style="background-color: whitesmoke;">
            <div style="font-size: 1rem; text-align: center;">
                &copy; DeveloperAuty 2021
            </div>
        </div>
    </footer>
</body>
</html>
