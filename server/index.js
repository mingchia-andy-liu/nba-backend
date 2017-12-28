const express = require('express')
const app = express()
const helmet = require('helmet')
const cookieSession = require('cookie-session')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const logger = require('morgan')

const keys = require('./config/keys')
const PORT = process.env.PORT || 9999

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
app.use(logger('common'))
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


// Routes
app.use('/api', require('./routes'))

// Fallback
app.get('*', (req, res) => {
    res.sendStatus(400)
})


app.listen(PORT, () => {
    console.log(`👂 App is listening on the port ${PORT}`)
})
