//import hardcoded data from json file
import json from "./proporties.js";

//import api module to request data
import { createCard } from "./createHouseCard.js";

//import card module to create house cards
import { requestListings } from "./requestAPI.js";


let query;
let favorites = [];

document.addEventListener('DOMContentLoaded', () => {
    if(localStorage.getItem("favorite") !== null){
        favorites = JSON.parse(localStorage.getItem("favorite"));
        console.log(favorites)
    }


    if (sessionStorage.getItem("query") !== null) {
        query = sessionStorage.getItem("query");
        loadcontent(query);
    } else {
        loadcontent();
    }



    document.querySelector(".home").addEventListener("click", gotoHomePage);

    const input = document.querySelector(".search-input");
    input.addEventListener("keypress", handleKeyPress);
    input.value = query;
    document.querySelector(".search").addEventListener('click', () => {
        goToSearchPage(input.value.trim());
    });

    const filterButtons = ["price", "size", "rooms"];
    filterButtons.forEach((filter) => {
        document.querySelector(`.${filter}-button`).addEventListener("click", () => {
            viewFilter(filter);
        });
    });
})

//load content from json file
const loadcontent = (query = "") => {
    let houses = json["listings"];
    const container = document.querySelector(".cards-container");

    houses.forEach((house) => {
        const { description, location, list_price } = house;
        const { address: { city, state, street_name } } = location;
        const size = description["sqft"];
        const price = list_price;

        if (query !== "") {
            query = query.toLowerCase();
            console.log(query);
            //check if query only contains numbers
            let isnum = /^\d+$/.test(query);
            if (isnum === false) {
                if (!(state.toLowerCase().includes(query) || city.toLowerCase().includes(query) || street_name.toLowerCase().includes(query))) {
                    return;
                }
            } else {
                if (query.length >= 5) {
                    if (parseFloat(price) > parseFloat(query)) {
                        return;
                    }
                } else {
                    if (parseFloat(size) > parseFloat(query)) {
                        return;
                    }
                }
            }
        }
        createCard(house);
    });

    if (container.childNodes.length === 0) {
        container.innerHTML = "<p class=empty>No Matching Results Were Found<p>";
    }

    checkFavorites();
}

//view filter element when a filter is pressed
const viewFilter = (element) => {
    const button = document.querySelector(`.${element}-button`);
    const icon = button.lastElementChild;
    if (icon.classList.contains("fa-caret-down")) {
        checkOpenContainers();
        icon.classList.remove("fa-caret-down")
        icon.classList.add("fa-caret-up")
        if (element !== "rooms") {
            createPriceRangeElement(element);
        } else {
            createRoomsElement();
        }
    } else {
        icon.classList.remove("fa-caret-up")
        icon.classList.add("fa-caret-down")
        const container = document.querySelector(`.${element}-container`);
        container.removeChild(container.lastElementChild);
    }
}

//create the range element for price/size filter
const createPriceRangeElement = (element) => {
    const container = document.querySelector(`.${element}-container`);
    let type = (element === "price") ? "$" : "M";

    let range = document.createElement("div");
    range.classList.add(`${element}-range`);
    range.innerHTML = `
    <div class="test">
        <div class="min-${element}">
            <input type="text" placeholder="Min" class=min-${element}-input>
            <p>${type}</p>
        </div>
        <div class="dash">-</div>
        <div class="max-${element}">
            <input type="text" placeholder="Max" class=max-${element}-input>
            <p>${type}</p>
        </div>
    </div>
    <p class=reset> Reset Changes </p>
    <button class=apply> Apply </button>
    `
    container.appendChild(range);
    container.querySelector(".apply").addEventListener('click', () => {
        filterRangeContent(element);
        viewFilter(element);
    })
}

//apply filter based on price/size
const filterRangeContent = (type) => {
    let min = document.querySelector(`.min-${type}-input`).value.trim();
    let max = document.querySelector(`.max-${type}-input`).value.trim();
    let container = document.querySelector(".cards-container");
    let cards = container.querySelectorAll(".card");
    console.log(typeof min)
    cards.forEach((card) => {
        let value;
        if (type === "price") {
            value = card.querySelector(".price").textContent.replace(/\,/g, '').split('$')[1];
        } else {
            value = card.querySelector(".small-info").textContent.split("|")[2].split(" ")[1];
        }

        value = parseInt(value);
        if (!(value >= parseInt(min) && value <= parseInt(max))) {
            // container.removeChild(card);
            card.classList.add(`${type}-filter-applied`)
        } else {
            card.classList.remove(`${type}-filter-applied`)
        }
    });

    checkEmptyCardsContainer();
}


