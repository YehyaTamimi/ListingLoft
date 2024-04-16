
import { createCard } from "./createHouseCard.js";
import { viewSearchHistory, addToSearchHistory, closeHistory } from "./history.js";
import { requestListings } from "./requestAPI.js";

let searchArr = [];
document.addEventListener("DOMContentLoaded", () => {

    let favorites = [];
    if (localStorage.getItem("favorite") !== null) {
        favorites = JSON.parse(localStorage.getItem("favorite"));
    }

    let counter =0;
    favorites.forEach((favorite)=>{
        let id = favorite.split("h")[1];
        requestListings(id, {}, loadFavorites, true, counter);
        counter++;
    })

    document.querySelector(".home").addEventListener("click", gotoHomePage);
})


//load content from json file
const loadFavorites = (json) => {
    let house = json["data"];
    createCard(house);
    checkEmpty();
}

const gotoHomePage = () => {
    window.location.href = "/html/index.html";
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
    }else{
        const favorite = document.querySelectorAll(".add-favorite");
        favorite.forEach((favorite) => {
            favorite.addEventListener("click", removeFavorite)
            const icon = favorite.querySelector("i");
            icon.classList.add("fa-solid");
        });
    }
}

const createSearch = (container) => {
    const main = document.querySelector("main");
    container.innerHTML = ` <p> Add Houses to Your  Favorites <i class="fa-regular fa-heart"></i> list</p>
                                <div class="search-container">
                                    <input type="text" name="" id="" placeholder="Enter a Location, Price, Size" class="search-input">
                                    <button class="search"><i class="fa-solid fa-magnifying-glass"></i></button>
                                </div>`;
    container.classList.add("no-favorites")
    main.classList.add("empty-favorites")

    enableSearch();
}

const enableSearch = () => {
    if (localStorage.getItem('history') !== null) {
        searchArr = JSON.parse(localStorage.getItem('history'));
    }

    const input = document.querySelector(".search-input");
    input.addEventListener("keypress", handleKeyPress);
    input.addEventListener("click", () => {
        viewSearchHistory(searchArr, goToSearchPage)
    });
    document.querySelector(".search").addEventListener('click', () => {
        goToSearchPage(input.value.trim());
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-input')) {
            closeHistory();
        }
    });
}

// handle Enter key press for search
const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
        let query = document.querySelector(".search-input").value.trim();
        goToSearchPage(query);
    }
}

const goToSearchPage = (query = "") => {
    sessionStorage.setItem("query", query);
    addToSearchHistory(query, searchArr);
    window.location.href = "search.html";
}
