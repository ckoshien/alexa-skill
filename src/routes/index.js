var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.json(200, { title: 'Express' })
});

router.post('/', function(req, res, next) {
  console.log(req)
  //res.render('index', { title: 'Express' });
  res.json(200,
    {response:{
      "outputSpeech": {
        "type": "PlainText",
        "text": "こんにちは、こちらはサーバプログラムです。"
      }
    }
  }
  )
  return;
});

module.exports = router;
