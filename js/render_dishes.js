// Ключ доступа к API
const API_KEY = 'c7f8b838-299b-40ed-8a41-3384fc3c751b';
const API_URL = 'https://edu.std-900.ist.mospolytech.ru/labs/api/dishes';

// Глобальные переменные
let dishes = []; // Здесь будут храниться блюда с API
const categories = {
    soup: document.querySelector(".soups"),
    'main-course': document.querySelector(".main-courses"), // Изменил на main-course
    salad: document.querySelector(".salads-starters"), // Изменил на salad
    drink: document.querySelector(".beverages"), // Изменил на drink
    dessert: document.querySelector(".desserts")
};

const selected = {
    soup: null,
    'main-course': null, // Изменил на main-course
    salad: null, // Изменил на salad
    drink: null, // Изменил на drink
    dessert: null
};

const orderSummary = document.getElementById("order-summary");
const totalPrice = document.getElementById("total-price");

// Функция для загрузки блюд с API
async function loadDishes() {
    try {
        const response = await fetch("https://edu.std-900.ist.mospolytech.ru/labs/api/dishes");
        
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Преобразуем данные API в нужный нам формат
        dishes = data.map(item => ({
            keyword: item.keyword,
            name: item.name,
            price: item.price,
            category: item.category, // API использует: "soup", "main-course", "salad", "drink", "dessert"
            kind: item.kind,
            count: item.count,
            image: item.image
        }));
        
        // После загрузки отображаем блюда
        renderAllCategories();
        setupFilters();
        setupFormHandlers();
        
    } catch (error) {
        console.error('Ошибка при загрузке блюд:', error);
        showNotification('Не удалось загрузить меню. Пожалуйста, обновите страницу.');
    }
}

// Отображение всех категорий
function renderAllCategories() {
    for (let cat in categories) {
        renderCategory(cat);
    }
}

// Отображение конкретной категории
function renderCategory(cat) {
    const container = categories[cat];
    if (!container) return;
    
    container.innerHTML = "";
    const dishesInCategory = dishes.filter(d => d.category === cat)
                                   .sort((a,b) => a.name.localeCompare(b.name));
    
    dishesInCategory.forEach(dish => {
        const div = document.createElement("div");
        div.classList.add(`${cat}-item`);
        div.setAttribute("data-dish", dish.keyword);
        div.setAttribute("data-kind", dish.kind);
        div.innerHTML = `
            <img src="${dish.image}" alt="${dish.name}" onerror="this.src='images/default.jpg'">
            <p class="item-price">${dish.price}₽</p>
            <p class="item-title">${dish.name}</p>
            <p class="item-weight">${dish.count}</p>
            <button type="button">Добавить</button>
        `;
        container.appendChild(div);

        div.addEventListener("click", () => selectDish(dish));
    });
}

// Выбор блюда
function selectDish(dish) {
    selected[dish.category] = dish;
    updateOrder();
}

// Обновление сводки заказа
function updateOrder() {
    orderSummary.innerHTML = "";
    const categoriesNames = {
        soup: "Суп",
        'main-course': "Главное блюдо",
        salad: "Салат/стартер",
        drink: "Напиток",
        dessert: "Десерт"
    };

    let total = 0;
    let nothingSelected = true;

    for (let cat in selected) {
        const dish = selected[cat];
        const pTitle = document.createElement("p");
        pTitle.innerHTML = `<strong>${categoriesNames[cat]}</strong>`;
        const pDish = document.createElement("p");

        if (dish) {
            pDish.textContent = `${dish.name} ${dish.price}₽`;
            total += dish.price;
            nothingSelected = false;
        } else {
            if (cat === "soup") pDish.textContent = "Блюдо не выбрано";
            else if (cat === "main-course") pDish.textContent = "Блюдо не выбрано";
            else if (cat === "salad") pDish.textContent = "Блюдо не выбрано";
            else if (cat === "drink") pDish.textContent = "Напиток не выбран";
            else if (cat === "dessert") pDish.textContent = "Десерт не выбран";
        }

        orderSummary.appendChild(pTitle);
        orderSummary.appendChild(pDish);
    }

    if (nothingSelected) {
        orderSummary.innerHTML = "<p><strong>Ничего не выбрано</strong></p>";
        total = 0;
    }

    totalPrice.innerHTML = `<strong>Стоимость заказа: ${total}₽</strong>`;
}

// Настройка фильтров
function setupFilters() {
    document.querySelectorAll("section").forEach(section => {
        const container = section.querySelector("div:last-of-type");
        const filterButtons = section.querySelectorAll(".filters button");
        
        filterButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const kind = btn.dataset.kind;
                const isActive = btn.classList.toggle("active");

                // Сброс других кнопок
                filterButtons.forEach(b => { 
                    if (b !== btn) b.classList.remove("active"); 
                });

                const items = container.querySelectorAll("div");
                items.forEach(item => {
                    if (!isActive) {
                        item.style.display = "";
                    } else {
                        item.style.display = item.dataset.kind === kind ? "" : "none";
                    }
                });
            });
        });
    });
}

// Настройка обработчиков формы
function setupFormHandlers() {
    const form = document.querySelector("form");
    
    // Сброс формы
    form.addEventListener("reset", () => {
        for (let cat in selected) selected[cat] = null;
        updateOrder();
        
        // Сброс активных фильтров
        document.querySelectorAll(".filters button.active").forEach(btn => {
            btn.classList.remove("active");
        });
        document.querySelectorAll("section div[data-kind]").forEach(item => {
            item.style.display = "";
        });
    });
    
    // Проверка при отправке
    form.addEventListener("submit", (e) => {
        const hasSoup = !!selected.soup;
        const hasMain = !!selected['main-course'];
        const hasSalad = !!selected.salad;
        const hasDrink = !!selected.drink;

        const totalSelected = hasSoup || hasMain || hasSalad || hasDrink || selected.dessert;

        if (!totalSelected) {
            e.preventDefault();
            showNotification("Ничего не выбрано. Выберите блюда для заказа");
            return;
        }

        if (!hasDrink) {
            e.preventDefault();
            showNotification("Выберите напиток");
            return;
        }

        if (hasSoup && !hasMain && !hasSalad) {
            e.preventDefault();
            showNotification("Выберите главное блюдо/салат/стартер");
            return;
        }

        if (hasSalad && !hasSoup && !hasMain) {
            e.preventDefault();
            showNotification("Выберите суп или главное блюдо");
            return;
        }

        if (hasDrink && !hasSoup && !hasMain && !hasSalad) {
            e.preventDefault();
            showNotification("Выберите главное блюдо");
            return;
        }
        
        // Если все проверки пройдены, форма отправится на https://httpbin.org/post
    });
}

// Показать уведомление
function showNotification(text) {
    const overlay = document.createElement("div");
    overlay.className = "notification-overlay";

    const box = document.createElement("div");
    box.className = "notification";
    box.innerHTML = `
        <p>${text}</p>
        <button>Окей 👌</button>
    `;

    box.querySelector("button").addEventListener("click", () => {
        overlay.remove();
    });

    overlay.appendChild(box);
    document.body.appendChild(overlay);
}

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    loadDishes();
});