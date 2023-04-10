const express=require('express');
const app=express();
const cors = require('cors');
const spawner = require('child_process').spawn
const twilio = require('twilio');
const { default: axios } = require('axios');
const bodyParder=require("body-parser");

app.use(express.json());
app.use(cors());

const accountSid = 'AC85cc74a4a440bfcd82a87af3739e6aad'; // Your Account SID from www.twilio.com/console
const authToken = '3a768bdd19430b69893f31bcc4193a66'; // Your Auth Token from www.twilio.com/console
const client = twilio(accountSid, authToken);

app.listen('3010',(req,res)=>{
    console.log("Im running on port 3010");
})

app.get("/",(req,res)=>{
  console.log("got requesttt");
    res.send("The first request from server")
})

app.post('/sendMessage',(req,res)=>{
    const ph1='+91'+req.body.ph1;
    console.log("Entered the messaging sectiom ");
    console.log(req.body);
    client.messages
  .create({
    body: 'Hello Im in danger, please help, my current location is xxxx,yyyy',
    to: ph1, // Text this number
    from: '+15855952432', // From a valid Twilio number
  })
  .then((message) => console.log(message.sid));
  // res.send("okk");
  res.send("The numbers recieved are "+ph1);

})
app.post('/',(req,res)=>{
  console.log("yayy, got the post request");
})

app.get('/sendMessage',(req,res)=>{
  client.calls
      .create({
        twiml: '<Response><Say>EMERGENCY! THE USER XYZ IS IN DANGER! THE USER XYZ IS IN DANGER! FROM SAFESTRIDE</Say></Response>',
         to: '+919326227834',
         from: '+15855952432'
       })
      .then(call => console.log(call.sid));
    res.send("Trying to get numbers");
})

app.get('/mltrial', (req,res)=>{
  let feedback = runModel()
  res.json({data:feedback})
})

app.get('/feedback', (req, res) => {
  const result = feedback()
  console.log(result,'r');
  result.then(data => res.json({data:data}))
  // res.send('Hello World!')
})

async function feedback ()  {
  try {
      const result = await new Promise((res,rej) => {
          const process = spawner('python',['./nlp2f.py',"input","kk",["jj",88]])
          let temp = null

          process.stdout.on('data',(data) => {
              temp = data.toString()
              console.log(temp,'2');
              res(temp)
              
          })  
      })
      return result        
  } catch (err) {
      console.log(new Error(err).message)
  }    
}

app.get('/safestroute',async(req,res)=>{
  console.log("safestroute requested");
  res.send("request for safestroute");
})


app.post('/safestroute',async (req, res) => {
  console.log(req.body.waypoints);
  console.log(req.body.numberOfRoutes);
  const waypoints=req.body.waypoints;
  const n=req.body.numberOfRoutes;
  let riskscore = 0
  let i=0;
  for (let index = 0; index < waypoints.length; index++) {
    console.log("route number :",i);
    while(index<waypoints.length && waypoints[index].route==i )
    {
    
    console.log("latitude: ",waypoints[index].latitude);
    console.log("longitude: ",waypoints[index].longitude);
    let latitude=waypoints[index].latitude;
    let longitude=waypoints[index].longitude;
    let police = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=500&type=police&key=AIzaSyD5puZeCAKP5CnZxPbhvWIezhWdHfJAwtY`).then(data => data.data.results.length)
    let metro = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=500&type=subway_station&key=AIzaSyD5puZeCAKP5CnZxPbhvWIezhWdHfJAwtY`).then(data => data.data.results.length)
    console.log("metro in this area ",metro);
    console.log("Police in this area: ",police);
    index++;
    }
    i++;
   
    //
    //console.log(metro,police,latitude,longitude,startTime,endTime);
    //let temp = await calculateSaftey(metro,police,latitude,longitude,startTime,endTime)
    //console.log(temp);
    //riskscore += Number(temp)
    // temp.then((data) => {console.log(data);})
  }
  // const result = await calculateSaftey(p)
  // console.log(result,'r');
  // result.then(data => res.json({data:data}))
  res.send("hello")
})

async function calculateSaftey (metro,police,latitude,longitude,startTime,endTime) {
  try {
      const result = await new Promise((res,rej) => {
          const process = spawner('python',['./mlmodel.py',latitude,longitude,police,metro,startTime,endTime])
          let temp = null

          process.stdout.on('data',(data) => {
              temp = data.toString()
              // console.log(temp,'2');
              res(temp)
              
          })  
      })
      return result        
  } catch (err) {
      console.log(new Error(err).message)
  }    
}