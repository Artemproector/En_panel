let loader = document.querySelector('.loader_modal');
let add_fin = document.querySelector('.add_fin');
let add_btn = document.querySelector('.add');
let edit_fin = document.querySelector('.edit_fin');
let id_p = document.querySelector('.id');
let id_inp = document.querySelector('.id_inp');
let area = document.querySelector('.area');
var desc = [];
var prices = [];
var types = [];
var ids = [];
getJsonValue('finance.info').then(org => {
    if (org && Array.isArray(org)) {
        org.forEach(function (item) {
            desc.push(item.desc);
            prices.push(item.price);
            types.push(item.type);
            ids.push(item.id);
        });
        renderCards(org);
    }
});

function renderCards(org) {
    area.innerHTML = '';

    if (!org || !Array.isArray(org) || org.length === 0) {
        area.innerHTML = '<div class="card">Нет данных о финансах</div>';
    } else {
        for (let i = 0; i < org.length; i++) {
            area.innerHTML += `<div class="${types[i] == "Расход" ? 'minus_fin' : 'plus_fin'} card">
                <p>ID:<span class='desc'> ${ids[i]}</span></p>
                <p>Тип: <span class='desc'>${types[i]}</span></p>
                <p>Сумма денег: <span class='desc'>${prices[i]}₽</span></p>
                <p>Описание: <span class='desc'>${desc[i]}</span></p>`;
        }
    }
    setTimeout(function () {
        loader.style.animation = '0.2s load forwards';
    }, 300);
}

add_btn.addEventListener('click', function (e) {
    add_fin.classList.toggle('show_modal');
    let id = Math.floor(Math.random() * (999999 - 100000) + 100000);
    id_p.innerHTML = `ID:${id}`;
    id_inp.value = id;
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