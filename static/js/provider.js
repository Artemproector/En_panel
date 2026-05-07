let area = document.querySelector('.area');
let price = document.querySelector('.price');
let add_btn = document.querySelector('.add');
let full_modal = document.querySelector('.add_con');
let full_modal2 = document.querySelector('.texno');
let form_add = document.querySelector('.form_add');
let saver = document.querySelector('.saver');
let content = document.querySelector('.content');
let price_tb = document.querySelector('.price_tb');
let select = document.querySelector('.unit');
let all_price = document.querySelector('.all_price');
let count_inp = document.querySelector('.count');
let price_inp = document.querySelector('.price');
let id_inp = document.querySelector('.id');
function hideLoader() {
    setTimeout(function () {
        let loader = document.querySelector('.loader_modal');
        loader.style.animation = '0.2s load forwards';
    }, 300);
}
count_inp.addEventListener("input", updateValue);
price_inp.addEventListener('input', updateValue);
function updateValue() {
    if (price_inp.value && count_inp.value) {
        all_price.textContent = `Итоговая сумма:${count_inp.value * price_inp.value}₽`
    }
}
add_btn.addEventListener('click', function () {
    full_modal.classList.toggle('show_modal');
});
saver.addEventListener('click', function (e) {
    id_inp.value = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    let map = document.querySelector('#map').value;
    if (map == '') {
        content.style.animation = 'err 1s';
        setTimeout(function () {
            content.style.animation = 'none';
        }, 1000);
        e.preventDefault();
    }
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
function splitString(str, maxLength = 20) {
    let result = '';
    for (let i = 0; i < str.length; i += maxLength) {
        result += str.slice(i, i + maxLength) + '\n';
    }
    return result;
}
getJsonValue('consumables.info').then(con => {
    area.innerHTML = '';
    if (!con || !Array.isArray(con) || con.length === 0) {
        area.innerHTML = '<div class="card">Нет поставщиков</div>';
        hideLoader();
        return;
    }
    let i = 0
    con.forEach((item) => {
        i += 1;
        let prov = splitString(item.provider, 20)
        area.innerHTML += `
                    <div class="card">
                        <p class='id_card'>${item.id}</p>
                        <h3><span class='desc'>${item.name || 'Без названия'}</span></h3>
                        <div>Информация:
                            <ul>Поставщик:<br>
                            ${prov}</ul>
                            <ul>Цена:${item.price}/${item.units}</ul>
                            <ul>Количество:${item.count}${item.units}</ul>
                        </div>
                    </div>
                `;
    });
    hideLoader();
}).catch(error => {
    console.error('Ошибка:', error);
    area.innerHTML = '<div class="card">Ошибка загрузки данных</div>';
    hideLoader();
});
select.addEventListener('change', function (e) {
    price.placeholder = `Цена за ${select.value}`
});