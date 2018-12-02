const Alexa = require('ask-sdk');
 
let skill;
exports.handler = async function (event, context) {
    if (!skill) {
      skill = Alexa.SkillBuilders.custom()
        .addRequestHandlers(LaunchRequestHandler,OrderIntentHandler)
        .create();
    }
    return skill.invoke(event);
}
 
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak('ようこそ、コーヒーショップへ、ご注文をどうぞ')
            .reprompt('ご注文をお伺いします')
            .getResponse();
    }
};
 
const OrderIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'OrderIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak('ご注文ありがとうございました')
            .getResponse();
    }
};