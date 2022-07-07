const express = require('express')
const router  = express.Router()
const control = require('../controllers/books')
const multer  = require('multer')
const upload  = multer({
    dest: './upload'
})


router.get('/add',control.get_add)
router.post('/add',upload.single('file'),control.post_add)
router.get('/:id', control.show_Book)
router.get('/:id/edit', control.edit_get)
router.put('/:id' ,upload.single('file'),control.edit_put)
router.get('/',control.get_show)
router.delete('/:id',control.delete_book)

module.exports = router