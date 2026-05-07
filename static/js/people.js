const inp_name = document.querySelector('.name');
const area = document.querySelector('.area');
const add_btn = document.querySelector('.add');
const form_add = document.querySelector('.form_add');
const products_list = document.querySelectorAll('.elem');
const id_inp = document.querySelector('.id');
const full_modal = document.querySelector('.add_ppl');
// ДОКУМЕНТЫ О ЧЕЛОВЕКЕ!!!!
add_btn.addEventListener('click', () => {
    full_modal.classList.toggle('show_modal');
    id_inp.value = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
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
setTimeout(() => {
    document.querySelector('.loader_modal').style.animation = '0.2s load forwards';
}, 300);
getJsonValue('people.info').then(people => {
    people.forEach(item => {
        console.log(item);
    });
});