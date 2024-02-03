const express = require('express')
const twilio = require('twilio');
const axios = require('axios');

// const router = express.Router()

// const client = twilio(process.env.ACCOUNTSID, process.env.AUTHTOKEN);


// router.post('/sms', async (req,res)=>{
//   const lat=req.body.latitude;
//   const long=req.body.longitude;
//   const phone='+91'+req.body.phone;
//   const name=req.body.name;

//   console.log(req.body);

//   // let location = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${process.env.GOOGLE_MAPS_API_KEY}`).then(res => console.log(res.data)).catch(err => console.log(err))

//   client.messages.create({
//     body: `${name} is danger, current location: ${lat},${long}`,
//     to: phone, // Text this number
//     from: '+15855952432', // From a valid Twilio number
//   })
//   .then((message) => console.log(message.sid));
//   // res.send("okk");
//   res.send("The numbers recieved is "+phone);

// })

// router.post('/call',(req,res)=>{
//   const name=req.body.name;
//   const phone='+91'+req.body.phone;

//   client.calls.create({
//       twiml: `<Response><Say>EMERGENCY! THE USER ${name} IS IN DANGER! THE USER ${name} IS IN DANGER! FROM SAFESTRIDE</Say></Response>`,
//        to: phone,
//        from: '+15855952432'
//   })
//   .then(call => console.log(call.sid)).catch(error => {console.log(error);req.send(error);});
//   console.log(req.body.phone);
//   res.send("Call sucessfull");
// })

// module.exports = router