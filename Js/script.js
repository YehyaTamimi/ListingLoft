
import json from "./newListings.js";

document.addEventListener("DOMContentLoaded", () => {
    startswiper();
    loadcontent();
    let input = document.querySelector(".search-input")
    document.querySelector(".discover").addEventListener('click', () => {
      goToSearchPage()});
    document.querySelector(".search").addEventListener('click', ()=>{
      goToSearchPage(input.value.trim());
    });;
    input.addEventListener("keypress", (e) => {
      if (e.key === 'Enter') {
          goToSearchPage(input.value.trim());
      }});
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
      sort: 'newest'
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

const loadcontent = () => {
  let houses = json["listings"];
  let container = document.querySelector(".card-container");
  let count = 10;

  houses.forEach((house) => {
    if(count === 0) return;
    let card = createCard(house);
    container.appendChild(card);
    count--;
  });
}

const createCard = (house) => {
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

const goToSearchPage = (query="") => {
  sessionStorage.setItem("query", query);
  window.location.href = "search.html";
}

const startswiper = () =>{
  const swiper = new Swiper('.swiper', {
    slidesPerView: 3,
      spaceBetween: 30,
      freeMode: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
});
}

