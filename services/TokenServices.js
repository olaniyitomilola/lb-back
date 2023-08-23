const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.TOKEN_KEY;

const GenerateToken = (email)=>{

    //change expiry time later and refreshtoken
    const token = jwt.sign({email},secretKey,{expiresIn: '24h'})

    return token;

}

const VerifyToken = (req,res,next) =>{
    console.log('verifying token')
    let token = req.headers['authorization'];
    console.log(token)
    if(!token){
        return res.status(401).json({success : false, message : 'Unauthorized'});

    }
    token = token.split(" ")[1];
    jwt.verify(token,secretKey,(err,decoded) =>{
        if(err){
            console.log("In error")
            console.log(err)
            return res.status(401).json({message : 'Invalid Token', success: false})
        }
        req.user = decoded;
        next();
    })
}

module.exports = {GenerateToken,VerifyToken};