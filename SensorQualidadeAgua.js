'use strict';

var connectionString = 'HostName=IoThubCisterna.azure-devices.net;DeviceId=SensorQualidadeAgua;SharedAccessKey=SuT1iNDyFLipuM4lgnyW6AtKdBLnm+9pp5nPoZ8CCv4=';

var Mqtt = require('azure-iot-device-mqtt').Mqtt;
var DeviceClient = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;

var client = DeviceClient.fromConnectionString(connectionString, Mqtt);

function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res) console.log(op + ' status: ' + res.constructor.name);
  };
}

setInterval(function(){
    
  var IQA =  (Math.random() * 100);   
  var qualidadeAgua;
  
  if (IQA >= 80 && IQA <= 100)
  {
    qualidadeAgua = "Otima";
  } 
  else if (IQA >= 52 && IQA <= 79) 
  {
    qualidadeAgua = "Boa";
  } 
  else if (IQA >= 37 && IQA <= 51) 
  {
    qualidadeAgua = "Razoavel";
  } 
  else if (IQA >= 20 && IQA <= 36) 
  {
    qualidadeAgua = "Ruim";
  } 
  else if (IQA >= 0 && IQA <= 19) 
  {
    qualidadeAgua = "Pessima";
  }    
  
  var data = JSON.stringify({ IQA: IQA, qualidadeAgua: qualidadeAgua});
  var message = new Message(data);

  message.properties.add('qualidadeAguaAlert', (IQA < 20) ? 'true' : 'false');
  console.log('Sending message: ' + message.getData());

  client.sendEvent(message, printResultFor('send'));
}, 1000);