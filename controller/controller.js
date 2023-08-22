const { DatabaseError } = require("../custom-errors/DatabaseError");
const { CourseError } = require("../custom-errors/CourseError");
const { getAllcourses,getUserCourses, getUser, createAccount } = require("../model/queries");
const { UserError } = require("../custom-errors/UserError");
const bcrypt = require('bcrypt');
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const namePattern = /^[A-Za-z\- ]+$/;


const fetchAllCourses = async (req,res,next)=>{
    try{
        let courses = await getAllcourses();

        return res.status(200).json({success: true, message: courses});

    }catch(error){
        if(error instanceof DatabaseError){
            console.log(error.message)
            return res.status(500).json({success: false, message: "Database Error", error: error.message})
        }
        return res.status(500).json({success: false, message: "Server Error"})

    }
}
const fetchUserCourses = async(req,res,next)=>{
    //TODO: authenticate with user ID
     const{language,level} = req.body;

     if(!language || !level) return res.status(400).json({sucess: false, message: "Bad Request"})

     try {

        let courses = await getUserCourses(level,language);

        return res.status(200).json({success: true, courses})
        
     } catch (error) {
        if(error instanceof DatabaseError){
            console.log(error.message)
            return res.status(500).json({success: false, message: "Database Error", error})
        }
        return res.status(500).json({success: false, message: "Server Error"})
     }

}

const signIn = async(req,res,next) =>{
    const {email,password} = req.body;


    //validate email input true regex too
    if(!email || !password || !emailPattern.test(email)) return res.status(400).json({success: false , message: "Bad request: Check Email"})
    

    try {
        const user = await getUser(email);
        //no need to check unavailable user, handled in the query.
        const passwordMatch = await bcrypt.compare(password, user.password);

        if(passwordMatch){
            //generate token here and send
            return res.status(200).json({success : true, message: user.id})

        }else{
            console.log(`${email}: Wrong password`)
            return res.status(404).json({success : false, message: "Invalid Email or Password"})
        }

    } catch (error) {
        if(error instanceof UserError){
            console.log(`${email}: ${error}`)
            return res.status(404).json({success : false, message: "Invalid Email or Password"})
        }
        else{
            console.log(`Server error: ${error}`)
            return res.status(500).json({success : false, message: "Unable to login in, try again later"})
        }
    }
}


const findUser = async(req,res,next) =>{
    const {email} = req.params;

    console.log(req.params)
    console.log(email)

    //validate email input true regex too
    if(!email || !emailPattern.test(email)) return res.status(400).json({success: false , message: "Bad request"})
    

    try {
        const user = await getUser(email);
        //no need to check unavailable user, handled in the query.

       return res.status(200).json({success: false, message: "Account already exists, sign in"})

    } catch (error) {
        if(error instanceof UserError){
            
            return res.status(200).json({success : true})
        }
        else{
            console.log(`Server error: ${error}`)
            return res.status(500).json({success : false, message: "Unable to Register, try again later"})
        }
    }
}

const registerAccount = async(req,res,next) =>{
    console.log("here")
    const {firstName, lastName, email,password, level,language} = req.body;
    //validate input
    if(!firstName || !lastName || !email || !password || !level || !language){
        console.log("Account validation error")
        return res.status(400).json({success: false, message: "Registration Error"})
    }
    //validate pattern
    if(!namePattern.test(firstName) || !namePattern.test(lastName) || !emailPattern.test(email)){
        console.log("Account validation error")
        return res.status(400).json({success: false, message: "Registration Error"})
    }

    try {
        const salt = await bcrypt.genSalt(10);//saltround
        const hashedPassword = await bcrypt.hash(password,salt);

        const create = await createAccount(firstName,lastName,email,hashedPassword,level,language);

        if(create){
            //create token and send back
            console.log(`New Account registeration : ${email}`)
          return  res.status(201).json({success : true})
        }
         console.log(`Server Error: Unable to create account, Investigated... line 134`)
          return  res.status(500).json({success : false})

        
    } catch (error) {
        console.log(`Server Error: ${error}`)
          return  res.status(500).json({success : false})
    }
}


module.exports = {fetchAllCourses, fetchUserCourses,signIn, findUser,registerAccount};