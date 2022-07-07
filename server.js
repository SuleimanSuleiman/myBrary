require('dotenv').config()

const express        = require('express')
const app            = express()
const bodyparser     = require('body-parser')
const path           = require('path')
const authorRouting  = require('./router/authors')
const bookRouting    = require('./router/books')
const methodOverride = require('method-override')
const mongoose       = require('mongoose')


mongoose.connect('mongodb://localhost/exmple_myBrary', { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.log(error))
db.once('open', () => console.log('Connected to Mongoose'))


app.set('view engine','ejs')

app.use(bodyparser.urlencoded({limit: '10mb',extended:false}))
app.use(bodyparser.json())
app.use(express.static(path.join(__dirname,'/public')))
app.use(methodOverride('_method'))


app.use('/authors', authorRouting)
app.use('/books',  bookRouting)


app.listen(process.env.PORT,() =>console.log('Server Running ...'))