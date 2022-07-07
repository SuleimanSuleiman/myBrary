const express = require('express')
const router = express.Router()
const  authorControll = require('../controllers/authors')

router.get('/' , authorControll.index)
router.get('/add' , authorControll.add_get)
router.post('/add' , authorControll.add_post)
router.get('/:id' , authorControll.show_author)
router.get('/:id/edit',authorControll.edit_get)
router.put('/:id',authorControll.edit_put)
router.delete('/:id',authorControll.delete_author)

module.exports = router