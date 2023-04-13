const loader = document.getElementById("loader");
const navigation = document.getElementById("navigation");
const app = document.getElementById("app");
const favorite = document.getElementsByClassName("favorite");
const input = document.querySelector("input");

var meals = [],
    favorites_items = [],
    str = "";

//! display the meals list
const dispaly = (data) => {
    if (data) {
        data.map((item) => {
            let tags = [];
            let meal_name = item.strMeal;
            if (meal_name.length > 34) meal_name = meal_name.substring(0, 34);
            if (item.strTags) tags = item.strTags.split(",");
            if (tags.length > 5) {
                tags = tags.splice(0, 4);
            }
            let favorite = favorites_items.includes(item.idMeal) ? "fa-solid fa-heart" : "fa-regular fa-heart";
            app.innerHTML =
                app.innerHTML +
                `<div class="card shadow">
                        <img src="${item.strMealThumb}" alt="can't load the image" />
                        <div class="favorite"><i class="${favorite}" data-id="${item.idMeal}"></i></div>
                        <div class="name">${meal_name}</div>
                        <div class="field">${item.strTags ? tags.join(" ") : "Meal"}</div>
                        <hr />
                        <div class="grid-container">
                            <div class="field">${item.strCategory}</div>
                            <div class="field">${item.strArea}</div>
                            <div class="title">Category</div>
                            <div class="title">Area</div>
                        </div>
                        <button class="view" data-id="${item.idMeal}">View</button>
                    </div>`;
        });
    }
};

//! favorite functions
const favoriteItem = () => {
    app.innerHTML = "";
    let data = meals.filter((item) => favorites_items.includes(item.idMeal));
    dispaly(data);
};

//! homeItems function
const homeItems = () => {
    loader.style.display = "flex";
    app.innerHTML = "";
    dispaly(meals);
    loader.style.display = "none";
};

//!home page
const home = async () => {
    if (localStorage.favorites_items) favorites_items = JSON.parse(localStorage.favorites_items);

    loader.style.display = "flex";
    app.innerHTML = "";
    for (let i = 97; i < 123; i++) {
        const temp = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${String.fromCharCode(i)}`);
        const data = await temp.json();
        if (data.meals) data.meals.map((item) => meals.push(item));
        dispaly(data.meals);
    }
    loader.style.display = "none";
};

//! input change event
const changeId = setInterval(() => {
    if (input.value !== str) {
        // loader.style.display = "flex";
        app.innerHTML = "";
        let length = input.value.length;
        let data = meals.filter((item) => item.strMeal.substring(0, length).toLowerCase() === input.value.toLowerCase());
        dispaly(data);
        str = input.value;
        // loader.style.display = "none";
    }
}, 500);

app.addEventListener("click", async (event) => {
    //! add to favorite list
    if (event.target.classList.contains("fa-regular")) {
        event.target.classList.remove("fa-regular");
        event.target.classList.add("fa-solid");
        favorites_items.push(event.target.getAttribute("data-id"));
        localStorage.favorites_items = JSON.stringify(favorites_items);
    } else if (event.target.classList.contains("fa-solid")) {
        event.target.classList.remove("fa-solid");
        event.target.classList.add("fa-regular");
        let data_id = event.target.getAttribute("data-id");
        favorites_items = favorites_items.filter((item) => item !== data_id);
        localStorage.favorites_items = JSON.stringify(favorites_items);
    }

    //! view button
    if (event.target.classList.contains("view")) {
        loader.style.display = "flex";
        let dataId = event.target.getAttribute("data-id");
        let item = meals.filter((item) => item.idMeal === dataId);
        item = item[0];
        console.log(item);
        let tags = [];
        let meal_name = item.strMeal;
        if (meal_name.length > 34) meal_name = meal_name.substring(0, 34);
        if (item.strTags) tags = item.strTags.split(",");
        if (tags.length > 5) {
            tags = tags.splice(0, 4);
        }
        let favorite = favorites_items.includes(item.idMeal) ? "fa-solid fa-heart" : "fa-regular fa-heart";
        let ingredientItems = [],
            ingredientMesure = [],
            i = 1;
        while (item[`strIngredient${i++}`] !== "" && item[`strIngredient${i}`] !== null) {
            ingredientItems.push(item[`strIngredient${i}`]);
            ingredientMesure.push(item[`strMeasure${i}`]);
        }
        console.log(ingredientItems);
        app.innerHTML = "";
        app.innerHTML = `<div class="big-card shadow">
            <img class="big-image" src="${item.strMealThumb}" alt="can't load the image" />
            <div class="big-favorite"><i class="${favorite}" data-id="${item.idMeal}"></i></div>
            <div class="right-side">
                <div class="big-name">${meal_name}</div>
                <div class="big-tags">${item.strTags ? tags.join(" ") : "Meal"}</div>
                <div class="grid-container">
                    <div class="field">${item.strCategory}</div>
                    <div class="field">${item.strArea}</div>
                    <div class="title">Category</div>
                    <div class="title">Area</div>
                </div>
                <div class="instructions">${item.strInstructions.replace("\r\n", "<br/>")}</div>
                <div class="ingredient">
                </div>
            </div>
        </div>`;
        const ingredient = document.querySelector(".ingredient");
        ingredient.innerHTML = "";
        ingredientItems.map((item, i) => {
            ingredient.innerHTML += `<div class="ingredient-item">
                <div class="ingredient-mesure">${ingredientMesure[i]}</div>
                <div class="ingredient-name">${item}</div>
            </div>`;
        });
        loader.style.display = "none";
    }
});

//! toggle to home and favorites
navigation.addEventListener("click", (event) => {
    if (event.target.innerHTML === "Favourite") {
        loader.style.display = "flex";
        document.querySelector(".active").classList.remove("active");
        event.target.classList.add("active");
        favoriteItem();
        loader.style.display = "none";
    }
    if (event.target.innerHTML === "Home") {
        document.querySelector(".active").classList.remove("active");
        event.target.classList.add("active");
        homeItems();
    }
});

home();
