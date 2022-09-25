const router = require('express').Router();
const { userController } = require('../Controllers');
const authMiddleware = require('../middleware/auth');
const validateRequest = require('../middleware/validate');
const { catchAsync } = require('../utils/catchAsync');
const { userValidation } = require('../validations');

router.post('/key-validator', validateRequest(userValidation.userKeyValidator), catchAsync(userController.userKeyValidator));
router.post('/:userId/activate', authMiddleware, validateRequest(userValidation.activateUserProfile), catchAsync(userController.activateUserProfile));

module.exports = router