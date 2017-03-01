module.exports = function() {

    createProfile = function(credentials) {
            var newProfile = new Profile({
                'matricnumber': credentials['matricnumber'],
                'email': credentials['email'],
                'displayName': credentials['firstname'] + " " + credentials['lastname'],
                'name': {
                    'givenName': credentials['firstname'],
                    'familyName': credentials['lastname']
                }
            })

            newProfile.save(function(err) {
                if (err) return (err, false)
                console.log("saving profile")
                return (null, newProfile)
            })
        },


        loadProfile = function(username, next) { // user is the username as a string
            Profile.findOne({
                username: username
            }, function(err, profile) {
                if (err) {
                    // console.log(err)
                    console.log("An error occured loading profiles")
                    return next(err, false)
                }
                return next(null, profile)
            })
        },

        findUserById = function(id, next) {
            User.findById(id, function(err, user) {
                return next(err, user)
            })
        },

        findUser = function(username, email, next) {
            User.findOne({
                $or: [{
                    'local.username': username
                }, {
                    'local.email': email
                }]
            }, function(err, user) {
                if (err) return next(null, false)
                if (user) return next(null, user)
                if (!user) return next(null, false)
            })
        },

        createUser = function(username, email, password, next) {
            var newUser = new User({
                'local.username': username,
                'local.email': email,
                'local.password': password
            })

            newUser.save(function(err) {
                if (err) return next(null, false)
                return next(null, newUser)
            })
        },

        createUser = function(username, email, password, next) {
            var newUser = new User({
                'local.username': username,
                'local.email': email,
                'local.password': password
            })

            newUser.save(function(err) {
                if (err) return next(null, false)
                return next(null, newUser)
            })
        }

}
