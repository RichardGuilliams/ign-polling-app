const crypto = require('crypto'); 
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
{   
    name: {
        type: String,
        required: [true, 'A user needs to have a name ']},
    email: {
        type: String,
        required: [true, 'a user must have an email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'please provide a valid email address']
    },
    photo: {
        type: String,
        default: 'default.jpg'

    },
    role:{
        type: String,
        enum: ['user', 'subscriber', 'moderator', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'a user must have a password'],
        minLength: [8, 'a password must contain at least 8 characters'],
        maxLength: [40, 'a password can be no longer than 40 characters']
    },
    passwordConfirm: {
        type: String,
        required: [true, 'a user must confirm their password'],
        validate: {
            // This only works on SAVE
            validator: function(el) {
                return el === this.password;
            },
            message: 'Password and passworn confirm do not match'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    pollsVotedOn: {
        type: [Object],
    }
})

userSchema.pre('save', async function(next){
    //Only run if password was modified
    if(!this.isModified('password')) return next();

    // Hash the password
    this.password = await bcrypt.hash(this.password, 12);

    //Prevent persisting the password confirm in the database
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre('save', function(next){
    if(!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt){
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }

    return false;
}

userSchema.pre(/^find/, function(next){
    //this points to current query
    this.find({active: {$ne: false}});
    next();
})

userSchema.methods.createPasswordResetToken = function(){
const resetToken = crypto.randomBytes(32).toString('hex');

this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

return resetToken
}

const User = mongoose.model('User', userSchema);

module.exports = User;