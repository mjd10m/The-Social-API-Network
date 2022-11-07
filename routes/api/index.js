const router = require('express').Router();
const userRoutes = require('./user-routes');
const thoughtRoutes = require('./thought-routes')

router.use('/pizzas', userRoutes);
router.use('/comments', thoughtRoutes)

module.exports = router;