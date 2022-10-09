const verification = (status) => {
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
    if (status === 'ok' || status.status === 'ok') {
        return true;
    }
    let correct = true;
    for (let property in status.status) {
        console.log(property)
        const id = verdicts[property][0];
        const text = [verdicts[property][1]];
        const elem = document.getElementById(id).nextElementSibling;
        elem.insertAdjacentHTML('afterbegin', `<span class="small red">${text}</span><br>`);
        correct = false;
    }
    return correct;
}

const main = () => {
    const signIn = document.getElementById('signIn');
    signIn.addEventListener('click', () => {
       document.location.replace('signIn');
    });
    const signUp = document.getElementById('signUp');
    signUp.addEventListener('click', async () => {
        const url = '/signUp';
        const inputs = document.querySelectorAll('input');
        const x = {
            'login' : inputs[0].value,
            'password' : inputs[1].value,
            'passwordRepeat' : inputs[2].value,
            'nickname' : inputs[3].value,
        };
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
                let nickname = raw.nickname
                document.location.replace(`/checkCode?nickname=${nickname}`);
            }
        }
    });
}

window.onload = () => {
    main();
}
