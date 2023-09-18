'use-strict';
const { courses } = require('./data');
const {
  Addcourse,
  getAllcourses,
  getAllUsers,
  insertCourseAssessment,
  fetchAllCourseAssessment,
  fetchCourseAssessment,
  fetchAllCourseAssessment_user,
} = require('./model/queries');
const router = require('./route/api');
const cors = require('cors');
const http = require('http');
const initializeWebSocket = require('./services/socket');

const start = require('./model/dbchecks');

const express = require('express');
const {
  conversationQuestions,
  historyQuestions,
  germanLiteratureQuestions,
  franceCultureAndLanguageQuestions,
  frenchForBeginnersQuestions,
  frenchForBeginners2Questions,
} = require('./questions');
const { dropTable } = require('./model/connect');
const app = express();
const port =  3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', router);


require('dotenv').config();

// check that all db is set before starting server
async function startApp() {
  try {
    let allset = await start();

    if (allset) {
      app.listen(port, async  () => {
        console.log(`App is listening on port ${port}`);

       
      
      });
    } else {
      console.error('Something wrong with the db');
    }
  } catch (error) {
    console.error(error.message);
  }
}

startApp();

