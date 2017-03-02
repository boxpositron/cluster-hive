database = require('./database-operation.js')
module.exports = function(app, passport, controller) {

    app.get('/', isLoggedIn, function(req, res) {
        res.redirect("/hive")
    });

    app.get('/hive', isLoggedIn, function(req, res) {
        res.render("hive")
    });


    app.get("/passport-reset", isLoggedIn, function(req, res) {
        res.render("passport-reset")
    })

    app.get("/about", isLoggedIn, function(req, res) {
        res.render("about")
    })

    app.get("/login", function(req, res) {
        res.render("login")
    })

    app.get("/logout", function(req, res) {
        req.logout()
        res.redirect('/')
    });

    app.post("/signup", passport.authenticate('local-signup', {
        successRedirect: "/home",
        failureRedirect: "/signup",
        failureFlash: true
    }));

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: "/home",
        failureRedirect: "/#login-modal",
        failureFlash: true
    }));


    app.use(isLoggedIn, function(req, res, next) {
        res.redirect("/hive")
    });

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) return next()
        res.redirect("/login")
    };
};
