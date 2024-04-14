
export const createCard = (house) => {
    let street1, size1, baths1, beds1, city1, state1;
    const { description, location, list_price, photos, property_id } = house;
    if (window.location.pathname.includes("favorites.html")) {
        const { baths, beds, sqft } = description;
        const { address: { city, state, street_name } } = location;
        size1 = sqft;
        street1 = street_name;
        baths1 = baths;
        beds1 = beds;
        city1 = city;
        state1 = state;
    } else {
        const { baths_full: baths, beds, sqft: size } = description;
        const { address: { city, state, street_name: street } } = location;
        size1 = size;
        street1 = street;
        baths1 = baths;
        beds1 = beds;
        city1 = city;
        state1 = state;
    }

    if (!photos || !photos[0].href) {
        return;
    }

    if (!description || !location || !list_price || !property_id) {
        return;
    }

    if (!baths1 || !beds1 || !size1 || !city1 || !state1 || !street1 || !price) {
        return;
    }

    const price = list_price.toLocaleString();
    const image = photos[0].href;



    const container = document.querySelector(".cards-container");


    let card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("swiper-slide");
    card.classList.add(`h${property_id}`);
    card.innerHTML = `<img src="${image}" alt="" class="card-img">
                          <button class="add-favorite"><i class="fa-regular fa-heart"></i></button>
                          <div class="info">
                                <p class="price">$${price}</p>
                                <p class="small-info">${beds1} bed | ${baths1} bath | ${size1} sqrt | ${street1}, ${city1}, ${state1}</p>
                          </div>`

    const button = card.querySelector(".add-favorite");
    button.addEventListener("click", () => {
        const icon = button.querySelector("i");
        if (icon.classList[2] == "fa-solid") {
            icon.classList.remove("fa-solid");
        } else {
            icon.classList.add("fa-solid");
        }
        addToFavorites(`h${property_id}`)
    })
    container.appendChild(card);
}

const addToFavorites = (id) => {
    let arr = [];
    if (localStorage.getItem("favorite") !== null) {
        arr = JSON.parse(localStorage.getItem("favorite"));
    }
    if (arr.includes(id)) {
        let index = arr.indexOf(id);
        let removed = arr.splice(index, 1);
    } else {
        arr.push(id);
    }
    localStorage.setItem("favorite", JSON.stringify(arr));
    console.log(arr)
}
