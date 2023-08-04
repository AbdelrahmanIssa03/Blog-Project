import mongoose from 'mongoose';
import validator from 'validator'
import isEmail from 'validator/lib/isEmail';
import bcrypt from 'bcrypt'

const postsObj = new mongoose.Schema({
    content : String,
    totalNumberOfComments : Number,
    comments : [{author : String, content : String}]
})

const userScheme = new mongoose.Schema({
    email:{
        type : String,
        required : [true, 'You need to enter an email address'],
        validate : [validator.isEmail, 'Enter a valid email address'],
        unique : true
    },
    password : {
        type : String,
        required : [true, 'You need to enter a password'],
        minLength : [8, 'Your password needs to be at least 8 characters'],
        maxLength : [20, 'Your passwords needs to be at most 20 characters'],
        select : false
    },
    username : {
        type: String,
        unique : true,
        required : [true, 'You need to enter a username'],
        minLength : [4, 'Your username needs to be at least 4 characters'],
        maxLength : [8, 'Your username needs to be at most 8 characters']
    },
    DateOfBirth: {
        type : Date,
        required : [true, 'You need to enter your data of birth'],
        max : Date()
    },
    gender : {
        type : String,
        required : [true, 'You need to enter your gender'],
        enum : {values : ['male', 'female',], message : `{VALUE} is not available`}
    },
    totalNumberOfPosts: {
        type : Number,
        min : [0, 'Total number of posts cant be less than 0'],
        default : 0
    },
    posts: {
        type : [postsObj],
        min : 0,
        default : []
    }
})

userScheme.pre('save', async function (next) : Promise<any> {
    try {
        if (!this.isModified('password')) {return next()}
        this.password! = await bcrypt.hash(this.password! ,12)
        next();
    }
    catch (err) {
        console.log (err)
    }
})

export const User = mongoose.model('User', userScheme);