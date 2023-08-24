const express = require('express');
const { fetchAllCourses, fetchUserCourses, Authenticate, findUser, registerAccount, fetchUserDetails, fetchCourseAssessments, fetchUserAssessments, postUserAssessments } = require('../controller/controller');
const { VerifyToken } = require('../services/TokenServices');


const router = express.Router();

router.route('/').get(VerifyToken,fetchUserDetails);
router.route('/courses').get(fetchAllCourses);
router.route('/courses/:courseId').get(VerifyToken, fetchCourseAssessments);
router.route('/courses/user').post(fetchUserCourses);
router.route('/user/login').post(Authenticate);
router.route('/user/register').post(registerAccount);
router.route('/course/assessments/:courseId').get( VerifyToken, fetchUserAssessments).post(VerifyToken, postUserAssessments)

router.route('/user/register/:email').get(findUser);



module.exports = router;
