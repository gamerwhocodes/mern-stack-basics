const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('../db/conn');
const User = require('../model/userSchema');


//home page
router.get("/", (req, res) => {
    res.send(`Home Page`);
  });

//SignUp route
router.post('/register',async(req,res)=>{
const{name,email,phone,password,cpassword} = req.body;

if(!name || !email || !phone || !password || !cpassword)
{
    console.log('required fields are empty');
    return res.status(422).json({error:"required fields are empty"});
}
try{
    
  const userExist = await User.findOne({email:email});

  if(userExist) {
    return res.status(422).json({error:"Email already exist."});
  }
  else if(password != cpassword)
  {
    return res.status(422).json({error:"password not matching"});
  }
  else{
    const user = new User({name,email,phone,password,cpassword});
    await user.save();
    res.status(201).json({messag:"user registered successfully"});
  }
  
} 
catch (error) {
    console.log(error)
  }
});

//login route
router.post('/signin',async(req,res)=>{

  let token;

  try {
    
    const {email,password} = req.body;
    if(!email || !password)
    {
      return res.status(400).json({error:"Plz fill the data"})
    }
    const userLogin = await User.findOne({email:email})

    if(userLogin)
    {
      const isMatch = await bcrypt.compare(password,userLogin.password)

      token = await userLogin.generateAuthToken();
      res.cookie("User Token", token,{
        expires:new Date(Date.now() + 25892000000),
        httpOnly:true
      });

    if(isMatch)
    {
      res.status(200).json({"message":"user logged in successfully"})
    }
    else{
      res.status(400).json({"message":"wrong user credentials"})
    }

    }
    else
    {
      res.status(400).json({"message":"wrong user credentials"})
    }
    
  } catch (error) {
    console.log(error);
  }
})

module.exports = router;