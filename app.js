const express = require('express')
const { Router } = require('express')
const mongoose = require('mongoose')

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const helmet = require('helmet')

const {
  create,
  signin,
  signout,
  testResult,
  requireSignin,
  userById,
  read,
} = require('./user.controller')
const config = require('./config')

const router = Router()
const app = express()

app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(helmet())

router.param('userId', userById)

router.route('/api/users').post(create)

router.route('/api/users/:userId').get(read)

router.route('/api/users/signin').post(signin)

router.route('/api/users/signout').get(signout)

router.route('/api/test/html').put(testResult)

app.use(router)

mongoose.Promise = global.Promise
mongoose.connect(config.mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${config.mongoUri}`)
})

const port = process.env.PORT || 8080

app.listen(port, () => {
  console.log('Server has been started')
})
