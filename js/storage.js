import { dishes } from "./render_dishes.js";

const STORAGE_KEY = "food_construct_order";

// получить массив keyword
export function getOrderFromStorage() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

// сохранить массив keyword
export function saveOrderToStorage(order) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
}

// добавить блюдо
export function addDish(keyword, category) {
    let order = getOrderFromStorage();

    // найти все keyword из этой же категории
    const sameCategoryKeywords = dishes
        .filter(d => d.category === category)
        .map(d => d.keyword);

    // удалить из заказа блюда этой категории
    order = order.filter(k => !sameCategoryKeywords.includes(k));

    // добавить новое
    order.push(keyword);

    saveOrderToStorage(order);
}


// удалить блюдо
export function removeDish(keyword) {
    const order = getOrderFromStorage().filter(k => k !== keyword);
    saveOrderToStorage(order);
}

// очистить заказ
export function clearOrder() {
    localStorage.removeItem(STORAGE_KEY);
}
