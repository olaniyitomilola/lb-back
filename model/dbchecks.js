const { DatabaseError } = require('pg');
const {DB,checkIfDbExist, createLB,checkIfTableExists,createUserTable,createCoursesTable, createCourseAssessments, createCourseAssessmentUser} = require('./connect');


async function start(){
    try{
        await DB.connect();
        //check skimpy db
        let res = await checkIfDbExist(DB,'languagebuddy');
        


        if(!res){
            await createLB(DB,"languagebuddy");
            //create the tables too
            //create user table
            await createUserTable(DB);
        }else{

            //db exists, check tables
            //check users table
            let userCheck = await checkIfTableExists('users',DB)
            //if User table does not exist, create one
            if(!userCheck){
                await createUserTable(DB);
            }
            //check courses table
            let coursesCheck = await checkIfTableExists('courses', DB)

            if(!coursesCheck){
                await createCoursesTable(DB)
            }

            let courseAssessmentCheck = await checkIfTableExists('courseassessment', DB)

            if(!courseAssessmentCheck){
                await createCourseAssessments(DB)
                //create product table
            }

             let courseAssessmentUserCheck = await checkIfTableExists('course_assessment_user', DB)

            if(!courseAssessmentUserCheck){
                await createCourseAssessmentUser(DB)
                //create product table
            }

            // let ordersCheck = await checkIfTableExists('orders',DB)

            // if(!ordersCheck){
            //     await createOrderTable(DB);
            // }
            // let orderProductsCheck = await checkIfTableExists('order_products',DB);
            // if(!orderProductsCheck){
            //     await createOrderProductsTable(DB)
            // }

        }
       
        return true;

    }catch(error){
        throw new DatabaseError("Unable to Start DB");
    }
}

module.exports = start;