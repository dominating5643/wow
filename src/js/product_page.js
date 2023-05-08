// PRODUCT_PAGE

// Set min width for product page description

const $productPage = $body.querySelector('.produst-page');
const $productPageDescription = $body.querySelector('.produst-page__description');

$productPageDescription.style.minHeight = `${window.innerHeight - parseInt(window.getComputedStyle($body.querySelector('header')).height) - parseInt(window.getComputedStyle($productPage).paddingTop)}px`

// PRODUCT SETTINGS

// Set width for product settings container

const $productSettings = $body.querySelector('.product-settings');
const $productSettingsContainer = $productSettings.querySelector('.product-settings__container');
const productSettingsVerticalPadding = 10;

if (document.documentElement.clientWidth > 800) {
    $productSettingsContainer.style.height = `${document.documentElement.clientHeight - parseInt(window.getComputedStyle($body.querySelector('header')).height) - parseInt(window.getComputedStyle($productPage).paddingTop) - productSettingsVerticalPadding*2}px`;
}

// Set position for product settings container

let baseTopForDescription = parseInt(window.getComputedStyle($body.querySelector('header')).height) + parseInt(window.getComputedStyle($productPage).paddingTop);
let baseTopForProductSettingsContainer = baseTopForDescription + productSettingsVerticalPadding;
const $produstPageDescription = $productPage.querySelector('.produst-page__description');

if (window.clientWidth > 800) {
    if (window.scrollY >= (baseTopForDescription + $produstPageDescription.clientHeight - window.innerHeight)) {
        setPositionToEnd();
    } else {
        setPositionToStart();
    }
}

window.addEventListener('scroll', () => {
    if (window.innerWidth > 800) {
        if (window.scrollY >= (baseTopForDescription + $produstPageDescription.clientHeight - window.innerHeight)) {
            setPositionToEnd();
        } else {
            setPositionToStart();
        }
    }
});

function setPositionToStart() {
    $productSettingsContainer.style.top = `${baseTopForProductSettingsContainer}px`;
    parseFloat(window.getComputedStyle($productPageDescription).border.split(' ')[0])
    $productSettingsContainer.style.left = `${$productPageDescription.getBoundingClientRect().left + $productPageDescription.clientWidth + parseFloat(window.getComputedStyle($productPageDescription).border.split(' ')[0])*2 }px`;
    $productSettingsContainer.style.position = 'fixed';
}

function setPositionToEnd() {
    $productSettingsContainer.style.position = 'relative';
    $productSettingsContainer.style.left = `0px`;
    $productSettingsContainer.style.top = `${baseTopForDescription + $produstPageDescription.clientHeight - $productSettingsContainer.clientHeight - productSettingsVerticalPadding - baseTopForProductSettingsContainer}px`;
}

// Run radiobuttons

$body.querySelectorAll('.product-settings__radiobutton').forEach($item => {
    $item.addEventListener('click', runRadiobutton);
});

function runRadiobutton(event) {
    const $target = event.target.closest('.product-settings__radiobutton');
    const $parent = $target.parentNode;

    $parent.querySelectorAll('.product-settings__radiobutton').forEach($item => {
        if ($item.classList.contains('_checked')) {
            $item.classList.remove('_checked');
            $item.setAttribute('data-status', 'off');
        }
    });

    $target.classList.add('_checked');
    $target.setAttribute('data-status', 'on');
}

// Run slider range

const $optionsRange = $body.querySelectorAll('.product-settings__option.range');
const priceGaps = [1];

