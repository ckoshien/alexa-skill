const Alexa = require('alexa-app');
const app = new Alexa.app('Sample');
const fs = require('fs')
const fetch = require('node-fetch')

const UTTERANCES = {
  response: {
    foo: 'ふっふっふー！ テンション上がってきたぁぁ！',
    average: 'average',
    stopAndCancel: 'あ、すいません。退場します。',
  },
  request: {
    stop: ['やめて', 'もうええわ', 'バイバイ'],
    help: ['ボスケテ', 'たすけて'],
    foo: ['ふっふー', 'ふー'],
    average: ['打率','打率の'],
  },
};

// 「Alexa〜〜を開いて」と言ってSkillsを起動したときに発動するintent
app.launch((req, res) => {
  var data = fs.readFileSync('data.json')
  var json = JSON.parse(data)
  // var url = 'http://jcbl.mydns.jp/JCBLScore/api/v1/result/season/39'
  // fetch(url,{
  //   method:'GET'
  // })
  // .then((response)=>{
  //   if(response.status===200){
  //     return response.json()
  //   }
  // })
  //.then((json)=>{
    var title = json['league']['title']
    var str =''
    str = str + title
    str = str + 'の'
    str = str + '打率TOP10を発表します。<break time="500ms"/>'
    for(var i = 0;i < json['averageTop10'].length ; i++){
      str = str + (i+1)+"位<break time='100ms'/>"
      str = str + json['averageTop10'][i]['name']
      str = str + "<break time='100ms'/>"
      str = str + json['averageTop10'][i]['average'].toFixed(3)
      str = str + "<break time='500ms'/>"
    }
    res.say(str).shouldEndSession(false);
  //})
});


const helpResponse = (req, res) => {
  res.say(UTTERANCES.response.launch).shouldEndSession(false)
};
const stopAndCancelResponse = (req, res) => {
  res.say(UTTERANCES.response.stopAndCancel)
};
const fooResponse = (req, res) => {
  foobarResponse(req, res, 'foo');
}
const averageResponse = (req, res) => {
  var data = fs.readFileSync('data.json')
  var json = JSON.parse(data)
  var num = req.slots['num'].value
  res.say(req.slots['num'].value).shouldEndSession(false)
  res.say(json['averageTop10'][num - 1]['name']+':'+json['averageTop10'][num - 1]['average']).shouldEndSession(false)
  //foobarResponse(req, res, 'average');
}
const foobarResponse = (req, res, type) => {
  res.say(UTTERANCES.response[type]).shouldEndSession(false)
  res.say(req.slots['num'].value).shouldEndSession(false)
};


app.intent('AMAZON.StopIntent', { utterances: UTTERANCES.request.stop }, stopAndCancelResponse);
app.intent('AMAZON.CancelIntent', { utterances: UTTERANCES.request.stop }, stopAndCancelResponse);
app.intent('AMAZON.HelpIntent', { utterances: UTTERANCES.request.help }, helpResponse);

app.intent('foo', { utterances: UTTERANCES.request.foo }, fooResponse);
app.intent('average', { utterances: UTTERANCES.request.average }, averageResponse);

module.exports = app;
