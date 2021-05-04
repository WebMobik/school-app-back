const { Router } = require('express')
const {
    userById,
    requireSignin,
    create,
    read,
    signin,
    signout,
    testResult
} = require('./user.controller')

const router = Router()

router.route('/api/auth/signin')
    .post(signin)

router.route('/api/auth/signout')
    .get(signout)

router.route('/api/users')
    .post(create)
    
router.route('/api/users/:userId')
    .get(read)

router.route('/api/test/html')
    .put(requireSignin, testResult)

router.param('userId', userById)

module.exports = router