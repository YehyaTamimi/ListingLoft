import json from "./proporties.js";
import { createCard } from "./createHouseCard.js";


document.addEventListener("DOMContentLoaded", () => {

    let favorites = [];
    if (localStorage.getItem("favorite") !== null) {
        favorites = JSON.parse(localStorage.getItem("favorite"));
    }
    loadFavorites(favorites);
    document.querySelector(".home").addEventListener("click", gotoHomePage);

    try {
        const favorites = document.querySelectorAll(".add-favorite");
        favorites.forEach((favorite) => {
            favorite.addEventListener("click", removeFavorite)
            const icon = favorite.querySelector("i");
            icon.classList.add("fa-solid");
        })
    } catch {
        
    }
})


//load content from json file
const loadFavorites = (favorites) => {
    let houses = json["listings"];
    const container = document.querySelector(".cards-container");

    houses.forEach((house) => {
        const { description, location, list_price, property_id } = house;
        const { address: { city, state, street_name } } = location;
        const size = description["sqft"];
        const price = list_price;
        if (favorites.includes(`h${property_id}`)) {
            createCard(house);
        }
    });

    checkEmpty();
}

const gotoHomePage = () => {
    window.location.href = "index.html";
}

const removeFavorite = (e) => {
    let card = e.target.closest(".card");
    const container = document.querySelector(".cards-container");
    const body = document.querySelector("body");
    container.removeChild(card);

    let div = document.createElement("div");
    div.classList.add("removed")
    div.innerHTML = `<p>House Removed From Favorites</p>`;
    //continue on this
    setTimeout(() => {
        body.classList.add("relative-body")
        body.appendChild(div);
    }, 200);
    setTimeout(() => {
        div.classList.add("remove-transition");
        div.addEventListener("transitionend", () => {
            body.removeChild(div);
            body.classList.remove("relative-body");
        });
    }, 2000);
    checkEmpty();
}

const checkEmpty = () => {
    const container = document.querySelector(".cards-container");
    if (container.childNodes.length === 0) {
        createSearch(container);
    }
}

const createSearch = (container) => {
    const main = document.querySelector("main");
    container.innerHTML = ` 
                                <div class="search-container">
                                    <p> Add Houses to Your  Favorites <i class="fa-regular fa-heart"></i> list</p>
                                    <input type="text" name="" id="" placeholder="Enter a Location, Price, Size" class="search-input">
                                    <button class="search"><i class="fa-solid fa-magnifying-glass"></i></button>
                                </div>`;
    container.classList.add("no-favorites")
    main.classList.add("empty-favorites")

    document.querySelector(".search").addEventListener('click', goToSearchPage);
    document.querySelector(".search-input").addEventListener("keypress", handleKeyPress);
}

// handle Enter key press for search
const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
        goToSearchPage();
    }
}

const goToSearchPage = () => {
    const input = document.querySelector(".search-input");
    sessionStorage.setItem("query", input.value.trim());
    window.location.href = "search.html";
}