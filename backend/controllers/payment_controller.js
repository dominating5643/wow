const database = require('../database/database.js');
const {siteHost} = require('../config.js');

class paymentController {
    constructor() {
        //this.sendEmailCode = this.sendEmailCode.bind(this);
    }

    async getOrderDescription(req, res) {
        try {
            let orderNumber = req.body.orderNumber;
            let data;
            try {
                data = await database.query('SELECT title, order_description, price FROM orders WHERE order_number = $1', [orderNumber]);
            } catch (error) {
                console.log('Error: ' + error);
                res.status(500);
                res.header('Access-Control-Allow-Origin', siteHost);
                res.header('Access-Control-Allow-Methods', 'POST');
                res.header('Access-Control-Allow-Headers', 'Content-Type');
                return res.json({en: 'Unexpected error of database', ru: 'Непредвиденная ошибка базы данных'});
            }
            data = data.rows[0];
            res.status(200);
            res.header('Access-Control-Allow-Origin', siteHost);
            res.header('Access-Control-Allow-Methods', 'POST');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            return res.json(data);
        } catch (error) {
            console.log('Error: ' + error);
            res.status(500);
            res.header('Access-Control-Allow-Origin', siteHost);
            res.header('Access-Control-Allow-Methods', 'POST');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            return res.json({en: 'Unexpected error', ru: 'Непредвиденная ошибка'});
        }
    }
}

module.exports = new paymentController();