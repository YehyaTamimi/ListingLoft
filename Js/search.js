//import hardcoded data from json file
import json from "./proporties.js";

//import api module to request data
import { createCard } from "./createHouseCard.js";

//import card module to create house cards
import { requestListings } from "./requestAPI.js";

//import activity history module
import { viewSearchHistory, addToSearchHistory, saveFilter, loadFilter, closeHistory } from "./history.js";


let query;
let searchArr = [];
document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem("query") !== null) {
        query = sessionStorage.getItem("query");
        loadcontent(query);
    } else {
        loadcontent();
    }

    if (localStorage.getItem('history') !== null) {
        searchArr = JSON.parse(localStorage.getItem('history'));
    }


    document.querySelector(".home").addEventListener("click", gotoHomePage);

    const input = document.querySelector(".search-input");
    input.addEventListener("keypress", handleKeyPress);
    document.querySelector(".search").addEventListener('click', () => {
        goToSearchPage(input.value.trim());
    });
    input.addEventListener("click", () => {
        viewSearchHistory(searchArr)
    }
    );

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-input')) {
            closeHistory();
        }
    });
    const filters = ["price", "size", "rooms"];
    filters.forEach((filter) => {
        document.querySelector(`.${filter}-button`).addEventListener("click", () => {
            viewFilter(filter);
        });
        if (filter !== "rooms") {
            filterRangeContent(filter, true);
        }
    });
})


//load content from json file
const loadcontent = () => {
    let houses = json["listings"];
    let container = document.querySelector(".cards-container");

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
        console.log("here");
        createCard(house);
    });

    if (container.childNodes.length === 0) {
        container.innerHTML = "<p class=empty>No Matching Results Were Found<p>";
    }

}

//view filter element when a filter is pressed
const viewFilter = (element) => {
    let button = document.querySelector(`.${element}-button`);
    console.log(button)
    let icon = button.lastElementChild;
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
        let container = document.querySelector(`.${element}-container`);
        container.removeChild(container.lastElementChild);
    }
}

//create the range element for price/size filter
const createPriceRangeElement = (element) => {
    let container = document.querySelector(`.${element}-container`);
    let type = (element === "price") ? "$" : "M";
    let min, max;

    let range = document.createElement("div");
    range.classList.add(`${element}-range`);
    range.innerHTML = `
    <div class="test">
        <div class="min-${element}">
            <input type="text" placeholder="Min">
            <p>${type}</p>
        </div>
        <div class="dash">-</div>
        <div class="max-${element}">
            <input type="text" placeholder="Max">
            <p>${type}</p>
        </div>
    </div>
    `


    container.appendChild(range);
    container.querySelector(".apply").addEventListener('click', () => {
        filterRangeContent(element, false);
        viewFilter(element);
    })

    container.querySelector(".reset").addEventListener("click", () => {
        resetContent(element);

    });

    [min, max] = loadFilter(element);
    if (min === "null" && max === "null") {
        return;
    }
    document.querySelector(`.min-${element}-input`).value = min;
    document.querySelector(`.max-${element}-input`).value = max;

}

//temporary function
//apply filter based on price/size
const filterRangeContent = (type, isHistory) => {
    let min;
    let max;
    if (isHistory) {
        [min, max] = loadFilter(type);
        console.log(min);
        console.log(max);
        if (min === "null" && max === "null") {
            return;
        }
    } else {
        min = document.querySelector(`.min-${type}-input`).value.trim();
        max = document.querySelector(`.max-${type}-input`).value.trim();
        console.log(document.querySelector(`.min-${type}-input`));
    }

    let container = document.querySelector(".cards-container");
    let cards = container.querySelectorAll(".card");

    cards.forEach((card) => {
        if (type === "price") {
            let price = card.querySelector(".price").textContent.replace(/\,/g, '').split('$')[1];
            if (!(price >= min && price <= max)) {
                container.removeChild(card);
            }
        } else {
            let size = card.querySelector(".small-info").textContent.split("|")[2].split(" ")[1];
            if (!(size >= min && size <= max)) {
                container.removeChild(card);
            }
        }
    })

    if (container.childNodes.length === 0) {
        container.innerHTML = "<p class=empty>No Matching Results Were Found<p>";
        return;
    }
    saveFilter(type, min, max);
    document.querySelector(`.${type}-button`).classList.add("selected-filter");
}


const createRoomsElement = () => {
    let container = document.querySelector(".rooms-container");
    let type = document.createElement("div");
    type.classList.add("rooms-type");
    type.innerHTML = `
        <div>Bedrooms</div>
        <div class="bedrooms-number">
            <button>Any</button>
            <button>1+</button>
            <button>2+</button>
            <button>3+</button>
            <button>4+</button>
        </div>
        <div>Bathrooms</div>
        <div class="bathrooms-number">
            <button>Any</button>
            <button>1+</button>
            <button>2+</button>
            <button>3+</button>
            <button>4+</button>
        </div>
        <button class="apply">Apply</button>
    `;

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

    container.querySelector(".apply").addEventListener('click', filterRoomContent)
    container.querySelector(".reset2").addEventListener("click", () => {
        saveFilter("rooms", null, null);
    })
}

//temporary function
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
        if (!(bednum >= beds && bathnum >= baths)) {
            container.removeChild(card);
        }
    })

    if (container.childNodes.length === 0) {
        container.innerHTML = "<p class=empty>No Matching Results Were Found<p>";
        return;
    }
    saveFilter("rooms", beds, baths);
}

//check if any other filter is open before opening a new filter
const checkOpenContainers = () => {
    let containers = ["price", "rooms", "size"];

    containers.forEach((container) => {
        let parent = document.querySelector(`.${container}-container`);
        if (parent.lastElementChild.tagName == "DIV") {
            let button = document.querySelector(`.${container}-button`);
            let icon = button.lastElementChild;
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
    addToSearchHistory(query, searchArr);
    window.location.href = "search.html";
}

//temporary function
//reset content after a filter reset
const resetContent = (element) => {
    const filters = ["price", "size"];
    document.querySelector(".cards-container").innerHTML = "";
    document.querySelector(`.min-${element}-input`).value = "";
    document.querySelector(`.max-${element}-input`).value = "";
    //reload content from start
    loadcontent();
    saveFilter(element, null, null);
    filters.forEach((filter) => {
        //keep any other filters that are applied
        filterRangeContent(filter, true);
    });
    document.querySelector(`.${element}-button`).classList.remove("selected-filter");
    viewFilter(element);
}