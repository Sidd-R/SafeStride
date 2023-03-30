const express=require('express');
const app=express();
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended: true}))


const twilio = require('twilio');
const accountSid = 'AC85cc74a4a440bfcd82a87af3739e6aad'; // Your Account SID from www.twilio.com/console
const authToken = '3a768bdd19430b69893f31bcc4193a66'; // Your Auth Token from www.twilio.com/console
const client = require('twilio')(accountSid, authToken);

app.listen('3010',(req,res)=>{
    console.log("Im running on port 3010");
})

app.get("/",(req,res)=>{
    res.send("The first request from server")
})

app.post('/sendMessage',(req,res)=>{
    const ph1=req.body.ph1;
    res.send("The numbers recieved are "+ph1);
    console.log("Entered the messaging sectiom ");
    client.messages
  .create({
    body: 'Hello Im in danger, please help, my current location is xxxx,yyyy',
    to: ph1, // Text this number
    from: '+15855952432', // From a valid Twilio number
  })
  .then((message) => console.log(message.sid));
})


app.get('/sendMessage',(req,res)=>{
    res.send("Trying to get numbers");
})

