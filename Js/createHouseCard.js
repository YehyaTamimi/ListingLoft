export const createCard = (house) => {
    const { description, location, list_price, primary_photo } = house;
    const { baths_full: baths, beds, sqft: size } = description;
    const { address: { city, state, street_name: street } } = location;
    const price = list_price.toLocaleString();
    const image = primary_photo["href"];
  
    let card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("swiper-slide");
    card.innerHTML = `<img src="${image}" alt="" class="card-img">
                          <button class="add-favorite"><i class="fa-regular fa-heart"></i></button>
                          <div class="info">
                                <p class="price">$${price}</p>
                                <p class="small-info">${beds} bed | ${baths} bath | ${size} sqrt | ${street}, ${city}, ${state}</p>
                          </div>`
    return card;
  
  }