const createRoomsElement = () => {
    const container = document.querySelector(".rooms-container");
    let type = document.createElement("div");
    type.classList.add("rooms-type");
    type.innerHTML = `
        <div>Bedrooms</div>
        <div class="bedrooms-number">
            <button class=active>Any</button>
            <button>1+</button>
            <button>2+</button>
            <button>3+</button>
            <button>4+</button>
        </div>
        <div>Bathrooms</div>
        <div class="bathrooms-number">
            <button class=active>Any</button>
            <button>1+</button>
            <button>2+</button>
            <button>3+</button>
            <button>4+</button>
        </div>
        <p class=reset2> Reset Changes </p>
        <button class="apply">Apply</button> `;

    container.appendChild(type);

    const roomTypes = [".bedrooms-number", ".bathrooms-number"];

    //small scale callback-hell ;)
    roomTypes.forEach((type) => {
        let rooms = document.querySelector(type);
        let roombuttons = rooms.querySelectorAll("button");
        roombuttons.forEach((button) => {
            button.addEventListener('click', () => {
                roombuttons.forEach(function (btn) {
                    btn.classList.remove('active');
                });
                button.classList.add('active');
            });
        });
    })

    container.querySelector(".apply").addEventListener('click', ()=>{
        filterRoomContent();
        viewFilter("rooms");});
}

//apply filter based on rooms
const filterRoomContent = () => {
    let baths;
    let beds;
    let container = document.querySelector(".cards-container");
    let cards = container.querySelectorAll(".card");

    const roomTypes = [".bedrooms-number", ".bathrooms-number"];

    roomTypes.forEach((type) => {
        let typeButtons = document.querySelectorAll(`${type} button`);
        typeButtons.forEach((button) => {
            if (button.classList.contains('active')) {
                if (type === ".bedrooms-number") {
                    beds = button.textContent[0];
                    beds = (beds === "A") ? "0" : beds;
                } else {
                    baths = button.textContent[0];
                    baths = (baths === "A") ? "0" : baths;
                }
            }
        })
    })

    cards.forEach((card) => {
        let bednum = card.querySelector(".small-info").textContent.split("|")[0].split(" ")[0];
        let bathnum = card.querySelector(".small-info").textContent.split("|")[1].split(" ")[1];
        if (( parseInt(beds) === 0  || parseInt(bednum) === parseInt(beds)) && (parseInt(baths) === 0 || parseInt(bathnum) === parseInt(baths))) {
            card.classList.remove("rooms-filter-applied");
        } else {
            card.classList.add("rooms-filter-applied");
        }
    })

    checkEmptyCardsContainer();
}

//check if any other filter is open before opening a new filter
const checkOpenContainers = () => {
    const containers = ["price", "rooms", "size"];

    containers.forEach((container) => {
        const parent = document.querySelector(`.${container}-container`);
        if (parent.lastElementChild.tagName == "DIV") {
            const button = document.querySelector(`.${container}-button`);
            const icon = button.lastElementChild;
            icon.classList.remove("fa-caret-up")
            icon.classList.add("fa-caret-down")
            parent.removeChild(parent.lastElementChild);
        }
    })
}

// handle Enter key press for search
const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
        const input = document.querySelector(".search-input");
        goToSearchPage(input.value.trim());
    }
}

const gotoHomePage = () => {
    window.location.href = "/html/index.html";
}

const goToSearchPage = (query = "") => {
    sessionStorage.setItem("query", query);
    document.querySelector(".cards-container").innerHTML = "";
    loadcontent(query);
}


const checkFavorites = ()=>{
    favorites.forEach((card) => {
        const element = document.querySelector(`.${card}`)
        const icon = element.querySelector(".add-favorite i");
        console.log(icon)
        icon.classList.add("fa-solid");
    })
}


//check if there are any cards not hidden
const checkEmptyCardsContainer = () => {

    const container = document.querySelector(".cards-container");

    const cards = container.querySelectorAll(".card");

    if (container.lastElementChild.tagName === "P") {
        container.removeChild(container.lastElementChild);

    }

    for (let i = 0; i < cards.length; i++) {
        let style = window.getComputedStyle(cards[i]);
        if (style.display !== 'none') {
            return;
        }
    }
    const p = document.createElement("p");
    p.classList.add("empty");
    p.innerHTML = "No Matching Results Were Found";
    container.appendChild(p);
}