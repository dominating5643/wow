const Router = require('express');
const adminRouter = new Router();
const adminController = require('../controllers/admin_controller');
const authController = require('../controllers/auth_controller');

adminRouter.get('/is_admin', adminController.isAdmin);
adminRouter.options('/is_admin', authController.sendOptions);

module.exports = adminRouter;