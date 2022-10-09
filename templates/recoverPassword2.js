window.onload = () => {
    let inputs = document.querySelectorAll('input');
    inputs[0].focus();
    for (let inp of inputs) {
        inp.addEventListener('keydown', prevInput);
        inp.addEventListener('input', newNumber);
    }
    main(inputs[5]);

}

const main = (input) => {
    const close = document.getElementById('close');
    close.addEventListener('click', () => {
        document.location.replace('/');
    });
    inputs[5].addEventListener('input', async () =>{
        const send = document.getElementById('send');
        send.addEventListener('click', async () => {
            const url = '/recoverPassword2';
            const inputs = document.querySelectorAll('input');
            let code = '';
            for(let input of inputs){
                code+= input;
            }
            const x = {'code' : code};
            const data = JSON.stringify(x);
            const response = await fetch(url, {
                method: 'POST',
                body: data,
            });
            if (!response.ok){
                throw new Error(`Ошибка при POST запросе по адрессу: ${url}, статус ошибки: ${response}`);
            } else{
                let raw = await response.json();
                document.location.replace('/recoverPassword2');
                return response;
            }
        });
    });
}

const prevInput = (event) => {
    if (event.code == 'Backspace'){
        let prev = event.target.previousElementSibling;
        if (prev == null){
            return;
        }
        if (event.target.nextElementSibling == null && event.target.value != ''){
            return;
        }
        prev.focus();
        prev.value = '';
    }
}

const newNumber = (event) => {
    if (event.target.value < '0' || event.target.value > '9') {
        event.target.value = '';
    } else{
        nextInput(event);
    }
}

const nextInput = (event) => {
    let next = event.target.nextElementSibling;
    if (next == null){
        return;
    }
    next.focus();
}