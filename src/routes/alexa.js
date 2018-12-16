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
  res.say('ようこそ日本カラーボール野球連盟の成績案内へ').shouldEndSession(false);
});


const helpResponse = (req, res) => {
  res.say(UTTERANCES.response.launch).shouldEndSession(false)
};
const stopAndCancelResponse = (req, res) => {
  res.say(UTTERANCES.response.stopAndCancel)
};

const averageResponse = (req, res) => {
  var data = fs.readFileSync('data.json')
  var json = JSON.parse(data)
  var num = req.slots['num'].value
  if(num <= 10){
    res.say(num+"位<break time='100ms'/>"+json['averageTop10'][num - 1]['name']+':'+json['averageTop10'][num - 1]['average']).shouldEndSession(false)
  }else{
    res.say("ごめんなさい。<break time='100ms'/>"+num+"は指定できません。<break time='100ms'/>10以下の順位を指定してください").shouldEndSession(false);
  }
}

const averageAllResponse = (req,res) => {
  var data = fs.readFileSync('data.json')
  var json = JSON.parse(data)
  var title = json['league']['title']
  var str = ''
  str = str + title
  str = str + 'の'
  str = str + '打率TOP10を発表します。<break time="500ms"/>'
  for (var i = 0; i < json['averageTop10'].length; i++) {
    str = str + (i + 1) + "位<break time='100ms'/>"
    str = str + json['averageTop10'][i]['name']
    str = str + "<break time='100ms'/>"
    str = str + json['averageTop10'][i]['average'].toFixed(3)
    str = str + "<break time='500ms'/>"
  }
  res.say(str).shouldEndSession(false);
}

const eraAllResponse = (req,res) => {
  var data = fs.readFileSync('data.json')
  var json = JSON.parse(data)
  var title = json['league']['title']
  var str = ''
  str = str + title
  str = str + 'の'
  str = str + '防御率TOP10を発表します。<break time="500ms"/>'
  for (var i = 0; i < json['eraTop10'].length; i++) {
    str = str + (i + 1) + "位<break time='100ms'/>"
    str = str + json['eraTop10'][i]['name']
    str = str + "<break time='100ms'/>"
    str = str + json['eraTop10'][i]['era'].toFixed(2)
    str = str + "<break time='500ms'/>"
  }
  res.say(str).shouldEndSession(false);
}

const rbiAllResponse = (req,res) => {
  var data = fs.readFileSync('data.json')
  var json = JSON.parse(data)
  var title = json['league']['title']
  var str = ''
  str = str + title
  str = str + 'の'
  str = str + '打点TOP10を発表します。<break time="500ms"/>'
  for (var i = 0; i < json['rbiTop10'].length; i++) {
    str = str + (i + 1) + "位<break time='100ms'/>"
    str = str + json['rbiTop10'][i]['name']
    str = str + "<break time='100ms'/>"
    str = str + json['rbiTop10'][i]['rbi']
    str = str + "打点<break time='500ms'/>"
  }
  res.say(str).shouldEndSession(false);
}

const homerunAllResponse = (req,res) => {
  var str = ''
  str = readCommonPart('ホームランTOP10','homerunTop10','homerun','本')
  res.say(str).shouldEndSession(false);
}

const readCommonPart=(titleName,titleKey,titleAttr,titleCounter)=>{
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
    str = str + json[titleKey][i][titleAttr]
    str = str + titleCounter+"<break time='500ms'/>"
  }
  return str
}

app.intent('AMAZON.StopIntent', { utterances: UTTERANCES.request.stop }, stopAndCancelResponse);
app.intent('AMAZON.CancelIntent', { utterances: UTTERANCES.request.stop }, stopAndCancelResponse);
app.intent('AMAZON.HelpIntent', { utterances: UTTERANCES.request.help }, helpResponse);

app.intent('average', { utterances: UTTERANCES.request.average }, averageResponse);
app.intent('averageAll', { utterances: UTTERANCES.request.average }, averageAllResponse);
app.intent('rbiAll', { utterances: UTTERANCES.request.average }, rbiAllResponse);
app.intent('homerunAll', { utterances: UTTERANCES.request.average }, homerunAllResponse);
app.intent('eraAll', { utterances: UTTERANCES.request.average }, eraAllResponse);

module.exports = app;
