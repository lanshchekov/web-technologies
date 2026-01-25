document.addEventListener("DOMContentLoaded", () => {

    const categories = {
        soup: document.querySelector(".soups"),
        main_course: document.querySelector(".main-courses"),
        salads_starters: document.querySelector(".salads-starters"),
        beverage: document.querySelector(".beverages"),
        desserts: document.querySelector(".desserts")
    };

    const selected = {
        soup: null,
        main_course: null,
        salads_starters: null,
        beverage: null,
        desserts: null
    };

    const orderSummary = document.getElementById("order-summary");
    const totalPrice = document.getElementById("total-price");

    function selectDish(dish) {
        selected[dish.category] = dish;
        updateOrder();
    }

    function updateOrder() {
        orderSummary.innerHTML = "";
        const categoriesNames = {
            soup: "Суп",
            main_course: "Главное блюдо",
            salads_starters: "Салат/стартер",
            beverage: "Напиток",
            desserts: "Десерт"
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
                else if (cat === "main_course") pDish.textContent = "Блюдо не выбрано";
                else if (cat === "salads_starters") pDish.textContent = "Блюдо не выбрано";
                else if (cat === "beverage") pDish.textContent = "Напиток не выбран";
                else if (cat === "desserts") pDish.textContent = "Десерт не выбран";
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

    // Отображение блюд
    function renderCategory(cat) {
        const container = categories[cat];
        container.innerHTML = "";
        const dishesInCategory = dishes.filter(d => d.category === cat)
                                       .sort((a,b)=>a.name.localeCompare(b.name));
        dishesInCategory.forEach(dish => {
            const div = document.createElement("div");
            div.classList.add(`${cat}-item`);
            div.setAttribute("data-dish", dish.keyword);
            div.setAttribute("data-kind", dish.kind);
            div.innerHTML = `
                <img src="${dish.image}" alt="${dish.name}">
                <p class="item-price">${dish.price}₽</p>
                <p class="item-title">${dish.name}</p>
                <p class="item-weight">${dish.count}</p>
                <button type="button">Добавить</button>
            `;
            container.appendChild(div);

            div.addEventListener("click", () => selectDish(dish));
        });
    }

    for (let cat in categories) renderCategory(cat);

    // Сброс
    const form = document.querySelector("form");
    form.addEventListener("reset", () => {
        for (let cat in selected) selected[cat] = null;
        updateOrder();
    });

    // Фильтры
    document.querySelectorAll("section").forEach(section => {
        const container = section.querySelector("div:last-of-type");
        const filterButtons = section.querySelectorAll(".filters button");
        filterButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const kind = btn.dataset.kind;
                const isActive = btn.classList.toggle("active");

                // Сброс других кнопок
                filterButtons.forEach(b => { if (b !== btn) b.classList.remove("active"); });

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

});
