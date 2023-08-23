const { DatabaseError } = require('../custom-errors/DatabaseError');
const { UserError } = require('../custom-errors/UserError');
const {DB} = require('./connect');
const {v4: uuidv4} = require('uuid');



async function createAccount(first_name,last_name,email,password,level,language){
    const id = uuidv4()
    const query = `
    INSERT INTO users(id, first_name,last_name,password,level,email,language)
    VALUES($1,$2,$3,$4,$5,$6,$7);
    `
    try{
        await DB.query(query,[id, first_name,last_name,password,level,email,language])
        return true;
    } catch(err){
        throw new DatabaseError(`Unable to Add User: ${err}`)
    }
}

async function Addcourse(coursetitle, course_level,language,courseDescription, img_sources){
   //autogenerate uuid
    const id = uuidv4()
    const query = `
    INSERT INTO courses(id, courseTitle,courseDescription,image_sources,course_level,course_language)
    VALUES($1,$2,$3,$4,$5,$6);
    `
    try{
        await DB.query(query,[id, coursetitle,courseDescription,img_sources,course_level,language])
        return true;

    } catch(err){
        throw new DatabaseError(`Unable to Add course: ${err}`)
    }
}

async function getAllcourses(){
    const query = `
        SELECT * FROM courses;
    `
    try{
            let result = await DB.query(query);
            return result.rows;

    } catch(err){
        throw new DatabaseError(`Unable to fetch courses from database`)
    }
}

async function getUserCourses(level,language){
    const query = `
        SELECT * FROM courses
        WHERE course_level = $1 AND course_language = $2;
    `
    try{
            let result = await DB.query(query,[level,language]);
            return result.rows;

    } catch(err){
        throw new DatabaseError(`Unable to fetch courses from database : ${err}`)
    }
}


async function getAllUsers(){
    const query = `
        SELECT * FROM users
        
    `
    try{
            let result = await DB.query(query);
           
            return result.rows;

    } catch(err){
        if(err instanceof UserError) throw  err
        throw new DatabaseError('error fetching user')
    }
}


async function getUser(email){
    const query = `
        SELECT * FROM users
        WHERE email = $1;
    `
    try{
            let result = await DB.query(query,[email]);
            if(!result.rows.length){
                console.log("error thrown")
                throw new UserError('User does not Exist');
                
            }
            console.log("fetched")
            return result.rows[0];

    } catch(err){
        if(err instanceof UserError) throw  err
        throw new DatabaseError('error fetching user')
    }
}


async function getUserDetails(email){
    const query = `
        SELECT id,email,first_name,last_name,level,language  FROM users
        WHERE email = $1;
    `
    try{
            let result = await DB.query(query,[email]);
            if(!result.rows.length){
                console.log("error thrown")
                throw new UserError('User does not Exist');
                
            }
            console.log("fetched")
            return result.rows[0];

    } catch(err){
        if(err instanceof UserError) throw  err
        throw new DatabaseError('error fetching user')
    }
}

async function insertCourseAssessment(courseId,question,option_a,option_b,option_c,option_d,correct_answer){
    const query = `
    INSERT INTO courseassessment(course_id, question,option_a,option_b,option_c,option_d,correct_answer)
    VALUES($1,$2,$3,$4,$5,$6,$7);
    `
    try{
        await DB.query(query,[courseId,question,option_a,option_b,option_c,option_d,correct_answer])
        return true;

    } catch(err){
        throw new DatabaseError(`Unable to Add courseAssement: ${err}`)
    }
}



async function fetchAllCourseAssessment(){
    const query = `
    SELECT * FROM courseassessment
    `
    try{
       let result = await DB.query(query)
        return result.rows;

    } catch(err){
        throw new DatabaseError(`Unable to Add courseAssement: ${err}`)
    }
}



async function fetchCourseAssessment(course_id){
    const query = `
    SELECT * FROM courseassessment
    WHERE course_id = $1
    `
    try{
       let result = await DB.query(query,[course_id])
        return result.rows;

    } catch(err){
        throw new DatabaseError(`Unable to fetch assessments: ${err}`)
    }
}


module.exports = { fetchCourseAssessment, fetchAllCourseAssessment,  insertCourseAssessment, getUserDetails , getAllUsers,createAccount,getAllcourses,Addcourse,getUserCourses,getUser};