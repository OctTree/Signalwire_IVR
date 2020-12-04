const express = require("express");
const { RestClient } = require('@signalwire/node')

// get environment variables ////
const DOMAIN = '3.88.217.29:5000'// the domain the app is deployed at
// methods should be in a different file in production /
function formatUrl(action, querystring = '') {
  return "http://" + DOMAIN + "/" + action + querystring;
}

function respondAndLog(res, response) {
  console.log(response.toString());
  res.send(response.toString());
}

// app startup ////
var app = express();
app.use(express.urlencoded());
app.use(express.static('assets'));

app.listen(process.env.PORT || 5000, () => {
 console.log("Server running on port 5000");
});

// app routes ////
app.get("/status", (req, res, next) => {
  res.send("Sample IVR")
});

app.post("/entry", (req, res, next) => {
  var response = new RestClient.LaML.VoiceResponse();
  gather = response.gather({ timeout: 5, numDigits: 1, action: formatUrl('mainmenu') })
  gather.play({loop: 2}, 'http://3.88.217.29:5000/stream/Health_IVR.mp3')
  respondAndLog(res, response);
 });

app.post("/mainmenu", (req, res, next) => {
  console.log(req.body.Digits);
  var response = new RestClient.LaML.VoiceResponse();

  switch (req.body.Digits) {
    case "1":
      dial = response.dial({timeout: 20});
      dial.number('+16299999319');
      break;
    case "2":
      dial = response.dial({timeout: 20, action: formatUrl('hangup')});
      dial.number(PRIMARY_SALES);
      break;
    default:
      break;
  }
  
  respondAndLog(res, response);
});

app.post("/primarysalesdial", (req, res, next) => {
  console.log(req.body);
  var response = new RestClient.LaML.VoiceResponse();
  if (req.body.DialCallStatus != "completed") {
    dial = response.dial({timeout: 20, action: formatUrl('hangup')});
  }

  respondAndLog(res, response);
});

app.post("/hangup", (req, res, next) => {
  var response = new RestClient.LaML.VoiceResponse();
  respondAndLog(res, response);
});