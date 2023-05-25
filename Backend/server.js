const express=require('express');
const cors = require('cors');
const dotenv = require('dotenv')

const app=express();
dotenv.config();

app.use(express.json());
app.use(cors());

const sos = require('./routes/sos')
const safestroute = require('./routes/safestroute')

app.use('/sos',sos)
app.use('/safestroute',safestroute)


app.listen('3010',(req,res)=>{
  console.log("Im running on port 3010");
})