const mongoose = require('mongoose')


const bookSchema = new mongoose.Schema({
    title:{
        type:String,
        required: [true,"pleace input Title"],
    },
    datePublished:{
        type: Date,
        required: [true,"pleace input date of published"],
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    },
    PageCount:{
        type: Number,
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now
    },
    coverImageName: {
        type: String,
        required: true
    },
    coverImageType: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
})

bookSchema.virtual('coverImagePath').get(function() {
    if (this.coverImage != null && this.coverImageType != null) {
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
})

module.exports = mongoose.model('Book', bookSchema)