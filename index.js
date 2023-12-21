const express  =require('express');
const jwt = require('jsonwebtoken');
const app = express();
const cors = require('cors')
const secretKey = "Secretkey"



// Body Parser Middleware 
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// Enabling CORS for API calling from diffrent region
app.use(cors());


app.get("/",(req,res)=>{
    res.json({messege: "sample api" });
});

app.post("/login",(req,res)=>{
    const user = req.body.user;

    if(user != null){
    jwt.sign({user},secretKey,{expiresIn:'300s'},(err,token)=>{
        res.json({
            token
        });
    });
}
else{
    res.status(500).send({
        messege : "User Payload is Empty !"
    })
}
});

app.post("/profile",verifyToken,(req,res)=>{

    jwt.verify(req.token,secretKey,(err,authData)=>{
        if(err){
            res.send({
                result: "Invalid Token! "
            })
        }
        else{
            res.json({
                messege: "Profile Accessed",
                authData
            })
        }
    })
});

function verifyToken(req,res,next){
 const bearerheader = req.headers['authorization'];
 if(typeof bearerheader  !=='undefiend'){
    const bearer = bearerheader.split(" ");
    const token = bearer[1];
    req.token = token;
    next();
 }else{
    res.send({
        result : "Token not Valid"
    });
 }
}

app.listen(5000,()=>{
    console.log("App is running on 5000");
});

