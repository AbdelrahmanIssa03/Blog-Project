import mongoose, {DefaultSchemaOptions, Types} from 'mongoose';
import validator from 'validator'
import bcrypt from 'bcrypt'

const postsObj = new mongoose.Schema({
    content : String,
    totalNumberOfComments : Number,
    comments : [{author : String, content : String}]
})

// interface IUser extends mongoose.Document{
//     email: string
//     password :string
//     username : string
//     image :string
//     age:number
//     description : string
//     hobbies :Types.Array<string>
//     admin :boolean
//     totalNumberOfPosts:number
//     posts: Types.Array<typeof postsObj>
//     passwordChangedAt : Date
// }

// interface IUserMethods {
//     changedPasswordAfter(JWTTimestamp : any) : boolean
// }


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
        type : String
        // default : default prof pic
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
    totalNumberOfPosts: {
        type : Number,
        default : 0
    },
    posts: {
        type : [postsObj],
        default : []
    },
    passwordChangedAt : Date,
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