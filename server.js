var http = require('http')
var express = require('express')
var session = require("express-session")
var MongoDBStore = require("connect-mongodb-session")(session)
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var morgan = require("morgan")
var passport = require("passport")
var passportSocketIo = require('passport.socketio')
var flash = require("connect-flash")
var config = require("./config/database")
var port = process.env.PORT || 8080
var app = express()

var sessionstore = new MongoDBStore({
    url: config.database,
    collection: "mySessions"
})

sessionstore.on('error', function(error) {
    assert.ifError(error)
    assert.ok(false)
})
app.use(express.static(__dirname + '/public'))

app.use(session({
    secret: config.cookiesecret,
    cookie: {
        maxAge: 604800000
    },
    store: sessionstore,
    resave: true,
    saveUninitialized: true
}))


app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.set('view engine', 'ejs')

require("./app/routes.js")(app, passport)


var server = http.createServer(app)
var io = require('socket.io').listen(server)

require("./app/virtual-classroom")(io)

cookieParser = require('cookie-parser')
cookieParser({
    secret: config.cookiesecret
})

io.set("authorization", passportSocketIo.authorize({
    cookieParser: cookieParser,
    secret: config.cookiesecret,
    store: sessionstore,
    success: onAuthorizeSuccess
}))

require("./config/passport")(passport)

//
// mongoose.connect(config.database, function(err) {
//     if (err) return console.log(err)
// })
server.listen(port, function() {
    console.log('Cluster Hive is running at http://localhost:' + port)

})

function onAuthorizeSuccess(data, accept) {
    console.log('successful connection to socket.io');
    accept(null, true);
}
