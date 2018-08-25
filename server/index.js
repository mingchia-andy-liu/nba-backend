const express = require('express')
const app = express()
const helmet = require('helmet')
const cookieSession = require('cookie-session')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const logger = require('morgan')
const RateLimit = require('express-rate-limit');

const keys = require('./config/keys')
const PORT = process.env.PORT || 8080

app.set('trust proxy', 'loopback')

// Middlewares
app.use(helmet({contentSecurityPolicy: {
    directives: {
        // This is the default policy for loading all content. Whatever is defined here applies to all the other type unless you set them to 'none'. In our case we are saying that any content coming from the same origin is allowed.
        defaultSrc: ["'self'"],

        // This is the policy for controlling the valid sources of fonts.
        fontSrc: ["'none'"],

        // This is the policy for controlling the valid sources of plugins like <object>, <embed>, or <applet>.
        objectSrc: ["'none'"],

        // This is the policy for controlling the valid sources of HTML5 media types like <audio> or <video>.
        mediaSrc: ["'none'"],

        // This is the policy for controlling the valid sources of frames.
        frameSrc: ["'none'"]
    },
}}))
if (process.env.NODE_ENV === 'development') {
    app.use(logger('dev'))
} else {
    // Only logs error
    app.use(logger('common', {
        skip: function (req, res) { return res.statusCode < 400 }
    }))
}
app.use(cookieParser({
    secret: keys.cookieKey,
}))
app.use(cookieSession({
    maxAge: 60 * 60 * 1000,   // in ms, 1 hour
    keys: [keys.cookieKey],
    sameSite: 'lax',
    cookie: {
        secure: true,
        httpOnly: true,
    }
}))
app.use(bodyParser.json())
const limiter = new RateLimit({
    windowMs: 60 * 1000, // in ms, 1 minute
    max: 5, // limit each IP to 100 requests per windowMs
    delayMs: 0 // disable delaying - full speed until the max limit is reached
});
app.use(limiter)

// db setup
require('./db')

// Routes
app.use('/api', require('./routes'))

// Fallback
app.get('*', (req, res) => {
    res.sendStatus(400)
})


app.listen(PORT, () => {
    console.log(`👂 App is listening on the port ${PORT}`)
})
