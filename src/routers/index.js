const router = require('express').Router()
const userRouter = require('./user')
const authRouter = require('./auth')
const tagRouter = require('./tag')
const coefficientRouter = require('./coefficient')
const languageRouter = require('./language')
const stopListRouter = require('./stopList')
const vacancyRouter = require('./vacancy')
const resumeRouter = require('./resume')
const articleRouter = require('./article')
const testimonialRouter = require('./testimonial')
const requestRegisterRouter = require('./requestRegister')
const requestForPointsRouter = require('./requestForPoints')
const agentsRouter = require('./agent')
const bookingsRouter = require('./booking')
const rewardsRouter = require('./reward')
const globalSettingRouter = require('./globalSetting')

router.use('/users', userRouter)
router.use('/auth', authRouter)
router.use('/tags', tagRouter)
router.use('/coefficients', coefficientRouter)
router.use('/languages', languageRouter)
router.use('/stopList', stopListRouter)
router.use('/vacancies', vacancyRouter)
router.use('/resume', resumeRouter)
router.use('/articles', articleRouter)
router.use('/testimonials', testimonialRouter)
router.use('/requestRegister', requestRegisterRouter)
router.use('/requestForPoints', requestForPointsRouter)
router.use('/agents', agentsRouter)
router.use('/bookings', bookingsRouter)
router.use('/rewards', rewardsRouter)
router.use('/globalSetting', globalSettingRouter)

module.exports = router