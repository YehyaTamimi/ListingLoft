
export const createCard = (house) => {
    let container = document.querySelector(".cards-container");
    const { description, location, list_price, primary_photo, property_id } = house;
    const { baths_full: baths, beds, sqft: size } = description;
    const { address: { city, state, street_name: street } } = location;
    const price = list_price.toLocaleString();
    const image = primary_photo["href"];
    let card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("swiper-slide");
    card.classList.add(`h${property_id}`);
    card.innerHTML = `<img src="${image}" alt="" class="card-img">
                          <button class="add-favorite"><i class="fa-regular fa-heart"></i></button>
                          <div class="info">
                                <p class="price">$${price}</p>
                                <p class="small-info">${beds} bed | ${baths} bath | ${size} sqrt | ${street}, ${city}, ${state}</p>
                          </div>`

    const button = card.querySelector(".add-favorite");
    button.addEventListener("click", ()=>{
        const icon = button.querySelector("i");
        if(icon.classList[2] == "fa-solid"){
            icon.classList.remove("fa-solid");
        }else{
            icon.classList.add("fa-solid");
        }
        addToFavorites(`h${property_id}`)
    })
    container.appendChild(card);
  }

const addToFavorites = (id) => {
    let arr = [];
    if(localStorage.getItem("favorite") !== null){
        arr = JSON.parse(localStorage.getItem("favorite"));
      }
    if (arr.includes(id)){
        let index = arr.indexOf(id);
        let removed = arr.splice(index, 1);

        // if(window.location.pathname.includes("favorites.html")){
        //     removeFavorite(removed);
        // }
    }else{
        arr.push(id);
    }
    localStorage.setItem("favorite", JSON.stringify(arr));
    console.log(arr)
}

// const removeFavorite = (removed)=>{
//     document.querySelector(`.${removed.toString()}`).remove();

//     const container = document.querySelector(".cards-container");
//     if(container.childNodes.length === 0){
//         container.innerHTML = "<p class=empty>No Favorites Found In Your List<p>";
//     }

// }
