const express=require('express');
const app=express();
const cors = require('cors');
const spawner = require('child_process').spawn
const twilio = require('twilio');
const { default: axios } = require('axios');

app.use(express.json());
app.use(cors());

const accountSid = 'AC85cc74a4a440bfcd82a87af3739e6aad'; // Your Account SID from www.twilio.com/console
const authToken = '3a768bdd19430b69893f31bcc4193a66'; // Your Auth Token from www.twilio.com/console
const client = twilio(accountSid, authToken);

app.listen('3010',(req,res)=>{
    console.log("Im running on port 3010");
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

app.post('/safestroute',async (req, res) => {
  let riskscoreArray = []
  // console.log('f');
  // let temp = await calculateSaftey(2,2,19.2054785,72.8500442,20,22)
  //   console.log(temp);
  // console.log(req.body.waypoints); //array with latitude, longitude, route number and time
  // console.log(req.body.numberOfRoutes);
  var time = 12;
  const waypoints=req.body.waypoints;
  const n=req.body.numberOfRoutes;
  let riskscore = 0
  let i=0;
  let waypointcount = 0
  for (let index = 0; index < waypoints.length; index++) {
    console.log("route number :",i);
    riskscore = 0
    waypointcount = 0
    while(index<waypoints.length && waypoints[index].route==i )
    {
    console.log("latitude: ",waypoints[index].latitude);
    console.log("longitude: ",waypoints[index].longitude);
    console.log("time spent in this area: ",waypoints[index].duration);
    let latitude=waypoints[index].latitude;
    let longitude=waypoints[index].longitude;
    console.log("start time: ",time);
    let startTime = Math.round(time)
    let duration=Number(waypoints[index].duration[0]+waypoints[index].duration[1]);
    time=time+duration*1.0/60;
    console.log("end time: ",time);
    let endTime = Math.round(time)
    let police = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=500&type=police&key=AIzaSyD5puZeCAKP5CnZxPbhvWIezhWdHfJAwtY`).then(data => data.data.results.length)
    let metro = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=500&type=subway_station&key=AIzaSyD5puZeCAKP5CnZxPbhvWIezhWdHfJAwtY`).then(data => data.data.results.length)
    console.log("metro in this area ",metro);
    console.log("Police in this area: ",police);
    index+=1;
    let temp = await calculateSaftey(metro,police,latitude,longitude,startTime,endTime)
    console.log('----------------------------------------------');
    riskscore += Number(temp)
    waypointcount += 1
    }
    riskscoreArray.push(riskscore/waypointcount)
    i++;
   
    //
    //console.log(metro,police,latitude,longitude,startTime,endTime);
    // let temp = await calculateSaftey(metro,police,latitude,longitude,startTime,endTime)
    // console.log(temp);
    //riskscore += Number(temp)
    // temp.then((data) => {console.log(data);})
  }
  // const result = await calculateSaftey(p)
  // console.log(result,'r');
  // result.then(data => res.json({data:data}))
  res.json({riskscores: riskscoreArray})
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