const dishes = [
    // Супы
    {keyword: "gazpacho", name: "Гаспачо", price: 195, category: "soup", kind: "veg", count: "350 г", image: "images/soups/gazpacho.jpg"},
    {keyword: "mushroom", name: "Грибной суп-пюре", price: 185, category: "soup", kind: "veg", count: "330 г", image: "images/soups/mushroom_soup.jpg"},
    {keyword: "norwegian", name: "Норвежский суп", price: 270, category: "soup", kind: "fish", count: "330 г", image: "images/soups/norwegian_soup.jpg"},
    {keyword: "ramen", name: "Рамен", price: 375, category: "soup", kind: "meat", count: "425 г", image: "images/soups/ramen.jpg"},
    {keyword: "tomyum", name: "Том ям с креветками", price: 650, category: "soup", kind: "fish", count: "500 г", image: "images/soups/tomyum.jpg"},
    {keyword: "chicken_soup", name: "Куриный суп", price: 330, category: "soup", kind: "meat", count: "350 г", image: "images/soups/chicken.jpg"},

    // Основные блюда
    {keyword: "friedpotatoeswithmushrooms", name: "Жареная картошка с грибами", price: 150, category: "main_course", kind: "veg", count: "250 г", image: "images/main_course/friedpotatoeswithmushrooms1.jpg"},
    {keyword: "lasagna", name: "Лазанья", price: 385, category: "main_course", kind: "meat", count: "310 г", image: "images/main_course/lasagna.jpg"},
    {keyword: "chicken_cutlets", name: "Котлеты из курицы с картофельным пюре", price: 225, category: "main_course", kind: "meat", count: "280 г", image: "images/main_course/chickencutletsandmashedpotatoes.jpg"},
    {keyword: "fish_rice", name: "Рыбная котлета с рисом и спаржей", price: 320, category: "main_course", kind: "fish", count: "270 г", image: "images/main_course/fishrice.jpg"},
    {keyword: "pizza", name: "Пицца Маргарита", price: 450, category: "main_course", kind: "veg", count: "470 г", image: "images/main_course/pizza.jpg"},
    {keyword: "shrimp_pasta", name: "Паста с креветками", price: 340, category: "main_course", kind: "fish", count: "280 г", image: "images/main_course/shrimppasta.jpg"},

    // Салаты и стартеры
    {keyword: "salad_with_egg", name: "Корейский салат с овощами и яйцом", price: 330, category: "salads_starters", kind: "veg", count: "250 г", image: "images/salads_starters/saladwithegg.jpg"},
    {keyword: "caesar_chicken", name: "Цезарь с цыпленком", price: 370, category: "salads_starters", kind: "meat", count: "220 г", image: "images/salads_starters/caesar.jpg"},
    {keyword: "caprese", name: "Капрезе с моцареллой", price: 350, category: "salads_starters", kind: "veg", count: "235 г", image: "images/salads_starters/caprese.jpg"},
    {keyword: "tuna_salad", name: "Салат с тунцом", price: 480, category: "salads_starters", kind: "fish", count: "250 г", image: "images/salads_starters/tunasalad.jpg"},
    {keyword: "frenchfries1", name: "Картофель фри с соусом Цезарь", price: 280, category: "salads_starters", kind: "veg", count: "235 г", image: "images/salads_starters/frenchfries1.jpg"},
    {keyword: "frenchfries2", name: "Картофель фри с кетчупом", price: 260, category: "salads_starters", kind: "veg", count: "235 г", image: "images/salads_starters/frenchfries2.jpg"},

    // Напитки
    {keyword: "orange_juice", name: "Апельсиновый сок", price: 120, category: "beverage", kind: "cold", count: "300 мл", image: "images/beverages/orangejuice.jpg"},
    {keyword: "apple_juice", name: "Яблочный сок", price: 90, category: "beverage", kind: "cold", count: "300 мл", image: "images/beverages/applejuice.jpg"},
    {keyword: "carrot_juice", name: "Морковный сок", price: 110, category: "beverage", kind: "cold", count: "300 мл", image: "images/beverages/carrotjuice.jpg"},
    {keyword: "cappuccino", name: "Капучино", price: 180, category: "beverage", kind: "hot", count: "300 мл", image: "images/beverages/cappuccino.jpg"},
    {keyword: "green_tea", name: "Зеленый чай", price: 100, category: "beverage", kind: "hot", count: "300 мл", image: "images/beverages/greentea.jpg"},
    {keyword: "tea", name: "Черный чай", price: 90, category: "beverage", kind: "hot", count: "300 мл", image: "images/beverages/tea.jpg"},

    // Десерты
    {keyword: "baklava", name: "Пахлава", price: 220, category: "desserts", kind: "medium", count: "300 г", image: "images/desserts/baklava.jpg"},
    {keyword: "cheesecake", name: "Чизкейк", price: 240, category: "desserts", kind: "small", count: "125 г", image: "images/desserts/checheesecake.jpg"},
    {keyword: "chocolate_cheesecake", name: "Шоколадный чизкейк", price: 260, category: "desserts", kind: "small", count: "125 г", image: "images/desserts/chocolatecheesecake.jpg"},
    {keyword: "chocolate_cake", name: "Шоколадный торт", price: 270, category: "desserts", kind: "small", count: "140 г", image: "images/desserts/chocolatecake.jpg"},
    {keyword: "donuts", name: "Пончики (3 штуки)", price: 410, category: "desserts", kind: "medium", count: "350 г", image: "images/desserts/donuts.jpg"},
    {keyword: "donuts2", name: "Пончики (6 штук)", price: 650, category: "desserts", kind: "large", count: "700 г", image: "images/desserts/donuts2.jpg"}
];
