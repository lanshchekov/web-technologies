const API_URL = "https://edu.std-900.ist.mospolytech.ru/labs/api";
const API_KEY = "c7f8b838-299b-40ed-8a41-3384fc3c751b";

const tbody = document.getElementById("orders-body");
const overlay = document.getElementById("modal-overlay");

let dishesMap = new Map();

async function loadDishes() {
    const res = await fetch(`${API_URL}/dishes?api_key=${API_KEY}`);
    const dishes = await res.json();

    dishes.forEach(d => {
        dishesMap.set(d.id, d);
    });
}

function getOrderDishes(order) {
    const ids = [
        order.soup_id,
        order.main_course_id,
        order.salad_id,
        order.drink_id,
        order.dessert_id
    ].filter(Boolean);

    return ids.map(id => dishesMap.get(id));
}

function calcTotalPrice(dishes) {
    return dishes.reduce((sum, d) => sum + d.price, 0);
}

async function loadOrders() {
    try {
        await loadDishes();

        const res = await fetch(`${API_URL}/orders?api_key=${API_KEY}`);
        if (!res.ok) throw new Error();

        const orders = await res.json();
        orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        tbody.innerHTML = "";

        orders.forEach((order, index) => {
            const tr = document.createElement("tr");

            const orderDishes = getOrderDishes(order);

            const composition = orderDishes
                .map(d => d.name)
                .join(", ");

            const totalPrice = calcTotalPrice(orderDishes);

            const deliveryTime =
                order.delivery_type === "by_time"
                    ? order.delivery_time
                    : "В течение дня (с 07:00 до 23:00)";

            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${new Date(order.created_at).toLocaleString()}</td>
                <td>${composition}</td>
                <td>${totalPrice} ₽</td>
                <td>${deliveryTime}</td>
                <td class="actions">
                    <button title="Подробнее">👁</button>
                    <button title="Редактировать">✏️</button>
                    <button title="Удалить">🗑</button>
                </td>
            `;

            const [viewBtn, editBtn, delBtn] = tr.querySelectorAll("button");

            viewBtn.onclick = () => openViewModal(order.id);
            editBtn.onclick = () => openEditModal(order);
            delBtn.onclick = () => openDeleteModal(order.id);

            tbody.appendChild(tr);
        });

    } catch {
        tbody.innerHTML =
            `<tr><td colspan="6">Ошибка загрузки заказов</td></tr>`;
    }
}

/* МОДАЛКИ */

function openModal(html) {
    overlay.innerHTML = `<div class="modal">${html}</div>`;
    overlay.classList.remove("hidden");
    overlay.querySelector(".modal-close").onclick = closeModal;
}

function closeModal() {
    overlay.classList.add("hidden");
    overlay.innerHTML = "";
}

/* Подробнее */
async function openViewModal(id) {
    const res = await fetch(`${API_URL}/orders/${id}?api_key=${API_KEY}`);
    const o = await res.json();

    openModal(`
        <span class="modal-close">✖</span>
        <h3>Информация о заказе</h3>
        <p><strong>Имя:</strong> ${o.full_name}</p>
        <p><strong>Email:</strong> ${o.email}</p>
        <p><strong>Телефон:</strong> ${o.phone}</p>
        <p><strong>Адрес:</strong> ${o.delivery_address}</p>
        <p><strong>Комментарий:</strong> ${o.comment || "-"}</p>

        <div class="modal-buttons">
            <button onclick="(${closeModal.toString()})()">Ок</button>
        </div>
    `);
}

/* Редактирование */
function openEditModal(order) {
    openModal(`
        <span class="modal-close">✖</span>
        <h3>Редактирование заказа</h3>

        <label>Имя</label>
        <input id="edit-name" value="${order.full_name}">
        <label>Email</label>
        <input id="edit-email" value="${order.email}">
        <label>Телефон</label>
        <input id="edit-phone" value="${order.phone}">
        <label>Адрес</label>
        <input id="edit-address" value="${order.delivery_address}">
        <label>Комментарий</label>
        <textarea id="edit-comment">${order.comment || ""}</textarea>

        <div class="modal-buttons">
            <button onclick="saveEdit(${order.id})">Сохранить</button>
            <button onclick="(${closeModal.toString()})()">Отмена</button>
        </div>
    `);
}

async function saveEdit(id) {
    const body = {
        full_name: document.getElementById("edit-name").value,
        email: document.getElementById("edit-email").value,
        phone: document.getElementById("edit-phone").value,
        delivery_address: document.getElementById("edit-address").value,
        comment: document.getElementById("edit-comment").value
    };

    const res = await fetch(
        `${API_URL}/orders/${id}?api_key=${API_KEY}`,
        {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        }
    );

    if (res.ok) {
        closeModal();
        alert("Заказ успешно изменён");
        loadOrders();
    } else {
        alert("Ошибка изменения заказа");
    }
}

/* Удаление */
function openDeleteModal(id) {
    openModal(`
        <span class="modal-close">✖</span>
        <h3>Удалить заказ?</h3>
        <p>Вы уверены, что хотите удалить заказ?</p>

        <div class="modal-buttons">
            <button onclick="deleteOrder(${id})">Да</button>
            <button onclick="(${closeModal.toString()})()">Отмена</button>
        </div>
    `);
}

async function deleteOrder(id) {
    const res = await fetch(
        `${API_URL}/orders/${id}?api_key=${API_KEY}`,
        { method: "DELETE" }
    );

    if (res.ok) {
        closeModal();
        alert("Заказ удалён");
        loadOrders();
    } else {
        alert("Ошибка удаления");
    }
}

/* Инициализация */
loadOrders();
