const Alexa = require('alexa-app');
const app = new Alexa.app('Sample');
const fs = require('fs')
const fetch = require('node-fetch')

const UTTERANCES = {
  response: {
    average: 'average',
    stopAndCancel: 'ありがとうございました。',
  },
  request: {
    stop: ['やめて'],
    help: ['たすけて','ヘルプ'],
    average: ['打率','打率の'],
  },
};

app.launch((req, res) => {
  res.say('ようこそ日本カラーボール野球連盟の成績案内へ')
  res.say('ご用件をどうぞ')
  .shouldEndSession(false);
});


const helpResponse = (req, res) => {
  res.say(UTTERANCES.response.launch).shouldEndSession(true)
};
const stopAndCancelResponse = (req, res) => {
  res.say(UTTERANCES.response.stopAndCancel)
};

const averageResponse = (req, res) => {
  var data = fs.readFileSync('data.json')
  var json = JSON.parse(data)
  var num = req.slots['num'].value
  if(num <= 10){
    res.say(num+"位<break time='100ms'/>"+json['averageTop10'][num - 1]['name']+':'+json['averageTop10'][num - 1]['average']).shouldEndSession(true)
  }else{
    res.say("ごめんなさい。<break time='100ms'/>"+num+"は指定できません。<break time='100ms'/>10以下の順位を指定してください").shouldEndSession(false);
  }
}

const resultResponse = (req, res) => {
  var data = fs.readFileSync('data.json')
  var json = JSON.parse(data)
  var name = req.slots['name'].value
  var num;
  //カスタムスロットが1件以上一致している場合
  if (req.slots['name'].resolutions[0]['values'].length > 0) {
    var resolutionName = req.slots['name'].resolutions[0]['values'][0]['name']
    if (name !== undefined) {
      for (var i = 0; i < json['battingResultList'].length; i++) {
        if (json['battingResultList'][i].name === name || json['battingResultList'][i].name === resolutionName) {
          num = i
          break;
        }
      }
      if (num !== undefined) {
        res.say(name + 'の成績は')
        res.say('打率' + json['battingResultList'][num].average)
          .shouldEndSession(true);
      } else {
        res.say(name + 'の成績は見つかりませんでした').shouldEndSession(true);
      }
    } else {
      res.say('データが用意されていない名前です。')
    }
  }else{
    res.say('データが用意されていない名前です。')
  }
  console.log(name)
}

const averageAllResponse = (req,res) => {
  var str = ''
  str = readCommonPart(
    '打率TOP<lang xml:lang="en-US">10</lang>',
    'averageTop10',
    'average',
    '',
    3)
  res.say(str).shouldEndSession(true);
}

const eraAllResponse = (req,res) => {
  var str = ''
  str = readCommonPart(
    '防御率TOP<lang xml:lang="en-US">10</lang>',
    'eraTop10',
    'era',
    '',
    2)
  res.say(str).shouldEndSession(true);
}

const rbiAllResponse = (req,res) => {
  var str = ''
  str = readCommonPart(
    '打点TOP<lang xml:lang="en-US">10</lang>',
    'rbiTop10',
    'rbi',
    '打点',
    0)
  res.say(str).shouldEndSession(true);
}

const homerunAllResponse = (req,res) => {
  var str = ''
  str = readCommonPart(
    'ホームランTOP<lang xml:lang="en-US">10</lang>',
    'homerunTop10',
    'homerun',
    '本',
    0)
  res.say(str).shouldEndSession(true);
}

/**
 * 共通箇所読み上げメソッド
 * @param {*} titleName タイトル名
 * @param {*} titleKey タイトルのキー
 * @param {*} titleAttr タイトル属性
 * @param {*} titleCounter 数え方
 * @param {*} digit 小数点以下桁数
 */
const readCommonPart=(titleName,titleKey,titleAttr,titleCounter,digit)=>{
  var data = fs.readFileSync('data.json')
  var json = JSON.parse(data)
  var str = ''
  var seasonTitle = json['league']['title']
  str = str + seasonTitle + 'の'
  str = str + titleName + 'を発表します。<break time="500ms"/>'
  for (var i = 0; i < json[titleKey].length; i++) {
    str = str + (i + 1) + "位<break time='100ms'/>"
    str = str + json[titleKey][i]['name']
    str = str + "<break time='100ms'/>"
    str = str + json[titleKey][i][titleAttr].toFixed(digit)
    str = str + titleCounter+"<break time='500ms'/>"
  }
  return str
}

app.intent('AMAZON.StopIntent', { utterances: UTTERANCES.request.stop }, stopAndCancelResponse);
app.intent('AMAZON.CancelIntent', { utterances: UTTERANCES.request.stop }, stopAndCancelResponse);
app.intent('AMAZON.HelpIntent', { utterances: UTTERANCES.request.help }, helpResponse);

app.intent('result', { utterances: UTTERANCES.request.average }, resultResponse);
app.intent('average', { utterances: UTTERANCES.request.average }, averageResponse);
app.intent('averageAll', { utterances: UTTERANCES.request.average }, averageAllResponse);
app.intent('rbiAll', { utterances: UTTERANCES.request.average }, rbiAllResponse);
app.intent('homerunAll', { utterances: UTTERANCES.request.average }, homerunAllResponse);
app.intent('eraAll', { utterances: UTTERANCES.request.average }, eraAllResponse);

app.sessionEnded( (req,res) => {
  console.log('session ended.')
})

module.exports = app;
