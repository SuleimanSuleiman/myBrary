const mongoose = require('mongoose')
const Book = require('./book')


const authorSchema = new mongoose.Schema({
    authorName:{
        type: String,
        required: true
    },

})

// authorSchema.pre('remove',async function (next){
//     await Book.find({author: this.id},(err,data) =>{
//         console.log(data)
//         if(err){
//             throw Error('we can not delete this author beacuse he have books')
//         }
//         else{
//             next()
//         }
        
//     })
// })

module.exports = mongoose.model('Author',authorSchema)