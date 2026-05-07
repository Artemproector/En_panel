const order_p = document.querySelector('.price_o');
const inp_name = document.querySelector('.name');
const auto_btn = document.querySelector('.auto');
const input_prod = document.querySelector('.input');
const price_o = document.querySelector('#b');
const area = document.querySelector('.area');
const add_btn = document.querySelector('.add');
const full_modal = document.querySelector('.add_ord');
const full_loader = document.querySelector('.full_loader');
const form_add = document.querySelector('.form_add');
const products_list = document.querySelectorAll('.elem');
const id_inp = document.querySelector('.id');
//реализация ID через SAVER и заполнение скрытого поля как в "products" и "provider"!
//СДЕЛАТЬ НАКОНЕЦ-ТО КНОПКИ!!!
add_btn.addEventListener('click', () => {
    full_modal.classList.toggle('show_modal');
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
var prices = [];
var productNames = [];
getJsonValue('products.info').then(org => {
    if (Array.isArray(org)) {
        org.forEach(item => {
            productNames.push(item.name);
            prices.push(Number(item.price));
        });
    }
});

getJsonValue('products.info').then(consumables => {
    const products = document.querySelector('.products');
    let sort_popular = [];
    if (Array.isArray(consumables)) {
        const popular = consumables.map(item => item.popular);
        const namesFromJson = consumables.map(i => i.name);
        popular.forEach((pop, index) => {
            if (pop > 0) {
                sort_popular = filter_elem(namesFromJson);
            }
        });
        if (sort_popular.length != 0) {
            sort_popular.forEach(elem => {
                products.innerHTML += `<div class="elem" onclick='addCart("${elem.replace(/"/g, '\\"')}","${elem.replace(/"/g, '\\"')}")'><p>${elem}</p></div>`;
            });
        } else {
            for (let i = 0; i < namesFromJson.length; i++) {
                products.innerHTML += `<div class="elem ${i}" onclick='addCart("${namesFromJson[i].replace(/"/g, '\\"')}")'><p>${namesFromJson[i]}</p></div>`;
            }
        }
        input_prod.innerHTML += `<p class='all_prd' onclick='showMore()'>Все товары</p>`;
    }
});
function filter_elem(full_arr) {
    console.log(full_arr);
    //let elem_arr_filter_final = array.slice().sort((a, b) => a - b);
    let elem_arr_filter_final = ['Капучино', 'Вода'];
    return elem_arr_filter_final;
}
function showMore() {
    const products = document.querySelector('.products');
    console.log(products);
    products.innerHTML = '';
    getJsonValue('products.info').then(consumables => {
        const namesFromJson = consumables.map(i => i.name);
        namesFromJson.forEach(item => {
            console.log(item);
            products.innerHTML += `<div class="elem" onclick='addCart("${item.replace(/"/g, '\\"')}")'><p>${item}</p></div>`;
        });
    });

}
function addCart(elem_id, elem) {
    console.log('Добавлено', elem_id, elem);
}
function calcMoney() {
    order_p.textContent = 'Расчетная выручка: Загрузка...';
    let result = 0;
    setTimeout(() => {
        order_p.textContent = 'Расчетная выручка: ' + result;
    }, 1000);
    price_o.value = result;
}
getJsonValue('orders.info').then(con => {
    area.innerHTML = '';
    if (!con || !Array.isArray(con) || con.length === 0) {
        area.innerHTML = '<div class="card">Нет данных о заказах</div>';
        setTimeout(() => {
            document.querySelector('.loader_modal').style.animation = '0.2s load forwards';
        }, 300);
        return;
    }
    renderCards(con);
});
function renderCards(con) {
    area.innerHTML = '';
    con.forEach((item, index) => {
        const uniqueId = `myButton-${index}`;
        area.innerHTML += `
            <div class="card"> 
                <h3><span class='desc'>${item.name || 'Без названия'}</span></h3>
                <p id="${uniqueId}" class="tooltip-btn">Состав заказа</p>
                <p>Выручка:<span class='desc'> ${item.revenue}₽</span></p>
                <p>Состояние заказа:<span class='desc'> ${item.progress}</span></p>
                ${item.progress != 'Завершен' ? `<button type='button' class='btn complete-btn' data-order="${item.name}">Завершить заказ</button>` : ''}
            </div>`;
    });
    con.forEach((item, index) => {
        const uniqueId = `myButton-${index}`;
        const contentWithBreaks = item.content ? item.content.replace(/,/g, '<br>') : 'Нет информации о составе';
        tippy(`#${uniqueId}`, {
            content: contentWithBreaks,
            allowHTML: true,
        });
    });
    document.querySelectorAll('.complete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const orderName = btn.getAttribute('data-order');
            completeOrder(orderName);
        });
    });
    setTimeout(() => {
        document.querySelector('.loader_modal').style.animation = '0.2s load forwards';
    }, 300);
}
function completeOrder(orderName) {
    console.log('Завершаем заказ:', orderName);
}
form_add.addEventListener('submit', (e) => {
    const selected = $('.multiple').val();
    document.querySelector('#a').value = selected;
    if (inp_name.value == 'Загрузка...') {
        e.preventDefault();
    }
});
auto_btn.addEventListener('click', () => {
    if (!auto_btn.classList.contains('active')) {
        auto_btn.classList.add('active');
        inp_name.value = 'Загрузка...';
        setTimeout(() => {
            inp_name.value = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        }, 1000);
    } else {
        inp_name.value = '';
        auto_btn.classList.remove('active');
    }
});