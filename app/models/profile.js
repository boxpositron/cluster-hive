var mongoose = require("mongoose")
var Schema = mongoose.Schema

var ProfileSchema = new Schema({
    matricnumber: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    displayName: {
        type: String
    },
    name: {
        givenName: {
            type: String
        },
        familyName: {
            type: String
        }
    }
})


var Profile = mongoose.model("Profile", ProfileSchema)
module.exports = Profile
