const HOST = 'http://localhost:3000';
const COLOR_2 = '#564fff';
const $orderNumber = document.querySelector('.payment__number');
const $subtitle = document.querySelector('.payment__subtitle');
const $description = document.querySelector('.payment__description');
const $price = document.querySelector('.payment__price');
const $articles = document.querySelectorAll('.payment__description-article');


fetch(`${HOST}/api/get_order_description`, {
    method: 'POST', 
    body: JSON.stringify({
        orderNumber: localStorage.getItem('order_number')
    }),
    headers: {
        'Content-Type': 'application/json'
    }
})
.then(async (res) => {
    const status = res.status;
    const data = await res.json();
    if (status !== 200) {
        $orderNumber.textContent = 'ERROR';
        $orderNumber.style.color = 'red';
    } else {
        $orderNumber.textContent = '#' + localStorage.getItem('order_number');
        $subtitle.textContent = data.title;
        $price.textContent = data.price + '$';

        let tempDescription = data.order_description.match(/radio:([\s\S]+?)range:/)[1];
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
                $articles[0].append(descriptionElement);
            }
        }

        tempDescription = data.order_description.match(/range:([\s\S]+?)checkbox:/)[1];
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
                $articles[1].append(descriptionElement);
            }
        }

        tempDescription = data.order_description.match(/checkbox:([\s\S]+?)select:/)[1];
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
                    $articles[2].append(descriptionElement);
                }
            }
        }

        tempDescription = data.order_description.match(/select:([\s\S]+?)$/)[1];
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
                $articles[3].append(descriptionElement);
            }
        }
    }
})
.catch((error) => {
    $orderNumber.textContent = 'ERROR';
    $orderNumber.style.color = 'red';
    console.error('Fetch error: ' + error);
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

// form validation
const $body = document.querySelector('body');
const $paymentForm = $body.querySelector('.payment__form');
const $paymentCardNumber = $paymentForm.querySelector('.payment__card-number');
const $paymentCardFirstDate = $paymentForm.querySelector('.payment__card-first-data');
const $paymentCardSecondDate = $paymentForm.querySelector('.payment__card-second-data');
const $paymentCardCVV = $paymentForm.querySelector('.payment__card-cvv');
const $paymentCardName = $paymentForm.querySelector('.payment__card-name');
const $paymentError = $body.querySelector('.payment-error');
const $paymentSuccess = $body.querySelector('.payment-success');

let date = new Date;
$paymentForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let isValid = true;

    if (!/^\d{16}$/.test($paymentCardNumber.value)) {
        isValid = false;
        $paymentCardNumber.style = 'border: 1px solid red';
    }
    if (!/^\d{1,2}$/.test($paymentCardFirstDate.value) || !/^\d{2}$/.test($paymentCardSecondDate.value)) {
        isValid = false;
        $paymentCardFirstDate.style = 'border: 1px solid red';
        $paymentCardSecondDate.style = 'border: 1px solid red';
    } else if (!((0 < Number($paymentCardFirstDate.value) && Number($paymentCardFirstDate.value) <= 12)) || !(Number($paymentCardSecondDate.value) >= (date.getFullYear() % 100))) {
        isValid = false;
        $paymentCardFirstDate.style = 'border: 1px solid red';
        $paymentCardSecondDate.style = 'border: 1px solid red';
    } else if (Number($paymentCardSecondDate.value) === (date.getFullYear() % 100) && Number($paymentCardFirstDate.value) < date.getMonth() + 1) {
        isValid = false;
        $paymentCardFirstDate.style = 'border: 1px solid red';
        $paymentCardSecondDate.style = 'border: 1px solid red';
    }
    if (!/^\d{3}$/.test($paymentCardCVV.value)) {
        isValid = false;
        $paymentCardCVV.style = 'border: 1px solid red';
    }
    if (!/^[a-zA-Z]{3,}\s[a-zA-Z]{3,}$/.test($paymentCardName.value)) {
        isValid = false;
        $paymentCardName.style = 'border: 1px solid red';
    }

    if (isValid) {
        fetch(`${HOST}/api/create_product`, {
            method: 'POST', 
            body: JSON.stringify({
                status: 'OK',
                orderNumber: localStorage.getItem('order_number')
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(async (res) => {
            const status = res.status;
            const data = await res.json();
            if (status !== 200) {
                $paymentError.classList.add('_shown');
                $body.classList.add('_lock');
            } else {
                $paymentSuccess.classList.add('_shown');
                $body.classList.add('_lock');
            }
        })
        .catch ((error) => {
            $paymentError.classList.add('_shown');
            $body.classList.add('_lock');
            console.error("Fetch error: " + error);
        });
    }
});

removeRedBorder($paymentCardNumber);
removeRedBorder($paymentCardFirstDate, $paymentCardSecondDate);
removeRedBorder($paymentCardSecondDate, $paymentCardFirstDate);
removeRedBorder($paymentCardCVV);
removeRedBorder($paymentCardName);

function removeRedBorder($input, $input2 = null) {
    $input.addEventListener('focus', () => {
        $input.style.border = `2px solid ${COLOR_2}`;
        if ($input2) {
            $input2.style.border = `2px solid ${COLOR_2}`;
        }
    });
}

window.addEventListener('click', (event) => {
    if ($paymentError.classList.contains('_shown')) {
        if (!event.target.closest('.payment-error__container') || event.target.classList.contains('payment-error__btn')) {
            $paymentError.classList.remove('_shown');
            $body.classList.remove('_lock');
        }
    }
    if ($paymentSuccess.classList.contains('_shown')) {
        if (!event.target.closest('.payment-success__container') || event.target.classList.contains('payment-success__btn')) {
            $paymentSuccess.classList.remove('_shown');
            $body.classList.remove('_lock');
            window.location = './index.html';
        }
    }
});