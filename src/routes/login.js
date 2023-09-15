const express = require('express');
const loginController = require('../controller/loginController');

const router = express.Router();

router.get('/login', loginController.login);
router.post('/login', loginController.authenticate);
router.get('/register', loginController.register);
router.post('/register', loginController.storeuser);
router.get('/logout', loginController.logout);


module.exports = router;