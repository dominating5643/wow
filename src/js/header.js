const HOST = 'http://localhost:3000';
const COLOR_2 = '#564fff';

// HEADER

// Login visualization in header when visiting the site

const $HeaderContactsBtn = document.querySelector('.left-row__contacts-btn');
const $adminBtn = document.querySelector('.header__admin');

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        checkToken().then(checkTokenResult => {
            if (checkTokenResult) {
                doLogin();

                checkAdmin().then(checkAdminResult => {
                    console.log(checkAdminResult)
                    if (checkAdminResult) {
                        $adminBtn.classList.add('_shown');
                        $HeaderContactsBtn.classList.add('_hidden');
                    }
                });
            } else {
                localStorage.setItem('isLoggedIn', 'false');
            }
        });
    }
});

async function checkToken() {
    let result;

    await fetch(`${HOST}/api/check_token`, {
        method: 'GET', 
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(async (res) => {
        if (res.status !== 200) {
            result = false;
        } else {
            result = true;
        }
    })
    .catch((error) => {
        localStorage.setItem('isLoggedIn', 'false');
        console.error('Check token error');
        result = false;
    });

    return result;
}

async function checkAdmin() {
    let result;

    await fetch(`${HOST}/api/is_admin`, {
        method: 'GET', 
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(async (res) => {
        if (res.status !== 200) {
            result = false;
        } else {
            result = true;
        }
    })
    .catch((error) => {
        console.error('Check admin error');
    });

    return result;
}

// Show contacts

const $body = document.querySelector('body')
const $HeaderContactsList = $body.querySelector('.left-row__state-list');

$HeaderContactsBtn.addEventListener('click', () => {
    $HeaderContactsList.classList.toggle('_shown');
});

window.addEventListener('click', (event) => {
    if ($HeaderContactsList.classList.contains('_shown')) {
        if (!(event.target.closest('.left-row__state-list') || event.target.closest('.left-row__state-btn'))) {
            $HeaderContactsList.classList.remove('_shown');
        }
    }
});

// Languages

const $headerLanguage = $body.querySelector('.header__languages');
const $headerLanguageEn = $body.querySelector('.header__languages .languages__en');
const $headerLanguageRu = $body.querySelector('.header__languages .languages__ru');

let currentLanguage = localStorage.getItem('currentLanguage') || 'en';

if (currentLanguage !== 'en') {
    $headerLanguageEn.classList.remove('languages__selected');
    $headerLanguageEn.classList.add('languages__not-selected');

    $headerLanguageRu.classList.remove('languages__not-selected');
    $headerLanguageRu.classList.add('languages__selected');
}

setTimeout(() => {
    $headerLanguageEn.style.transitionDuration = '300ms';
    $headerLanguageRu.style.transitionDuration = '300ms';
}, 500);


languageChanges();

$headerLanguage.addEventListener('click', () => {
    if (currentLanguage === 'en') {
        localStorage.setItem('currentLanguage', 'ru');
        currentLanguage = 'ru';

        $headerLanguageEn.classList.remove('languages__selected');
        $headerLanguageEn.classList.add('languages__not-selected');

        $headerLanguageRu.classList.remove('languages__not-selected');
        $headerLanguageRu.classList.add('languages__selected');
    } else {
        localStorage.setItem('currentLanguage', 'en');
        currentLanguage = 'en';

        $headerLanguageRu.classList.remove('languages__selected');
        $headerLanguageRu.classList.add('languages__not-selected');

        $headerLanguageEn.classList.remove('languages__not-selected');
        $headerLanguageEn.classList.add('languages__selected');
    }

    languageChanges();
});

function languageChanges() {
    const $enTextArray = $body.querySelectorAll('.en');
    const $ruTextArray = $body.querySelectorAll('.ru');

    if (currentLanguage === 'en') {
        $enTextArray.forEach($item => {
            $item.classList.add('_show');

            if ($item.classList.contains('_hide')) {
                $item.classList.remove('_hide');
            }
        });

        $ruTextArray.forEach($item => {
            $item.classList.add('_hide');

            if ($item.classList.contains('_show')) {
                $item.classList.remove('_show');
            }
        });
    } else {
        $ruTextArray.forEach($item => {
            $item.classList.add('_show');

            if ($item.classList.contains('_hide')) {
                $item.classList.remove('_hide');
            }
        });

        $enTextArray.forEach($item => {
            $item.classList.add('_hide');

            if ($item.classList.contains('_show')) {
                $item.classList.remove('_show');
            }
        });
    }
}

// Adoptive

const $headerBurgerButton = $body.querySelector('.burger__button');
const $headerBurgerList = $body.querySelector('.burger__list');
const $headerRightRow = $body.querySelector('.right-row');
const $headerRightRowReg = $headerRightRow.querySelector('.right-row__reg');
const $headerRightRowLog = $headerRightRow.querySelector('.right-row__log');
const $headerRightRowExit = $headerRightRow.querySelector('.right-row__exit');
const $headerRightRowAccount = $headerRightRow.querySelector('.right-row__account');
const $headerLeftRow = $body.querySelector('.left-row');
const $headerLeftRowLogo = $headerLeftRow.querySelector('.left-row__logo');
const $headerLeftRowTlg = $headerLeftRow.querySelector('.left-row__tlg');
const $headerLeftRowChat = $headerLeftRow.querySelector('.left-row__chat');
const $HeaderLeftRowContacts = $headerLeftRow.querySelector('.left-row__state');

if (document.documentElement.clientWidth <= 608) {
    headerAdoptiveLess880();
    headerAdoptiveLess608();
} else if (document.documentElement.clientWidth <= 880) {
    headerAdoptiveLess880();
}

window.addEventListener('resize', () => {
    if (document.documentElement.clientWidth <= 608) {
        if ($headerRightRowReg.closest('.burger__list') && !$HeaderLeftRowContacts.closest('.burger__list')) {
            headerAdoptiveLess608();
        } else if (!$headerRightRowReg.closest('.burger__list')) {
            headerAdoptiveLess880();
            headerAdoptiveLess608();
        }
    } else if (document.documentElement.clientWidth <= 880) {
        if ($HeaderLeftRowContacts.closest('.burger__list')) {
            headerAdoptiveMore608();
        } else if (!$headerRightRowReg.closest('.burger__list')) {
            headerAdoptiveLess880();
        }
    } else {
        if ($headerRightRowReg.closest('.burger__list') && !$HeaderLeftRowContacts.closest('.burger__list')) {
            headerAdoptiveMore880();
        } else if ($HeaderLeftRowContacts.closest('.burger__list')) {
            headerAdoptiveMore608();
            headerAdoptiveMore880();
        }
    }
});


function headerAdoptiveLess880() {
    $headerBurgerList.append($headerRightRowReg);
    $headerBurgerList.append($headerRightRowLog);
    $headerBurgerList.append($headerRightRowExit);
    $headerBurgerList.append($headerRightRowAccount);
    $headerBurgerList.append($headerLeftRowTlg);
    $headerBurgerList.append($headerLeftRowChat);

    $headerRightRowReg.classList.add('burger__item');
    $headerRightRowLog.classList.add('burger__item');
    $headerRightRowExit.classList.add('burger__item');
    $headerRightRowAccount.classList.add('burger__item');
    $headerLeftRowTlg.classList.add('burger__item');
    $headerLeftRowChat.classList.add('burger__item');
}

function headerAdoptiveMore880() {
    $headerRightRow.append($headerRightRowReg);
    $headerRightRow.append($headerRightRowLog);
    $headerRightRow.append($headerRightRowExit);
    $headerRightRow.append($headerRightRowAccount);
    $headerLeftRow.append($headerLeftRowTlg);
    $headerLeftRow.append($headerLeftRowChat);

    $headerRightRowReg.classList.remove('burger__item');
    $headerRightRowLog.classList.remove('burger__item');
    $headerRightRowExit.classList.remove('burger__item');
    $headerRightRowAccount.classList.remove('burger__item');
    $headerLeftRowTlg.classList.remove('burger__item');
    $headerLeftRowChat.classList.remove('burger__item');
}

function headerAdoptiveLess608() {
    $headerBurgerList.append($HeaderLeftRowContacts);
    $HeaderLeftRowContacts.classList.add('burger__item');
}

function headerAdoptiveMore608() {
    $headerLeftRowLogo.after($HeaderLeftRowContacts);
    $HeaderLeftRowContacts.classList.remove('burger__item');
}

// Show burger list

$headerBurgerButton.addEventListener('click', () => {
    $headerBurgerList.classList.toggle('_show');

    if ($headerBurgerList.classList.contains('_show')) {
        $body.classList.add('_lock');
    } else {
        $body.classList.remove('_lock');
    }
});

window.addEventListener( 'click', (event) => {
    if ($headerBurgerList.classList.contains('_show')) {
        if (!event.target.closest('.burger') && !event.target.closest('.header__sign-up-popup')) {
            $headerBurgerList.classList.remove('_show');
            $body.classList.remove('_lock');
        }
    }
});

// Establishing a position burger list

$headerBurgerList.style.top = `${70 - document.documentElement.scrollTop}px`;
window.addEventListener('scroll', () => {
    $headerBurgerList.style.top = `${70 - document.documentElement.scrollTop}px`;
});

// SIGN UP

// Set width sign up

const $headerSignUpPopup = document.querySelector('.header__sign-up-popup');

window.addEventListener('resize', () => {
    $headerSignUpPopup.style.width = `${$body.clientWidth}px`
});

// Show sign up popup

//? $headerRightRowReg;
const $headerSignUpCloseBtn = $headerSignUpPopup.querySelector('.sign-up__close');


$headerRightRowReg.addEventListener('click', () => {
    $headerSignUpPopup.classList.toggle('_show');

    if ($headerSignUpPopup.classList.contains('_show')) {
        $body.classList.add('_lock');
    } else {
        $body.classList.remove('_lock');
    }
});

window.addEventListener( 'click', (event) => {
    if ($headerSignUpPopup.classList.contains('_show')) {
        if (!event.target.closest('.sign-up__container') && !event.target.closest('.right-row__reg')) {
            $headerSignUpPopup.classList.remove('_show');
            $body.classList.remove('_lock');
        }
    }
});

$headerSignUpCloseBtn.addEventListener('click', () => {
    if ($headerSignUpPopup.classList.contains('_show')) {
        $headerSignUpPopup.classList.remove('_show');
        $body.classList.remove('_lock');
    }
});

// Set position sign up

const $headerSignUpContainer = $headerSignUpPopup.querySelector('.sign-up__container');

if ($headerSignUpContainer.clientHeight + 40 > window.innerHeight) {
    $headerSignUpPopup.style.alignItems = 'flex-start';
    $headerSignUpPopup.style.marginTop = '20px';
} else {
    $headerSignUpPopup.style.alignItems = 'center';
    $headerSignUpPopup.style.marginTop = '0';
}

window.addEventListener('resize', () => {
    if ($headerSignUpContainer.clientHeight + 40 > window.innerHeight) {
        $headerSignUpPopup.style.alignItems = 'flex-start';
        $headerSignUpPopup.style.marginTop = '20px';
    } else {
        $headerSignUpPopup.style.alignItems = 'center';
        $headerSignUpPopup.style.marginTop = '0';
    }
})

// Register form Validation

const $headerSignUpFormReg = $headerSignUpPopup.querySelector('.sign-up__form-registration');
const $headerSignUpEmail = $headerSignUpFormReg.querySelector('.sign-up__email');
const $headerSignUpNickname = $headerSignUpFormReg.querySelector('.sign-up__nickname');
const $headerSignUpTlg = $headerSignUpFormReg.querySelector('.sign-up__tlg');
const $headerSignUpPassword = $headerSignUpFormReg.querySelector('.sign-up__password');
const $headerSignUpRepeatPassword = $headerSignUpFormReg.querySelector('.sign-up__repeat-password');
const $headerSignUpErrorMessage = $headerSignUpFormReg.querySelector('.sign-up__reg-error-message');

const $headerSignUpRegistration = $headerSignUpContainer.querySelector('.sign-up__registration');
const $headerSignUpActivation = $headerSignUpContainer.querySelector('.sign-up__activation');
const $headerSignUpBackBtn = $headerSignUpContainer.querySelector('.sign-up__back');
const $headerSignUpSubtitle = $headerSignUpContainer.querySelector('.sign-up__subtitle');
const $headerSignUpReorderBtn = $headerSignUpContainer.querySelector('.sign-up__reorder');
const $headerSignUpReorderCounter = $headerSignUpContainer.querySelector('.sign-up__reorder-counter');

let userEmail = '';

$headerSignUpFormReg.addEventListener('submit', (event) => {
    event.preventDefault();

    let errorMessage = '';

    if (!(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu.test($headerSignUpEmail.value))) {
        $headerSignUpEmail.style.border = '1px solid red';
        errorMessage = (errorMessage) ? errorMessage : ((currentLanguage === 'en') ? 'Incorrect email' : 'Некорректная электронная почта');
    }

    if (!(/^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/.test($headerSignUpNickname.value))) {
        $headerSignUpNickname.style.border = '1px solid red';
        errorMessage = (errorMessage) ? errorMessage : ((currentLanguage === 'en') ? 'The nickname must start with a Latin letter, contain only Latin letters and numbers, and may contain the symbols -,_,.' : 'Никнейм должен начинаться с латинской буквы, содержать только латинские буквы и цифры, может содержать символы -,_,.');
    }

    if (!stringLengthCheck($headerSignUpNickname.value, 6)) {
        $headerSignUpNickname.style.border = '1px solid red';
        errorMessage = (errorMessage) ? errorMessage : ((currentLanguage === 'en') ? 'Nickname less than 6 characters' : 'Никнейм меньше 6 символов');
    }

    if (!(/^[@]{1}[^а-яё]+$/.test($headerSignUpTlg.value))) {
        $headerSignUpTlg.style.border = '1px solid red';
        errorMessage = (errorMessage) ? errorMessage : ((currentLanguage === 'en') ? 'Incorrect telegram' : 'Некорректный телеграм');
    }

    if (!stringLengthCheck($headerSignUpTlg.value, 2)) {
        $headerSignUpTlg.style.border = '1px solid red';
        errorMessage = (errorMessage) ? errorMessage : ((currentLanguage === 'en') ? 'Telegram less than 2 characters' : 'Телеграм меньше 2 символов');
    }

    if (!(/^(?=.*\d)(?=.*[a-zA-Z])(?!.*\s).*$/.test($headerSignUpPassword.value))) {
        $headerSignUpPassword.style.border = '1px solid red';
        $headerSignUpRepeatPassword.style.border = '1px solid red';
        errorMessage = (errorMessage) ? errorMessage : ((currentLanguage === 'en') ? 'Password must contain latin letters and numbers' : 'Пароль должен содержать латинские буквы и цифры');
    }

    if (!stringLengthCheck($headerSignUpPassword.value, 6)) {
        $headerSignUpPassword.style.border = '1px solid red';
        $headerSignUpRepeatPassword.style.border = '1px solid red';
        errorMessage = (errorMessage) ? errorMessage : ((currentLanguage === 'en') ? 'Password less than 6 characters' : 'Пароль меньше 6 символов');
    }

    if ($headerSignUpPassword.value !== $headerSignUpRepeatPassword.value) {
        $headerSignUpPassword.style.border = '1px solid red';
        $headerSignUpRepeatPassword.style.border = '1px solid red';
        errorMessage = (errorMessage) ? errorMessage : ((currentLanguage === 'en') ? 'Passwords do not match' : 'Пароли не совпадают');
    }

    if (errorMessage) {
        $headerSignUpErrorMessage.textContent = errorMessage;
    } else {
        if ($headerSignUpErrorMessage.textContent) {
            $headerSignUpErrorMessage.textContent = '';
        }

        // Query send for register

        fetch(`${HOST}/api/send_email_code`, {
            method: 'POST', 
            body: JSON.stringify({
                email: $headerSignUpEmail.value,
                nickname: $headerSignUpNickname.value,
                tlg: $headerSignUpTlg.value,
                pass: $headerSignUpPassword.value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(async (res) => {
            const status = res.status;
            const data = await res.json();
            if (status !== 200) {
                try {
                    $headerSignUpErrorMessage.textContent = (currentLanguage === 'en') ? data.en : data.ru;
                } catch (error) {
                    console.error('Error: ' + error);
                }
            } else {
                userEmail = $headerSignUpEmail.value;

                $headerSignUpEmail.value = '';
                $headerSignUpNickname.value = '';
                $headerSignUpTlg.value = '';
                $headerSignUpPassword.value = '';
                $headerSignUpRepeatPassword.value = '';

                $headerSignUpEmail.style.border = `2px solid ${COLOR_2}`;
                $headerSignUpNickname.style.border = `2px solid ${COLOR_2}`;
                $headerSignUpTlg.style.border = `2px solid ${COLOR_2}`;
                $headerSignUpPassword.style.border = `2px solid ${COLOR_2}`;
                $headerSignUpRepeatPassword.style.border = `2px solid ${COLOR_2}`;

                $headerSignUpRegistration.classList.add('_hidden');
                $headerSignUpActivation.classList.add('_shown');
                $headerSignUpBackBtn.classList.add('_shown');

                $headerSignUpCodeError.textContent = (currentLanguage === 'en') ? data.en : data.ru;
                $headerSignUpSubtitle.textContent = (currentLanguage === 'en') ? `Email with code sent ${userEmail}` : `Сообщение с кодом отправлено на почту ${userEmail}`

                makeSendButtonInactive($headerSignUpReorderCounter, $headerSignUpReorderBtn);
            }
        })
        .catch((error) => {
            $headerSignUpErrorMessage.textContent = (currentLanguage === 'en') ? 'Unexpected error' : 'Непредвиденная ошибка';    
            console.error('Fetch error');
        });
    }
});

// Remove red border by focus registration input

removeRedBorder($headerSignUpEmail);
removeRedBorder($headerSignUpNickname);
removeRedBorder($headerSignUpTlg);
removeRedBorder($headerSignUpPassword);
removeRedBorder($headerSignUpRepeatPassword);

function removeRedBorder($input1, $input2) {
    $input1.addEventListener('focus', () => {
        $input1.style.border = `2px solid ${COLOR_2}`;
        if ($input2) {
            $input2.style.border = `2px solid ${COLOR_2}`;
        }
    });
}

function stringLengthCheck(str, len) {
    return str.length >= len;
}

// Return to the registration form on the button

let resendMessageCounterForSingUp;

$headerSignUpBackBtn.addEventListener('click', () => {
    $headerSignUpRegistration.classList.remove('_hidden');
    $headerSignUpActivation.classList.remove('_shown');
    $headerSignUpBackBtn.classList.remove('_shown');

    clearInterval(resendMessageCounterForSingUp);
    $headerSignUpReorderCounter.textContent = '';
    if ($headerSignUpReorderBtn.classList.contains('_disabled')) {
        $headerSignUpReorderBtn.classList.remove('_disabled');
    }
});

// Send email-code again

const $headerSignUpFormActv = $headerSignUpPopup.querySelector('.sign-up__form-activation');
const $headerSignUpCodeInput = $headerSignUpFormActv.querySelector('.sign-up__code');
const $headerSignUpCodeError = $headerSignUpFormActv.querySelector('.sign-up__code-error-message');

$headerSignUpReorderBtn.addEventListener('click', () => {
    if (!$headerSignUpReorderBtn.classList.contains('_disables')) {
        resendMessageCounterForSingUp = makeSendButtonInactive($headerSignUpReorderCounter, $headerSignUpReorderBtn);

        fetch(`${HOST}/api/send_code_again`, {
            method: 'POST', 
            body: JSON.stringify({
                email: userEmail,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(async (res) => {
            const status = res.status;
            const data = await res.json();

            if (status !== 200) {
                try {
                    $headerSignUpCodeError.textContent = (currentLanguage === 'en') ? data.en : data.ru;

                    clearInterval(resendMessageCounterForSingUp);
                    $headerSignUpReorderCounter.textContent = '';
                    if ($headerSignUpReorderBtn.classList.contains('_disabled')) {
                        $headerSignUpReorderBtn.classList.remove('_disabled');
                    }
                } catch (error) {
                    console.error('Error: ' + error);
                }
            }
        })
        .catch((error) => {
            $headerSignUpCodeError.textContent = (currentLanguage === 'en') ? 'Unexpected error' : 'Непредвиденная ошибка';    
            console.error('Fetch error');
        });
    }
});

// Activation form Validation

$headerSignUpFormActv.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!(/^[0-9]{6}$/.test($headerSignUpCodeInput.value))) {
        $headerSignUpCodeInput.style.border = `1px solid red`;

        $headerSignUpCodeError.textContent = (currentLanguage === 'en') ? 'Incorrect code' : 'Неверный код';
    } else {
        fetch(`${HOST}/api/sign_in`, {
            method: 'POST', 
            credentials: 'include',
            body: JSON.stringify({
                email: userEmail,
                code: $headerSignUpCodeInput.value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(async (res) => {
            const status = res.status;
            const data = await res.json();

            if (status !== 200) {
                try {
                    $headerSignUpCodeError.textContent = (currentLanguage === 'en') ? data.en : data.ru;
                } catch (error) {
                    console.error('Error: ' + error);
                }
            } else {
                localStorage.setItem('isLoggedIn', 'true');
                
                doLogin();

                $headerSignUpCodeInput.value = '';
                $headerSignUpCodeInput.style.border = `2px solid ${COLOR_2}`;
                $headerSignUpCodeError.textContent = '';

                $headerSignUpRegistration.classList.remove('_hidden');
                $headerSignUpActivation.classList.remove('_shown');
                $headerSignUpBackBtn.classList.remove('_shown');

                $headerSignUpPopup.classList.remove('_show');
                $body.classList.remove('_lock');

                clearInterval(resendMessageCounterForSingUp);
                $headerSignUpReorderCounter.textContent = '';
                if ($headerSignUpReorderBtn.classList.contains('_disabled')) {
                    $headerSignUpReorderBtn.classList.remove('_disabled');
                }
            }
        })
        .catch((error) => {
            $headerSignUpCodeError.textContent = (currentLanguage === 'en') ? 'Unexpected error' : 'Непредвиденная ошибка';    
            console.error('Fetch error');
        });
    }
});

// Make the send button inactive

function makeSendButtonInactive($counter, $btn) {
    $btn.classList.add('_disabled');

    let countOfSeconsd = 2 * 60;

    $counter.textContent = `${Math.floor(countOfSeconsd / 60)}:${(countOfSeconsd % 60 > 9) ? countOfSeconsd % 60 : '0' + countOfSeconsd % 60}`;

    const interval = setInterval(() => {
        countOfSeconsd -= 1;

        if (!countOfSeconsd) {
            clearInterval(interval);
            $counter.textContent = '';
            if ($btn.classList.contains('_disabled')) {
                $btn.classList.remove('_disabled');
            }
        } else {
            $counter.textContent = `${Math.floor(countOfSeconsd / 60)}:${(countOfSeconsd % 60 > 9) ? countOfSeconsd % 60 : '0' + countOfSeconsd % 60}`;
        }
    }, 1000)

    return interval;
}

// Remove red border and clean error message by focus

$headerSignUpCodeInput.addEventListener('focus', () => {
    $headerSignUpCodeInput.style.border = `2px solid ${COLOR_2}`;
    $headerSignUpCodeError.textContent = '';
});

// Exit visualization in header by button

$headerRightRowExit.addEventListener('click', () => {
    localStorage.setItem('isLoggedIn', 'false');

    doExit();
});

// Login visualization in header

function doLogin() {
    $headerRightRowReg.classList.add('_hidden');
    $headerRightRowLog.classList.add('_hidden');
    $headerRightRowExit.classList.add('_shown');
    $headerRightRowAccount.classList.add('_shown');

    checkAdmin().then(checkAdminResult => {
        if (checkAdminResult) {
            $adminBtn.classList.add('_shown');
            $HeaderContactsBtn.classList.add('_hidden');
        }
    });
}

// Exit visualization in header

function doExit() {
    $headerRightRowReg.classList.remove('_hidden');
    $headerRightRowLog.classList.remove('_hidden');
    $headerRightRowExit.classList.remove('_shown');
    $headerRightRowAccount.classList.remove('_shown');

    if ($adminBtn.classList.contains('_shown')) {
        $adminBtn.classList.remove('_shown');
        $HeaderContactsBtn.classList.remove('_hidden');
    }
}

// LOG_IN

// Show sign up popup

//? $headerRightRowLog;
const $headerLogInPopup = $body.querySelector('.header__log-in-popup');
const $headerLogInCloseBtn = $headerLogInPopup.querySelector('.log-in__close');


$headerRightRowLog.addEventListener('click', () => {
    $headerLogInPopup.classList.toggle('_shown');

    if ($headerLogInPopup.classList.contains('_shown')) {
        $body.classList.add('_lock');
    } else {
        $body.classList.remove('_lock');
    }
});

window.addEventListener( 'click', (event) => {
    if ($headerLogInPopup.classList.contains('_shown')) {
        if (!event.target.closest('.log-in__container') && !event.target.closest('.right-row__log')) {
            $headerLogInPopup.classList.remove('_shown');
            $body.classList.remove('_lock');
        }
    }
});

$headerLogInCloseBtn.addEventListener('click', () => {
    if ($headerLogInPopup.classList.contains('_shown')) {
        $headerLogInPopup.classList.remove('_shown');
        $body.classList.remove('_lock');
    }
});

// Set position sign up

const $headerLogInContainer = $headerLogInPopup.querySelector('.log-in__container');

if ($headerLogInContainer.clientHeight + 40 > window.innerHeight) {
    $headerLogInPopup.style.alignItems = 'flex-start';
    $headerLogInPopup.style.marginTop = '20px';
} else {
    $headerLogInPopup.style.alignItems = 'center';
    $headerLogInPopup.style.marginTop = '0';
}

window.addEventListener('resize', () => {
    if ($headerLogInContainer.clientHeight + 40 > window.innerHeight) {
        $headerLogInPopup.style.alignItems = 'flex-start';
        $headerLogInPopup.style.marginTop = '20px';
    } else {
        $headerLogInPopup.style.alignItems = 'center';
        $headerLogInPopup.style.marginTop = '0';
    }
});

// Login form Validation

const $headerLogInForm = $headerLogInPopup.querySelector('.log-in__form');

const $headerLogInEmail = $headerLogInForm.querySelector('.log-in__email');
const $headerLogInPassword = $headerLogInForm.querySelector('.log-in__password');
const $headerLogInErrorMessage = $headerLogInForm.querySelector('.log-in__error-message');
const $headerLogInSubmit = $headerLogInForm.querySelector('.log-in__submit');

$headerLogInForm.addEventListener('submit', (event) => {
    event.preventDefault();

    let errorMessage = '';

    if (!(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu.test($headerLogInEmail.value))) {
        $headerLogInEmail.style.border = '1px solid red';
        errorMessage = (errorMessage) ? errorMessage : ((currentLanguage === 'en') ? 'Incorrect email' : 'Некорректная электронная почта');
    }

    if (!stringLengthCheck($headerLogInPassword.value, 6)) {
        $headerLogInPassword.style.border = '1px solid red';
        errorMessage = (errorMessage) ? errorMessage : ((currentLanguage === 'en') ? 'Password less than 6 characters' : 'Пароль меньше 6 символов');
    }

    if (!(/^(?=.*\d)(?=.*[a-zA-Z])(?!.*\s).*$/.test($headerLogInPassword.value))) {
        $headerLogInPassword.style.border = '1px solid red';
        errorMessage = (errorMessage) ? errorMessage : ((currentLanguage === 'en') ? 'Password must contain latin letters and numbers' : 'Пароль должен содержать латинские буквы и цифры');
    }

    if (errorMessage) {
        $headerLogInErrorMessage.textContent = errorMessage;
    } else {
        if ($headerLogInErrorMessage.textContent) {
            $headerLogInErrorMessage.textContent = '';
        }

        // Query send for register

        fetch(`${HOST}/api/log_in`, {
            method: 'POST', 
            credentials: 'include',
            body: JSON.stringify({
                email: $headerLogInEmail.value,
                pass: $headerLogInPassword.value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(async (res) => {
            const status = res.status;
            const data = await res.json();
            if (status !== 200) {
                try {
                    $headerLogInErrorMessage.textContent = (currentLanguage === 'en') ? data.en : data.ru;
                } catch (error) {
                    console.error('Error: ' + error);
                }
            } else {
                $headerLogInEmail.value = '';
                $headerLogInPassword.value = '';

                $headerLogInEmail.style.border = `2px solid ${COLOR_2}`;
                $headerLogInPassword.style.border = `2px solid ${COLOR_2}`;

                $headerSignUpCodeError.textContent = '';

                localStorage.setItem('isLoggedIn', 'true');
                doLogin();

                $headerLogInPopup.classList.remove('_shown');
                $body.classList.remove('_lock');
            }
        })
        .catch((error) => {
            $headerLogInErrorMessage.textContent = (currentLanguage === 'en') ? 'Unexpected error' : 'Непредвиденная ошибка';    
            console.error('Fetch error');
        });
    }
});

// Restore password

const $headerLogInBackBtn = $headerLogInPopup.querySelector('.log-in__back');

const $headerLogInRestorePassword = $headerLogInForm.querySelector('.log-in__restore-password');
const $headerLogInMainContainer = $headerLogInPopup.querySelector('.log-in__main-container');
const $headerLogInConfirmationContainer = $headerLogInPopup.querySelector('.log-in__confirmation-container');
const $headerLogInConfirmationError = $headerLogInPopup.querySelector('.log-in__confirmation-error');
const $headerLogInConfirmationForm = $headerLogInPopup.querySelector('.log-in__confirmation-form');
const $headerLogInConfirmationEmail = $headerLogInConfirmationForm.querySelector('.log-in__confirmation-email');
const $headerLogInConfirmationSubmit = $headerLogInConfirmationForm.querySelector('.log-in__confirmation-submit');
const $headerLogInConfirmationCounter = $headerLogInConfirmationForm.querySelector('.log-in__confirmation-counter');
const $headerLogInCodeForm = $headerLogInPopup.querySelector('.log-in__code-form');
const $headerLogInCode = $headerLogInCodeForm.querySelector('.log-in__code');
const $headerLogInCodeSubmit = $headerLogInCodeForm.querySelector('.log-in__code-submit');
const $headerLogInNewPassContainer = $headerLogInPopup.querySelector('.log-in__new-pass-container');

let resendMessageCounterForRefreshPassword;
let userEmailForRefreshPassword;

$headerLogInRestorePassword.addEventListener('click', () => {
    $headerLogInMainContainer.classList.add('_hidden');
    $headerLogInConfirmationContainer.classList.add('_shown');
    $headerLogInBackBtn.classList.add('_shown');
});

// Send refresh email code

$headerLogInConfirmationForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!$headerLogInConfirmationSubmit.classList.contains('_disabled')) {
        let errorMessage = '';

        if (!(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu.test($headerLogInConfirmationEmail.value))) {
            $headerLogInConfirmationEmail.style.border = '1px solid red';
            errorMessage = (errorMessage) ? errorMessage : ((currentLanguage === 'en') ? 'Incorrect email' : 'Некорректная электронная почта');
        }

        if (errorMessage) {
            $headerLogInConfirmationError.textContent = errorMessage;
        } else {
            if ($headerLogInConfirmationError.textContent) {
                $headerLogInConfirmationError.textContent = '';
            }

            // Query send for send refresh email code

            fetch(`${HOST}/api/send_refresh_email_code`, {
                method: 'POST', 
                body: JSON.stringify({
                    email: $headerLogInConfirmationEmail.value,
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(async (res) => {
                const status = res.status;
                const data = await res.json();
                if (status !== 200) {
                    try {
                        $headerLogInConfirmationError.textContent = (currentLanguage === 'en') ? data.en : data.ru;
                    } catch (error) {
                        console.error('Error: ' + error);
                    }
                } else {
                    userEmailForRefreshPassword = $headerLogInConfirmationEmail.value;

                    $headerLogInConfirmationEmail.style.border = `2px solid ${COLOR_2}`;

                    $headerLogInConfirmationError.textContent = '';

                    $headerLogInConfirmationSubmit.classList.add('_disabled');
                    resendMessageCounterForRefreshPassword = makeSendButtonInactive($headerLogInConfirmationCounter, $headerLogInConfirmationSubmit);
                    if ($headerLogInCodeSubmit.classList.contains('_disabled')) {
                        $headerLogInCodeSubmit.classList.remove('_disabled');
                    }
                }
            })
            .catch((error) => {
                $headerLogInConfirmationError.textContent = (currentLanguage === 'en') ? 'Unexpected error' : 'Непредвиденная ошибка';    
                console.error('Fetch error');
            });
        }
    }
});

// Check the access code on the server

$headerLogInCodeForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!$headerLogInCodeSubmit.classList.contains('_disabled')) {
        if (!(/^[0-9]{6}$/.test($headerLogInCode.value))) {
            $headerLogInCode.style.border = `1px solid red`;
    
            $headerLogInConfirmationError.textContent = (currentLanguage === 'en') ? 'Incorrect code' : 'Неверный код';
        } else {
            fetch(`${HOST}/api/check_access_code_on_server`, {
                method: 'POST', 
                credentials: 'include',
                body: JSON.stringify({
                    email: userEmailForRefreshPassword,
                    code: $headerLogInCode.value
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(async (res) => {
                const status = res.status;
                const data = await res.json();
    
                if (status !== 200) {
                    try {
                        $headerLogInConfirmationError.textContent = (currentLanguage === 'en') ? data.en : data.ru;
                    } catch (error) {
                        console.error('Error: ' + error);
                    }
                } else {
                    $headerLogInConfirmationEmail.value = '';
                    $headerLogInCode.value = '';
                    $headerLogInConfirmationEmail.style.border = `2px solid ${COLOR_2}`;
                    $headerLogInCode.style.border = `2px solid ${COLOR_2}`;
                    $headerLogInConfirmationError.textContent = '';
    
                    $headerLogInConfirmationContainer.classList.remove('_shown');
                    $headerLogInNewPassContainer.classList.add('_shown');
                    // $headerSignUpBackBtn.classList.remove('_shown');
    
                    clearInterval(resendMessageCounterForRefreshPassword);
                    $headerLogInConfirmationCounter.textContent = '';
                    if ($headerLogInConfirmationSubmit.classList.contains('_disabled')) {
                        $headerLogInConfirmationSubmit.classList.remove('_disabled');
                    }
                    $headerLogInCodeSubmit.classList.add('_disabled');
                }
            })
            .catch((error) => {
                $headerLogInConfirmationError.textContent = (currentLanguage === 'en') ? 'Unexpected error' : 'Непредвиденная ошибка';    
                console.error('Fetch error');
            });
        }
    }
});

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// Send new password

const $headerLogInNewPassForm = $headerLogInNewPassContainer.querySelector('.log-in__new-pass-form');
const $headerLogInNewPass = $headerLogInNewPassContainer.querySelector('.log-in__new-pass');
const $headerLogInRepeatNewPass = $headerLogInNewPassContainer.querySelector('.log-in__repeat-new-pass');
const $headerLogInNewPassError = $headerLogInNewPassContainer.querySelector('.log-in__new-pass-error');

$headerLogInNewPassForm.addEventListener('submit', (event) => {
    event.preventDefault();

    let errorMessage = '';

    if (!(/^(?=.*\d)(?=.*[a-zA-Z])(?!.*\s).*$/.test($headerLogInNewPass.value))) {
        $headerLogInNewPass.style.border = '1px solid red';
        $headerLogInRepeatNewPass.style.border = '1px solid red';
        errorMessage = (errorMessage) ? errorMessage : ((currentLanguage === 'en') ? 'Password must contain latin letters and numbers' : 'Пароль должен содержать латинские буквы и цифры');
    }

    if (!stringLengthCheck($headerLogInNewPass.value, 6)) {
        $headerLogInNewPass.style.border = '1px solid red';
        $headerLogInRepeatNewPass.style.border = '1px solid red';
        errorMessage = (errorMessage) ? errorMessage : ((currentLanguage === 'en') ? 'Password less than 6 characters' : 'Пароль меньше 6 символов');
    }

    if ($headerLogInNewPass.value !== $headerLogInRepeatNewPass.value) {
        $headerLogInNewPass.style.border = '1px solid red';
        $headerLogInRepeatNewPass.style.border = '1px solid red';
        errorMessage = (errorMessage) ? errorMessage : ((currentLanguage === 'en') ? 'Passwords do not match' : 'Пароли не совпадают');
    }

    if (errorMessage) {
        $headerLogInNewPassError.textContent = errorMessage;
    } else {
        if ($headerLogInNewPassError.textContent) {
            $headerLogInNewPassError.textContent = '';
        }

        // Query send

        fetch(`${HOST}/api/change_user_password`, {
            method: 'POST', 
            credentials: 'include',
            body: JSON.stringify({
                pass: $headerLogInNewPass.value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(async (res) => {
            const status = res.status;
            const data = await res.json();
            if (status !== 200) {
                try {
                    $headerLogInNewPassError.textContent = (currentLanguage === 'en') ? data.en : data.ru;
                } catch (error) {
                    console.error('Error: ' + error);
                }
            } else {
                $headerLogInNewPass.value = '';
                $headerLogInRepeatNewPass.value = '';

                $headerLogInNewPass.style.border = `2px solid ${COLOR_2}`;
                $headerLogInRepeatNewPass.style.border = `2px solid ${COLOR_2}`;

                $headerLogInNewPassError.textContent = '';

                localStorage.setItem('isLoggedIn', 'true');
                doLogin();

                $headerLogInPopup.classList.remove('_shown');
                $headerLogInConfirmationContainer.classList.remove('_shown');
                $headerLogInNewPassContainer.classList.remove('_shown');
                $headerLogInMainContainer.classList.remove('_hidden');
                $body.classList.remove('_lock');
            }
        })
        .catch((error) => {
            $headerLogInNewPassError.textContent = (currentLanguage === 'en') ? 'Unexpected error' : 'Непредвиденная ошибка';    
            console.error('Fetch error');
        });
    }
});

// Remove red border by focus registration input

removeRedBorder($headerLogInEmail);
removeRedBorder($headerLogInPassword);
removeRedBorder($headerLogInConfirmationEmail);
removeRedBorder($headerLogInCode);
removeRedBorder($headerLogInNewPass);
removeRedBorder($headerLogInRepeatNewPass);

// Back to login

$headerLogInBackBtn.addEventListener('click', () => {
    if ($headerLogInConfirmationContainer.classList.contains('_shown')) {
        $headerLogInConfirmationContainer.classList.remove('_shown');
    }
    if ($headerLogInNewPassContainer.classList.contains('_shown')) {
        $headerLogInNewPassContainer.classList.remove('_shown');
    }

    $headerLogInMainContainer.classList.remove('_hidden');
    $headerLogInBackBtn.classList.remove('_shown');
});