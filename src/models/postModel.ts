import mongoose, { mongo } from 'mongoose'

const postSchema = new mongoose.Schema({
    author : {
        type : String,
        required : [true, 'A post must have an author'],
    },
    content : {
        type : String,
        required : [true, 'A post must have content inside']
    },
    totalNumberOfCommets : {
        type : Number,
        default : 0
    },
    comments : {
        type : [{author : String, content : String}],
        default : []
    }
})

export const Post = mongoose.model('Post', postSchema);
