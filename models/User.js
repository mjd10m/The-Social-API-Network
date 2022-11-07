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
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref:'Thought'
            }
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref:'User'
            }
        ]

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