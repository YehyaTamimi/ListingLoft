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

    const input = document.querySelector(".search-input");
    input.addEventListener("keypress", handleKeyPress);
    input.value = query;
    document.querySelector(".search").addEventListener('click', () => {
        goToSearchPage(input.value.trim());
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
    
    if(container.childNodes.length === 0){
        container.innerHTML = "<p class=empty>No Matching Results Were Found<p>";
    }

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
        <button class="apply">Apply</button>
    `;

    container.appendChild(type);

    const bedroomNumber = document.querySelector('.bedrooms-number');
    const bedroomButtons = bedroomNumber.querySelectorAll('button');
    bedroomButtons.forEach((button) => {
        button.addEventListener('click', () => {
            console.log(button.textContent[0]);
        });
    });
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
