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
  res.say('<say-as interpret-as="interjection">ようこそ</say-as>日本カラーボール野球連盟の成績案内へ').shouldEndSession(false);
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
  res.say(num+"位<break time='100ms'/>"+json['averageTop10'][num - 1]['name']+':'+json['averageTop10'][num - 1]['average']).shouldEndSession(false)
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
const foobarResponse = (req, res, type) => {
  res.say(UTTERANCES.response[type]).shouldEndSession(false)
  res.say(req.slots['num'].value).shouldEndSession(false)
};


app.intent('AMAZON.StopIntent', { utterances: UTTERANCES.request.stop }, stopAndCancelResponse);
app.intent('AMAZON.CancelIntent', { utterances: UTTERANCES.request.stop }, stopAndCancelResponse);
app.intent('AMAZON.HelpIntent', { utterances: UTTERANCES.request.help }, helpResponse);

app.intent('average', { utterances: UTTERANCES.request.average }, averageResponse);
app.intent('averageAll', { utterances: UTTERANCES.request.average }, averageAllResponse);

module.exports = app;
