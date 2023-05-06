const express = require('express')
const twilio = require('twilio');
const axios = require('axios');

const router = express.Router()

const client = twilio(process.env.ACCOUNTSID, process.env.AUTHTOKEN);


router.post('/sms', async (req,res)=>{
  lat=req.body.latitude;
  long=req.body.longitude;
  phone=req.body.phone;

  console.log(req.body);

  // let location = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${process.env.GOOGLE_MAPS_API_KEY}`).then(res => console.log(res.data)).catch(err => console.log(err))

  // client.messages.create({
  //   body: `Hello Im in danger, please help, my current location is ${"xyz"}`,
  //   to: '+917021746420', // Text this number
  //   from: '+15855952432', // From a valid Twilio number
  // })
  // .then((message) => console.log(message.sid));
  // // res.send("okk");
  // res.send("The numbers recieved are +917021746420");
  res.send("testing")

})

router.post('/call',(req,res)=>{
  // client.calls.create({
  //     twiml: '<Response><Say>EMERGENCY! THE USER XYZ IS IN DANGER! THE USER XYZ IS IN DANGER! FROM SAFESTRIDE</Say></Response>',
  //      to: '+917021746420',
  //      from: '+15855952432'
  // })
  // .then(call => console.log(call.sid)).catch(error => {console.log(error);request.send(error);});
  console.log(req.body.phone);
  res.send("Trying to get numbers");
})

module.exports = router