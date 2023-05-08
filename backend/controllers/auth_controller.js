const database = require('../database/database.js');
const emailService = require('../services/email_service.js');
const cookieService = require('../services/cookie_service.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {secret, siteHost} = require('../config.js');


class authController {
    constructor() {
        this.sendEmailCode = this.sendEmailCode.bind(this);
        this.singIn = this.singIn.bind(this);
        this.logIn = this.logIn.bind(this);
        this.sendRefreshEmailCode = this.sendRefreshEmailCode.bind(this);
        this.checkAccessCodeOnServer = this.checkAccessCodeOnServer.bind(this);
        this.changeUserPassword = this.changeUserPassword.bind(this);
    }

    async sendEmailCode(req, res) {
        try {
            let validationSuccessful = true;
            let errorMessage = {
                en: '',
                ru: ''
            }

            // Validation

            if (!(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu.test(req.body.email))) {
                validationSuccessful = false;
                errorMessage = (errorMessage.en) ? errorMessage : {en: 'Incorrect email', ru: 'Некорректная электронная почта'};
            }
        
            if (!(/^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/.test(req.body.nickname))) {
                validationSuccessful = false;
                errorMessage = (errorMessage.en) ? errorMessage : {en: 'Incorrect nickname', ru: 'Некорректный никнейм'};
            }

            if (!this.stringLengthCheck(req.body.nickname, 6)) {
                validationSuccessful = false;
                errorMessage = (errorMessage.en) ? errorMessage : {en: 'Nickname less than 6 characters', ru: 'Никнейм меньше 6 символов'};
            }
        
            if (!(/^[@]{1}[^а-яё]+$/.test(req.body.tlg))) {
                validationSuccessful = false;
                errorMessage = (errorMessage.en) ? errorMessage : {en: 'Incorrect telegram', ru: 'Некорректный телеграм'};
            }
        
            if (!this.stringLengthCheck(req.body.tlg, 2)) {
                validationSuccessful = false;
                errorMessage = (errorMessage.en) ? errorMessage : {en: 'Telegram less than 2 characters', ru: 'Телеграм меньше 2 символов'};
            }
        
            if (!(/^(?=.*\d)(?=.*[a-zA-Z])(?!.*\s).*$/.test(req.body.pass))) {
                validationSuccessful = false;
                errorMessage = (errorMessage.en) ? errorMessage : {en: 'Incorrect password', ru: 'Некорректный пароль'};
            }
        
            if (!this.stringLengthCheck(req.body.pass, 6)) {
                validationSuccessful = false;
                errorMessage = (errorMessage.en) ? errorMessage : {en: 'Password less than 6 characters', ru: 'Пароль меньше 6 символов'};
            }

            // User absence check

            let data = await database.query('SELECT * FROM person WHERE email = $1', [req.body.email]);

            if (data.rows.length) {
                validationSuccessful = false;
                errorMessage = (errorMessage.en) ? errorMessage : {en: 'User with this email already exists', ru: 'Пользователь с такой почтой уже существует'};
            }

            data = await database.query('SELECT * FROM person WHERE nickname = $1', [req.body.nickname]);

            if (data.rows.length) {
                validationSuccessful = false;
                errorMessage = (errorMessage.en) ? errorMessage : {en: 'User with this nickname already exists', ru: 'Пользователь с таким никнеймом уже существует'};
            }

            // Send error

            if (errorMessage.en) {
                res.status(409);
                res.header('Access-Control-Allow-Origin', siteHost);
                res.header('Access-Control-Allow-Methods', 'POST');
                res.header('Access-Control-Allow-Headers', 'Content-Type');
                return res.json(errorMessage);
            }

            // Making, recording and email-sening access code

            const code = this.generateAccessCode();

            data = await database.query('SELECT * FROM person_bufer WHERE email = $1', [req.body.email]);

            if (data.rows.length) {
                await database.query('DELETE FROM person_bufer WHERE email = $1', [req.body.email]);
            }

            await database.query('INSERT INTO person_bufer (email, nickname, tlg, pass, roole, code) values ($1, $2, $3, $4, $5, $6)', [req.body.email, req.body.nickname, req.body.tlg, bcrypt.hashSync(req.body.pass, 7), 'user', code]);

            try {
                emailService.sendActivationCode(req.body.email, code);
            } catch (error) {
                try {
                    emailService.sendActivationCode(req.body.email, code);
                } catch (error) {
                    console.log('Error: ' + error);
                }
            }

            // Send ressponse

            res.status(200);
            res.header('Access-Control-Allow-Origin', siteHost);
            res.header('Access-Control-Allow-Methods', 'POST');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            return res.json('OK');

        } catch (error) {
            console.log('Error: ' + error);
            res.status(500);
            res.header('Access-Control-Allow-Origin', siteHost);
            res.header('Access-Control-Allow-Methods', 'POST');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            return res.json({en: 'Unexpected registration error', ru: 'Непредвиденная ошибка регистации'});
        }
    }

    async singIn(req, res) {
        try {
            // Find an unverified user and check the code

            const data = await database.query('SELECT * FROM person_bufer WHERE email = $1', [req.body.email]);

            if (data.rows.length) {
                if (req.body.code === data.rows[0].code) {
                    // Delete account from person_bufer

                    await database.query('DELETE FROM person_bufer WHERE email = $1', [req.body.email]);

                    // Make account and token

                    const token = this.generateAccessToken(req.body.email, 'user', '720h');

                    await database.query('INSERT INTO person (email, nickname, tlg, pass, roole, token) values ($1, $2, $3, $4, $5, $6)', [data.rows[0].email, data.rows[0].nickname, data.rows[0].tlg, data.rows[0].pass, 'user', token]);

                    // Send ressponse

                    res.status(200);
                    res.header('Access-Control-Allow-Origin', siteHost);
                    res.header('Access-Control-Allow-Methods', 'POST');
                    res.header('Access-Control-Allow-Headers', 'Content-Type');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.cookie('token', `Bearer ${token}`, {
                        maxAge: 2 * 30 * 24 * 60 * 60 * 1000,
                        httpOnly: true
                    });
                    return res.json('ok');
                } else {
                    res.status(409);
                    res.header('Access-Control-Allow-Origin', siteHost);
                    res.header('Access-Control-Allow-Methods', 'POST');
                    res.header('Access-Control-Allow-Headers', 'Content-Type');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    return res.json({en: 'Incorrect code', ru: 'Неверный код'});
                }
            } else {
                res.status(500);
                res.header('Access-Control-Allow-Origin', siteHost);
                res.header('Access-Control-Allow-Methods', 'POST');
                res.header('Access-Control-Allow-Headers', 'Content-Type');
                res.header('Access-Control-Allow-Credentials', 'true');
                return res.json({en: 'Unexpected registration error', ru: 'Непредвиденная ошибка регистации'});
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

    async sendCodeAgain(req, res) {
        try {
            const data = await database.query('SELECT code FROM person_bufer WHERE email = $1', [req.body.email]);
            
            if (data.rows.length) {
                await emailService.sendActivationCode(req.body.email, data.rows[0].code);

                res.status(200);
                res.header('Access-Control-Allow-Origin', siteHost);
                res.header('Access-Control-Allow-Methods', 'POST');
                res.header('Access-Control-Allow-Headers', 'Content-Type');
                return res.json('OK');
            } else {
                res.status(500);
                res.header('Access-Control-Allow-Origin', siteHost);
                res.header('Access-Control-Allow-Methods', 'POST');
                res.header('Access-Control-Allow-Headers', 'Content-Type');
                return res.json({en: 'Error. Register again', ru: 'Ошибка. Пройдите регистрацию снова'});
            }
        } catch (error) {
            console.log('Error: ' + error);
            res.status(500);
            res.header('Access-Control-Allow-Origin', siteHost);
            res.header('Access-Control-Allow-Methods', 'POST');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            return res.json({en: 'Unexpected error while submitting code', ru: 'Непредвиденная ошибка при отправке кода'});
        }
    }

    async logIn(req, res) {
        try {
            const data = await database.query('SELECT pass, roole, token FROM person WHERE email = $1', [req.body.email]);

            if (data.rows.length === 1) {
                let token = data.rows[0].token;

                if (bcrypt.compareSync(req.body.pass, data.rows[0].pass)) {
                    jwt.verify(token, secret, async (err) => {
                        if (err) {
                            token = this.generateAccessToken(req.body.email, data.rows[0].roole, '720h');
                            await database.query('UPDATE person SET token = $2 WHERE email = $1', [req.body.email, token])
                        }
                    });

                    // Delete refresh email code

                    if (!data.rows[0].code) {
                        await database.query('UPDATE person SET code = $2 WHERE email = $1', [req.body.email, '']);
                    }

                    res.status(200);
                    res.header('Access-Control-Allow-Origin', siteHost);
                    res.header('Access-Control-Allow-Methods', 'POST');
                    res.header('Access-Control-Allow-Headers', 'Content-Type');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.cookie('token', `Bearer ${token}`, {
                        maxAge: 2 * 30 * 24 * 60 * 60 * 1000,
                        httpOnly: true
                    });
                    return res.json('OK');
                } else {
                    res.status(409);
                    res.header('Access-Control-Allow-Origin', siteHost);
                    res.header('Access-Control-Allow-Methods', 'POST');
                    res.header('Access-Control-Allow-Headers', 'Content-Type');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    return res.json({en: 'Wrong password', ru: 'Неверный пароль'});
                }
            } else {
                res.status(404);
                res.header('Access-Control-Allow-Origin', siteHost);
                res.header('Access-Control-Allow-Methods', 'POST');
                res.header('Access-Control-Allow-Headers', 'Content-Type');
                res.header('Access-Control-Allow-Credentials', 'true');
                return res.json({en: 'Account not found', ru: 'Аккаунт не найден'});
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

    async checkToken(req, res) {
        try {
            const tokenFromReq = cookieService.findCookieByKey(req, 'token');

            try {
                const data = jwt.verify(tokenFromReq, secret);

                let token = await database.query('SELECT token FROM person WHERE email = $1', [data.email]);
                if (token.rows.length === 1) {
                    token = token.rows[0].token;
                } else {
                    res.status(409);
                    res.header('Access-Control-Allow-Origin', siteHost);
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Headers', 'Content-Type');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    return res.json('More than one account registered with email');
                }
                
                if (tokenFromReq === token) {
                    res.status(200);
                    res.header('Access-Control-Allow-Origin', siteHost);
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Headers', 'Content-Type');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    return res.json('OK');
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

    async sendRefreshEmailCode(req, res) {
        try {
            const email = req.body.email;
            const data = await database.query('SELECT * FROM person WHERE email = $1', [email]);
            let code;

            if (data.rows.length === 1) {
                if (!data.rows[0].code) {
                    code = this.generateAccessCode();
                } else {
                    code = data.rows[0].code;
                }

                await database.query('UPDATE person SET token = $2, code = $3 WHERE email = $1', [email, '', code]);

                emailService.sendRefreshCode(email, code);

                res.status(200);
                res.header('Access-Control-Allow-Origin', siteHost);
                res.header('Access-Control-Allow-Methods', 'GET');
                res.header('Access-Control-Allow-Headers', 'Content-Type');
                return res.json('OK');
            } else {
                res.status(404);
                res.header('Access-Control-Allow-Origin', siteHost);
                res.header('Access-Control-Allow-Methods', 'POST');
                res.header('Access-Control-Allow-Headers', 'Content-Type');
                return res.json({en: 'Account not found', ru: 'Аккаунт не найден'});
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

    async checkAccessCodeOnServer(req, res) {
        try {
            const data = await database.query('SELECT roole, code FROM person WHERE email = $1', [req.body.email]);

            if (data.rows.length === 1) {
                if (data.rows[0].code) {
                    if (data.rows[0].code === req.body.code) {
                        const token = this.generateAccessToken(req.body.email, 'refresh_pass', '20m');
                        await database.query('UPDATE person SET token = $2, code = $3 WHERE email = $1', [req.body.email, token, '']);

                        res.status(200);
                        res.header('Access-Control-Allow-Origin', siteHost);
                        res.header('Access-Control-Allow-Methods', 'POST');
                        res.header('Access-Control-Allow-Headers', 'Content-Type');
                        res.header('Access-Control-Allow-Credentials', 'true');
                        res.cookie('token', `Bearer ${token}`, {
                            maxAge: 20 * 60 * 1000,
                            httpOnly: true
                        });
                        return res.json('OK');
                    } else {
                        res.status(409);
                        res.header('Access-Control-Allow-Origin', siteHost);
                        res.header('Access-Control-Allow-Methods', 'POST');
                        res.header('Access-Control-Allow-Headers', 'Content-Type');
                        res.header('Access-Control-Allow-Credentials', 'true');
                        return res.json({en: 'Incorrect code', ru: 'Неверный код'});
                    }
                } else {
                    res.status(409);
                    res.header('Access-Control-Allow-Origin', siteHost);
                    res.header('Access-Control-Allow-Methods', 'POST');
                    res.header('Access-Control-Allow-Headers', 'Content-Type');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    return res.json({en: 'Authorization error, please try again', ru: 'Ошибка авторизации, попробуйте снова'});
                }
            } else {
                res.status(404);
                res.header('Access-Control-Allow-Origin', siteHost);
                res.header('Access-Control-Allow-Methods', 'POST');
                res.header('Access-Control-Allow-Headers', 'Content-Type');
                res.header('Access-Control-Allow-Credentials', 'true');
                return res.json({en: 'Account not found', ru: 'Аккаунт не найден'});
            }
        } catch (error) {
            console.log('Error: ' + error);
            res.status(500);
            res.header('Access-Control-Allow-Origin', siteHost);
            res.header('Access-Control-Allow-Methods', 'POST');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            res.header('Access-Control-Allow-Credentials', 'true');
            return res.json({en: 'Unexpected error', ru: 'Непредвиденная ошибка'});
        }
    }

    sendOptions(req, res) {
        res.status(200);
        res.header('Access-Control-Allow-Origin', siteHost);
        res.header('Access-Control-Allow-Methods', 'POST');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.header('Access-Control-Allow-Credentials', 'true');
        return res.json('ok');
    }

    //! Убрать у обоих паролей red border при фокусе на один
    //! При back очистить поля и error
    async changeUserPassword(req, res) {
        try {
            let passwordIsValid = true;

            if (!(/^(?=.*\d)(?=.*[a-zA-Z])(?!.*\s).*$/.test(req.body.pass))) {
                passwordIsValid = false;
            }
        
            if (!this.stringLengthCheck(req.body.pass, 6)) {
                passwordIsValid = false;
            }

            if (passwordIsValid) {
                const tokenFromReq = cookieService.findCookieByKey(req, 'token');

                jwt.verify(tokenFromReq, secret, async (err, payload) => {
                    if (!err) {
                        if (payload.role === 'refresh_pass') {
                            const data = await database.query('SELECT * FROM person WHERE email = $1', [payload.email]);
                            if (data.rows.length === 1) {
                                if (data.rows[0].token === tokenFromReq) {
                                    const token = this.generateAccessToken(data.rows[0].email, data.rows[0].roole, '720h');
                                    await database.query('UPDATE person SET token = $2, pass = $3 WHERE email = $1', [data.rows[0].email, token, bcrypt.hashSync(req.body.pass, 7)]);

                                    res.status(200);
                                    res.header('Access-Control-Allow-Origin', siteHost);
                                    res.header('Access-Control-Allow-Methods', 'POST');
                                    res.header('Access-Control-Allow-Headers', 'Content-Type');
                                    res.header('Access-Control-Allow-Credentials', 'true');
                                    res.cookie('token', `Bearer ${token}`, {
                                        maxAge: 2 * 30 * 24 * 60 * 60 * 1000,
                                        httpOnly: true
                                    });
                                    return res.json('ok');
                                } else {
                                    res.status(409);
                                    res.header('Access-Control-Allow-Origin', siteHost);
                                    res.header('Access-Control-Allow-Methods', 'POST');
                                    res.header('Access-Control-Allow-Headers', 'Content-Type');
                                    res.header('Access-Control-Allow-Credentials', 'true');
                                    return res.json({en: 'Unexpected error', ru: 'Непредвиденная ошибка'});
                                }
                            } else {
                                res.status(500);
                                res.header('Access-Control-Allow-Origin', siteHost);
                                res.header('Access-Control-Allow-Methods', 'POST');
                                res.header('Access-Control-Allow-Headers', 'Content-Type');
                                res.header('Access-Control-Allow-Credentials', 'true');
                                return res.json({en: 'Unexpected error', ru: 'Непредвиденная ошибка'});
                            }
                        } else {
                            res.status(409);
                            res.header('Access-Control-Allow-Origin', siteHost);
                            res.header('Access-Control-Allow-Methods', 'POST');
                            res.header('Access-Control-Allow-Headers', 'Content-Type');
                            res.header('Access-Control-Allow-Credentials', 'true');
                            return res.json({en: 'Unexpected error', ru: 'Непредвиденная ошибка'});
                        }
                    } else {
                        res.status(409);
                        res.header('Access-Control-Allow-Origin', siteHost);
                        res.header('Access-Control-Allow-Methods', 'POST');
                        res.header('Access-Control-Allow-Headers', 'Content-Type');
                        res.header('Access-Control-Allow-Credentials', 'true');
                        return res.json({en: 'Timeout expired', ru: 'Время ожидания вышло'});
                    }
                });
            } else {
                res.status(409);
                res.header('Access-Control-Allow-Origin', siteHost);
                res.header('Access-Control-Allow-Methods', 'POST');
                res.header('Access-Control-Allow-Headers', 'Content-Type');
                res.header('Access-Control-Allow-Credentials', 'true');
                return res.json({en: 'Incorrect password', ru: 'Неверный пароль'});
            }
        } catch (error) {
            console.log('Error: ' + error);
            res.status(500);
            res.header('Access-Control-Allow-Origin', siteHost);
            res.header('Access-Control-Allow-Methods', 'POST');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            res.header('Access-Control-Allow-Credentials', 'true');
            return res.json({en: 'Unexpected error', ru: 'Непредвиденная ошибка'});
        }
    }

    stringLengthCheck(str, len) {
        return str.length >= len;
    }

    generateAccessToken(email, role, exp) {
        const payload = {
            email,
            role
        }
        
        return jwt.sign(payload, secret, {expiresIn: exp});
    }

    generateAccessCode() {
        // Returns a string with a six digit number

        return String(Math.floor(Math.random() * (1000000 - 100000) + 100000));
    }
}

module.exports = new authController();