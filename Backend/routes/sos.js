const express = require('express')
const twilio = require('twilio');
const axios = require('axios');

const router = express.Router()

const accountSid = 'AC85cc74a4a440bfcd82a87af3739e6aad'; // Your Account SID from www.twilio.com/console
const authToken = '3a768bdd19430b69893f31bcc4193a66'; // Your Auth Token from www.twilio.com/console
const client = twilio(accountSid, authToken);


router.post('/sms', async (req,res)=>{
  lat=req.body.latitude;
  long=req.body.longitude;

  const ph1='+91'+req.body.ph1;
  console.log("Entered the messaging sectiom ");
  console.log(req.body);

  let location = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyD5puZeCAKP5CnZxPbhvWIezhWdHfJAwtY`).then(res => res.results[0].formatted_address)

  client.messages.create({
  body: `Hello Im in danger, please help, my current location is ${location}`,
  to: '+917021746420', // Text this number
  from: '+15855952432', // From a valid Twilio number
})
.then((message) => console.log(message.sid));
// res.send("okk");
res.send("The numbers recieved are +917021746420");

})

router.get('/call',(req,res)=>{
client.calls
    .create({
      twiml: '<Response><Say>EMERGENCY! THE USER XYZ IS IN DANGER! THE USER XYZ IS IN DANGER! FROM SAFESTRIDE</Say></Response>',
       to: '+917021746420',
       from: '+15855952432'
     })
    .then(call => console.log(call.sid)).catch(error => {console.log(error);request.send(error);});
  res.send("Trying to get numbers");
})

module.exports = router