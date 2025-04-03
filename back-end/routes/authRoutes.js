const express = require('express');
const router = express.Router();
const authController = require('../controllers/loginController');
const authMiddleware =  require('../middleware/authMiddleware')
const auth = require('../controllers/UpdatePassword')

router.post('/login', authController.login);
router.get("/token-refresh/:token" ,authController.token_refresh)
router.put('/update-password',  authMiddleware.protect, auth.updatePassword );

module.exports = router;