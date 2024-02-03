const express = require('express')
const spawner = require('child_process').spawn
const { default: axios } = require('axios');

const router = express.Router();
const GOOGLE_MAPS_API_KEY="AIzaSyCI7xUVXdKdCUtFQGIT9TbYMQM2GN27gqg"

router.get('/',(req,res)=>{
    console.log("SafetySpots Part")
    res.json("hey, lets calculate safetyspots")
})
router.post('', async (req,res)=>{
  console.log('req');
  console.log(req.body,req.params);
  const latitude=req.body.latitude;
  const longitude=req.body.longitude;
  const radius=1500;
  let hospitals = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=hospital&key=${GOOGLE_MAPS_API_KEY}`).then(data => data.data.results)
  res.json(hospitals)
})


module.exports = router