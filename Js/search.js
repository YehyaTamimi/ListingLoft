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
let favorites = [];
let filterParameter = {
    price_min: 0,
    price_max: 99999999,
    size_min: 0,
    size_max: 999999999,
    beds_min: 0,
    beds_max: 1000,
    baths_min: 0,
    baths_max: 1000,
    };
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem("favorite") !== null) {
        favorites = JSON.parse(localStorage.getItem("favorite"));
    }

    if (localStorage.getItem('history') !== null) {
        searchArr = JSON.parse(localStorage.getItem('history'));
    }

    if (sessionStorage.getItem("query") !== null) {
        query = sessionStorage.getItem("query");
        searchWithHistory(query)
    } else {
        searchWithHistory();
    }

    document.querySelector(".home").addEventListener("click", gotoHomePage);

    const input = document.querySelector(".search-input");
    input.value = query;
    input.addEventListener("keypress", handleKeyPress);
    document.querySelector(".search").addEventListener('click', () => {
        goToSearchPage(input.value.trim());
    });
    input.addEventListener("click", () => {
        viewSearchHistory(searchArr, goToSearchPage)
    }
    );

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-input')) {
            closeHistory();
        }
    });

    changeFilter();
    window.addEventListener("resize", changeFilter);

    const filters = ["price", "size", "rooms"];
    filters.forEach((filter) => {
        document.querySelector(`.${filter}-button`).addEventListener("click", () => {
            viewFilter(filter);
        });
    });
})


//load content from json file
const loadcontent = (Json) => {
    let houses = Json["listings"];
    const container = document.querySelector(".cards-container");
    houses.forEach((house) => {
        const { description, location, list_price } = house;
        const { address: { city, state, street_name } } = location;
        const size = description["sqft"];
        const price = list_price;
        createCard(house);
    });
    checkEmptyCardsContainer();

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
    let min, max;

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

    <button class="apply">Apply</button>
    `


    container.appendChild(range);
    container.querySelector(".apply").addEventListener('click', () => {
        filterRangeContent(element, false);
        viewFilter(element);
    })

    container.querySelector(".reset").addEventListener("click", () => {
        resetContent(element);

    });


    showSavedInput(element);

}

//temporary function
//apply filter based on price/size
const filterRangeContent = (type, isHistory) => {
    let min;
    let max;

    if (localStorage.getItem("historyFilters") !== null) {
        filterParameter = JSON.parse(localStorage.getItem("historyFilters"));
    }

    if (isHistory) {
        [min, max] = loadFilter(type);
        if (min === "null" && max === "null") {
            return;
        }
    } else {
        min = document.querySelector(`.min-${type}-input`).value.trim();
        max = document.querySelector(`.max-${type}-input`).value.trim();

        if (min === "" && max === "") {
            return;
        }
    }

    if ((/^\d+$/.test(min) && /^\d+$/.test(max)) && (parseInt(min) < parseInt(max)) ) {

        if (type === "price") {
            filterParameter.price_min = min;
            filterParameter.price_max = max;
        } else {
            filterParameter.home_size_min = min;
            filterParameter.home_size_max = max;
        }
        saveFilter(type, min, max);
        document.querySelector(`.${type}-button`).classList.add("selected-filter");
        const oneFilter = document.querySelector(`.filter-button`);
        if (oneFilter) {
            oneFilter.classList.add("selected-filter");
        }
    }

    removeCards();
    requestListings(query, filterParameter, loadcontent)
    localStorage.setItem("historyFilters", JSON.stringify(filterParameter));
}


const createRoomsElement = () => {
    const container = document.querySelector(".rooms-container");
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
        <p class=reset2> Reset Changes </p>
        <button class="apply">Apply</button>`;

    container.appendChild(type);

    changeRoomButtonColor();

    container.querySelector(".apply").addEventListener('click', () => {
        filterRoomContent(false)
        viewFilter("rooms")
    });
    container.querySelector(".reset2").addEventListener("click", () => {
        resetContent("rooms");
    })
}

