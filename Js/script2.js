import json from "./proporties.js";


let searchArr = [];
let query
document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem("query") !== null) {
        query = sessionStorage.getItem("query");
        loadcontent(query);
    } else {
        loadcontent();
    }
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

    let input = document.querySelector(".search-input");
    document.querySelector(".search").addEventListener('click', () => {
        goToSearchPage(input.value.trim());
    });;
    input.addEventListener("keypress", (e) => {
        if (e.key === 'Enter') {
            goToSearchPage(input.value.trim());
        }
    });

})

const requestListings = () => {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '41602150d1msh5c4982690c63891p129b85jsn781a18c8417a',
            'X-RapidAPI-Host': 'us-real-estate-listings.p.rapidapi.com'
        }
    };

    const params = {
        location: 'Metairie, LA',
        offset: '0',
        limit: '100',
    }

    const queryString = new URLSearchParams(params).toString()
    let url = `https://us-real-estate-listings.p.rapidapi.com/for-sale?${queryString}`

    fetch(url, options)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            return new Error("Error loading movies");
        })
        .then(loadcontent)
        .catch(err => console.error('error:' + err));

}

const loadcontent = (query = "") => {
    let houses = json["listings"];

    houses.forEach((house) => {
        let desc = house["description"];
        let size = desc["sqft"];
        let location = house["location"];
        let city = location["address"]["city"];
        let state = location["address"]["state"];
        let street = location["address"]["street_name"];
        let price = house["list_price"];

        if (query !== "") {
            query = query.toLowerCase();
            let isnum = /^\d+$/.test(query);
            if (isnum === false) {
                if (!(state.toLowerCase().includes(query) || city.toLowerCase().includes(query) || street.toLowerCase().includes(query))) {
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

const createCard = (house) => {
    let container = document.querySelector(".cards-container");
    let desc = house["description"];
    let baths = desc["baths_full"];
    let beds = desc["beds"];
    let size = desc["sqft"];
    let location = house["location"];
    let city = location["address"]["city"];
    let state = location["address"]["state"];
    let street = location["address"]["street_name"];
    let price = house["list_price"];
    let image = house["primary_photo"]["href"];

    let card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `<img src="${image}" alt="" class="card-img">
                        <button class="add-favorite"><i class="fa-regular fa-heart"></i></button>
                          <div class="info">
                                <p class="price">$${price.toLocaleString()}</p>
                                <p class="small-info">${beds} bed | ${baths} bath | ${size} sqrt | ${street}, ${city}, ${state}</p>
                          </div>`
    container.appendChild(card);
}

const viewRange = (element) => {
    let button = document.querySelector(`.${element}-button`);
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

const filterRangeContent = (type) => {
    let min = document.querySelector(`.min-${type}-input`).value.trim();
    let max = document.querySelector(`.max-${type}-input`).value.trim();
    let container = document.querySelector(".cards-container");
    let cards = container.querySelectorAll(".card");
    if (type === "price") {
        cards.forEach((card) => {
            let price = card.querySelector(".price").textContent.replace(/\,/g, '').split('$')[1];
            console.log(price);
            if (!(price >= min && price <= max)) {
                container.removeChild(card);
            }
        })
    } else {
        cards.forEach((card) => {
            let size = card.querySelector(".small-info").textContent.split("|")[2].split(" ")[1];
            console.log(size);
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


const goToSearchPage = (query = "") => {
    sessionStorage.setItem("query", query);
    document.querySelector(".cards-container").innerHTML = "";
    loadcontent(query);
}