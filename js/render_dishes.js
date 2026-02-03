import { addDish, getOrderFromStorage } from "./storage.js";

// Ключ доступа к API
const API_KEY = "c7f8b838-299b-40ed-8a41-3384fc3c751b";
const API_URL = "https://edu.std-900.ist.mospolytech.ru/labs/api";

// Глобальные переменные
export var dishes = []; // Здесь будут храниться блюда с API
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

// const orderSummary = document.getElementById("order-summary");
// const totalPrice = document.getElementById("total-price");

// Функция для загрузки блюд с API
async function loadDishes() {
    try {
        console.log("FETCH URL:", `${API_URL}?api_key=${API_KEY}`);
        const response = await fetch(`${API_URL}/dishes?api_key=${API_KEY}`);
        
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
        updatePanel();        // ← ВАЖНО
        
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
            <img src="${dish.image}" alt="${dish.name}"">
            <p class="item-price">${dish.price}₽</p>
            <p class="item-title">${dish.name}</p>
            <p class="item-weight">${dish.count}</p>
            <button type="button">Добавить</button>
        `;
        container.appendChild(div);
        
        const stored = getOrderFromStorage();
        if (stored.includes(dish.keyword)) {
            div.classList.add("selected");
        }


        div.addEventListener("click", () => selectDish(dish));
    });
}

// Выбор блюда
function selectDish(dish) {
    selected[dish.category] = dish;
    addDish(dish.keyword, dish.category);
    updatePanel();
}

function updatePanel() {
    const panel = document.getElementById("checkout-panel");
    const priceSpan = document.getElementById("panel-price");
    const link = document.getElementById("checkout-link");

    const total = Object.values(selected)
        .filter(Boolean)
        .reduce((sum, d) => sum + d.price, 0);

    if (total === 0) {
        panel.classList.add("hidden");
        return;
    }

    panel.classList.remove("hidden");
    priceSpan.textContent = `${total} ₽`;

    // проверка комбо
    const validCombo =
        selected.drink && selected["main-course"] || 
        selected.drink && selected["main-course"] && selected.soup || 
        selected.drink && selected.salad && selected.soup || 
        selected.drink && selected.salad && selected["main-course"] || 
        selected.drink && selected.salad && selected["main-course"] && selected.soup;

    link.classList.toggle("disabled", !validCombo);
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