//apply filter based on rooms
const filterRoomContent = (isHistory) => {
    let baths;
    let beds;
    let container = document.querySelector(".cards-container");
    let cards = container.querySelectorAll(".card");

    if (localStorage.getItem("historyFilters") !== null) {
        filterParameter = JSON.parse(localStorage.getItem("historyFilters"));
    }

    if (isHistory) {
        [beds, baths] = loadFilter("rooms");
        beds = (beds === "null") ? "0" : beds;
        baths = (baths === "null") ? "0" : baths;
    } else {
        const roomTypes = [".bedrooms-number", ".bathrooms-number"];

        roomTypes.forEach((type) => {
            let typeButtons = document.querySelectorAll(`${type} button`);
            typeButtons.forEach((button) => {
                if (button.classList.contains('active')) {
                    if (type === ".bedrooms-number") {
                        beds = button.textContent[0];
                        beds = (beds === "A") ? "0" : beds;
                        filterParameter.beds_min = parseInt(beds);
                        filterParameter.beds_max = parseInt(beds);
                    } else {
                        baths = button.textContent[0];
                        baths = (baths === "A") ? "0" : baths;
                        filterParameter.baths_min = parseInt(baths);
                        filterParameter.baths_max = parseInt(baths);
                    }
                }
            })
        })

    }

    if (beds === "0") {
        filterParameter.beds_min = 0;
        filterParameter.beds_max = 99999999;
    }

    if (baths === "0") {
        filterParameter.baths_min = 0;
        filterParameter.baths_max = 9999999;
    }

    removeCards();
    requestListings(query, filterParameter, loadcontent);

    saveFilter("rooms", beds, baths);
    if (beds !== "0" && baths !== "0") {
        document.querySelector(`.rooms-button`).classList.add("selected-filter");
        const oneFilter = document.querySelector(`.filter-button`);
        if (oneFilter) {
            oneFilter.classList.add("selected-filter");
        }
    }

    localStorage.setItem("historyFilters", JSON.stringify(filterParameter));
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

    addToSearchHistory(query, searchArr);
    window.location.href = "search.html";
}

//reset content after a filter reset
const resetContent = (element) => {
    if (localStorage.getItem("historyFilters") !== null) {
        filterParameter = JSON.parse(localStorage.getItem("historyFilters"));
    }

    const filters = ["price", "size", "rooms"];
    document.querySelector(".cards-container").innerHTML = "";
    if (element !== "rooms") {
        document.querySelector(`.min-${element}-input`).value = "";
        document.querySelector(`.max-${element}-input`).value = "";
    }

    if (element === "price") {
        filterParameter.price_min = 0;
        filterParameter.price_max = 99999999;
    } else if (element === "size") {
        filterParameter.home_size_min = 0;
        filterParameter.home_size_max = 99999999;
    } else {
        filterParameter.baths_min = 0;
        filterParameter.baths_max = 99999999;
        filterParameter.beds_min = 0;
        filterParameter.beds_max = 999999999;
    }

    requestListings(query, filterParameter, loadcontent);
    //reload content from start
    saveFilter(element, null, null);
    document.querySelector(`.${element}-button`).classList.remove("selected-filter");
    if(!document.querySelector(".filter-range")){
    viewFilter(element);
    }

    localStorage.setItem("historyFilters", JSON.stringify(filterParameter));
}

const showSavedInput = (element) => {
    let min, max;
    [min, max] = loadFilter(element);
    if (min === "null" && max === "null") {
        return;
    }
    document.querySelector(`.min-${element}-input`).value = min;
    document.querySelector(`.max-${element}-input`).value = max;
}

const showSavedButton = (type, button) => {
    let beds, baths;
    [beds, baths] = loadFilter("rooms")
    if (type === ".bedrooms-number") {
        if ((button.textContent[0] === "A" && beds === "0") || (button.textContent[0] === beds)) {
            button.classList.add("active");
        }

    } else {
        if ((button.textContent[0] === "A" && baths === "0") || (button.textContent[0] === baths)) {
            button.classList.add("active");
        }
    }
}


const checkFavorites = () => {
    favorites.forEach((card) => {
        const element = document.querySelector(`.${card}`)
        if (element) {
            const icon = element.querySelector(".add-favorite i");
            icon.classList.add("fa-solid");
        }
    })
}


