const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const session = require('express-session')
const { ExpressOIDC } = require('@okta/oidc-middleware')

const okta = require('./okta')
const indexRouter = require('./routes/index')
const dashboardRouter = require('./routes/dashboard')
const profileRouter = require('./routes/profile')
const registrationRouter = require('./routes/register')
const resetPassword = require('./routes/reset-password')

const app = express()

const oidc = new ExpressOIDC({
  issuer: `${process.env.ORG_URL}/oauth2/default`,
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  redirect_uri: `${process.env.HOST_URL}/authorization-code/callback`,
  scope: 'openid profile',
})


console.log(">>>" + path.join(__dirname, 'views'));

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
//app.use(express.static(path.join(__dirname, '/public/build')))

app.use(session({
  secret: process.env.APP_SECRET,
  resave: true,
  saveUninitialized: false
}))

app.use(oidc.router)
app.use(okta.middleware)

/*app.use('/', indexRouter)
app.use('/dashboard', oidc.ensureAuthenticated(), dashboardRouter)
app.use('/profile', oidc.ensureAuthenticated(), profileRouter)
app.use('/register', registrationRouter)
app.use('/reset-password', resetPassword)*/
app.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

/*
// Conditionally serve the React build folder using the middleware
app.use('/', oidc.ensureAuthenticated(), express.static(path.join(__dirname, '/build')));

// Fallback for client-side routing: serve index.html for all other GET requests if authenticated
app.get('/*', oidc.ensureAuthenticated(), (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});*/

app.use('/', oidc.ensureAuthenticated(), express.static(path.join(__dirname, '/build')));

// Conditionally serve the React build folder using the middleware
//app.use('/', express.static(path.join(__dirname, 'public')));

// Fallback for client-side routing: serve index.html for all other GET requests if authenticated
/*app.get('/*', oidc.ensureAuthenticated(), (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});*/

// catch 404 and forward to error handler
/*app.use(function (req, res, next) {
  next(createError(404))
})*/

// error handler
/*
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})
*/

module.exports = { app, oidc }
