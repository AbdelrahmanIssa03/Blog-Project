import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
    author : {
        type : String,
        required : [true, "A comment must have an author"]
    },
    content : {
        type : String,
        required : [true, "A comment must have content inside of it"]
    }
})

export const Comment = mongoose.model('comment', commentSchema);