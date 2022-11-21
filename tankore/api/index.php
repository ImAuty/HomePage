<?php
// DB接続クラス
require_once($_SERVER['DOCUMENT_ROOT'] . '/../php/DbConnection.php');

// 定数
/** 日付フォーマット */
const DATE_FORMAT = 'Y-m-d';
/** 対応メソッドリスト */
const ALLOWED_METHODS = ['GET', 'POST'];
/** ブロック */
const CHARACTER_BLOCK = 'Katakana'; // カタカナ
/** パターン */
const LETTER_PATTERN = '/[ァ-ワヲンー]/u'; // カタカナの中で記号や一般的でない文字を含まない表現

try {
    // JSONヘッダー
    header('Content-Type: application/json; charset=UTF-8');
    // 対応メソッドを確認する
    if (!in_array($_SERVER['REQUEST_METHOD'], ALLOWED_METHODS, true)) {
        // HTTPレスポンスコード:Method Not Allowed(405)
        http_response_code(405);
        // JSONボディ
        echo json_encode([
            'errorMessage' => '対応しないメソッドです。'
        ]);
        exit;
    }

    // 対象日付を設定する
    $targetDate = new DateTime();
    // 回答単語を設定する
    $replyWord = null;
    // リクエストメソッドを確認する
    $requestMethod = $_SERVER['REQUEST_METHOD'];
    if ($requestMethod === 'POST') {
        // リクエストボディを取得する
        $requestBody = file_get_contents('php://input');
        $requestData = json_decode($requestBody, true);
        // 対象日付を取得する
        $dateStr = $requestData['answerDate'];
        $targetDate = DateTime::createFromFormat(DATE_FORMAT, $dateStr);
        // 回答単語を取得する
        $replyWord = $requestData['inputWord'];
    }

    // DBに接続する
    $dbh = DbConnection::connectTankore();

    // 回答失敗かを設定する
    $isFailedToReply = false;
    // 回答単語を確認する
    if (isset($replyWord)) {
        // 回答単語が存在するか確認する
        $wordCount = countWordByValue($dbh, $replyWord);
        // 回答単語が存在しない場合は回答失敗を設定する
        $isFailedToReply = ($wordCount !== 1);
    }

    // 解答を取得する
    $answer = findAnswerByDate($dbh, $targetDate);
    // 解答単語を取得する
    $answerWord = $answer['word'];
    // 解答文字数を取得する
    $numberOfAnswerLetters = mb_strlen($answerWord);
    // 解答制限を取得する
    $answerLimit = $answer['limit'];
    // 解答日付を取得する
    $answerDate = $answer['date'];

    // 回答単語リストを設定する
    $replyWords = [];
    // セッションを開始する
    session_start();
    // 対象日付からセッションキーを作成する
    $sessionKey = $targetDate->format(DATE_FORMAT);
    // セッションを確認する
    if (isset($_SESSION[$sessionKey])) {
        // セッションを取得する
        $replyWords = $_SESSION[$sessionKey];
    } else {
        // セッションを解除する
        $_SESSION = [];
    }
    // 回答単語を確認する
    if (isset($replyWord) && !$isFailedToReply) {
        // 回答単語をリストに追加する
        if (count($replyWords) < $answerLimit) $replyWords[] = $replyWord;
    }
    // セッションを設定する
    $_SESSION[$sessionKey] = $replyWords;
    // セッションを終了する
    session_write_close();

    // 回答リストを作成する
    $replies = createReplies($replyWords, $answerWord);

    // 文字リスト（記号などを含む）を取得する
    $characterBlock = CHARACTER_BLOCK;
    $characters = findCharactersByBlock($dbh, $characterBlock);
    // 文字リスト（記号などを含まない）を作成する
    $pattern = LETTER_PATTERN;
    $letters = createLetters($characters, $pattern);

    // HTTPレスポンスコード:OK(200)
    http_response_code(200);
    // JSONボディ
    echo json_encode([
        'isFailedToReply' => $isFailedToReply,
        'numberOfAnswerLetters' => $numberOfAnswerLetters,
        'answerLimit' => $answerLimit,
        'targetDate' => $answerDate,
        'replies' => $replies,
        'letters' => $letters,
    ]);
} catch (RuntimeException $e) {
    // HTTPレスポンスコード:Internal Server Error(500)
    http_response_code(500);
    // JSONボディ
    echo json_encode([
        'errorMessage' => $e->getMessage()
    ]);
} catch (Throwable $e) {
    // HTTPレスポンスコード:Internal Server Error(500)
    http_response_code(500);
    // JSONボディ
    echo json_encode([
        'errorMessage' => '想定外の事象が発生しました。'
    ]);
}

