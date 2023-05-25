const express = require('express')
const spawner = require('child_process').spawn
const { default: axios } = require('axios');

const router = express.Router();


router.post('', async (req, res) => {
  let riskscoreArray = []
  var time = 12;
  const waypoints=req.body.waypoints;
  const n=req.body.numberOfRoutes;
  let riskscore = 0,i=0,waypointcount = 0

  for (let index = 0; index < waypoints.length; index++) {
    console.log("route number :",i);
    riskscore = 0
    waypointcount = 0
    while(index<waypoints.length && waypoints[index].route==i ) {
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
    let police = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=500&type=police&key=${process.env.GOOGLE_MAPS_API_KEY}`).then(data => data.data.results.length)
    let metro = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=500&type=subway_station&key=${process.env.GOOGLE_MAPS_API_KEY}`).then(data => data.data.results.length)
    console.log("metro in this area ",metro);
    console.log("Police in this area: ",police);
    index+=8;
    let temp = await calculateSaftey(metro,police,latitude,longitude,startTime,endTime)
    console.log("risk score: ", Number(temp));
    console.log('----------------------------------------------');
    riskscore += Number(temp)
    waypointcount += 1
    }
    riskscoreArray.push(riskscore/waypointcount);
    i++;
  }
  res.json({riskscores: riskscoreArray})
})


router.post('/safetyArea', async (req,res)=>{
  console.log('req');
  console.log(req.body,req.params);
  const latitude=req.body.sourcelat;
  const longitude=req.body.sourcelong;
  const radius=500;
  let police = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=police&key=${process.env.GOOGLE_MAPS_API_KEY}`).then(data => data.data.results.length)
  let metro = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=subway_station&key=${process.env.GOOGLE_MAPS_API_KEY}`).then(data => data.data.results.length)
  let startTime = Number(new Date().getHours())
  let endTime = startTime + 1
  console.log(metro,police,latitude,longitude,startTime,endTime);
  let riskscore = await calculateSaftey(metro,police,latitude,longitude,startTime,endTime) 
  res.json({riskscores: Number(riskscore)})
})

async function calculateSaftey (metro,police,latitude,longitude,startTime,endTime) {
  try {
      const result = await new Promise((res,rej) => {
          const process = spawner('python',['./mlmodel.py',latitude,longitude,police,metro,startTime,endTime])
          let temp = null

          process.stdout.on('data',(data) => {
              temp = data.toString()
              res(temp)
          })  
      })
      return result        
  } catch (err) {
      console.log(new Error(err).message)
  }    
}


module.exports = router