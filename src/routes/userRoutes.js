const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { SUPER_ADMIN, ADMIN } = require('../constants/roles');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logOut);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);
/**
 * @description use of middleware here to protect all routes below
 */

router.patch('/updateMyPassword', authController.updatePassword);

router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);
router.patch('/activateUser',
  authController.restrictTo(ADMIN, SUPER_ADMIN),
  userController.activateUser);

router
  .route('/')
  .get(authController.restrictTo(ADMIN, SUPER_ADMIN), userController.getAllUsers)
  .post(authController.restrictTo(SUPER_ADMIN), userController.createUser);

router
  .route('/:id')
  .get(authController.restrictTo(ADMIN, SUPER_ADMIN), userController.getUser)
  .patch(
    authController.restrictTo(ADMIN, SUPER_ADMIN),
    userController.updateUserRestrictions,
    userController.updateUser
  )
  .delete(authController.restrictTo(SUPER_ADMIN), userController.deleteUser);

module.exports = router;
