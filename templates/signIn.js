const verification = (status) => {
    if (status == 'ok') {
        return true;
    }
    const verdicts = {
        'email_valid': ['email', 'Неправильная почта'],
        'email_busy': ['email', 'Эта почта занята'],
        'password_length': ['password', 'Неправильная длина пароля'],
        'password_without_symbols': ['password', 'Неправильный формат пароля'],
        'password_equal': ['secPassword', 'Пароли не совпадают'],
        'nickname_valid': ['nickname', 'Неправильный никнейм'],
        'nickname_busy': ['nickname', 'Никнейм занят'],
    };
    for(let property in verdicts){
        const id = verdicts[property][0];
        if (document.getElementById(id)) {
            const elem = document.getElementById(id).nextElementSibling;
            elem.innerHTML = "";
        }
    }
    let correct = true;
    for (let property in verdicts) {
        const id = verdicts[property][0];
        if (status.hasOwnProperty(property)) {
            const text = [verdicts[property][1]];
            const elem = document.getElementById(id).nextElementSibling;
            elem.insertAdjacentHTML('afterbegin', `<span class="small red">${text}</span><br>`);
            correct = false;
        }
    }
    return correct;
}

const main = () => {
    let x = {'143': 14};
    console.log(x);
    const signUp = document.getElementById('signUp');
    signUp.addEventListener('click', () => {
        document.location.replace('/signUp');
    });
    const forgotPassword = document.getElementById('forgotPassword');
    forgotPassword.addEventListener('click', () => {
        document.location.replace('/recoverPassword1')
    });
    const signIn = document.getElementById('signIn');
    signIn.addEventListener('click', async () => {
        const url = '/signIn';
        const inputs = document.querySelectorAll('input');
        const x = {'login': inputs[0].value, 'password': inputs[1].value};
        const data = JSON.stringify(x);
        const response = await fetch(url, {
            method: 'POST',
            body: data,
        });
        if (!response.ok) {
            throw new Error(`Ошибка при POST запросе по адрессу: ${url}, статус ошибки: ${response}`);
        } else {
            let raw = await response.json();
            if (verification(raw)){
                document.location.replace('/');
            }
        }
    });
}

window.onload = () => {
    main();
}
