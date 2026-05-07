// Подключаем библиотеку для работы с Excel
const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
document.head.appendChild(script);

let data = null;

async function loadData() {
    try {
        const response = await fetch('static/system.json');
        if (!response.ok) {
            throw new Error('Ошибка загрузки файла');
        }
        data = await response.json();
        console.log('Данные успешно загружены');
        return data;
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        alert('Ошибка загрузки файла данных');
        return null;
    }
}

function downloadExcel(data, filename) {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Отчет");
    XLSX.writeFile(wb, `${filename}.xlsx`);
}

async function downloadReport(type) {
    if (!data) {
        const loaded = await loadData();
        if (!loaded) return;
    }
    
    let reportData = [];
    let filename = '';

    switch(type) {
        case 'general':
            createGeneralReport();
            return;
        case 'consumables':
            reportData = data.consumables.info.map(item => ({
                'Название': item.name,
                'Цена': item.price,
                'Ссылка': item.href,
                'Единицы измерения': item.units,
                'Количество': item.count
            }));
            filename = 'расходники_отчет';
            break;
        case 'products':
            reportData = data.products.info.map(item => {
                let composition = 'Не указан';
                if (item.content && item.content !== '[{"row":1,"name":"-","number":"","unit":"-"}]') {
                    try {
                        const content = JSON.parse(item.content);
                        composition = content.map(comp => 
                            `${comp.name}: ${comp.number} ${comp.unit}`
                        ).join('; ');
                    } catch (e) {
                        composition = 'Ошибка парсинга';
                    }
                }
                return {
                    'Название изделия': item.name,
                    'Цена': item.price,
                    'Ссылка': item.href,
                    'Состав': composition
                };
            });
            filename = 'изделия_отчет';
            break;
        case 'orders':
            reportData = data.orders.info.map(item => ({
                'Номер заказа': item.name,
                'Статус': item.progress,
                'Состав заказа': item.content,
                'Выручка': item.revenue
            }));
            filename = 'заказы_отчет';
            break;
        case 'finance':
            reportData = data.finance.info.map(item => ({
                'Тип операции': item.type,
                'ID операции': item.id,
                'Сумма': item.price,
                'Описание': item.desc,
                'Дата': new Date().toLocaleDateString()
            }));
            filename = 'финансы_отчет';
            break;
        case 'revenue':
            const revenues = data.orders.info
                .filter(order => !isNaN(parseInt(order.revenue)))
                .map(order => parseInt(order.revenue));
            
            const totalRevenue = revenues.reduce((sum, revenue) => sum + revenue, 0);
            const avgRevenue = revenues.length > 0 ? totalRevenue / revenues.length : 0;
            const maxRevenue = revenues.length > 0 ? Math.max(...revenues) : 0;

            reportData = [
                {
                    'Показатель': 'Общая выручка',
                    'Значение': totalRevenue,
                    'Валюта': 'руб.'
                },
                {
                    'Показатель': 'Средняя выручка на заказ',
                    'Значение': Math.round(avgRevenue * 100) / 100,
                    'Валюта': 'руб.'
                },
                {
                    'Показатель': 'Максимальная выручка с заказа',
                    'Значение': maxRevenue,
                    'Валюта': 'руб.'
                },
                {
                    'Показатель': 'Количество завершенных заказов',
                    'Значение': revenues.length,
                    'Валюта': 'шт.'
                }
            ];
            filename = 'выручка_отчет';
            break;
        case 'finance_stats':
            const income = data.finance.info
                .filter(item => item.type === 'Доход')
                .reduce((sum, item) => sum + parseInt(item.price), 0);
                
            const expenses = data.finance.info
                .filter(item => item.type === 'Расход')
                .reduce((sum, item) => sum + parseInt(item.price), 0);
                
            const netProfit = income - expenses;
            const profitability = income > 0 ? (netProfit / income * 100) : 0;

            reportData = [
                {'Показатель': 'Общий доход', 'Значение': income, 'Валюта': 'руб.'},
                {'Показатель': 'Общие расходы', 'Значение': expenses, 'Валюта': 'руб.'},
                {'Показатель': 'Чистая прибыль', 'Значение': netProfit, 'Валюта': 'руб.'},
                {'Показатель': 'Рентабельность', 'Значение': Math.round(profitability * 100) / 100, 'Валюта': '%'},
                {'Показатель': 'Количество финансовых операций', 'Значение': data.finance.info.length, 'Валюта': 'шт.'}
            ];
            filename = 'финансовая_статистика';
            break;
        case 'cash_flow':
            const cashFlowData = data.finance.info.map(item => ({
                'Дата': new Date().toLocaleDateString(),
                'Тип операции': item.type,
                'Сумма': parseInt(item.price),
                'Описание': item.desc,
                'ID операции': item.id
            }));
            
            // Сортируем по дате (в реальном приложении нужно использовать реальные даты)
            cashFlowData.sort((a, b) => a['Дата'].localeCompare(b['Дата']));
            reportData = cashFlowData;
            filename = 'движение_денежных_средств';
            break;
        case 'popular':
            const productCount = {};
            data.orders.info.forEach(order => {
                const products = order.content.split(',');
                products.forEach(product => {
                    const trimmedProduct = product.trim();
                    if (trimmedProduct && trimmedProduct !== 'Загрузка...') {
                        productCount[trimmedProduct] = (productCount[trimmedProduct] || 0) + 1;
                    }
                });
            });

            reportData = Object.entries(productCount)
                .sort((a, b) => b[1] - a[1])
                .map(([product, count]) => ({
                    'Название изделия': product,
                    'Количество заказов': count,
                    'Доля в общем объеме': `${Math.round((count / data.orders.info.length) * 100)}%`
                }));
            filename = 'рейтинг_популярности';
            break;
        case 'price':
            reportData = data.products.info
                .map(item => ({
                    'Название изделия': item.name,
                    'Цена': parseInt(item.price),
                    'Ссылка': item.href
                }))
                .sort((a, b) => b.Цена - a.Цена);
            filename = 'рейтинг_цен';
            break;
        case 'profit':
            // Расчет прибыльности изделий на основе состава и цены
            reportData = data.products.info.map(product => {
                let cost = 0;
                if (product.content && product.content !== '[{"row":1,"name":"-","number":"","unit":"-"}]') {
                    try {
                        const composition = JSON.parse(product.content);
                        composition.forEach(comp => {
                            if (comp.name && comp.name !== '-') {
                                const consumable = data.consumables.info.find(c => c.name === comp.name);
                                if (consumable) {
                                    // Упрощенный расчет себестоимости
                                    const unitCost = parseInt(consumable.price) / parseInt(consumable.count);
                                    cost += unitCost * parseInt(comp.number);
                                }
                            }
                        });
                    } catch (e) {
                        console.error('Ошибка расчета себестоимости:', e);
                    }
                }
                
                const price = parseInt(product.price);
                const profit = price - cost;
                const margin = price > 0 ? (profit / price * 100) : 0;
                
                return {
                    'Название изделия': product.name,
                    'Цена продажи': price,
                    'Себестоимость': Math.round(cost * 100) / 100,
                    'Прибыль': Math.round(profit * 100) / 100,
                    'Маржинальность': Math.round(margin * 100) / 100
                };
            }).sort((a, b) => b.Прибыль - a.Прибыль);
            
            filename = 'рейтинг_прибыльности';
            break;
        case 'availability':
            reportData = data.consumables.info.map(item => ({
                'Название расходника': item.name,
                'Цена': item.price,
                'Ссылка': item.href,
                'Единицы измерения': item.units,
                'Количество в наличии': item.count,
                'Статус': parseInt(item.count) > 0 ? 'В наличии' : 'Нет в наличии',
                'Уровень запаса': parseInt(item.count) > 100 ? 'Высокий' : parseInt(item.count) > 10 ? 'Средний' : 'Низкий'
            }));
            filename = 'наличие_расходников';
            break;
        case 'composition':
            reportData = [];
            data.products.info.forEach(product => {
                if (product.content && product.content !== '[{"row":1,"name":"-","number":"","unit":"-"}]') {
                    try {
                        const composition = JSON.parse(product.content);
                        composition.forEach(comp => {
                            if (comp.name && comp.name !== '-') {
                                reportData.push({
                                    'Изделие': product.name,
                                    'Ингредиент': comp.name,
                                    'Количество': comp.number,
                                    'Единица измерения': comp.unit,
                                    'Цена изделия': product.price
                                });
                            }
                        });
                    } catch (e) {
                        // Пропускаем ошибки парсинга
                    }
                }
            });
            filename = 'состав_изделий';
            break;
        case 'cost_analysis':
            reportData = [];
            data.products.info.forEach(product => {
                let totalCost = 0;
                const components = [];
                
                if (product.content && product.content !== '[{"row":1,"name":"-","number":"","unit":"-"}]') {
                    try {
                        const composition = JSON.parse(product.content);
                        composition.forEach(comp => {
                            if (comp.name && comp.name !== '-') {
                                const consumable = data.consumables.info.find(c => c.name === comp.name);
                                if (consumable) {
                                    const unitCost = parseInt(consumable.price) / parseInt(consumable.count);
                                    const componentCost = unitCost * parseInt(comp.number);
                                    totalCost += componentCost;
                                    
                                    components.push({
                                        'Компонент': comp.name,
                                        'Количество': comp.number,
                                        'Единица': comp.unit,
                                        'Стоимость': Math.round(componentCost * 100) / 100
                                    });
                                }
                            }
                        });
                    } catch (e) {
                        console.error('Ошибка анализа себестоимости:', e);
                    }
                }
                
                const price = parseInt(product.price);
                const profit = price - totalCost;
                const margin = price > 0 ? (profit / price * 100) : 0;
                
                reportData.push({
                    'Изделие': product.name,
                    'Цена продажи': price,
                    'Общая себестоимость': Math.round(totalCost * 100) / 100,
                    'Прибыль': Math.round(profit * 100) / 100,
                    'Рентабельность': Math.round(margin * 100) / 100 + '%',
                    'Количество компонентов': components.length
                });
            });
            filename = 'анализ_себестоимости';
            break;
        case 'profitability':
            const totalIncome = data.finance.info
                .filter(item => item.type === 'Доход')
                .reduce((sum, item) => sum + parseInt(item.price), 0);
                
            const totalExpenses = data.finance.info
                .filter(item => item.type === 'Расход')
                .reduce((sum, item) => sum + parseInt(item.price), 0);
                
            const netProfitTotal = totalIncome - totalExpenses;
            
            reportData = [
                {'Метрика': 'Общая выручка', 'Значение': totalIncome, 'Единица': 'руб.'},
                {'Метрика': 'Общие затраты', 'Значение': totalExpenses, 'Единица': 'руб.'},
                {'Метрика': 'Чистая прибыль', 'Значение': netProfitTotal, 'Единица': 'руб.'},
                {'Метрика': 'Рентабельность по чистой прибыли', 'Значение': totalIncome > 0 ? Math.round((netProfitTotal / totalIncome) * 100 * 100) / 100 : 0, 'Единица': '%'},
                {'Метрика': 'Коэффициент доходности', 'Значение': totalExpenses > 0 ? Math.round((totalIncome / totalExpenses) * 100) / 100 : 0, 'Единица': 'раз'},
                {'Метрика': 'Точка безубыточности (примерно)', 'Значение': Math.round(totalExpenses / 0.3), 'Единица': 'руб.'}
            ];
            filename = 'анализ_рентабельности';
            break;
    }

    if (reportData.length > 0) {
        downloadExcel(reportData, filename);
    } else {
        alert('Нет данных для отчета');
    }
}

