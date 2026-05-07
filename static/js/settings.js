let org_n = document.querySelector('.org_n');
let main_c = document.querySelector('.main_c');
let theme_c = document.querySelector('.theme_c');
let account_c = document.querySelector('.account_c');
let info_c = document.querySelector('.info_c');
let ver = document.querySelector('.ver');
let auto_btn = document.querySelector('.theme');
let right_con = document.querySelector('.right');
getJsonValue('account.org_name').then(org => {
    org_n.textContent += org
});
getJsonValue('system.version').then(vers => {
    ver.textContent += vers
    setTimeout(function () {
        let loader = document.querySelector('.loader_modal');
        loader.style.animation = '0.2s load forwards'
    }, 300);
});

async function getJsonValue(path = '') {
    try {
        const response = await fetch('static/system.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!path) return data;
        const value = path.split('.').reduce((obj, key) => obj?.[key], data);
        return value !== undefined ? value : null;
    } catch (error) {
        console.error('Ошибка загрузки JSON:', error);
        return null;
    }
}
function exit() {
    window.location = '/'
    document.cookie = 'islogin=; max-age=1; path=/';
}
function applyTheme(isDark) {
    const body = document.querySelector('body');
    const header = document.querySelector('header');
    const btns = document.querySelectorAll('.btn');

    if (isDark) {
        body.classList.add('dark');
        header.classList.add('dark');
        btns.forEach(btn => btn.classList.add('dark_btn'));
        auto_btn.classList.add('active');
        auto_btn.textContent = 'Светлая тема';
    } else {
        body.classList.remove('dark');
        header.classList.remove('dark');
        btns.forEach(btn => btn.classList.remove('dark_btn'));
        auto_btn.classList.remove('active');
        auto_btn.textContent = 'Темная тема';
    }
}
function toggleTheme() {
    const isDark = !document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    applyTheme(isDark);
}
document.addEventListener('DOMContentLoaded', function () {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    applyTheme(isDark);
});
auto_btn.addEventListener('click', toggleTheme);
function main() {
    main_c.style.display = 'block'
    info_c.style.display = 'none'
    theme_c.style.display = 'none'
    account_c.style.display = 'none'
}
function theme() {
    main_c.style.display = 'none'
    info_c.style.display = 'none'
    theme_c.style.display = 'block'
    account_c.style.display = 'none'
}
function account() {
    main_c.style.display = 'none'
    info_c.style.display = 'none'
    theme_c.style.display = 'none'
    account_c.style.display = 'block'
}
function info() {
    main_c.style.display = 'none'
    info_c.style.display = 'block'
    theme_c.style.display = 'none'
    account_c.style.display = 'none'
}