import {
    getOrderFromStorage,
    removeDish,
    clearOrder
} from "./storage.js";

const API_URL = "https://edu.std-900.ist.mospolytech.ru/labs/api";
const API_KEY = "c7f8b838-299b-40ed-8a41-3384fc3c751b";

const container = document.getElementById("checkout-items");

function renderOrderSummary(dishes) {
    const map = {
        soup: "summary-soup",
        "main-course": "summary-main",
        salad: "summary-salad",
        drink: "summary-drink",
        dessert: "summary-dessert"
    };

    let total = 0;

    Object.entries(map).forEach(([cat, id]) => {
        const el = document.getElementById(id);
        if (!el) return;

        const dish = dishes.find(d => d.category === cat);
        if (dish) {
            el.textContent = `${dish.name} — ${dish.price} ₽`;
            total += dish.price;
        } else {
            el.textContent = "Не выбрано";
        }
    });

    document.getElementById("summary-total").innerHTML =
        `<strong>Итого: ${total} ₽</strong>`;
}


async function loadCheckout() {
    const order = getOrderFromStorage();

    if (!order.length) {
        container.innerHTML = `
            <p>
              Ничего не выбрано.
              <a href="make_order.html">Собрать ланч</a>
            </p>`;
        return;
    }

    const res = await fetch(`${API_URL}/dishes?api_key=${API_KEY}`);
    const dishes = await res.json();

    const selectedDishes = [];

    order.forEach(keyword => {
        const dish = dishes.find(d => d.keyword === keyword);
        if (!dish) return;

        selectedDishes.push(dish);
        
        const div = document.createElement("div");
        div.innerHTML = `
            <img src="${dish.image}">
            <p class="item-price">${dish.price}₽</p>
            <p class="item-title">${dish.name}</p>
            <p class="item-weight">${dish.count}</p>
            <button>Удалить</button>
        `;

        div.querySelector("button").onclick = () => {
            removeDish(keyword);
            div.remove();

            
            // удаляем из массива selectedDishes
            const index = selectedDishes.findIndex(d => d.keyword === keyword);
            if (index !== -1) selectedDishes.splice(index, 1);

            // обновляем сводку заказа
            renderOrderSummary(selectedDishes);

        };

        container.appendChild(div);
    });

    renderOrderSummary(selectedDishes);
}

loadCheckout();

document.querySelector("form").addEventListener("submit", async e => {
    e.preventDefault();

    try {
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        // доставка ко времени — проверка
        if (data.delivery_type === "by_time" && !data.delivery_time) {
            alert("Укажите время доставки");
            return;
        }

        const orderKeywords = getOrderFromStorage();

        const resDishes = await fetch(`${API_URL}/dishes?api_key=${API_KEY}`);
        const dishes = await resDishes.json();

        const selectedDishes = dishes.filter(d =>
            orderKeywords.includes(d.keyword)
        );

        const dishIds = buildDishIds(selectedDishes);

        if (!dishIds.drink_id) {
            alert("Напиток обязателен");
            return;
        }

        const body = {
            full_name: data.full_name,
            email: data.email,
            phone: data.phone,
            delivery_address: data.delivery_address,
            delivery_type: data.delivery_type,
            delivery_time: data.delivery_type === "by_time"
                ? data.delivery_time
                : null,
            comment: data.comment || "",
            subscribe: data.subscribe ? 1 : 0,
            ...dishIds
        };

        const res = await fetch(
            `${API_URL}/orders?api_key=${API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            }
        );

        if (!res.ok) throw new Error();

        clearOrder();
        alert("Заказ успешно оформлен!");
        location.href = "index.html";

    } catch (err) {
        alert("Ошибка при оформлении заказа");
    }
});


function buildDishIds(selectedDishes) {
    const result = {};

    selectedDishes.forEach(dish => {
        if (dish.category === "soup") result.soup_id = dish.id;
        if (dish.category === "main-course") result.main_course_id = dish.id;
        if (dish.category === "salad") result.salad_id = dish.id;
        if (dish.category === "drink") result.drink_id = dish.id;
        if (dish.category === "dessert") result.dessert_id = dish.id;
    });

    return result;
}