async function createGeneralReport() {
    if (!data) {
        const loaded = await loadData();
        if (!loaded) return;
    }
    
    const wb = XLSX.utils.book_new();
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');

    // Лист с расходниками
    const consumablesData = data.consumables.info.map(item => ({
        'Название': item.name,
        'Цена': item.price,
        'Ссылка': item.href,
        'Единицы измерения': item.units,
        'Количество': item.count
    }));
    const ws1 = XLSX.utils.json_to_sheet(consumablesData);
    XLSX.utils.book_append_sheet(wb, ws1, "Расходники");

    // Лист с изделиями
    const productsData = data.products.info.map(item => {
        let composition = 'Не указан';
        if (item.content && item.content !== '[{"row":1,"name":"-","number":"","unit":"-"}]') {
            try {
                const content = JSON.parse(item.content);
                composition = content.map(comp => 
                    `${comp.name}: ${comp.number} ${comp.unit}`
                ).join('; ');
            } catch (e) {
                composition = 'Ошибка парсинга';
            }
        }
        return {
            'Название изделия': item.name,
            'Цена': item.price,
            'Ссылка': item.href,
            'Состав': composition
        };
    });
    const ws2 = XLSX.utils.json_to_sheet(productsData);
    XLSX.utils.book_append_sheet(wb, ws2, "Изделия");

    // Лист с заказами
    const ordersData = data.orders.info.map(item => ({
        'Номер заказа': item.name,
        'Статус': item.progress,
        'Состав заказа': item.content,
        'Выручка': item.revenue
    }));
    const ws3 = XLSX.utils.json_to_sheet(ordersData);
    XLSX.utils.book_append_sheet(wb, ws3, "Заказы");

    // Лист с финансами
    const financeData = data.finance.info.map(item => ({
        'Тип операции': item.type,
        'ID операции': item.id,
        'Сумма': item.price,
        'Описание': item.desc
    }));
    const ws4 = XLSX.utils.json_to_sheet(financeData);
    XLSX.utils.book_append_sheet(wb, ws4, "Финансы");

    // Лист со статистикой
    const revenues = data.orders.info
        .filter(order => !isNaN(parseInt(order.revenue)))
        .map(order => parseInt(order.revenue));
    
    const income = data.finance.info
        .filter(item => item.type === 'Доход')
        .reduce((sum, item) => sum + parseInt(item.price), 0);
        
    const expenses = data.finance.info
        .filter(item => item.type === 'Расход')
        .reduce((sum, item) => sum + parseInt(item.price), 0);

    const statsData = [
        {'Показатель': 'Общая выручка', 'Значение': revenues.reduce((a, b) => a + b, 0)},
        {'Показатель': 'Средняя выручка', 'Значение': Math.round((revenues.reduce((a, b) => a + b, 0) / revenues.length) * 100) / 100},
        {'Показатель': 'Максимальная выручка', 'Значение': Math.max(...revenues)},
        {'Показатель': 'Общий доход', 'Значение': income},
        {'Показатель': 'Общие расходы', 'Значение': expenses},
        {'Показатель': 'Чистая прибыль', 'Значение': income - expenses},
        {'Показатель': 'Количество изделий', 'Значение': data.products.info.length},
        {'Показатель': 'Количество расходников', 'Значение': data.consumables.info.length},
        {'Показатель': 'Количество заказов', 'Значение': data.orders.info.length}
    ];
    const ws5 = XLSX.utils.json_to_sheet(statsData);
    XLSX.utils.book_append_sheet(wb, ws5, "Статистика");

    XLSX.writeFile(wb, `общий_отчет_${timestamp}.xlsx`);
}

// Функция для инициализации (можно вызвать при загрузке страницы)
async function initReports() {
    await loadData();
    console.log('Система отчетов готова к работе');
}

// Инициализируем систему отчетов
initReports();