//ПОЗЖЕ !!!!!
let isAnimating = false; function startCyclicCounter(targetNumber, interval = 4000) {
    if (isAnimating) return;
    isAnimating = true; async function cycle() {
        while (isAnimating) {
            await counter(targetNumber, 2000);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Пауза между циклами
        }
    } cycle();
} function stopCyclicCounter() {
    isAnimating = false;
} async function counter(targetNumber, duration = 2000) {
    count.style.opacity = '0';
    count.style.transform = 'translateY(20px)';    // Анимация появления фразы
    await animateElement(count, 800, 'in');    // Ждем 1 секунду
    await new Promise(resolve => setTimeout(resolve, 1000));    // Скрываем фразу
    await animateElement(count, 600, 'out');    // Запускаем счетчик
    await startCounting(targetNumber, duration);
} function animateElement(element, duration, type) {
    return new Promise((resolve) => {
        let startTime = null; function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = (timestamp - startTime) / duration; if (progress < 1) {
                const value = type === 'in' ? progress : 1 - progress;
                const ease = 1 - Math.pow(1 - value, 3); element.style.opacity = type === 'in' ? ease : 1 - ease;
                element.style.transform = type === 'in'
                    ? `translateY(${20 * (1 - ease)}px)`
                    : `translateY(${-10 * ease}px)`; requestAnimationFrame(animate);
            } else {
                resolve();
            }
        } requestAnimationFrame(animate);
    });
}

function startCounting(targetNumber, duration) {
    return new Promise((resolve) => {
        let startTime = performance.now();

        function update() {
            const elapsed = performance.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easeInOut = progress < 0.5
                ? 2 * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;

            const current = Math.floor(targetNumber * easeInOut);
            count.textContent = current;
            count.style.opacity = '1';
            count.style.transform = 'translateY(0)';

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                count.textContent = targetNumber;

                // Финальная анимация
                count.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    count.style.transform = 'scale(1)';
                    setTimeout(resolve, 500);
                }, 150);
            }
        }

        update();
    });
}
//startCyclicCounter(28); ЗАПУСК