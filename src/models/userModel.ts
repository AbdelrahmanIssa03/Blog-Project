import mongoose, {DefaultSchemaOptions, Types} from 'mongoose';
import validator from 'validator'
import bcrypt from 'bcrypt'

const postsObj = new mongoose.Schema({
    content : String,
    totalNumberOfComments : Number,
    comments : [{author : String, content : String}]
})

function validateImageFile(str: string) : boolean{
    let regex = new RegExp(/[^\s]+(.*?).(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/);
    if (str == null) {
        return false;
    }
    if (regex.test(str) == true) {
        return true;
    }
    else {
        return false;
    }
}

export const userScheme = new mongoose.Schema({
    email: {
        type : String,
        required : [true, 'Please enter an email address'],
        validate : [validator.isEmail, 'Please enter a valid email address'],
        unique : true
    },
    password : {
        type : String,
        required : [true, 'Please enter a password'],
        minLength : [8, 'Your password needs to be at least 8 characters'],
        maxLength : [25, 'Your passwords needs to be at most 25 characters'],
        select : false
    },
    username : {
        type: String,
        unique : true,
        required : [true, 'Please enter a username'],
        minLength : [4, 'Your username needs to be at least 4 characters'],
        maxLength : [16, 'Your username needs to be at most 16 characters']
    },
    image : { 
        type : String,
        validate : [validateImageFile, 'Please enter a valid image link']
    },
    age: {
        type : Number,
        required : [true, 'Please enter your age'],
        min : [16, 'You need to be at least 16 years old to register']
    },
    description : {
        type : String,
        required : [true, 'Please enter a description'],
        minLength : [40, 'The description needs to be at least 40 characters'],
        maxLength : [200, 'The description needs to be at most 200 characters']
    },
    hobbies : {
        type : [String],
        default : []
    },
    admin : {
        type : Boolean,
        default : false,
        select : false
    },
    passwordChangedAt : Date
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