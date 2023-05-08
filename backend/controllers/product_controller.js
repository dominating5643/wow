const database = require('../database/database.js');
const cookieService = require('../services/cookie_service.js');
const jwt = require('jsonwebtoken');
const {secret, siteHost} = require('../config.js');

class productController {
    constructor() {
        //this.sendEmailCode = this.sendEmailCode.bind(this);
    }

    async saveOrder(req, res) {
        try {
            const tokenFromReq = cookieService.findCookieByKey(req, 'token');

            try {
                let data = jwt.verify(tokenFromReq, secret);
                let token;
                data = await database.query('SELECT * FROM person WHERE email = $1', [data.email]);
                if (data.rows.length === 1) {
                    data = data.rows[0];
                    token = data.token;
                } else {
                    res.status(409);
                    res.header('Access-Control-Allow-Origin', siteHost);
                    res.header('Access-Control-Allow-Methods', 'POST');
                    res.header('Access-Control-Allow-Headers', 'Content-Type');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    return res.json('More than one account registered with email');
                }

                if (tokenFromReq === token) {
                    try {
                        let title = req.body.title;
                        const sendingData = req.body.data;
                        let dataForPriceFormation = await database.query('SELECT price_data FROM price_formation WHERE price_name = $1', [title]);
                        dataForPriceFormation = JSON.parse(dataForPriceFormation.rows[0].price_data);

                        //Price and description formation
                        let orderDescription = 'radio:\n';
                        let price = dataForPriceFormation.base_price;
                        let coef = 1;

                        for (let key in dataForPriceFormation.radio) {
                            orderDescription += '    ' + key + ':\n';
                            orderDescription += '        ' + sendingData.radio[key] + ',\n';
                            const optionsObject = dataForPriceFormation.radio[key][sendingData.radio[key]];
                            if (optionsObject.is_coef) {
                                coef *= optionsObject.value;
                            } else {
                                price += optionsObject.value;
                            }
                        }
                        orderDescription += 'range:\n';
                        for (let key in dataForPriceFormation.range) {
                            orderDescription += '    ' + key + ':\n';
                            orderDescription += '        ' + sendingData.range[key] + ',\n';
                            const optionsObject = dataForPriceFormation.range[key];
                            if (optionsObject.is_coef) {
                                coef *= sendingData.range[key] * optionsObject.value;
                            } else {
                                price += sendingData.range[key] * optionsObject.value;
                            }
                        }
                        orderDescription += 'checkbox:\n';
                        for (let key in dataForPriceFormation.checkbox) {
                            orderDescription += '    ' + key + ':\n';
                            for (let item of sendingData.checkbox[key]) {
                                orderDescription += '        ' + item + ',\n';
                                const optionsObject = dataForPriceFormation.checkbox[key][item];
                                if (optionsObject.is_coef) {
                                    coef *= optionsObject.value;
                                } else {
                                    price += optionsObject.value;
                                }
                            }
                        }
                        orderDescription += 'select:\n';
                        for (let key in dataForPriceFormation.select) {
                            orderDescription += '    ' + key + ':\n';
                            orderDescription += '        ' + sendingData.select[key] + ',\n';
                            const optionsObject = dataForPriceFormation.select[key][sendingData.select[key]];
                            if (optionsObject.is_coef) {
                                coef *= optionsObject.value;
                            } else {
                                price += optionsObject.value;
                            }
                        }
                        price *= coef;
                        price = price.toFixed(2);

                        let userData = await database.query('SELECT * FROM person WHERE email = $1', [data.email]);
                        userData = userData.rows[0];

                        // Formation title
                        title = title.replace(/_/g, ' ');
                        title = title[0].toUpperCase() + title.slice(1);

                        //get current order number
                        let orderNumder = await database.query('SELECT * FROM current_order_number');
                        orderNumder = Number(orderNumder.rows[0].order_number) + 1;

                        let count = 1;
                        let tempOrderNumber = orderNumder;
                        let newOrderNumber = '';
                        while (tempOrderNumber > 9) {
                            tempOrderNumber = Math.floor(tempOrderNumber / 10);
                            count++;
                        }
                        for (let i = 0; i < 6 - count; i++) {
                            newOrderNumber += '0';                       
                        }
                        newOrderNumber += orderNumder;
                        
                        try {
                            await database.query('INSERT INTO orders (order_number, id, email, nickname, tlg, title, order_description, price) values ($1, $2, $3, $4, $5, $6, $7, $8)', [newOrderNumber, data.id, data.email, data.nickname, data.tlg, title, orderDescription, price]);
                            await database.query('UPDATE current_order_number SET order_number = $2 WHERE order_number = $1', [orderNumder - 1, orderNumder]);
                        } catch (error) {
                            console.log('Error: ' + error)
                            res.status(500);
                            res.header('Access-Control-Allow-Origin', siteHost);
                            res.header('Access-Control-Allow-Methods', 'POST');
                            res.header('Access-Control-Allow-Headers', 'Content-Type');
                            res.header('Access-Control-Allow-Credentials', 'true');
                            return res.json({en: 'Unexpected database error', ru: 'Непредвиденная ошибка базы данных'});
                        }

                        res.status(200);
                        res.header('Access-Control-Allow-Origin', siteHost);
                        res.header('Access-Control-Allow-Methods', 'POST');
                        res.header('Access-Control-Allow-Headers', 'Content-Type');
                        res.header('Access-Control-Allow-Credentials', 'true');
                        res.header('Access-Control-Allow-Credentials', 'true');
                        return res.json(newOrderNumber);
                    } catch (error) {
                        console.log('Error: ' + error)
                        res.status(409);
                        res.header('Access-Control-Allow-Origin', siteHost);
                        res.header('Access-Control-Allow-Methods', 'POST');
                        res.header('Access-Control-Allow-Headers', 'Content-Type');
                        res.header('Access-Control-Allow-Credentials', 'true');
                        return res.json('Ordering error');
                    }
                } else {
                    res.status(409);
                    res.header('Access-Control-Allow-Origin', siteHost);
                    res.header('Access-Control-Allow-Methods', 'POST');
                    res.header('Access-Control-Allow-Headers', 'Content-Type');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    return res.json('Tokens don\'t match');
                }
            } catch (error) {
                res.status(401);
                res.header('Access-Control-Allow-Origin', siteHost);
                res.header('Access-Control-Allow-Methods', 'POST');
                res.header('Access-Control-Allow-Headers', 'Content-Type');
                res.header('Access-Control-Allow-Credentials', 'true');
                return res.json('Invalid token');        

            }
        } catch (error) {
            console.log('Error: ' + error);
            res.status(500);
            res.header('Access-Control-Allow-Origin', siteHost);
            res.header('Access-Control-Allow-Methods', 'POST');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            res.header('Access-Control-Allow-Credentials', 'true');
            return res.json({en: 'Unexpected registration error', ru: 'Непредвиденная ошибка регистации'});
        }
    }

