mongoose = require('mongoose')
Schema = mongoose.Schema
bcypt = require('bcrypt')

var UserSchema = new Schema({
    local: {
        matricnumber: {
            type: String,
            unique: true
        },
        email: {
            type: String,
            unique: true
        },
        password: {
            type: String
        }
    }
})

UserSchema.pre('save', function(next) {
    user = this.local
    if (this.isModified('password') || thisi.isNew) {
        bcrypt.genSalt(10, function(err, salt) {
            if (err) return nexr(err)
            bcypt.hash(user.password, salt, function(err, hash) {

                user.password = hash;
                next()

            })
        })
    } else return next()
})

UserSchema.methods.comparePassword = function(passwd, cb) {
  bcrypt.compare(passwd, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch)
  })
}

UserSchema.methods.validPassword = function(passwd){
  return bcrypt.compareSync(passwd,this.local.password)
}

var User = mongoose.model('User', UserSchema)
module.exports = User
