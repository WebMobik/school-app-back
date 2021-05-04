const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const { User } = require('./user.schema')
const config = require('./config')

const create = async (req, res) => {
  const user = new User(req.body)

  try {
    await user.save()
    return res.status(200).json({
      message: 'Successfully signed up !',
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
}

const signin = async (req, res) => {
  try {
    const user = await User.findOne({
      name: req.body.name,
    })

    if (!user) {
      return res.status(401).json({
        error: 'User not found',
      })
    }

    if (!user.authenticate(req.body.password)) {
      return res.status(401).send({
        error: "Email and password don't match.",
      })
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      config.jwtSecret
    )

    res.cookie('t', token, {
      expires: new Date(),
    })

    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
      },
    })
  } catch (err) {
    return res.status(401).json({
      error: 'Could not sign in',
    })
  }
}

const requireSignin = expressJwt({
    secret: config.jwtSecret,
    userProperty: 'auth',
    algorithms: ['HS256'],
})

const signout = (req, res) => {
    res.clearCookie('t')
    return res.status(200).json({
        message: 'signed out',
    })
}

const read = (req, res) => {
    req.profile.password = undefined
    return res.json(req.profile)
}

const userById = async (req, res, next, id) => {
    try {
        const user = await User.findById(id)
        if (!user) {
            return res.status(400).json({
                error: 'User not found',
            })
        }
        req.profile = user
        next()
    } catch (err) {
        console.log('i call');
        return res.status(400).json({
            error: 'Could not retrieve user',
        })
    }
}

const testResult = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.body._id,
            {$push: { tests: req.body.test }}
        )
        .exec()
        res.json(user)
    } catch (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
    }
}

module.exports = {
    requireSignin,
    userById,
    create,
    read,
    signin,
    signout,
    testResult
}
