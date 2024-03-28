let lastOpenContainer;
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector(".price-button").addEventListener("click", () => {
        viewRange("price")
    });

    document.querySelector(".size-button").addEventListener("click", () => {
        viewRange("size")
    });

    document.querySelector(".rooms-button").addEventListener("click", () => {
        viewRange("rooms")
    });

})

const viewRange = (element) => {
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
        button.addEventListener('click',  () => {
            console.log(button.textContent[0]);
        });
    });
}

const checkOpenContainers = () => {
    let containers = ["price", "rooms", "size"];

    containers.forEach((container) => {
        let parent = document.querySelector(`.${container}-container`);
        if(parent.lastElementChild.tagName == "DIV"){
            let button = document.querySelector(`.${container}-button`);
            let icon = button.lastElementChild;
            icon.classList.remove("fa-caret-up")
            icon.classList.add("fa-caret-down")
            parent.removeChild(parent.lastElementChild);
        }
    })
}