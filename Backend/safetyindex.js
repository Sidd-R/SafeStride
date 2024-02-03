const express = require('express')
const spawner = require('child_process').spawn
const { default: axios } = require('axios');

const router = express.Router();
const GOOGLE_MAPS_API_KEY="AIzaSyCI7xUVXdKdCUtFQGIT9TbYMQM2GN27gqg"



router.get('/',(req,res)=>{
    console.log("SafetyIndex part")
    res.json("hey, lets calculate safety")
})
router.post('', async (req,res)=>{
  console.log('req');
  console.log(req.body,req.params);
  const latitude=req.body.latitude;
  const longitude=req.body.longitude;
  const radius=500;
  let police = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=police&key=${GOOGLE_MAPS_API_KEY}`).then(data => data.data.results.length)
  let metro = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=subway_station&key=${GOOGLE_MAPS_API_KEY}`).then(data => data.data.results.length)
  let startTime = Number(new Date().getHours())
  let endTime = startTime + 1
  console.log("Metro Stations: ",metro)
  console.log("Police Stations: ",police)
  console.log("Latitude: ",latitude)
  console.log("Longitude: ",longitude)
  console.log(metro,police,latitude,longitude,startTime,endTime);
  console.log("Sending to ml model")
  let riskscore = await calculateSaftey(metro,police,latitude,longitude,startTime,endTime) 
  console.log("Riskscore: ",riskscore)
  res.json({riskscores: Number(riskscore)})
})

async function calculateSaftey (metro,police,latitude,longitude,startTime,endTime) {
  try {
    console.log("Sending to ml model inside function")
      const result = await new Promise((res,rej) => {
        const path = require('path');
        const scriptPath = path.join(__dirname, 'mlmodel.py');
        const process = spawner('python',[scriptPath,latitude,longitude,police,metro,startTime,endTime])
          let temp = null
          process.stdout.on('data',(data) => {
              temp = data.toString()
              res(temp)
          })  
});
      return result        
  } catch (err) {
    console.log("Error:", err);
    throw err; // Rethrow the error to handle it at a higher level
}   
}


module.exports = router