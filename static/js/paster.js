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
if (!isLogin) {
  window.location = '/'
}

function applyTheme(isDark) {
  setTimeout(function () {
    const cards = document.querySelectorAll('.card');
    const body = document.querySelector('body');
    const header = document.querySelector('header');
    const btns = document.querySelectorAll('.btn');
    const links = document.querySelectorAll('a');
    console.log('==========================');
    console.log('Тема:', isDark ? 'dark' : 'light');
    console.log('Карты:', cards.length);
    console.log('Кнопки:', btns.length);
    console.log('Ссылки:', links.length);
    console.log('==========================');
    if (isDark) {
      body.classList.add('dark');
      header.classList.add('dark');
      btns.forEach(btn => btn.classList.add('dark_btn'));
      cards.forEach(card => card.classList.add('dark_card'));
      links.forEach(card => card.classList.add('dark_a'));
    } else {
      body.classList.remove('dark');
      header.classList.remove('dark');
      cards.forEach(card => card.classList.remove('dark_card'));
      btns.forEach(btn => btn.classList.remove('dark_btn'));
      links.forEach(card => card.classList.add('dark_a'));
    }
  }, 300);

}
document.addEventListener('DOMContentLoaded', function () {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
  applyTheme(isDark);
});

let header = document.querySelector('header');
if (header) {
  header.innerHTML = `
  <div class="left">
    <img src='static/img/favicon.jpg'>
    <h1 class="label">ПАНЕЛЬ ПРЕДПРИНИМАТЕЛЯ</h1>
  </div>
  <div class="right">
    <div class="up"></div>
    <div class="menu">
      <a href="/main" class="link">
        <span class="link-icon">
          <img src="static/img/main.png" alt="">
        </span>
        <span class="link-title">Главная</span>
      </a>      
      <a href="/provider" class="link">
        <span class="link-icon">
          <img src="static/img/provider.png" alt="">
        </span>
        <span class="link-title">Поставщики</span>
      </a>
      <a href="/products" class="link">
        <span class="link-icon">
          <img src="static/img/products.png" alt="">
        </span>
        <span class="link-title">Продукты</span>
      </a>
      <a href="/orders" class="link">
        <span class="link-icon">
          <img src="static/img/orders.png" alt="">
        </span>
        <span class="link-title">Продажи</span>
      </a>      

      <a href="/finance" class="link">
        <span class="link-icon">
          <img src="static/img/finance.png" alt="">
        </span>
        <span class="link-title">Финансы</span>
      </a>
      <a href="/info" class="link">
        <span class="link-icon">
          <img src="static/img/info.png" alt="">
        </span>
        <span class="link-title">Отчет</span>
      </a>
      <a href="/settings" class="link">
        <span class="link-icon">
          <img src="static/img/settings.png" alt="">
        </span>
        <span class="link-title">Настройки</span>
      </a>
    </div>
  </div>`
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

    return value !== undefined ? value : 'error(VNF)';
  } catch (error) {
    return 'error(FNF)';
  }
}