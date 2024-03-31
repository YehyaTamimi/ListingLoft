//import hardcoded data from json file
import json from "./proporties.js";

//import api module to request data
import { createCard } from "./createHouseCard.js";

//import card module to create house cards
import { requestListings } from "./requestAPI.js";


let query;
document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem("query") !== null) {
        query = sessionStorage.getItem("query");
        loadcontent(query);
    } else {
        loadcontent();
    }
    document.querySelector(".price-button").addEventListener("click", () => {
        viewFilter("price")
    });

    document.querySelector(".size-button").addEventListener("click", () => {
        viewFilter("size")
    });

    document.querySelector(".rooms-button").addEventListener("click", () => {
        viewFilter("rooms")
    });


    document.querySelector(".home").addEventListener("click", gotoHomePage);

    let input = document.querySelector(".search-input");
    input.addEventListener("keypress", handleKeyPress);
    document.querySelector(".search").addEventListener('click', () => {
        goToSearchPage(input.value.trim());
    });

})

//load content from json file
const loadcontent = (query = "") => {
    let houses = json["listings"];

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
    })
}

//apply filter based on price/size
const filterRangeContent = (type) => {
    let min = document.querySelector(`.min-${type}-input`).value.trim();
    let max = document.querySelector(`.max-${type}-input`).value.trim();
    let container = document.querySelector(".cards-container");
    let cards = container.querySelectorAll(".card");
    if (type === "price") {
        cards.forEach((card) => {
            let price = card.querySelector(".price").textContent.replace(/\,/g, '').split('$')[1];
            if (!(price >= min && price <= max)) {
                container.removeChild(card);
            }
        })
    } else {
        cards.forEach((card) => {
            let size = card.querySelector(".small-info").textContent.split("|")[2].split(" ")[1];
            if (!(size >= min && size <= max)) {
                container.removeChild(card);
            }
        })
    }
}


const createRoomsElement = () => {
    let container = document.querySelector(".rooms-container");
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

    let bedroomNumber = document.querySelector('.bedrooms-number');
    let bedroomButtons = bedroomNumber.querySelectorAll('button');
    bedroomButtons.forEach((button) => {
        button.addEventListener('click', () => {
            bedroomButtons.forEach(function (btn) {
                btn.classList.remove('active');
            });
            button.classList.add('active');
        });
    });

    let bathroomNumber = document.querySelector('.bathrooms-number');
    let bathroomButtons = bathroomNumber.querySelectorAll('button');
    bathroomButtons.forEach((button) => {
        button.addEventListener('click', () => {
            bathroomButtons.forEach(function (btn) {
                btn.classList.remove('active');
            });
            button.classList.add('active');
        });
    });

    container.querySelector(".apply").addEventListener('click', filterRoomContent)
}

//apply filter based on rooms
const filterRoomContent = () => {
    let baths;
    let beds;
    let container = document.querySelector(".cards-container");
    let cards = container.querySelectorAll(".card");

    let bedroomsButtons = document.querySelectorAll('.bedrooms-number button');
    bedroomsButtons.forEach(function(button) {
        if (button.classList.contains('active')) {
            beds = button.textContent[0];
            beds = (beds === "A") ? "0" : beds;
        }
    });

    let bathroomsButtons = document.querySelectorAll('.bathrooms-number button');
    bathroomsButtons.forEach(function(button) {
        if (button.classList.contains('active')) {
            baths = button.textContent[0];
            baths = (baths === "A") ? "0" : baths;
        }
    });

    cards.forEach((card) => {
        let bednum = card.querySelector(".small-info").textContent.split("|")[0].split(" ")[0];
        let bathnum = card.querySelector(".small-info").textContent.split("|")[1].split(" ")[1];
        if (!(bednum >= beds && bathnum >= baths)) {
            container.removeChild(card);
        }
    })

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
        let input = document.querySelector(".search-input");
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