console.log($optionsRange.length)
for (let i = 0; i < $optionsRange.length; i++) {
    const $progress = $optionsRange[i].querySelector('.product-settings__range-progress');
    const $inputsForRange = $optionsRange[i].querySelectorAll('.product-settings__input-for-range');
    const $ranges = $optionsRange[i].querySelectorAll('.product-settings__range');

    // Run input for slider range
    console.log($inputsForRange)
    $inputsForRange.forEach($inputForRange => {
        const min = $ranges[0].getAttribute('min');
        const max = $ranges[0].getAttribute('max');
        let minVal = ($inputsForRange[0].value && $inputsForRange[0].value >= 0) ? parseInt($inputsForRange[0].value) : 0;
        let maxVal = ($inputsForRange[1].value && $inputsForRange[0].value >= 0) ? parseInt($inputsForRange[1].value) : 0;

        if ((maxVal - minVal >= priceGaps[i]) && (maxVal <= max)) {
                $ranges[0].value = minVal;
                $progress.style.left = `${((minVal - min) / (max - min)) * 100}%`;
                $ranges[1].value = maxVal;
                $progress.style.right = `${100 - ((maxVal - min) / (max - min)) * 100}%`;
        }

        $inputForRange.addEventListener('input', event => {
            let minVal = ($inputsForRange[0].value && $inputsForRange[0].value >= 0) ? parseInt($inputsForRange[0].value) : 0;
            let maxVal = ($inputsForRange[1].value && $inputsForRange[0].value >= 0) ? parseInt($inputsForRange[1].value) : 0;

            if ((maxVal - minVal >= priceGaps[i]) && (maxVal <= max)) {
                if (event.target.classList.contains('product-settings__input-for-range-min')) {
                    $ranges[0].value = minVal;
                    $progress.style.left = `${((minVal - min) / (max - min)) * 100}%`;
                } else {
                    $ranges[1].value = maxVal;
                    $progress.style.right = `${100 - ((maxVal - min) / (max - min)) * 100}%`;
                }
            }
        });
    });

    // Run slider range

    $ranges.forEach($inputForRange => {
        $inputForRange.addEventListener('input', event => {
            const min = $ranges[0].getAttribute('min');
            const max = $ranges[0].getAttribute('max');
            let minVal = parseInt($ranges[0].value);
            let maxVal = parseInt($ranges[1].value);

            if (maxVal - minVal < priceGaps[i]) {
                if (event.target.classList.contains('product-settings__range-min')) {
                    $ranges[0].value = maxVal - priceGaps[i];
                } else {
                    $ranges[1].value = minVal + priceGaps[i];
                }
            } else {
                $inputsForRange[0].value = minVal;
                $inputsForRange[1].value = maxVal;
                $progress.style.left = `${((minVal - min) / (max - min)) * 100}%`;
                $progress.style.right = `${100 - ((maxVal - min) / (max - min)) * 100}%`;
            }
        });
    });
}

// Adoptive

let windowWidth = document.documentElement.clientWidth;
let windowHeight = window.innerHeight;
let adobtiveStatus = 'null'

window.addEventListener('resize', () => {

    // Width adoptive

    baseTopForDescription = parseInt(window.getComputedStyle($body.querySelector('header')).height) + parseInt(window.getComputedStyle($productPage).paddingTop);
    baseTopForProductSettingsContainer = baseTopForDescription + productSettingsVerticalPadding;

    if (document.documentElement.clientWidth > 800) {
        $productSettingsContainer.style.left = `${$productPageDescription.getBoundingClientRect().left + $productPageDescription.clientWidth + 4}px`;
       
        $productSettingsContainer.style.height = `${document.documentElement.clientHeight - parseInt(window.getComputedStyle($body.querySelector('header')).height) - parseInt(window.getComputedStyle($productPage).paddingTop) - productSettingsVerticalPadding*2}px`;

        if (window.scrollY >= (baseTopForDescription + $produstPageDescription.clientHeight - window.innerHeight)) {
            setPositionToEnd();
        } else {
            setPositionToStart();
        }

        if (adobtiveStatus !== 'more') {
            adobtiveStatus = 'more';
        }
    } else if (adobtiveStatus !== 'less') {
        $productSettingsContainer.style.height = 'auto';
        $productSettingsContainer.style.position = 'relative';
        $productSettingsContainer.style.left = `0px`;
        $productSettingsContainer.style.top = `0px`;
        adobtiveStatus = 'less';
    }
});

