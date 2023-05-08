const Router = require('express');
const authRouter = new Router();
const authController = require('../controllers/auth_controller');

authRouter.post('/send_email_code', authController.sendEmailCode);
authRouter.options('/send_email_code', authController.sendOptions);
authRouter.post('/sign_in', authController.singIn);
authRouter.options('/sign_in', authController.sendOptions);
authRouter.post('/send_code_again', authController.sendCodeAgain);
authRouter.options('/send_code_again', authController.sendOptions);
authRouter.post('/log_in', authController.logIn);
authRouter.options('/log_in', authController.sendOptions);
authRouter.get('/check_token', authController.checkToken);
authRouter.options('/check_token', authController.sendOptions);
authRouter.post('/send_refresh_email_code', authController.sendRefreshEmailCode);
authRouter.options('/send_refresh_email_code', authController.sendOptions);
authRouter.post('/check_access_code_on_server', authController.checkAccessCodeOnServer);
authRouter.options('/check_access_code_on_server', authController.sendOptions);
authRouter.post('/change_user_password', authController.changeUserPassword);
authRouter.options('/change_user_password', authController.sendOptions);

module.exports = authRouter;