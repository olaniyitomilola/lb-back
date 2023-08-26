const { DatabaseError } = require("../custom-errors/DatabaseError");
const { CourseError } = require("../custom-errors/CourseError");
const { getAllcourses,getUserCourses, getUser, createAccount, getUserDetails, getCourseAssessment, fetchCourseAssessment_user, insertCourseAssessment_user, fetchCourseUserAssessment } = require("../model/queries");
const { UserError } = require("../custom-errors/UserError");
const bcrypt = require('bcrypt');
const { GenerateToken } = require("../services/TokenServices");
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


const fetchCourseAssessments = async(req,res,next)=>{
    //TODO: authenticate with user ID
     const{courseId} = req.params;

     if(!courseId) return res.status(400).json({sucess: false, message: "Bad Request"})

     try {

        let courses = await getCourseAssessment(courseId);

        return res.status(200).json({success: true, courses})
        
     } catch (error) {
        if(error instanceof DatabaseError){
            console.log(error.message)
            return res.status(500).json({success: false, message: "Database Error", error})
        }
        return res.status(500).json({success: false, message: "Server Error"})
     }

}



const Authenticate = async(req,res,next) =>{
    const {email,password} = req.body;



    //validate email input true regex too
    if(!email || !password || !emailPattern.test(email)) return res.status(400).json({success: false , message: "Bad request: Check Email"})
    

    try {
        const user = await getUser(email);
        //no need to check unavailable user, handled in the query.
        const passwordMatch = await bcrypt.compare(password, user.password);

        if(passwordMatch){
            //generate token here and send
            const token = GenerateToken(email)
            return res.status(200).json({success : true, token})

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

const fetchUserDetails = async  (req,res)=>{
     const {email} = req.user;

     if(!email) return res.status(404).json({succes: false, message: "User not found"});

     try {
        const userDetails = await getUserDetails(email);
        const userCourses = await getUserCourses(userDetails.level,userDetails.language);
        return res.status(200).json({success : true, courses : userCourses, details : userDetails})
        
     } catch (error) {
        if(error instanceof UserError){
           return res.status(404).json({success: false, message: "Not found"})
        }
        return res.status(500).json({success: false, message: "Server Error"})

     }
}


const fetchUserAssessments = async  (req,res)=>{
    //Authenticate first
     const {email} = req.user;
     const{courseId} = req.params

     if(!email) return res.status(404).json({succes: false, message: "User not found"});
     if(!courseId) return res.status(404).json({succes: false, message: "User not found"});

     try {
        const userDetails = await getUserDetails(email);
        let userId = userDetails.id;

        let assessments = await fetchCourseUserAssessment(courseId,  userId);


        return res.status(200).json({success: true, assessments: assessments});
       
        
     } catch (error) {
        if(error instanceof UserError){
           return res.status(404).json({success: false, message: "Not found"})
        }
        return res.status(500).json({success: false, message: "Server Error"})

     }
}


const postUserAssessments = async  (req,res)=>{
    //Authenticate first
     const {email} = req.user;
     const{courseId} = req.params;


     if(!email) return res.status(401).json({succes: false, message: "User not found"});
     if(!courseId) return res.status(401).json({succes: false, message: "User not found"});

     try {
        const userDetails = await getUserDetails(email);

    
        let userId = userDetails.id;

        //confirm that entry doesn't exist already

        let check = await fetchCourseAssessment_user(courseId,userId)

        if(check.length) {

            return res.status(201).json({success: true});

        }

        let assessments = await insertCourseAssessment_user(courseId,userId);

        return res.status(201).json({success: true, assessments: assessments});
       
        
     } catch (error) {
        if(error instanceof UserError){
           return res.status(404).json({success: false, message: "Not found"})
        }
        console.log(error)
        return res.status(500).json({success: false, message: "Server Error"})

     }
}


const findUser = async(req,res,next) =>{
    const {email} = req.params;

  

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


module.exports = { postUserAssessments, fetchUserAssessments, fetchCourseAssessments, fetchUserDetails ,fetchAllCourses, fetchUserCourses, Authenticate, findUser,registerAccount};