//check if there are any cards not hidden
const checkEmptyCardsContainer = () => {

    const container = document.querySelector(".cards-container");

    const existingP = container.querySelector(".empty");
    if (existingP) {
        container.removeChild(existingP);
    }

    const cards = container.querySelectorAll(".card");

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


const changeFilter = () => {
    const width = window.innerWidth;
    const filters = ["price", "size", "rooms"];
    const header = document.querySelector(".whole-container");
    const filter = document.querySelector(".filter-container")

    if (width < 620) {
        filters.forEach((filter) => {
            const button = document.querySelector(`.${filter}-container`)
            button.style.display = "none";
        });
        createOneFilterButton();
    } else {
        const oneFilter = document.querySelector(".filter-range");
        hideFilter(oneFilter);
        filters.forEach((filter) => {
            const button = document.querySelector(`.${filter}-container`)
            button.style.display = "block";
        });
        if (filter) {
            header.removeChild(filter);
        }
    }
}

const createOneFilterButton = () => {
    if (!document.querySelector(".filter-container")) {
        const container = document.querySelector(".whole-container");
        const body = document.querySelector("body");
        const filter = document.createElement("div");
        filter.classList.add("filter-container");
        const button = document.createElement("button");
        button.textContent = "Filter";
        button.classList.add("filter-button")
        filter.appendChild(button);
        container.appendChild(filter);
        button.addEventListener("click", () => { createFilterBody(body) })
    }
}

const createFilterBody = (body) => {
    const range = document.createElement("div");
    range.classList.add("filter-range");
    range.innerHTML = `
    <div class="close"><button class="closeButton"><i class="fa-solid fa-x"></i></button></div>
    <div>Price</div>
    <div class="test">
        <div class="min-price">
            <input type="text" placeholder="Min" class=min-price-input>
            <p>$</p>
        </div>
        <div class="dash">-</div>
        <div class="max-price">
            <input type="text" placeholder="Max" class=max-price-input>
            <p>$</p>
        </div>
    </div>
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
        <div>Size</div>
        <div class="test">
        <div class="min-size">
            <input type="text" placeholder="Min" class=min-size-input>
            <p>M</p>
        </div>
        <div class="dash">-</div>
        <div class="max-size">
            <input type="text" placeholder="Max" class=max-size-input>
            <p>M</p>
        </div>
    </div>
    <p class=reset2> Reset Changes </p>
        <button class="apply">Apply</button>
    `
    range.querySelector(".closeButton").addEventListener("click", () => {
        hideFilter(range);
    })

    showFilter(range);
    changeRoomButtonColor();
    showSavedInput("price");
    showSavedInput("size");

    range.querySelector(".apply").addEventListener("click", () => {
        checkSelectedFilter(range, body);
    })

    range.querySelector(".reset2").addEventListener("click", () => {
        resetAll(range);
    })

}


const checkSelectedFilter = (filter) => {
    filterRoomContent(false);
    filterRangeContent("price", false);
    filterRangeContent("size", false);
    hideFilter(filter)
}


const changeRoomButtonColor = () => {
    const roomTypes = [".bedrooms-number", ".bathrooms-number"];

    //small scale callback-hell ;)
    roomTypes.forEach((type) => {
        let rooms = document.querySelector(type);
        let roombuttons = rooms.querySelectorAll("button");
        roombuttons.forEach((button) => {
            button.addEventListener('click', () => {

                roombuttons.forEach((btn) => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');
            });

            showSavedButton(type, button);
        });
    })
}

const resetAll = (filter) => {
    const filters = ["price", "size", "rooms"];
    filters.forEach((filter) => {
        resetContent(filter);
    })
    document.querySelector(`.filter-container`).classList.remove("selected-filter");
    hideFilter(filter);
}

const showFilter = (filter) => {
    const body = document.querySelector("body")
    body.appendChild(filter);
    body.classList.add("disabled");
}

const hideFilter = (filter) => {
    const body = document.querySelector("body")
    if (filter) {
        body.removeChild(filter);
        body.classList.remove("disabled");
    }
}

const removeCards = () => {
    const cardsContainer = document.querySelector(".cards-container");
    cardsContainer.innerHTML = "";
}

const searchWithHistory = (query = "") => {
    let minPrice, maxPrice, minSize, MaxSize, beds, baths;

    if (localStorage.getItem("historyFilters") !== null) {
        filterParameter = JSON.parse(localStorage.getItem("historyFilters"));

        if (filterParameter.hasOwnProperty("price_min")) {
            document.querySelector(`.price-button`).classList.add("selected-filter");
        }

        if (filterParameter.hasOwnProperty("size_min")) {
            document.querySelector(`.size-button`).classList.add("selected-filter");
        }

        if (filterParameter.hasOwnProperty("baths_min") || filter.hasOwnProperty("beds_min")) {
            document.querySelector(`.rooms-button`).classList.add("selected-filter");
        }

    } 
    
    requestListings(query, filterParameter, loadcontent);

}