// Price formation
const $productPricesEn = $body.querySelectorAll('.product-price__price .en .product-price__text');
const $productPricesRu = $body.querySelectorAll('.product-price__price .ru .product-price__text');
const $radios = $body.querySelectorAll('.product-settings__option.radio');
const $ranges = $body.querySelectorAll('.product-settings__option.range');
const $checkboxes = $body.querySelectorAll('.product-settings__option.checkbox');
const $selects = $body.querySelectorAll('.product-settings__option.select');
const $form = $body.querySelector('.product-settings__form');
const $productPriceSubmit = $body.querySelectorAll('.product-price__submit');
let coef = 1;

// Get data for price formation

let dataForPriceFormation;
fetch(`${HOST}/api/get_price_formation`, {
    method: 'POST', 
    body: JSON.stringify({
        title: $body.querySelector('.data-title').textContent,
    }),
    headers: {
        'Content-Type': 'application/json'
    }
})
.then(async (res) => {
    const status = res.status;
    const data = await res.json();
    if (status !== 200) {
        console.error((currentLanguage === 'en') ? data.en : data.ru);
    } else {
        let dataForPriceFormation = data;

        let price = dataForPriceFormation.base_price;

        priceFormation(dataForPriceFormation);

        $radios.forEach($radio => {
            $radio.querySelectorAll('.product-settings__radiobutton').forEach($radioItem => {
                $radioItem.addEventListener('click', () => {
                    priceFormation(dataForPriceFormation);
                });
            });
        });

        $ranges.forEach($range => {
            $range.querySelectorAll('input').forEach($rangeItem => {
                $rangeItem.addEventListener('input', () => {
                    priceFormation(dataForPriceFormation);
                });
            });
        });

        $checkboxes.forEach($checkbox => {
            $checkbox.querySelectorAll('.product-settings__checkbox').forEach($checkboxItem => {
                $checkboxItem.addEventListener('input', () => {
                    priceFormation(dataForPriceFormation);
                });
            });
        });

        $selects.forEach($select => {
            $select.querySelector('.product-settings__select').addEventListener('input', () => {
                priceFormation(dataForPriceFormation);
            });
        });

        // Submit and payment

        $form.addEventListener('submit', event => {
            event.preventDefault();

            if (localStorage.getItem('isLoggedIn') === 'true') {
                checkToken().then(checkTokenResult => {
                    if (checkTokenResult) {
                        // Create sending object
                        let sendingData = {};
                        sendingData.radio = {};
                        sendingData.range = {};
                        sendingData.checkbox = {};
                        sendingData.select = {};

                        $radios.forEach($radio => {
                            $checked = $radio.querySelector('._checked');
                            const data = dataForPriceFormation.radio[$checked.getAttribute('name')][$checked.getAttribute('value')];
                            sendingData.radio[String($checked.getAttribute('name'))] = $checked.getAttribute('value');
                        });
                        $ranges.forEach($range => {
                            const delta = ($range.querySelector('.product-settings__input-for-range-max').value - $range.querySelector('.product-settings__input-for-range-min').value);            
                            sendingData.range[$range.querySelector('input').getAttribute('name')] = delta;
                        });
                        $checkboxes.forEach($checkbox => {
                            sendingData.checkbox[$checkbox.querySelectorAll('.product-settings__checkbox')[0].getAttribute('data-checkbox-name')] = [];
                            $checkbox.querySelectorAll('.product-settings__checkbox').forEach($checkboxItem => {
                                if ($checkboxItem.checked) {
                                    sendingData.checkbox[$checkboxItem.getAttribute('data-checkbox-name')].push($checkboxItem.getAttribute('name'));
                                }
                            });
                        });
                        $selects.forEach($select => {
                            const $selectItem = $select.querySelector('.product-settings__select');
                            sendingData.select[$selectItem.getAttribute('name')] = $selectItem.value;

                            if (dataForPriceFormation.select[$selectItem.getAttribute('name')][$selectItem.value]) {
                                if (dataForPriceFormation.select[$selectItem.getAttribute('name')][$selectItem.value].is_coef) {
                                    coef *= dataForPriceFormation.select[$selectItem.getAttribute('name')][$selectItem.value].value;
                                } else {
                                    price += dataForPriceFormation.select[$selectItem.getAttribute('name')][$selectItem.value].value;
                                }
                            }
                        });

                        fetch(`${HOST}/api/save_order`, {
                            method: 'POST', 
                            credentials: 'include',
                            body: JSON.stringify({
                                title: $body.querySelector('.data-title').textContent,
                                data: sendingData
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
                                $body.classList.add('_lock')
                            } else {
                                localStorage.setItem('order_number', data);
                                window.location = '../payment.html';
                            }
                        })
                        .catch((error) => {
                            $paymentError.classList.add('_shown');
                            $body.classList.add('_lock')
                            console.error('Fetch error');
                        });

                    } else {
                        doExit();
            
                        if (!$headerLogInPopup.classList.contains('_shown')) {
                            $headerLogInPopup.classList.add('_shown');
                            $body.classList.add('_lock');
                        }
                    }
                });
            } else {
                if (!$headerLogInPopup.classList.contains('_shown')) {
                    $headerLogInPopup.classList.add('_shown');
                    $body.classList.add('_lock');
                }
            }
        });
        $productPriceSubmit.forEach($btn => {
            $btn.addEventListener('click', () => {
                if (localStorage.getItem('isLoggedIn') === 'true') {
                    checkToken().then(checkTokenResult => {
                        if (checkTokenResult) {
                            // Create sending object
                            let sendingData = {};
                            sendingData.radio = {};
                            sendingData.range = {};
                            sendingData.checkbox = {};
                            sendingData.select = {};
        
                            $radios.forEach($radio => {
                                $checked = $radio.querySelector('._checked');
                                const data = dataForPriceFormation.radio[$checked.getAttribute('name')][$checked.getAttribute('value')];
                                sendingData.radio[String($checked.getAttribute('name'))] = $checked.getAttribute('value');
                            });
                            $ranges.forEach($range => {
                                const delta = ($range.querySelector('.product-settings__input-for-range-max').value - $range.querySelector('.product-settings__input-for-range-min').value);            
                                sendingData.range[$range.querySelector('input').getAttribute('name')] = delta;
                            });
                            $checkboxes.forEach($checkbox => {
                                sendingData.checkbox[$checkbox.querySelectorAll('.product-settings__checkbox')[0].getAttribute('data-checkbox-name')] = [];
                                $checkbox.querySelectorAll('.product-settings__checkbox').forEach($checkboxItem => {
                                    if ($checkboxItem.checked) {
                                        sendingData.checkbox[$checkboxItem.getAttribute('data-checkbox-name')].push($checkboxItem.getAttribute('name'));
                                    }
                                });
                            });
                            $selects.forEach($select => {
                                const $selectItem = $select.querySelector('.product-settings__select');
                                sendingData.select[$selectItem.getAttribute('name')] = $selectItem.value;
        
                                if (dataForPriceFormation.select[$selectItem.getAttribute('name')][$selectItem.value]) {
                                    if (dataForPriceFormation.select[$selectItem.getAttribute('name')][$selectItem.value].is_coef) {
                                        coef *= dataForPriceFormation.select[$selectItem.getAttribute('name')][$selectItem.value].value;
                                    } else {
                                        price += dataForPriceFormation.select[$selectItem.getAttribute('name')][$selectItem.value].value;
                                    }
                                }
                            });
        
                            fetch(`${HOST}/api/save_order`, {
                                method: 'POST', 
                                credentials: 'include',
                                body: JSON.stringify({
                                    title: $body.querySelector('.data-title').textContent,
                                    data: sendingData
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
                                    $body.classList.add('_lock')
                                } else {
                                    localStorage.setItem('order_number', data);
                                    window.location = '../payment.html';
                                }
                            })
                            .catch((error) => {
                                $paymentError.classList.add('_shown');
                                $body.classList.add('_lock')
                                console.error('Fetch error');
                            });
        
                        } else {
                            doExit();
                
                            if (!$headerLogInPopup.classList.contains('_shown')) {
                                $headerLogInPopup.classList.add('_shown');
                                $body.classList.add('_lock');
                            }
                        }
                    });
                } else {
                    if (!$headerLogInPopup.classList.contains('_shown')) {
                        $headerLogInPopup.classList.add('_shown');
                        $body.classList.add('_lock');
                    }
                }
            });
        });
    }
})
.catch((error) => {
    console.error('Fetch error: ' + error);
});

function priceFormation(dataForPriceFormation) {
    price = dataForPriceFormation.base_price;
    coef = 1;

    $radios.forEach($radio => {
        $checked = $radio.querySelector('._checked');
        const data = dataForPriceFormation.radio[$checked.getAttribute('name')][$checked.getAttribute('value')];

        if (data.is_coef) {
            coef *= data.value;
        } else {
            price += data.value;
        }
    });

    $ranges.forEach($range => {
        const delta = ($range.querySelector('.product-settings__input-for-range-max').value - $range.querySelector('.product-settings__input-for-range-min').value);
        const maxDelta = $range.querySelector('.product-settings__range-min').getAttribute('max') - $range.querySelector('.product-settings__range-min').getAttribute('min');

        if (dataForPriceFormation.range[$range.querySelector('.product-settings__input-for-range-min').getAttribute('name')].is_coef) {
            if (delta >= 1 && delta <= maxDelta) {
                coef *= delta * dataForPriceFormation.range[$range.querySelector('.product-settings__input-for-range-min').getAttribute('name')].value;
            }
        } else {
            if (delta >= 1 && delta <= maxDelta) {
                price += delta * dataForPriceFormation.range[$range.querySelector('.product-settings__input-for-range-min').getAttribute('name')].value;
            }
        }
    });

    $checkboxes.forEach($checkbox => {
        $checkbox.querySelectorAll('.product-settings__checkbox').forEach($checkboxItem => {
            if ($checkboxItem.checked) {
                if (dataForPriceFormation.checkbox[$checkboxItem.getAttribute('data-checkbox-name')][$checkboxItem.getAttribute('name')].is_coef) {
                    coef *= dataForPriceFormation.checkbox[$checkboxItem.getAttribute('data-checkbox-name')][$checkboxItem.getAttribute('name')].value;
                } else {
                    price += dataForPriceFormation.checkbox[$checkboxItem.getAttribute('data-checkbox-name')][$checkboxItem.getAttribute('name')].value;
                }
            }
        });
    });

    $selects.forEach($select => {
        const $selectItem = $select.querySelector('.product-settings__select');

        if (dataForPriceFormation.select[$selectItem.getAttribute('name')][$selectItem.value]) {
            if (dataForPriceFormation.select[$selectItem.getAttribute('name')][$selectItem.value].is_coef) {
                coef *= dataForPriceFormation.select[$selectItem.getAttribute('name')][$selectItem.value].value;
            } else {
                price += dataForPriceFormation.select[$selectItem.getAttribute('name')][$selectItem.value].value;
            }
        }
    });

    price *= coef;
    $productPricesEn[0].textContent = price.toFixed(2);
    $productPricesEn[1].textContent = price.toFixed(2);
    $productPricesRu[0].textContent = (price * 76).toFixed(2);
    $productPricesRu[1].textContent = (price * 76).toFixed(2);
}

// Show error

const $paymentError = $body.querySelector('.payment-error');
window.addEventListener('click', (event) => {
    if ($paymentError.classList.contains('_shown')) {
        if (!event.target.closest('.payment-error__container') || event.target.classList.contains('payment-error__btn')) {
            $paymentError.classList.remove('_shown');
            $body.classList.remove('_lock');
        }
    }
});