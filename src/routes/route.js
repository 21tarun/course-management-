const express =require('express')
const router= express.Router()

const controller= require('../controllers/controller')
const middleware=require('../middleware/auth')


router.post('/signUp',controller.createEmployee)
router.post('/signIn',controller.signIn)


router.post('/course',middleware.authentication,controller.createCourse)
router.put('/course/:courseId',middleware.authentication,controller.updateCourse)
router.delete('/course/:courseId',middleware.authentication,controller.deleteCourse)


router.put('/approvedCourse/:courseId',middleware.authentication,controller.approvedCourse)

router.get('/courses',middleware.authentication,controller.getCourses)
router.get('/sortCourses',middleware.authentication,controller.sortCourses)









module.exports=router