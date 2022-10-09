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

export default verification;