const Router = require('express');
const paymentRouter = new Router();
const paymentController = require('../controllers/payment_controller');
const authController = require('../controllers/auth_controller');

paymentRouter.post('/get_order_description', paymentController.getOrderDescription);
paymentRouter.options('/get_order_description', authController.sendOptions);

module.exports = paymentRouter;