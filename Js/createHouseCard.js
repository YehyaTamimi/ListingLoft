
export const createCard = (house) => {
    const { description, location, list_price, primary_photo, property_id } = house;
    const { baths_full: baths, beds, sqft: size } = description;
    const { address: { city, state, street_name: street } } = location;
    const price = list_price.toLocaleString();
    const image = primary_photo["href"];

    const container = document.querySelector(".cards-container");
  

    let card = document.createElement("div");
    card.classList.add("card");
    if(window.location.pathname.includes("index.html")){
    card.classList.add("swiper-slide");
    }
    card.classList.add(`h${property_id}`);
    card.innerHTML = `<img src="${image}" alt="" class="card-img">
                          <button class="add-favorite"><i class="fa-regular fa-heart"></i></button>
                          <div class="info">
                                <p class="price">$${price}</p>
                                <p class="small-info">${beds} bed | ${baths} bath | ${size} sqrt | ${street}, ${city}, ${state}</p>
                          </div>`

    const button = card.querySelector(".add-favorite");
    button.addEventListener("click", (e)=>{
        e.stopPropagation();
        const icon = button.querySelector("i");
        if(icon.classList[2] == "fa-solid"){
            icon.classList.remove("fa-solid");
        }else{
            icon.classList.add("fa-solid");
        }
        addToFavorites(`h${property_id}`)
    })

    card.addEventListener("click" ,()=>{
        if(!window.location.pathname.includes("index.html")){
        createPopup(house, button);}
    });

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
    }else{
        arr.push(id);
    }
    localStorage.setItem("favorite", JSON.stringify(arr));
}

const createPopup = (house, fav) => {
    const body = document.querySelector("main");
    body.classList.add("disabled");
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    body.appendChild(overlay);

    const { description, location, list_price, photos, property_id } = house;
    const { baths_full: baths, beds, sqft: size, text } = description;
    const { address: { city, state, street_name: street } } = location;
    const price = list_price.toLocaleString();


    const popup = document.createElement("div");
    popup.classList.add("popup");
    popup.innerHTML = `
    <div class="buttons">
        <button class="close-popup"><i class="fa-solid fa-x"></i></button>
        <h1 class="popup-home">LISTING LOFT</h1>
        <button class="favorite-popup"> Add to <i class="fa-regular fa-heart"></i> </button>
    </div>
        <div class="swiper mySwiper">
            <div class="swiper-wrapper">
            </div>
            <div class="swiper-button-next"></div>
            <div class="swiper-button-prev"></div>
        </div>

        <div class="text-info">
            <div class="popup-price">$${price}</div>
            <div class="popup-info"><span>${beds}</span> bed &nbsp; <span>${baths}</span> bath &nbsp; <span>${size}</span> sqrt &nbsp;</div>
        </div>

        <div class="location"> ${street}, ${city}, ${state}</div>
        <div class="popup-desc-big">description</div>
        <div class="popup-desc">${text}</div>
        <button class="agent">Call an Agent</button>`
    
    body.appendChild(popup);

    photos.forEach((photo) => {
        createImage(photo);
    })

    var swiper = new Swiper(".mySwiper", {
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });

    document.querySelector(".close-popup").addEventListener("click", ()=>{
        closePopup(body, popup, overlay);
    })

    const favorite = document.querySelector(".favorite-popup");
    if(fav.querySelector("i").classList[2] == "fa-solid"){
        const favIcon = favorite.querySelector("i");
        favIcon.classList.add("fa-solid");
    }
    favorite.addEventListener("click", ()=>{
        changeHeart(favorite, fav, property_id);
    })
}

const createImage = (photo) =>{
    const img = document.createElement("img");
    const swiperWrapper = document.querySelector(".swiper-wrapper");
  
    img.src = photo["href"];
    img.classList.add("swiper-slide");
  
    swiperWrapper.appendChild(img);
}


const closePopup = (body, popup, overlay)=>{
    body.removeChild(popup);
    body.removeChild(overlay);
    body.classList.remove("disabled");
}

const changeHeart = (favorite, fav, property_id)=>{
    const favIcon = favorite.querySelector("i");
    const icon = fav.querySelector("i");
    if(icon.classList[2] == "fa-solid" || favIcon.classList[2] == "fa-solid"){
        icon.classList.remove("fa-solid");
        favIcon.classList.remove("fa-solid")
    }else{
        icon.classList.add("fa-solid");
        favIcon.classList.add("fa-solid");
    }
    addToFavorites(`h${property_id}`)
}