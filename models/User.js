const { Schema, model } = require('mongoose')
const { isEmail } = require('validator')

const UserSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            requred: true,
            trim: true 
        },
        email: {
            type: String,
            unique: true,
            requred: true,
            validate: [isEmail, 'invalid email']
        },
        thoughts: [],
        friends: []

    },
    {
        toJSON: {
            virtuals: true
        },
        id: false
    }
)

UserSchema.virtual('friendsCount').get(function() {
    return this.friends.length
})

const User = model('User', UserSchema)

module.exports = User