var LocalStrategy = require("passport-local").Strategy
// require("../app/database-operation.js")

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id)
    })

    passport.deserializeUser(function(id, done) {
        findUserById(id, function(err, user) {
            done(err, user)
        })
    })


    passport.use('local-login', new LocalStrategy({
                usernameField: 'username',
                passportField: 'password',
                passReqToCallback: true
            },
            function(req, username, password, done) {
                process.nextTick(function() {
                    findUser(username, username, function(err, user) {
                        if (err) return done(err)

                        if (!user) {
                            return done(null, false, req.flash('loginMessage', "Invalid Username or Password"))
                        }

                        if (!user.validPassword(password)) return done(null, false, req.flash('loginMessage', "Invalid Username or Password"))
                        return done(null, user)
                    })
                })
            }),
        function(err, user) {
            if (err) return done(err, false)
            if (user) done(null, user)
            else done(null, false)
        })

    passport.use('local-signup', new LocalStrategy({
            usernameField: "username",
            passwordField: "password",
            passReqToCallback: true
        },
        function(req, username, password, done) {
            process.nextTick(function() {
                findUser(username, req.body.email,
                    function(err, user) {
                        if (err) return done(err)
                        if (user) {
                            if (user.local.username == req.body.username) return done(null, false, req.flash('signupMessage', 'Username is already taken'))
                            if (user.local.email == req.body.email) return done(null, false, req.flash('emailMessage', "That email address is registered to another account"))
                        } else {

                            createProfile(req.body, function(err, profile) {
                                if (err) {
                                    console.log(err)
                                    return done(null, false)
                                }
                            })
                            createUser(username, req.body.email, password, function(err, user) {
                                if (err) {
                                    console.log(err)
                                    return done(null, false)
                                }
                                return done(null, user)
                            })
                        }
                    })
            })
        }))


}
