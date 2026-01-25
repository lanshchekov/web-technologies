document.addEventListener("DOMContentLoaded", () => {

    // Выбор контейнеров для категорий
    const categories = {
        soup: document.querySelector(".soups"),
        main_course: document.querySelector(".main-courses"),
        beverage: document.querySelector(".beverages")
    };

    // Сортировка и отображение блюд по категориям
    Object.keys(categories).forEach(cat => {
        const container = categories[cat];
        const dishesInCategory = dishes
            .filter(d => d.category === cat)
            .sort((a, b) => a.name.localeCompare(b.name));

        dishesInCategory.forEach(dish => {
            const div = document.createElement("div");
            div.classList.add(`${cat}-item`);
            div.setAttribute("data-dish", dish.keyword);
            div.innerHTML = `
                <img src="${dish.image}" alt="${dish.name}">
                <p class="item-price">${dish.price}₽</p>
                <p class="item-title">${dish.name}</p>
                <p class="item-weight">${dish.count}</p>
                <button type="button">Добавить</button>
            `;
            container.appendChild(div);

            // Клик на карточку добавляет в заказ
            div.addEventListener("click", () => {
                selectDish(dish);
            });
        });
    });

    // Объект выбранных блюд
    const selected = {
        soup: null,
        main_course: null,
        beverage: null
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
            beverage: "Напиток"
        };

        let total = 0;
        let nothingSelected = true;

        for (let cat of ["soup", "main_course", "beverage"]) {
            const dish = selected[cat];
            const pTitle = document.createElement("p");
            pTitle.innerHTML = `<strong>${categoriesNames[cat]}</strong>`;
            const pDish = document.createElement("p");

            if (dish) {
                pDish.textContent = `${dish.name} ${dish.price}₽`;
                total += dish.price;
                nothingSelected = false;
            } else {
                pDish.textContent = cat === "beverage" ? "Напиток не выбран" :
                                    cat === "main_course" ? "Блюдо не выбрано" :
                                    "Блюдо не выбрано";
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

    // Сброс выбранных блюд при нажатии кнопки reset
    const form = document.querySelector("form");
    form.addEventListener("reset", () => {
        selected.soup = null;
        selected.main_course = null;
        selected.beverage = null;
        updateOrder();
    });

});
