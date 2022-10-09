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
    const close = document.getElementById('close');
    close.addEventListener('click', () => {
        document.location.replace('/');
    });
    const send = document.getElementById('send');
    send.addEventListener('click', async () => {
        const url = '/recoverPassword1';
        const inputs = document.querySelectorAll('input');
        const x = {'login' : inputs[0].value};
        const data = JSON.stringify(x);
        const response = await fetch(url, {
            method: 'POST',
            body: data,
        });
        if (!response.ok){
            throw new Error(`Ошибка при POST запросе по адрессу: ${url}, статус ошибки: ${response}`);
        } else{
            let raw = await response.json();
            if (verification(raw)){
                document.location.replace('/recoverPassword2');
            }
        }
    });
}

window.onload = () => {
    main();
}
