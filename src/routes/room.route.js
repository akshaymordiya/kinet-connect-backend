const router = require('express').Router();
const { roomController } = require('../Controllers');
const authMiddleware = require('../middleware/auth');
const validateRequest = require('../middleware/validate');
const { catchAsync } = require('../utils/catchAsync');
const { roomValidation } = require('../validations');

// router.get('/', authMiddleware, catchAsync(roomController.index))
router.post('/create', authMiddleware, validateRequest(roomValidation.createRoom), catchAsync(roomController.createRoom))

module.exports = router