    async getPriceFormation(req, res) {
        try {
            try {
                const title = req.body.title;
                let dataForPriceFormationTitles = await database.query('SELECT price_name FROM price_formation');
                dataForPriceFormationTitles = dataForPriceFormationTitles.rows;

                let titleIsValid = false;
                dataForPriceFormationTitles.forEach(data => {
                    if (data.price_name == title) {
                        titleIsValid = true;
                    }
                });

                if (titleIsValid) {
                    let dataForPriceFormation = await database.query('SELECT price_data FROM price_formation WHERE price_name = $1', [title]);
                    dataForPriceFormation = JSON.parse(dataForPriceFormation.rows[0].price_data);

                    res.status(200);
                    res.header('Access-Control-Allow-Origin', siteHost);
                    res.header('Access-Control-Allow-Methods', 'POST');
                    res.header('Access-Control-Allow-Headers', 'Content-Type');
                    return res.json(dataForPriceFormation);
                } else {
                    console.log('Error: ' + error);
                    res.status(400);
                    res.header('Access-Control-Allow-Origin', siteHost);
                    res.header('Access-Control-Allow-Methods', 'POST');
                    res.header('Access-Control-Allow-Headers', 'Content-Type');
                    return res.json({en: 'Bad Request', ru: 'Неккоректные данные'});
                }

            } catch (error) {
                console.log('Error: ' + error);
                res.status(500);
                res.header('Access-Control-Allow-Origin', siteHost);
                res.header('Access-Control-Allow-Methods', 'POST');
                res.header('Access-Control-Allow-Headers', 'Content-Type');
                return res.json({en: 'Unexpected error of database', ru: 'Непредвиденная ошибка базы данных'});
            }
        } catch (error) {
            console.log('Error: ' + error);
            res.status(500);
            res.header('Access-Control-Allow-Origin', siteHost);
            res.header('Access-Control-Allow-Methods', 'POST');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            return res.json({en: 'Unexpected error', ru: 'Непредвиденная ошибка'});
        }
    }
    async createProduct(req, res) {
        try {
            if (req.body.status === 'OK') {
                let order;
                try {
                    order = await database.query('SELECT * FROM orders WHERE order_number = $1', [req.body.orderNumber]);
                } catch (error) {
                    console.log('Error: ' + error);
                    res.status(500);
                    res.header('Access-Control-Allow-Origin', siteHost);
                    res.header('Access-Control-Allow-Methods', 'POST');
                    res.header('Access-Control-Allow-Headers', 'Content-Type');
                    return res.json({en: 'Unexpected error of database', ru: 'Непредвиденная ошибка базы данных'});
                }

                order = order.rows[0];
                const date = new Date;
                const currentDate = `${(date.getDate() < 10) ? '0' + date.getDate() : date.getDate()}.${(date.getMonth() + 1 < 10) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}.${(date.getFullYear() % 100 < 10) ? '0' + (date.getFullYear() % 100) : date.getFullYear() % 100}`;

                try {
                    await database.query('INSERT INTO products (order_number, id, email, nickname, tlg, title, order_description, price, create_date) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [order.order_number, order.id, order.email, order.nickname, order.tlg, order.title, order.order_description, order.price, currentDate]);
                } catch (error) {
                    console.log('Error: ' + error);
                    res.status(500);
                    res.header('Access-Control-Allow-Origin', siteHost);
                    res.header('Access-Control-Allow-Methods', 'POST');
                    res.header('Access-Control-Allow-Headers', 'Content-Type');
                    return res.json({en: 'Unexpected error of database', ru: 'Непредвиденная ошибка базы данных'});
                }

                res.status(200);
                res.header('Access-Control-Allow-Origin', siteHost);
                res.header('Access-Control-Allow-Methods', 'POST');
                res.header('Access-Control-Allow-Headers', 'Content-Type');
                return res.json({status: 'OK'});
            } else {
                console.log('Error: ' + error);
                res.status(400);
                res.header('Access-Control-Allow-Origin', siteHost);
                res.header('Access-Control-Allow-Methods', 'POST');
                res.header('Access-Control-Allow-Headers', 'Content-Type');
                return res.json({en: 'Bad Request', ru: 'Неккоректные данные'});
            }
        } catch (error) {
            console.log('Error: ' + error);
            res.status(500);
            res.header('Access-Control-Allow-Origin', siteHost);
            res.header('Access-Control-Allow-Methods', 'POST');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            return res.json({en: 'Unexpected error', ru: 'Непредвиденная ошибка'});
        }
    }
    async getUserProducts(req, res) {
        try {
            const tokenFromReq = cookieService.findCookieByKey(req, 'token');

            try {
                let data = jwt.verify(tokenFromReq, secret);
                let token;
                data = await database.query('SELECT * FROM person WHERE email = $1', [data.email]);
                if (data.rows.length === 1) {
                    data = data.rows[0];
                    token = data.token;
                } else {
                    res.status(409);
                    res.header('Access-Control-Allow-Origin', siteHost);
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Headers', 'Content-Type');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    return res.json('More than one account registered with email');
                }

                if (tokenFromReq === token) {
                    try {  
                        try {
                            data = await database.query('SELECT * FROM products WHERE email = $1', [data.email]);
                        } catch (error) {
                            console.log('Error: ' + error)
                            res.status(500);
                            res.header('Access-Control-Allow-Origin', siteHost);
                            res.header('Access-Control-Allow-Methods', 'GET');
                            res.header('Access-Control-Allow-Headers', 'Content-Type');
                            res.header('Access-Control-Allow-Credentials', 'true');
                            return res.json({en: 'Unexpected database error', ru: 'Непредвиденная ошибка базы данных'});
                        }

                        res.status(200);
                        res.header('Access-Control-Allow-Origin', siteHost);
                        res.header('Access-Control-Allow-Methods', 'GET');
                        res.header('Access-Control-Allow-Headers', 'Content-Type');
                        res.header('Access-Control-Allow-Credentials', 'true');
                        res.header('Access-Control-Allow-Credentials', 'true');
                        return res.json(data.rows);
                    } catch (error) {
                        console.log('Error: ' + error)
                        res.status(409);
                        res.header('Access-Control-Allow-Origin', siteHost);
                        res.header('Access-Control-Allow-Methods', 'GET');
                        res.header('Access-Control-Allow-Headers', 'Content-Type');
                        res.header('Access-Control-Allow-Credentials', 'true');
                        return res.json('Geting products error');
                    }
                } else {
                    res.status(409);
                    res.header('Access-Control-Allow-Origin', siteHost);
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Headers', 'Content-Type');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    return res.json('Tokens don\'t match');
                }
            } catch (error) {
                res.status(401);
                res.header('Access-Control-Allow-Origin', siteHost);
                res.header('Access-Control-Allow-Methods', 'GET');
                res.header('Access-Control-Allow-Headers', 'Content-Type');
                res.header('Access-Control-Allow-Credentials', 'true');
                return res.json('Invalid token');       

            }
        } catch (error) {
            console.log('Error: ' + error);
            res.status(500);
            res.header('Access-Control-Allow-Origin', siteHost);
            res.header('Access-Control-Allow-Methods', 'GET');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            res.header('Access-Control-Allow-Credentials', 'true');
            return res.json({en: 'Unexpected registration error', ru: 'Непредвиденная ошибка регистации'});
        }
    }
    async getAllProducts(req, res) {
        try {
            const tokenFromReq = cookieService.findCookieByKey(req, 'token');

            try {
                let data = jwt.verify(tokenFromReq, secret);
                let token;
                data = await database.query('SELECT * FROM person WHERE email = $1', [data.email]);
                if (data.rows.length === 1) {
                    data = data.rows[0];
                    token = data.token;
                } else {
                    res.status(409);
                    res.header('Access-Control-Allow-Origin', siteHost);
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Headers', 'Content-Type');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    return res.json('More than one account registered with email');
                }

                if (tokenFromReq === token) {
                    if (data.roole === 'admin') {
                        try {  
                            try {
                                data = await database.query('SELECT * FROM products');
                            } catch (error) {
                                console.log('Error: ' + error)
                                res.status(500);
                                res.header('Access-Control-Allow-Origin', siteHost);
                                res.header('Access-Control-Allow-Methods', 'GET');
                                res.header('Access-Control-Allow-Headers', 'Content-Type');
                                res.header('Access-Control-Allow-Credentials', 'true');
                                return res.json({en: 'Unexpected database error', ru: 'Непредвиденная ошибка базы данных'});
                            }

                            res.status(200);
                            res.header('Access-Control-Allow-Origin', siteHost);
                            res.header('Access-Control-Allow-Methods', 'GET');
                            res.header('Access-Control-Allow-Headers', 'Content-Type');
                            res.header('Access-Control-Allow-Credentials', 'true');
                            res.header('Access-Control-Allow-Credentials', 'true');
                            return res.json(data.rows);
                        } catch (error) {
                            console.log('Error: ' + error)
                            res.status(409);
                            res.header('Access-Control-Allow-Origin', siteHost);
                            res.header('Access-Control-Allow-Methods', 'GET');
                            res.header('Access-Control-Allow-Headers', 'Content-Type');
                            res.header('Access-Control-Allow-Credentials', 'true');
                            return res.json('Geting products error');
                        }
                    } else {
                        res.status(400);
                        res.header('Access-Control-Allow-Origin', siteHost);
                        res.header('Access-Control-Allow-Methods', 'GET');
                        res.header('Access-Control-Allow-Headers', 'Content-Type');
                        res.header('Access-Control-Allow-Credentials', 'true');
                        return res.json('You are not admin');
                    }
                } else {
                    res.status(409);
                    res.header('Access-Control-Allow-Origin', siteHost);
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Headers', 'Content-Type');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    return res.json('Tokens don\'t match');
                }
            } catch (error) {
                res.status(401);
                res.header('Access-Control-Allow-Origin', siteHost);
                res.header('Access-Control-Allow-Methods', 'GET');
                res.header('Access-Control-Allow-Headers', 'Content-Type');
                res.header('Access-Control-Allow-Credentials', 'true');
                return res.json('Invalid token');        

            }
        } catch (error) {
            console.log('Error: ' + error);
            res.status(500);
            res.header('Access-Control-Allow-Origin', siteHost);
            res.header('Access-Control-Allow-Methods', 'GET');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            res.header('Access-Control-Allow-Credentials', 'true');
            return res.json({en: 'Unexpected registration error', ru: 'Непредвиденная ошибка регистации'});
        }
    }
    async createOtherProduct(req, res) {
        try {
            const tokenFromReq = cookieService.findCookieByKey(req, 'token');

            try {
                let data = jwt.verify(tokenFromReq, secret);
                let token;
                data = await database.query('SELECT * FROM person WHERE email = $1', [data.email]);
                if (data.rows.length === 1) {
                    data = data.rows[0];
                    token = data.token;
                } else {
                    res.status(409);
                    res.header('Access-Control-Allow-Origin', siteHost);
                    res.header('Access-Control-Allow-Methods', 'POST');
                    res.header('Access-Control-Allow-Headers', 'Content-Type');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    return res.json('More than one account registered with email');
                }

                if (tokenFromReq === token) {
                    try {
                        const sendingData = req.body;

                        //get current order number
                        let orderNumder = await database.query('SELECT * FROM current_order_number');
                        orderNumder = Number(orderNumder.rows[0].order_number) + 1;

                        let count = 1;
                        let tempOrderNumber = orderNumder;
                        let newOrderNumber = '';
                        while (tempOrderNumber > 9) {
                            tempOrderNumber = Math.floor(tempOrderNumber / 10);
                            count++;
                        }
                        for (let i = 0; i < 6 - count; i++) {
                            newOrderNumber += '0';                       
                        }
                        newOrderNumber += orderNumder;

                        const date = new Date;
                        const currentDate = `${(date.getDate() < 10) ? '0' + date.getDate() : date.getDate()}.${(date.getMonth() + 1 < 10) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}.${(date.getFullYear() % 100 < 10) ? '0' + (date.getFullYear() % 100) : date.getFullYear() % 100}`;
                        
                        try {
                            await database.query('INSERT INTO other_products (order_number, id, email, nickname, tlg, title, order_description, price, create_date) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [newOrderNumber, data.id, data.email, data.nickname, data.tlg, 'Other product', sendingData.orderDescription, sendingData.price, currentDate]);
                            await database.query('UPDATE current_order_number SET order_number = $2 WHERE order_number = $1', [orderNumder - 1, orderNumder]);
                        } catch (error) {
                            console.log('Error: ' + error)
                            res.status(500);
                            res.header('Access-Control-Allow-Origin', siteHost);
                            res.header('Access-Control-Allow-Methods', 'POST');
                            res.header('Access-Control-Allow-Headers', 'Content-Type');
                            res.header('Access-Control-Allow-Credentials', 'true');
                            return res.json({en: 'Unexpected database error', ru: 'Непредвиденная ошибка базы данных'});
                        }

                        res.status(200);
                        res.header('Access-Control-Allow-Origin', siteHost);
                        res.header('Access-Control-Allow-Methods', 'POST');
                        res.header('Access-Control-Allow-Headers', 'Content-Type');
                        res.header('Access-Control-Allow-Credentials', 'true');
                        res.header('Access-Control-Allow-Credentials', 'true');
                        return res.json(newOrderNumber);
                    } catch (error) {
                        console.log('Error: ' + error)
                        res.status(409);
                        res.header('Access-Control-Allow-Origin', siteHost);
                        res.header('Access-Control-Allow-Methods', 'POST');
                        res.header('Access-Control-Allow-Headers', 'Content-Type');
                        res.header('Access-Control-Allow-Credentials', 'true');
                        return res.json('Ordering error');
                    }
                } else {
                    res.status(409);
                    res.header('Access-Control-Allow-Origin', siteHost);
                    res.header('Access-Control-Allow-Methods', 'POST');
                    res.header('Access-Control-Allow-Headers', 'Content-Type');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    return res.json('Tokens don\'t match');
                }
            } catch (error) {
                res.status(401);
                res.header('Access-Control-Allow-Origin', siteHost);
                res.header('Access-Control-Allow-Methods', 'POST');
                res.header('Access-Control-Allow-Headers', 'Content-Type');
                res.header('Access-Control-Allow-Credentials', 'true');
                return res.json('Invalid token');        

            }
        } catch (error) {
            console.log('Error: ' + error);
            res.status(500);
            res.header('Access-Control-Allow-Origin', siteHost);
            res.header('Access-Control-Allow-Methods', 'POST');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            res.header('Access-Control-Allow-Credentials', 'true');
            return res.json({en: 'Unexpected registration error', ru: 'Непредвиденная ошибка регистации'});
        }
    }
    async getUserOtherProducts(req, res) {
        try {
            const tokenFromReq = cookieService.findCookieByKey(req, 'token');

            try {
                let data = jwt.verify(tokenFromReq, secret);
                let token;
                data = await database.query('SELECT * FROM person WHERE email = $1', [data.email]);
                if (data.rows.length === 1) {
                    data = data.rows[0];
                    token = data.token;
                } else {
                    res.status(409);
                    res.header('Access-Control-Allow-Origin', siteHost);
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Headers', 'Content-Type');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    return res.json('More than one account registered with email');
                }

                if (tokenFromReq === token) {
                    try {  
                        try {
                            data = await database.query('SELECT * FROM other_products WHERE email = $1', [data.email]);
                        } catch (error) {
                            console.log('Error: ' + error)
                            res.status(500);
                            res.header('Access-Control-Allow-Origin', siteHost);
                            res.header('Access-Control-Allow-Methods', 'GET');
                            res.header('Access-Control-Allow-Headers', 'Content-Type');
                            res.header('Access-Control-Allow-Credentials', 'true');
                            return res.json({en: 'Unexpected database error', ru: 'Непредвиденная ошибка базы данных'});
                        }

                        res.status(200);
                        res.header('Access-Control-Allow-Origin', siteHost);
                        res.header('Access-Control-Allow-Methods', 'GET');
                        res.header('Access-Control-Allow-Headers', 'Content-Type');
                        res.header('Access-Control-Allow-Credentials', 'true');
                        res.header('Access-Control-Allow-Credentials', 'true');
                        return res.json(data.rows);
                    } catch (error) {
                        console.log('Error: ' + error)
                        res.status(409);
                        res.header('Access-Control-Allow-Origin', siteHost);
                        res.header('Access-Control-Allow-Methods', 'GET');
                        res.header('Access-Control-Allow-Headers', 'Content-Type');
                        res.header('Access-Control-Allow-Credentials', 'true');
                        return res.json('Geting products error');
                    }
                } else {
                    res.status(409);
                    res.header('Access-Control-Allow-Origin', siteHost);
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Headers', 'Content-Type');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    return res.json('Tokens don\'t match');
                }
            } catch (error) {
                res.status(401);
                res.header('Access-Control-Allow-Origin', siteHost);
                res.header('Access-Control-Allow-Methods', 'GET');
                res.header('Access-Control-Allow-Headers', 'Content-Type');
                res.header('Access-Control-Allow-Credentials', 'true');
                return res.json('Invalid token');       

            }
        } catch (error) {
            console.log('Error: ' + error);
            res.status(500);
            res.header('Access-Control-Allow-Origin', siteHost);
            res.header('Access-Control-Allow-Methods', 'GET');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            res.header('Access-Control-Allow-Credentials', 'true');
            return res.json({en: 'Unexpected registration error', ru: 'Непредвиденная ошибка регистации'});
        }
    }
    async getAllOtherProducts(req, res) {
        try {
            const tokenFromReq = cookieService.findCookieByKey(req, 'token');

            try {
                let data = jwt.verify(tokenFromReq, secret);
                let token;
                data = await database.query('SELECT * FROM person WHERE email = $1', [data.email]);
                if (data.rows.length === 1) {
                    data = data.rows[0];
                    token = data.token;
                } else {
                    res.status(409);
                    res.header('Access-Control-Allow-Origin', siteHost);
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Headers', 'Content-Type');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    return res.json('More than one account registered with email');
                }

                if (tokenFromReq === token) {
                    if (data.roole === 'admin') {
                        try {  
                            try {
                                data = await database.query('SELECT * FROM other_products');
                            } catch (error) {
                                console.log('Error: ' + error)
                                res.status(500);
                                res.header('Access-Control-Allow-Origin', siteHost);
                                res.header('Access-Control-Allow-Methods', 'GET');
                                res.header('Access-Control-Allow-Headers', 'Content-Type');
                                res.header('Access-Control-Allow-Credentials', 'true');
                                return res.json({en: 'Unexpected database error', ru: 'Непредвиденная ошибка базы данных'});
                            }

                            res.status(200);
                            res.header('Access-Control-Allow-Origin', siteHost);
                            res.header('Access-Control-Allow-Methods', 'GET');
                            res.header('Access-Control-Allow-Headers', 'Content-Type');
                            res.header('Access-Control-Allow-Credentials', 'true');
                            res.header('Access-Control-Allow-Credentials', 'true');
                            return res.json(data.rows);
                        } catch (error) {
                            console.log('Error: ' + error)
                            res.status(409);
                            res.header('Access-Control-Allow-Origin', siteHost);
                            res.header('Access-Control-Allow-Methods', 'GET');
                            res.header('Access-Control-Allow-Headers', 'Content-Type');
                            res.header('Access-Control-Allow-Credentials', 'true');
                            return res.json('Geting products error');
                        }
                    } else {
                        res.status(400);
                        res.header('Access-Control-Allow-Origin', siteHost);
                        res.header('Access-Control-Allow-Methods', 'GET');
                        res.header('Access-Control-Allow-Headers', 'Content-Type');
                        res.header('Access-Control-Allow-Credentials', 'true');
                        return res.json('You are not admin');
                    }
                } else {
                    res.status(409);
                    res.header('Access-Control-Allow-Origin', siteHost);
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Headers', 'Content-Type');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    return res.json('Tokens don\'t match');
                }
            } catch (error) {
                res.status(401);
                res.header('Access-Control-Allow-Origin', siteHost);
                res.header('Access-Control-Allow-Methods', 'GET');
                res.header('Access-Control-Allow-Headers', 'Content-Type');
                res.header('Access-Control-Allow-Credentials', 'true');
                return res.json('Invalid token');        

            }
        } catch (error) {
            console.log('Error: ' + error);
            res.status(500);
            res.header('Access-Control-Allow-Origin', siteHost);
            res.header('Access-Control-Allow-Methods', 'GET');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            res.header('Access-Control-Allow-Credentials', 'true');
            return res.json({en: 'Unexpected registration error', ru: 'Непредвиденная ошибка регистации'});
        }
    }
}

module.exports = new productController();
