const express=require('express');
const cors = require('cors');
const dotenv = require('dotenv')

const app=express();
dotenv.config();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');

  next();
});


app.use(express.json());
app.use(cors());

const sos = require('./routes/sos')
const nearestsafespot=require('./routes/nearestsafespot')
const safestroute = require('./routes/safestroute')
const safetyindex=require('./safetyindex')
// app.use('/sos',sos)
app.use('/safestroute',safestroute)
app.use('/safetyindex',safetyindex)
app.use('/nearestsafespot',nearestsafespot)


app.listen('3010',(req,res)=>{
  console.log("Im running on port 3010");
})

app.get('/',(req,res)=>{
  console.log("Trying to get port 3010")
  res.send("hi")
})