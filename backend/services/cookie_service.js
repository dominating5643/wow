class CookieService {
    findCookieByKey(req, keyName) {
        try {
            const regExpForCookieKey = new RegExp(`^${keyName}`);
            let token;

            req.headers.cookie.split('; ').some(cookieItem => {
                if (regExpForCookieKey.test(cookieItem)) {
                    token = cookieItem.match(/=.*/)[0].slice(1);

                    if (/%20/.test(token)) {
                        token = token.split('%20')[1];
                    } else {
                        token = token.split(' ')[1];
                        console.log('Space found in token: \'Bearer \$\{token \}\';')
                    }

                    return token;
                }
            });

            return token;
        } catch (error) {
            console.log('Error: Error in search function for cookies by key');
            throw new Error('Error in search function for cookies by key');
        }
    }
}

module.exports = new CookieService();