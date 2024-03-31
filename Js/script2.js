//import hardcoded data from json file
import json from "./proporties.js";

//import api module to request data
import { createCard } from "./createHouseCard.js";

//import card module to create house cards
import { requestListings } from "./requestAPI.js";


let lastOpenContainer;
document.addEventListener('DOMContentLoaded', () => {
    loadcontent();
    document.querySelector(".price-button").addEventListener("click", () => {
        viewRange("price")
    });

    document.querySelector(".size-button").addEventListener("click", () => {
        viewRange("size")
    });

    document.querySelector(".rooms-button").addEventListener("click", () => {
        viewRange("rooms")
    });

    document.querySelector(".home").addEventListener("click", () => {
        window.location.href = "/html/index.html";
    })

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
    let apply = document.createElement("button");
    apply.textContent = "Apply";
    apply.classList.add("apply");
    range.appendChild(apply);
    container.appendChild(range);
}

//create rooms element for rooms filter
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

    let bedroomNumber = document.querySelector('.bedrooms-number');
    let bedroomButtons = bedroomNumber.querySelectorAll('button');
    bedroomButtons.forEach((button) => {
        button.addEventListener('click', () => {
            console.log(button.textContent[0]);
        });
    });
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