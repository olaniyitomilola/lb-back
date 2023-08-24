'use-strict';
const {courses} = require('./data')
const {Addcourse,getAllcourses,getAllUsers, insertCourseAssessment, fetchAllCourseAssessment, fetchCourseAssessment, fetchAllCourseAssessment_user} = require('./model/queries')
const router = require('./route/api');
const cors = require('cors');

require('dotenv').config()

const start = require('./model/dbchecks');

const express = require('express');
const {conversationQuestions, historyQuestions, germanLiteratureQuestions, franceCultureAndLanguageQuestions, frenchForBeginnersQuestions, frenchForBeginners2Questions} = require('./questions');
const { dropTable } = require('./model/connect');
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/', router)

//check that all db is set before starting server

async function startApp(){

    try {
        let allset = await start();

        if(allset){
        app.listen(port,()=>{
            console.log(`App is listening on port ${port}`)
        })
        
        let courseId = "cb2ff504-381a-485d-8aa6-813dbed44ec6"
      //  console.log(await fetchCourseAssessment(courseId));
       
        // frenchForBeginners2Questions.forEach(async (question)=>{
        //     await insertCourseAssessment(courseId, question.question, question.option_a, question.option_b, question.option_c, question.option_d, question.correct_answer);
        // })
      // console.log(await getAllUsers())
        
       
       
        }else{
            console.error('Something wrong with db')
        }
        
    } catch (error) {
            console.error(error.message);
        
    }

    
}

startApp()
 