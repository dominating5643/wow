const Router = require('express');
const productRouter = new Router();
const productController = require('../controllers/product_controller');
const authController = require('../controllers/auth_controller');

productRouter.post('/save_order', productController.saveOrder);
productRouter.options('/save_order', authController.sendOptions);
productRouter.post('/get_price_formation', productController.getPriceFormation);
productRouter.options('/get_price_formation', authController.sendOptions);
productRouter.post('/create_product', productController.createProduct);
productRouter.options('/create_product', authController.sendOptions);
productRouter.get('/get_user_products', productController.getUserProducts);
productRouter.options('/get_user_products', authController.sendOptions);
productRouter.get('/get_all_products', productController.getAllProducts);
productRouter.options('/get_all_products', authController.sendOptions);
productRouter.post('/create_other_product', productController.createOtherProduct);
productRouter.options('/create_other_product', authController.sendOptions);
productRouter.get('/get_user_other_products', productController.getUserOtherProducts);
productRouter.options('/get_user_other_products', authController.sendOptions);
productRouter.get('/get_all_other_products', productController.getAllOtherProducts);
productRouter.options('/get_all_other_products', authController.sendOptions);

module.exports = productRouter;