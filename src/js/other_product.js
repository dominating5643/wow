const $otherProductsForm = document.querySelector('.other-product__form');
const $otherProductsDescription = $otherProductsForm.querySelector('.other-product__textarea');
const $otherProductsPrice = $otherProductsForm.querySelector('.other-product__inpit');
const $paymentError = $body.querySelector('.payment-error');
const $paymentSuccess = $body.querySelector('.payment-success');

$otherProductsForm.addEventListener('submit', event => {
    event.preventDefault();
    let isValid = true;

    if (!$otherProductsDescription.value) {
        $otherProductsDescription.style.border = '2px solid red';
        isValid = false;
    }

    if (!(/^[0-9]([0-9.,]{0,})$/.test($otherProductsPrice.value))) {
        $otherProductsPrice.style.border = '2px solid red';
        isValid = false;
    }

    if (isValid) {
        // Query send

        fetch(`${HOST}/api/create_other_product`, {
            method: 'POST', 
            credentials: 'include',
            body: JSON.stringify({
                orderDescription: $otherProductsDescription.value,
                price: $otherProductsPrice.value
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
                console.error("Fetch error: " + error);
            } else {
                $otherProductsDescription.value = '';
                $otherProductsPrice.value = '';

                $otherProductsDescription.style.border = `2px solid ${COLOR_2}`;
                $otherProductsPrice.style.border = `2px solid ${COLOR_2}`;

                $paymentSuccess.classList.add('_shown');
                $body.classList.add('_lock');
            }
        })
        .catch((error) => {
            $paymentError.classList.add('_shown');
            $body.classList.add('_lock');
            console.error("Fetch error: " + error);
        });
    }
});

removeRedBorder($otherProductsDescription);
removeRedBorder($otherProductsPrice);

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
        }
    }
});