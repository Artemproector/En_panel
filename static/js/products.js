let area = document.querySelector('.area');
let loader = document.querySelector('.full_loader');
let add_btn = document.querySelector('.add');
let full_modal = document.querySelector('.add_prd');
let full_modal2 = document.querySelector('.texno');
let form_add = document.querySelector('.form_add');
let tex_card = document.querySelector('.tex');
let tbody = document.querySelector('tbody');
let saver = document.querySelector('.saver');
let auto_btn = document.querySelector('.auto');
let inp_name = document.querySelector('.price');
let units = document.querySelector('.units');
let id_inp = document.querySelector('.id');
add_btn.addEventListener('click', function (e) {
    full_modal.classList.toggle('show_modal');
});
tex_card.addEventListener('click', function (e) {
    full_modal2.classList.toggle('show_modal');
});

saver.addEventListener('click', function (e) {
    id_inp.value = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    let map = document.querySelector('#map').value
    if (map == '') {
        tex_card.style.animation = 'err 1s'
        setTimeout(function () {
            tex_card.style.animation = 'none'
        }, 1000);
        e.preventDefault();
    }
});
async function calc(counts) {
    const consumables = await getJsonValue('consumables.info');
    let pricesArr = [];
    let productArr = [];
    consumables.forEach(item => {
        pricesArr.push(item.price);
        productArr.push(item.name);
    });
    let totalPrice = 0;
    for (let i = 0; i < products.length; i++) {
        const productName = products[i].name;
        const quantity = products[i].quantity;
        for (let j = 0; j < productArr.length; j++) {
            if (productArr[j] === productName) {
                totalPrice += pricesArr[j] * quantity;
                break;
            }
        }
    }
    console.log('Общая цена:', totalPrice);
    return totalPrice;
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
        return value !== undefined ? value : null;
    } catch (error) {
        console.error('Ошибка загрузки JSON:', error);
        return null;
    }
}

getJsonValue('products.info').then(con => {
    area.innerHTML = '';
    if (!con || !Array.isArray(con) || con.length === 0) {
        area.innerHTML = '<div class="card">Нет данных о продуктов</div>';
        setTimeout(function () {
            let loader = document.querySelector('.loader_modal');
            loader.style.animation = '0.2s load forwards'
        }, 300);
        return;
    }

    con.forEach((item, index) => {
        const uniqueId = `myButton-${index}`;
        area.innerHTML += `
                <div class="card">
                <p class='id_card'>${item.id}</p>
                    <h3><span class='desc'>${item.name || 'Без названия'}</span></h3>
                    <p>Цена:<span class='desc'> ${item.price || '0'}₽</span></p>
                    <p id="${uniqueId}" class="tooltip-btn">Состав изделия</p>
                </div>
            `;
    });
    con.forEach((item, index) => {
        const data = JSON.parse(item.content);
        let result = []
        data.forEach(item => {
            result.push(`${item.name} - ${item.number + item.unit}`)
        });
        const uniqueId = `myButton-${index}`;
        tippy(`#${uniqueId}`, {
            content: result.join('<br>') || 'Нет информации о составе',
            allowHTML: true,
        });
    });
});
setTimeout(function () {
    setTimeout(function () {
        let loader = document.querySelector('.loader_modal');
        loader.style.animation = '0.2s load forwards'
    }, 300);
});

form_add.addEventListener('submit', function (e) {
    var selected = $('.multiple').val();
    let text = document.querySelector('#a').value = selected
});

function add_table() {
    getJsonValue('consumables.info').then(consumables => {
        const names_con = consumables.map(item => item.name);
        const rowIndex = document.querySelectorAll('tbody tr').length;

        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>
                <select class="full nameing">
                    <option disabled selected value="-">Выберите материал</option>
                </select>
            </td>
            <td>
                <select name="unit" class="full unit">
                    <option disabled selected value="-">Выберите единицу измерения</option>
                    <optgroup label="Литры">
                        <option value="л">Литры</option>
                        <option value="мл">Миллилитры</option>
                    </optgroup>
                    <optgroup label="Килограммы">
                        <option value="кг">Килограммы</option>
                        <option value="г">Граммы</option>
                    </optgroup>
                    <optgroup label="Штуки">
                        <option value="шт">Шт</option>
                    </optgroup>
                </select>
            </td>
            <td><input type="number" class="full num${rowIndex}"></td>
            <td><svg onclick='closeItem(${rowIndex})' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#064f97">
                      <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                     </svg></td>
        `;
        tbody.appendChild(newRow);
        let rows = document.querySelectorAll('tbody tr');
        rows[rowIndex].style.animation = 'add 0.5s forwards'
        setTimeout(function () {
            let unit = document.querySelector('.unit');
        }, 100);

        const nameSelect = newRow.querySelector('.nameing');
        names_con.forEach(name => {
            nameSelect.innerHTML += `<option value='${name}'>${name}</option>`;
        });
    });

}
function closeItem(item) {
    let rows = document.querySelectorAll('tbody tr');
    if (rows[item]) {
        rows[item].style.animation = 'close 0.5s forwards'
        setTimeout(function () {
            rows[item].innerHTML = '';
        }, 500);
    }
}
function save_map() {
    const rows = document.querySelectorAll('tbody tr');
    const tableData = [];
    rows.forEach((row, index) => {
        const nameSelect = row.querySelector('.nameing');
        const numberInput = row.querySelector('input[type="number"]');
        const unitSelect = row.querySelector('.unit');
        const rowData = {
            row: index + 1,
            name: nameSelect ? nameSelect.value : null,
            number: numberInput ? numberInput.value : null,
            unit: unitSelect ? unitSelect.value : null
        };
        tableData.push(rowData);
    });
    document.getElementById('map').value = JSON.stringify(tableData);
    full_modal2.classList.toggle('show_modal');
    return tableData;
}