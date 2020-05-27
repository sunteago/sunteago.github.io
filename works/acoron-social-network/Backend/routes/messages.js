const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const isAuth = require('../middleware/isAuth');

//messages/

router.get('/get-all', isAuth, messageController.getMessages);

router.post('/create', isAuth,messageController.postMessage);

router.delete('/:messageId', isAuth,messageController.deleteMessage);


module.exports = router;
