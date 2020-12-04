require('dotenv').config()
const express = require("express");
const { RestClient } = require('@signalwire/node')

// get environment variables ////
const DOMAIN = process.env.DOMAIN;
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
  if (process.env.PORT == '') {
    console.log(`Server running on port 5000`);
  }
  else {
    console.log(`Server running on port ${process.env.PORT}`);
  }
});

// app routes ////
app.get("/status", (req, res, next) => {
  res.send("Sample IVR")
});

app.post("/entry", (req, res, next) => {
  var response = new RestClient.LaML.VoiceResponse();
  gather = response.gather({ timeout: 5, numDigits: 1, action: formatUrl('mainmenu') })
  gather.play({ loop: 2 }, `http://${DOMAIN}/stream/Health_IVR_01.mp3`)
  respondAndLog(res, response);
});

app.post("/mainmenu", (req, res, next) => {
  console.log(req.body.Digits);
  var response = new RestClient.LaML.VoiceResponse();

  switch (req.body.Digits) {
    case "1":
      dial = response.dial({ timeout: 20 });
      dial.number('+12066720711');
      break;
    case "2":
      dial = response.dial({ timeout: 20, action: formatUrl('hangup') });
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
    dial = response.dial({ timeout: 20, action: formatUrl('hangup') });
  }

  respondAndLog(res, response);
});

app.post("/hangup", (req, res, next) => {
  var response = new RestClient.LaML.VoiceResponse();
  respondAndLog(res, response);
});