/**
 * 単語の数を取得する
 * 
 * @param PDO    $dbh   PDO
 * @param string $value 値
 * @return int 単語の数
 */
function countWordByValue(PDO $dbh, string $value): int
{
    $sql = 'SELECT COUNT(*) FROM `words` WHERE `value` = :value';
    $sth = $dbh->prepare($sql);
    $sth->bindValue('value', $value, PDO::PARAM_STR);
    $sth->execute();
    $result = $sth->fetchColumn();
    return $result;
}

/**
 * 文字リストを取得する
 * 
 * @param PDO    $dbh   PDO
 * @param string $block ブロック
 * @return array 文字リスト
 */
function findCharactersByBlock(PDO $dbh, string $block): array
{
    $sql = 'SELECT * FROM `characters` WHERE `block` = :block';
    $sth = $dbh->prepare($sql);
    $sth->bindValue('block', $block, PDO::PARAM_STR);
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    return $result;
}

/**
 * 解答を取得する
 * 
 * @param PDO      $dbh  PDO
 * @param DateTime $date 日付
 * @return mixed 解答
 */
function findAnswerByDate(PDO $dbh, DateTime $date): mixed
{
    $sql = 'SELECT * FROM `answers` WHERE `date` = :date';
    $sth = $dbh->prepare($sql);
    $dateStr = $date->format('Y-m-d');
    $sth->bindValue('date', $dateStr, PDO::PARAM_STR);
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    if (count($result) !== 1) throw new RuntimeException("解答の取得に失敗しました。");
    return $result[0];
}

/**
 * 回答リストを作成する
 * 
 * @param array  $replyWords 回答単語リスト
 * @param string $answerWord 解答単語
 * @return array 回答リスト
 */
function createReplies(array $replyWords, string $answerWord): array
{
    // 解答文字リストを取得する
    $answerLetters = mb_str_split($answerWord);
    // 回答リストを設定する
    $replies = [];
    foreach ($replyWords as $replyWord) {
        // 回答文字リストを取得する
        $replyLetters = mb_str_split($replyWord);
        // 回答を設定する
        $reply = [];
        foreach ($replyLetters as $i => $replyLetter) {
            // 文字を設定する
            $letter = [];
            // 回答文字を設定する
            $letter['value'] = $replyLetter;
            // 回答文字が解答単語に含まれる数を設定する
            $contains = array_filter($answerLetters, fn ($l) => $l === $replyLetter);
            $letter['inAnswerWord'] = count($contains);
            // 回答文字が解答文字と一致するかを設定する
            $letter['matchesAnswerLetter'] = false;
            if (count($answerLetters) > $i) {
                $answerLetter = $answerLetters[$i];
                $letter['matchesAnswerLetter'] = ($replyLetter === $answerLetter);
            }
            // 文字をリストに追加する
            $reply[$i] = $letter;
        }
        // 回答をリストに追加する
        $replies[] = $reply;
    }
    return $replies;
}

/**
 * 文字リストを作成する
 * 
 * @param array  $characters 文字リスト
 * @param string $pattern    パターン
 * @return array 文字リスト
 */
function createLetters(array $characters, string $pattern): array
{
    // 文字リスト（記号などを含まない）を設定する
    $letters = [];
    foreach ($characters as $character) {
        // 文字グリフを確認する
        $characterGlyph = $character['glyph'];
        if (preg_match($pattern, $characterGlyph) !== 1) continue;
        // 文字を設定する
        $letter = [];
        $letter['code'] = $character['unicode'];
        $letter['type'] = $character['type'];
        $letter['value'] = $character['glyph'];
        // 文字をリストに追加する
        $letters[] = $letter;
    }
    return $letters;
}
