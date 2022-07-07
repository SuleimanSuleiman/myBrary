const Book = require('../models/book')
const Author = require('../models/author')
const fs = require('fs')

module.exports.get_add = async(req,res) =>{
    const authors = await Author.find()
    try{
        res.render('books/add.pug',{
            book: new Book(),
            authors: authors
        })
    }catch(err){
        console.log(err)
        res.redirect('/')
    }
}

module.exports.post_add = async (req,res) =>{
    const newBook = new Book({
        title: req.body.title,
        author: req.body.author,
        datePublished: req.body.datePublished,
        PageCount: req.body.PageCount,
        description: req.body.description,
        coverImageName: req.file.filename,
        coverImageType: req.file.mimetype
    })
    try{
        handleUploadImage(req.file)
        const book = await newBook.save()
        res.redirect(`/books/${book.id}`)
    }catch(err){
        handleErrorAddAndEdit(newBook,req.file.path,req.file.originalname,'add.pug')
    }
}

module.exports.show_Book = async (req,res) =>{

    const book = await Book.findById(req.params.id).populate('author').exec()

    try{
        res.render('books/show.pug',{book: book})
    }catch(err){
        res.redirect('/books')
    }
}

module.exports.edit_get = async (req,res) =>{
    const book = await Book.findById(req.params.id)
    const authors = await Author.find()
    try{
        res.render('books/edit.pug',{
            book: book,
            authors: authors
        })
    }catch(err){
        res.redirect('/books')
    }
}

module.exports.edit_put = async (req,res) =>{
    let booking
    try{
        booking = await Book.findById(req.params.id)
        booking.title          = req.body.title
        booking.author         = req.body.author
        booking.datePublished   = new Date(req.body.datePublished)
        booking.PageCount      = req.body.PageCount
        booking.description    = req.body.description
        booking.coverImageName = req.file.filename
        booking.coverImageType = req.file.mimetype
        handleUploadImage(req.file)
        await booking.save()
        res.redirect(`/books/${booking.id}`)
    }catch(err){
        handleErrorAddAndEdit(newBook,req.file.path,req.file.originalname,'edit.pug')
    }
}


module.exports.get_show =async (req,res) =>{
    let query = Book.find()
    if(req.query.title != null && req.query.title != ''){
        query = query.regex('title',new RegExp(req.query.title,'i'))
    }
    if(req.query.PublishedAfter != null && req.query.PublishedAfter != ''){
        query =query.lte("publishDate",req.query.PublishedAfter)
    }
    if(req.query.PublishedBefore != null && req.query.PublishedBefore != ''){
        query =query.gte("publishDate",req.query.PublishedBefore)
    }
    try{
        const books = await query.exec()
        res.render('books/index.pug',{
            searchValue: req.query,
            books: books
        })
    }catch(err){
        res.redirect('/books')
    }
}


module.exports.delete_book = async (req,res) =>{
    const theBook = await Book.findById(req.params.id)
    try{
        await theBook.remove()
        res.redirect('/books')
    }catch(err){
        console.log(err)
        res.redirect('/books')
    }
}

function handleUploadImage(file){
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        throw Error('the file is not Image')
    }
}

async function handleErrorAddAndEdit(theBook,filePath,fileOiginalname,nameFile){
    let errors = handleError(err)
    if(theBook != null && theBook != ''){
        fs.unlink(filePath,(err) =>{
            if(err){
                console.log(err)
            }else{
                console.log(`\nDeleted file: ${fileOiginalname}`)
            }
        })
    }
    const authors = await Author.find()
    res.render(`books/${nameFile}`,{
        authors: authors,
        book: newBook,
        errorMessage: errors
    })
}

function handleError(err){
    let errors = {
        title: "",
        author:"",
        datePublished: "",
        PageCount:"",
        description: "",
        coverImageName:"",
        coverImageType: ""
    }
    if(err.message.includes('Book validation failed')){
        Object.values(err.errors).forEach(error =>{
            errors[error.path] = error.message
        })
    }
    return errors
}


