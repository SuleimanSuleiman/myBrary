const express = require('express')
const Author = require('../models/author')
const Book = require('../models/book')

module.exports.index = async(req,res) =>{
    let query = Author.find()
    if(req.query.nameSearch != null && req.query.nameSearch != ''){
        query = query.regex('authorName',new RegExp(req.query.nameSearch,'i'))
    }
    try{ 
        const authors = await query.exec()
        res.render('authors/index.pug',{
            nameSearch: req.query.nameSearch,
            authors: authors
        })
    }catch(err){
        res.redirect('/')
    }
}
module.exports.add_get = (req,res) =>{
    try{
        res.render('authors/add.pug',{
            author: new Author()
        })
    }catch(err){
        console.log(err)
        res.redirect('/')
    }
}

module.exports.add_post = async(req,res) =>{

    const AuthorNew = new Author({
        authorName: req.body.authorName
    })

    try{
        await handleName(AuthorNew.authorName)
        await AuthorNew.save()
        res.redirect(`/authors/${AuthorNew.id}`)
    }catch(err){
        res.render('authors/add.pug',{
            author: AuthorNew,
            errorMessage: err.message
        })
    }
}

module.exports.show_author = async (req,res) =>{
    const theAuthor = await Author.findById(req.params.id)
    const books = await Book.find({author: theAuthor.id}).exec()
    try{
        res.render('authors/showAuthor.pug',{
            author: theAuthor,
            books: books
        })
    }catch(err){
        res.json(err)
        res.redirect('/')
    }
}

module.exports.edit_get = async(req,res) =>{

    const theAuthor = await Author.findById(req.params.id)

    try{
        res.render('authors/edit.pug',{
            author: theAuthor
        })
    }catch(err){
        console.log(err)
        res.redirect('/')
    }
}

module.exports.edit_put = async (req,res) =>{

    const theAuthor = await Author.findById(req.params.id)
    try{
        await handleName(req.body.authorName)
        theAuthor.authorName = req.body.authorName
        await theAuthor.save()
        res.redirect('/authors')
    }catch(error){
        res.render('authors/edit.pug',{
            author: theAuthor,
            errorMessage: error.message
        })
    }

}


module.exports.delete_author = async (req,res) =>{
    let theAuthor
    try{
        theAuthor = await Author.findById(req.params.id)
        await theAuthor.remove()
        res.redirect('/authors')
    }catch{
        if(theAuthor == null && theAuthor == ''){
            res.redirect('/authors')
        }else{
            res.redirect(`/authors/${theAuthor.id}`)
        }
    }
}
function handleName(name){
    if(name.match(/\s/ig)){
        throw Error('The Name should content  once word')
    }

    if(name.match(/[^a-zA-Z0-9]/ig)){
        throw Error('The Name should content from char or number')
    }
}