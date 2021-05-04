const express = require('express')
const mongoose = require('mongoose')

const cookieParser = require('cookie-parser')
const cors = require('cors')
const helmet = require('helmet')
const config = require('./config')
const userRouter = require('./user.routes')

const app = express()

app.use(cors({origin: 'http://localhost:3000', credentials: true}))
app.use(express.json())
app.use(cookieParser())
app.use(helmet())

app.use('/', userRouter)

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
