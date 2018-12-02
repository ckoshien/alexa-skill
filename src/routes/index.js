var express = require('express');
var router = express.Router();
var fetch = require('node-fetch')

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.json(200, { title: 'Express' })
});

router.post('/', function(req, res, next) {
  //console.log(req.body.context.System.apiAccessToken)
  //res.render('index', { title: 'Express' });
  const method = 'POST'
  const headers= {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer '+req.body.context.System.apiAccessToken,
    'Content-length': 200
  }
  const body={
    "requestTime" : "2018-12-03T19:04:00.672",
    "trigger": {
         "type" : "SCHEDULED_ABSOLUTE",                 // トリガーのタイプを示します
         "scheduledTime" : "2018-12-03T19:00:00.000",    // 有効なISO 8601形式 - 想定されるトリガー時刻
         "timeZoneId" : "America/Los_Angeles",           // タイムゾーンのIDを含む文字列。 以下の「タイムゾーンの動作」セクションを参照してください。
         "recurrence" : {                               // 反復情報をすべて含める必要があります
             "freq" : "WEEKLY",                         // 反復の頻度のタイプ
             "byDay": ["MO"],                           // 一週間の中での日のリスト
         }
    },
    "alertInfo": {
         "spokenInfo": {
             "content": [{
                 "locale": "en-US",                     // 値が指定されるロケール
                 "text": "犬の散歩"                // 表示および読み上げ用に使用されるテキスト
             }]
         }
     },
     "pushNotification" : {                            
          "status" : "ENABLED"                          // プッシュ通知を送信するかどうか [default = ENABLED]
     }
 }
 //fetch('https://api.amazonalexa.com/v1/alerts/reminders')
   fetch('https://api.amazonalexa.com/v1/alerts/reminders',
   {method,headers})
  .then((response) => {
    return response.json()
  })
  .then((json)=>{
    console.log(json)
  })
  res.json(200,
    {
      response:{
      "outputSpeech": {
        "type": "PlainText",
        "text": "こんにちは、こちらはサーバプログラムです。"
      }
    }
  }
  )
  //return;
});

module.exports = router;
