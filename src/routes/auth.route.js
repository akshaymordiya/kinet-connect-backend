const router = require('express').Router();
const validateRequest = require('../middleware/validate');
const { authValidation } = require('../validations');
const { authController } = require('../Controllers');
const { catchAsync } = require('../utils/catchAsync');
const authMiddleware = require('../middleware/auth');

router.post('/send-otp',validateRequest(authValidation.sendOTP), catchAsync(authController.sendOTP));
router.post('/verify-otp',validateRequest(authValidation.verifyOTP), catchAsync(authController.verifyOTP));
router.post('/sign-in', validateRequest(authValidation.manualLogin),catchAsync(authController.perfomManualLogin));
router.get('/refresh-tokens', catchAsync(authController.performAutoLogin));
router.get('/logout', authMiddleware, catchAsync(authController.handleLogout));
module.exports = router;
