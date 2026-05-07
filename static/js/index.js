function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.trim().split('=');
        if (cookieName === name) {
            return decodeURIComponent(cookieValue);
        }
    }
    return null;
}

const isLogin = getCookie('islogin');

if (isLogin) {
    window.location = '/main'
}
let win = document.querySelector('.window');
function createAcc() {
    win.innerHTML = `
    <h1>Зарегистрируйтесь</h1>        
    <form method="POST" class="form_reg" action="/save-acc"> 
            <input type="text" name="name" id="name" class="name" placeholder="Название организации" required>
            <input type="text" name="login" id="login" class="login" placeholder="Логин" autocomplete="username" required>
            <input type="password" name="pass" id="pass" class="pass" placeholder="Придумайте пароль" autocomplete="new-password" required>
            <input type="password" name="pass-repeat" id="pass-repeat" class="pass" placeholder="Повторите пароль" autocomplete="new-password" required>
            <button type="submit">Зарегестрироваться</button>

        </form>
        <p class='acc_btn' onclick="login()"> -- Есть аккаунт? Войдите</P>
        <script src='account.js'></script>
`
}
function login() {
    win.innerHTML = `        <h1>Войти в систему</h1>
            <form class="form_log" action="#">
                <input type="text" name="login" id="login" class="login" placeholder="Логин" autocomplete="username"
                    required aria-invalid="true">
                <input type="password" name="pass" id="pass" class="pass" placeholder="Пароль"
                    autocomplete="current-password" required aria-invalid="true">
                <button type="submit">Войти</button>
            <a href="#" onclick="createAcc()">-- Создать аккаунт</a>

            </form>
`
}
async function getJsonValue(path = '') {
    try {
        const response = await fetch('static/system.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!path) return data;
        const value = path.split('.').reduce((obj, key) => obj?.[key], data);
        return value !== undefined ? value : 'error(VNF)'; // Value Not Found
    } catch (error) {
        return 'error(FNF)'; // File Not Found
    }
}
let form_log = document.querySelector('.form_log');
form_log.addEventListener('submit', async function (e) {
    e.preventDefault();
    let pass = document.querySelector('#pass').value;
    let login = document.querySelector('#login').value;
    try {
        const [currect_login, currect_pass] = await Promise.all([
            getJsonValue('account.login'),
            getJsonValue('account.pass')
        ]);
        if (pass === currect_pass && login === currect_login) {
            window.location = '/main';
            document.cookie = 'islogin=true; max-age=900; path=/';
        } else {
            win.style.animation = 'err 1s';
            setTimeout(function () {
                win.style.animation = 'none';
            }, 1000);
        }
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
    }
});