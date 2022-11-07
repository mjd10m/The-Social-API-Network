const router = require('express').Router()
const { getAllThought, addThought, getThoughtById, updateThought, removeThought } = require('../../controllers/thought-controller')

router
    .route('/')
    .get(getAllThought)
    .post(addThought)

router
    .route('/:id')
    .get(getThoughtById)
    .put(updateThought)
    .delete(removeThought)

router 
    .route('/:thoughtId/reactions')





module.exports = router