//import hardcoded data from json file
import json from "./newListings.js";
import { createCard } from "./createHouseCard.js";
import { requestListings } from "./requestAPI.js";

document.addEventListener("DOMContentLoaded", () => {
  startswiper();
  loadcontent();
  document.querySelector(".discover").addEventListener('click', goToSearchPage);
  document.querySelector(".search").addEventListener('click', goToSearchPage);
  document.querySelector(".search-input").addEventListener("keypress", handleKeyPress);
})


//load content from json file
const loadcontent = () => {
  let houses = json["listings"];
  let container = document.querySelector(".card-container");
  let count = 10;

  houses.forEach((house) => {
    if (count === 0) return;
    createCard(house);
    count--;
  });
}

// handle Enter key press for search
const handleKeyPress = (e) => {
  if (e.key === 'Enter') {
    goToSearchPage();
  }
}

const goToSearchPage = () => {
  const input = document.querySelector(".search-input");
  sessionStorage.setItem("query", input.value.trim());
  window.location.href = "search.html";
}

const startswiper = () => {
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






