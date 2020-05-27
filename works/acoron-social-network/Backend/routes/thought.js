const thoughtController = require('../controllers/thoughtController');
const express = require('express');
const isAuth = require('../middleware/isAuth');
const router = express.Router();
const { body } = require('express-validator');

//  /thoughts/...

router.get('/get-all', thoughtController.getThoughts);

router.get('/get-single/:thoughtId', thoughtController.getThought);

router.post('/create-new',
   [ body('thought.content').isLength({min: 1, max: 280})]
 ,isAuth, thoughtController.createThought);

router.delete('/:thoughtId', isAuth, thoughtController.deleteThought);

router.delete('/:thoughtId/comment/:commentId', isAuth, thoughtController.deleteComment);

router.post('/:thoughtId/comment', isAuth, thoughtController.postAddComment);
//mandar por body?

router.post('/:thoughtId/like', isAuth, thoughtController.postLikeThought);

router.post('/:thoughtId/comment/like', isAuth, thoughtController.postLikeComment);




module.exports = router;
