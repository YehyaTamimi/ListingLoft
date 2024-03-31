//import hardcoded data from json file
import json from "./proporties.js";

//import api module to request data
import { createCard } from "./createHouseCard.js";

//import card module to create house cards
import { requestListings } from "./requestAPI.js";


let lastOpenContainer;
document.addEventListener('DOMContentLoaded', () => {
    loadcontent();
    const filterButtons = ["price", "size", "rooms"];
    filterButtons.forEach((filter) => {
        document.querySelector(`.${filter}-button`).addEventListener("click", () => {
            viewFilter(filter);
        });
    });
})

//load content from json file
const loadcontent = () => {
    let houses = json["listings"];
    let container = document.querySelector(".cards-container");

    houses.forEach((house) => {
        let card = createCard(house);
        container.appendChild(card);
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
