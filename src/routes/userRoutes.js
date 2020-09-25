const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
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
  authController.restrictTo('admin', 'superAdmin'),
  userController.activateUser);

router
  .route('/')
  .get(authController.restrictTo('admin', 'superAdmin'), userController.getAllUsers)
  .post(authController.restrictTo('superAdmin'), userController.createUser);

router
  .route('/:id')
  .get(authController.restrictTo('admin', 'superAdmin'), userController.getUser)
  .patch(authController.restrictTo('superAdmin'), userController.updateUser)
  .delete(authController.restrictTo('superAdmin'), userController.deleteUser);

module.exports = router;
