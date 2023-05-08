const $adminOrders = $body.querySelector('.admin__orders');

window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        fetch(`${HOST}/api/get_all_products`, {
            method: 'GET', 
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(async (res) => {
            const status = res.status;
            const data = await res.json();
            if (status !== 200) {
                try {
                    $adminOrders.innerHTML = (currentLanguage === 'en') ? 'Error' : 'Ошибка';
                } catch (error) {
                    console.error('Error: ' + error);
                }
            } else {
                if (data.length) {
                    data.forEach(product => {
                        let $productArticle = document.createElement('article');
                        $productArticle.className = "account__order order-item";
                        const $productDate = document.createElement('div');
                        $productDate.className = "order-item__option";
                        $productDate.innerHTML = product.create_date;
                        $productArticle.append($productDate);

                        const $productNumber = document.createElement('div');
                        $productNumber.className = "order-item__option";
                        $productNumber.innerHTML = '#' + product.order_number;
                        $productArticle.append($productNumber);

                        const $productTitle = document.createElement('div');
                        $productTitle.className = "order-item__option";
                        $productTitle.innerHTML = product.title;
                        $productArticle.append($productTitle);

                        const $productPrice = document.createElement('div');
                        $productPrice.className = "order-item__option";
                        $productPrice.innerHTML = product.price + '$';
                        $productArticle.append($productPrice);

                        const $productDescription = document.createElement('div');
                        $productDescription.className = "order-item__option";
                        let tempDescription = product.order_description.match(/radio:([\s\S]+?)range:/)[1];
                        tempDescription = tempDescription.split(' ').join('').split('\n').join('');
                        if (stringIsValid(tempDescription)) {
                            while (tempDescription.length) {
                                let descriptionElement = document.createElement('div');
                                descriptionElement.className = 'payment__description-object';
                                let HTMLForDescriptionElement = `<p class="payment__description-subtitle">${tempDescription.match(/^([\s\S]+?):/)[1] + ':'}</p>`;
                                tempDescription = tempDescription.slice(tempDescription.match(/^([\s\S]+?):/)[1].length + 1);
                                HTMLForDescriptionElement += `<p class="payment__description-value">${tempDescription.match(/^([\s\S]+?),/)[1] + ','}</p>`;
                                tempDescription = tempDescription.slice(tempDescription.match(/^([\s\S]+?),/)[1].length + 1);
                                descriptionElement.innerHTML = HTMLForDescriptionElement;
                                $productDescription.append(descriptionElement);
                            }
                        }

                        tempDescription = product.order_description.match(/range:([\s\S]+?)checkbox:/)[1];
                        tempDescription = tempDescription.split(' ').join('').split('\n').join('');
                        if (stringIsValid(tempDescription)) {
                            while (tempDescription.length) {
                                let descriptionElement = document.createElement('div');
                                descriptionElement.className = 'payment__description-object';
                                let HTMLForDescriptionElement = `<p class="payment__description-subtitle">${tempDescription.match(/^([\s\S]+?):/)[1] + ':'}</p>`;
                                tempDescription = tempDescription.slice(tempDescription.match(/^([\s\S]+?):/)[1].length + 1);
                                HTMLForDescriptionElement += `<p class="payment__description-value">${tempDescription.match(/^([\s\S]+?),/)[1] + ','}</p>`;
                                tempDescription = tempDescription.slice(tempDescription.match(/^([\s\S]+?),/)[1].length + 1);
                                descriptionElement.innerHTML = HTMLForDescriptionElement;
                                $productDescription.append(descriptionElement);
                            }
                        }

                        tempDescription = product.order_description.match(/checkbox:([\s\S]+?)select:/)[1];
                        tempDescription = tempDescription.split(' ').join('').split('\n').join('');
                        if (stringIsValid(tempDescription)) {
                            while (tempDescription.length) {
                                let descriptionSubtitle = tempDescription.match(/^([\s\S]+?):/)[1] + ':';
                                tempDescription = tempDescription.slice(tempDescription.match(/^([\s\S]+?):/)[1].length + 1);

                                while (tempDescription.indexOf(':') > tempDescription.indexOf(',') || (!tempDescription.includes(':') && tempDescription.includes(','))) {
                                    let descriptionElement = document.createElement('div');
                                    descriptionElement.className = 'payment__description-object';
                                    let HTMLForDescriptionElement = `<p class="payment__description-subtitle">${descriptionSubtitle}</p>`;
                                    HTMLForDescriptionElement += `<p class="payment__description-value">${tempDescription.match(/^([\s\S]+?),/)[1] + ','}</p>`;
                                    tempDescription = tempDescription.slice(tempDescription.match(/^([\s\S]+?),/)[1].length + 1);
                                    descriptionElement.innerHTML = HTMLForDescriptionElement;
                                    $productDescription.append(descriptionElement);
                                }
                            }
                        }

                        tempDescription = product.order_description.match(/select:([\s\S]+?)$/)[1];
                        tempDescription = tempDescription.split(' ').join('').split('\n').join('');
                        if (stringIsValid(tempDescription)) {
                            while (tempDescription.length) {
                                let descriptionElement = document.createElement('div');
                                descriptionElement.className = 'payment__description-object';
                                let HTMLForDescriptionElement = `<p class="payment__description-subtitle">${tempDescription.match(/^([\s\S]+?):/)[1] + ':'}</p>`;
                                tempDescription = tempDescription.slice(tempDescription.match(/^([\s\S]+?):/)[1].length + 1);
                                HTMLForDescriptionElement += `<p class="payment__description-value">${tempDescription.match(/^([\s\S]+?),/)[1] + ','}</p>`;
                                tempDescription = tempDescription.slice(tempDescription.match(/^([\s\S]+?),/)[1].length + 1);
                                descriptionElement.innerHTML = HTMLForDescriptionElement;
                                $productDescription.append(descriptionElement);
                            }
                        }
                        $productArticle.append($productDescription);

                        const $productUserInfo = document.createElement('div');
                        $productUserInfo.className = "order-item__option";
                        const $productUserNick = document.createElement('div');
                        let $userInfoElement = document.createElement('div');
                        $userInfoElement.className = 'payment__description-object';
                        let HTMLForuserInfoElement = `<p class="payment__description-subtitle">${'Nickname' + ':'}</p>`;
                        HTMLForuserInfoElement += `<p class="payment__description-value">${product.nickname + ','}</p>`;
                        $userInfoElement.innerHTML = HTMLForuserInfoElement;
                        $productUserNick.append($userInfoElement);
                        $productUserInfo.append($productUserNick);
                        const $productUserEmail = document.createElement('div');
                        $userInfoElement = document.createElement('div');
                        $userInfoElement.className = 'payment__description-object';
                        HTMLForuserInfoElement = `<p class="payment__description-subtitle">${'Email' + ':'}</p>`;
                        HTMLForuserInfoElement += `<p class="payment__description-value">${product.email + ','}</p>`;
                        $userInfoElement.innerHTML = HTMLForuserInfoElement;
                        $productUserEmail.append($userInfoElement);
                        $productUserInfo.append($productUserEmail);
                        const $productUserTlg = document.createElement('div');
                        $userInfoElement = document.createElement('div');
                        $userInfoElement.className = 'payment__description-object';
                        HTMLForuserInfoElement = `<p class="payment__description-subtitle">${'Telegram' + ':'}</p>`;
                        HTMLForuserInfoElement += `<p class="payment__description-value">${product.tlg + ','}</p>`;
                        $userInfoElement.innerHTML = HTMLForuserInfoElement;
                        $productUserTlg.append($userInfoElement);
                        $productUserInfo.append($productUserTlg);
                        $productArticle.append($productUserInfo);


                        $adminOrders.append($productArticle);
                    });
                } else {
                    $accountOrders.innerHTML = (currentLanguage === 'en') ? 'No orders' : 'Заказы отсутствуют';
                }
            }
        })
        .then(() => {
            fetch(`${HOST}/api/get_all_other_products`, {
                method: 'GET', 
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(async (res) => {
                const status = res.status;
                const data = await res.json();
                if (status !== 200) {
                    console.error('Bad status');
                } else {
                    if (data.length) {
                        const $subtitle = document.createElement('h2');
                        $subtitle.className = "account__subtitle";
                        let $subtitleSpan = document.createElement('span');
                        if (localStorage.getItem('currentLanguage') === 'en') {
                            $subtitleSpan.className = "en _show";
                        } else {
                            $subtitleSpan.className = "en _hide";
                        }
                        $subtitleSpan.innerHTML = 'Personal services';
                        $subtitle.append($subtitleSpan);
                        $subtitleSpan = document.createElement('span');
                        if (localStorage.getItem('currentLanguage') === 'en') {
                            $subtitleSpan.className = "ru _hide";
                        } else {
                            $subtitleSpan.className = "ru _show";
                        }
                        $subtitleSpan.innerHTML = 'Персональные услуги';
                        $subtitle.append($subtitleSpan);
                        $adminOrders.append($subtitle);

                        data.forEach(product => {
                            console.log(product)
                            let $productArticle = document.createElement('article');
                            $productArticle.className = "account__order order-item";
                            const $productDate = document.createElement('div');
                            $productDate.className = "order-item__option";
                            $productDate.innerHTML = product.create_date;
                            $productArticle.append($productDate);
    
                            const $productNumber = document.createElement('div');
                            $productNumber.className = "order-item__option";
                            $productNumber.innerHTML = '#' + product.order_number;
                            $productArticle.append($productNumber);
    
                            const $productTitle = document.createElement('div');
                            $productTitle.className = "order-item__option";
                            $productTitle.innerHTML = product.title;
                            $productArticle.append($productTitle);
    
                            const $productDescription = document.createElement('div');
                            $productDescription.className = "order-item__option";
                            $productDescription.innerHTML = product.order_description;
                            $productArticle.append($productDescription);

                            const $productPrice = document.createElement('div');
                            $productPrice.className = "order-item__option";
                            $productPrice.innerHTML = product.price;
                            $productArticle.append($productPrice);
    
                            const $productUserInfo = document.createElement('div');
                            $productUserInfo.className = "order-item__option";
                            const $productUserNick = document.createElement('div');
                            let $userInfoElement = document.createElement('div');
                            $userInfoElement.className = 'payment__description-object';
                            let HTMLForuserInfoElement = `<p class="payment__description-subtitle">${'Nickname' + ':'}</p>`;
                            HTMLForuserInfoElement += `<p class="payment__description-value">${product.nickname + ','}</p>`;
                            $userInfoElement.innerHTML = HTMLForuserInfoElement;
                            $productUserNick.append($userInfoElement);
                            $productUserInfo.append($productUserNick);
                            const $productUserEmail = document.createElement('div');
                            $userInfoElement = document.createElement('div');
                            $userInfoElement.className = 'payment__description-object';
                            HTMLForuserInfoElement = `<p class="payment__description-subtitle">${'Email' + ':'}</p>`;
                            HTMLForuserInfoElement += `<p class="payment__description-value">${product.email + ','}</p>`;
                            $userInfoElement.innerHTML = HTMLForuserInfoElement;
                            $productUserEmail.append($userInfoElement);
                            $productUserInfo.append($productUserEmail);
                            const $productUserTlg = document.createElement('div');
                            $userInfoElement = document.createElement('div');
                            $userInfoElement.className = 'payment__description-object';
                            HTMLForuserInfoElement = `<p class="payment__description-subtitle">${'Telegram' + ':'}</p>`;
                            HTMLForuserInfoElement += `<p class="payment__description-value">${product.tlg + ','}</p>`;
                            $userInfoElement.innerHTML = HTMLForuserInfoElement;
                            $productUserTlg.append($userInfoElement);
                            $productUserInfo.append($productUserTlg);
                            $productArticle.append($productUserInfo);
    
    
                            $adminOrders.append($productArticle);
                        });
                    } else {
                        $adminOrders.innerHTML = (currentLanguage === 'en') ? 'No orders' : 'Заказы отсутствуют';
                    }
                }
            })
            .catch((error) => {
                $accountOrders.innerHTML = (currentLanguage === 'en') ? 'Error' : 'Ошибка';
                console.error('Fetch error: ' + error);
            });
        })
        .catch((error) => {
            $adminOrders.innerHTML = (currentLanguage === 'en') ? 'Error' : 'Ошибка';
            console.error('Fetch error: ' + error);
        });
    } else {
        $adminOrders.innerHTML = (currentLanguage === 'en') ? 'No orders' : 'Заказы отсутствуют';
    }
});

function stringIsValid(str) {
    if (str.includes(':') && str.includes(',') && str.indexOf(':') < str.indexOf(',')) {
        while (str.length) {
            str = str.slice(str.match(/^([\s\S]+?):/)[1].length + 1);
            if (str.indexOf(':') != -1) {
                if (str.indexOf(':') < str.indexOf(',') || !str.includes(',')) return false;
            }
            while (str.indexOf(':') > str.indexOf(',') || (!str.includes(':') && str.includes(','))) str = str.slice(str.match(/^([\s\S]+?),/)[1].length + 1);
        }
        return true;
    }
    return false;
}