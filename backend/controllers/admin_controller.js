const database = require('../database/database.js');
const cookieService = require('../services/cookie_service.js');
const jwt = require('jsonwebtoken');
const {siteHost, secret} = require('../config.js');

class adminController {
    constructor() {
        //this.sendEmailCode = this.sendEmailCode.bind(this);
    }

    async isAdmin(req, res) {
        try {
            const tokenFromReq = cookieService.findCookieByKey(req, 'token');

            try {
                const data = jwt.verify(tokenFromReq, secret);

                let dbData = await database.query('SELECT * FROM person WHERE email = $1', [data.email]);

                if (dbData.rows.length === 1) {
                    dbData = dbData.rows[0];
                } else {
                    res.status(409);
                    res.header('Access-Control-Allow-Origin', siteHost);
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Headers', 'Content-Type');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    return res.json('More than one account registered with email');
                }
                
                if (tokenFromReq === dbData.token) {
                    if (dbData.roole === 'admin') {
                        res.status(200);
                        res.header('Access-Control-Allow-Origin', siteHost);
                        res.header('Access-Control-Allow-Methods', 'GET');
                        res.header('Access-Control-Allow-Headers', 'Content-Type');
                        res.header('Access-Control-Allow-Credentials', 'true');
                        return res.json('True');
                    } else {
                        res.status(417);
                        res.header('Access-Control-Allow-Origin', siteHost);
                        res.header('Access-Control-Allow-Methods', 'GET');
                        res.header('Access-Control-Allow-Headers', 'Content-Type');
                        res.header('Access-Control-Allow-Credentials', 'true');
                        return res.json('False');
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
            return res.json({en: 'Unexpected error', ru: 'Непредвиденная ошибка'});
        }
    }
}

module.exports = new adminController();