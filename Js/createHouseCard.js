export const createCard = (house) => {
    let desc = house["description"];
    let baths = desc["baths_full"];
    let beds = desc["beds"];
    let size = desc["sqft"];
    let location = house["location"];
    let city = location["address"]["city"];
    let state = location["address"]["state"];
    let street = location["address"]["street_name"];
    let price = house["list_price"].toLocaleString();
    let image = house["primary_photo"]["href"];
  
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